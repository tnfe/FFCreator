'use strict';

/**
 * Renderer - Core classes for rendering animations and videos.
 *
 * ####Example:
 *
 *     const renderer = new Renderer({ creator: this });
 *     renderer.on("progress", progressHandler);
 *     renderer.on("render-start", startHandler);
 *     renderer.on("render-error", errorHandler);
 *
 *
 * ####Note:
 *     Rendering process
 *     1. Render the InkPaint scene and save the data to frames
 *     2. Save frame file and add transition animation
 *     3. Use ffmpeg to synthesize video files
 *     4. Delete cache folder
 *
 * @class
 */

// const GLReset = require("gl-reset");
const { gl } = require('inkpaint');
const forEach = require('lodash/forEach');
const FS = require('../utils/fs');
const GLUtil = require('../utils/gl');
const Perf = require('../utils/perf');
const FFBase = require('../core/base');
const Synthesis = require('./synthesis');
const FFStream = require('../utils/stream');
const FFLogger = require('../utils/logger');
const CanvasUtil = require('../utils/canvas');
const Timeline = require('../timeline/timeline');

/**
 * @typedef { import("../node/scene") } FFScene
 * @typedef { import("../creator") } FFCreator
 * @typedef { import("gl") } GLFactory
 * @typedef { ReturnType<GLFactory> } GL
 * @typedef { Buffer | Uint8Array } RenderedData
 * @typedef { (data: RenderedData | null | undefined) => RenderedData | Promise<RenderedData> } RenderTransformer
 * @typedef { import("../timeline/frame") } FrameData
 */

class Renderer extends FFBase {
  /**
   * @param {{
   *   creator: FFCreator;
   *   transformers?: RenderTransformer[];
   * }} options
   */
  constructor(options) {
    super({ type: 'renderer' });

    const { creator, transformers } = options;

    /** @type { boolean } */
    this.stop = false;
    /** @type { FFCreator } */
    this.parent = creator;
    /** @type { RenderTransformer[] } */
    this.transformers = transformers;
  }

  /**
   * Start rendering
   * @async
   * @public
   */
  async start() {
    this.emit({ type: 'start' });
    await this.preProcessing();

    Perf.start();
    this.createGL();
    this.transBindGL();
    this.filterBindGL();
    this.configCache();
    this.createStream();
    this.createTimeline();
    this.createSynthesis();
  }

  /**
   * Confirm that there must be a cache folder
   * @private
   */
  configCache() {
    const conf = this.rootConf();
    const type = conf.getVal('cacheFormat');
    const dir = conf.getVal('detailedCacheDir');
    FS.ensureDir(dir);
    FS.setCacheFormat(type);
  }

  /**
   * Prepare processing materials in advance
   * @private
   */
  async preProcessing() {
    try {
      const preload = this.rootConf('preload');
      const creator = this.getCreator();
      const { loader } = creator;

      // sub child preProcessing
      await creator.runScenesFunc(async node => await node.preProcessing());

      // sub child preload
      await creator.runScenesFunc(async node => {
        if (preload && node.preload) {
          const urls = node.getPreloadUrls();
          forEach(urls, url => {
            if (url) {
              if (/.+(\.[\d\w]{1,10})$/.test(url)) loader.add(url, url);
              else loader.add(url, url, { loadType: 2 });
            }
          });
        }
      });
      await loader.loadAsync();

      creator.removeAllDisplayChildren();
    } catch (error) {
      this.emitError({ error, pos: 'preProcessing' });
    }
  }

  /**
   * Create webgl environment context
   * @private
   */
  createGL() {
    const width = this.rootConf('width');
    const height = this.rootConf('height');
    /** @type { GL } */
    this.gl = gl(width, height);
  }

  /**
   * Binding gl context for each transition animation
   * @private
   */
  transBindGL() {
    forEach(this.getScenes(), scene => scene.transition.bindGL(this.gl));
  }

  filterBindGL() {
    forEach(this.getScenes(), scene => scene.filter && scene.filter.bindGL(this.gl));
  }

  /**
   * Create a stream pipeline for data transmission
   * @private
   */
  createStream() {
    const conf = this.rootConf();
    const size = conf.getVal('highWaterMark');
    const parallel = conf.getVal('parallel');

    const stream = new FFStream({ size, parallel });
    stream.addPullFunc(this.renderFrame.bind(this));
    stream.on('error', error => this.emitError({ error, pos: 'FFStream' }));
    this.stream = stream;
  }

  /**
   * Create a timeline to manage animation
   * @private
   */
  createTimeline() {
    const scenes = this.getScenes();
    const fps = this.rootConf('fps');
    const timeline = new Timeline(fps);
    timeline.annotate(scenes);
    this.timeline = timeline;
  }

  /**
   * Render a single frame, They are normal clips and transition animation clips.
   * @private
   * @param { undefined | (data: RenderedData | null | undefined) => void } callback
   */
  async renderFrame(callback) {
    const { timeline, gl } = this;
    const frameData = timeline.getFrameData();

    if (timeline.isOver()) {
      if (callback) {
        callback(null);
      }
      return null;
    }

    const { frame, type, progress, isSceneStart, isSceneOver, isLast, scenesIndex } = frameData;
    const creator = this.getCreator();
    let scene, data;

    // Various scene states
    // scene frameData start event
    if (isSceneStart) {
      scene = this.getCurrentScene();
      creator.addDisplayChild(scene);
      scene.start();
    }

    // scene frame end event
    if (isSceneOver && !isLast) {
      scene = this.getPrevScene();
      creator.removeDisplayChild(scene);
    }

    FFLogger.info({ pos: 'renderFrame', msg: `current frame - ${timeline.frame}` });
    timeline.nextFrame();

    const packConf = scene => {
      return {
        ...frameData,
        scene,
        progress,
        currentFrame: frame,
        totalFrame: timeline.framesNum,
      };
    };

    // Rendering logic part
    if (type === 'normal') {
      // normal part
      data = await this.snapshotToBuffer(packConf(this.getCurrentScene()));
    } else {
      // transition part
      const currScene = this.getSceneByIndex(scenesIndex[0]);
      const nextScene = this.getSceneByIndex(scenesIndex[1]);
      creator.addOnlyDisplayChild(currScene);
      const fromBuff = await this.snapshotToBuffer(packConf(currScene));
      creator.addOnlyDisplayChild(nextScene);
      const toBuff = await this.snapshotToBuffer(packConf(nextScene));

      const { transition } = currScene;
      const conf = this.rootConf();
      const width = conf.getVal('width');
      const height = conf.getVal('height');
      const quality = conf.getVal('cacheQuality');
      const cacheFormat = conf.getVal('cacheFormat');

      await transition.render({ type: cacheFormat, fromBuff, toBuff, progress });
      data = GLUtil.getPixelsByteArray({ gl, width, height });

      if (cacheFormat !== 'raw') {
        const canvas = CanvasUtil.draw({ width, height, data });
        data = CanvasUtil.toBuffer({ type: cacheFormat, canvas, quality });
      }
    }

    // if has transformers, call them to transform data.
    if (this.transformers && this.transformers.length) {
      for (const transformer of this.transformers) {
        data = await transformer(data);
      }
    }

    if (callback) {
      callback(data);
    }

    return data;
  }

  /**
   * Take a screenshot of node-canvas and convert it to buffer.
   * @private
   * @param { ({ scene?: FFScene; currentFrame: number; totalFrame: number; } & Partial<FrameData>) | undefined } params
   */
  async snapshotToBuffer(params) {
    const conf = this.rootConf();
    const creator = this.getCreator();

    creator.render();

    const cacheFormat = conf.getVal('cacheFormat');
    const quality = conf.getVal('cacheQuality');
    const canvas = creator.app.view;

    let buffer = CanvasUtil.toBuffer({ type: cacheFormat, canvas, quality });

    if (!params) {
      return buffer;
    } else {
      const { scene, progress, totalFrame, currentFrame, startFrame, endFrame } = params;

      if (!scene || !scene.filter) {
        return buffer;
      } else {
        const width = conf.getVal('width');
        const height = conf.getVal('height');

        await scene.filter.render({
          type: cacheFormat,
          progress,
          buffer,
          currentFrame,
          totalFrame,
          startFrame,
          endFrame,
        });
        const pixels = GLUtil.getPixelsByteArray({
          gl: this.gl,
          width,
          height,
        });

        // re-draw buffer.
        const canvas = CanvasUtil.draw({ width, height, data: pixels });
        return CanvasUtil.toBuffer({ type: cacheFormat, canvas, quality });
      }
    }
  }

  /**
   * synthesis Video Function
   * @private
   */
  createSynthesis() {
    const { stream, timeline } = this;

    const conf = this.rootConf();
    const cover = conf.getVal('cover');
    const creator = this.getCreator();
    const audios = creator.concatAudios();
    const synthesis = new Synthesis(conf);
    synthesis.setFramesNum(timeline.framesNum);
    synthesis.setDuration(timeline.duration);
    synthesis.addStream(stream);
    synthesis.addAudios(audios);
    synthesis.addCover(cover);

    // add synthesis event
    this.bubble(synthesis);
    synthesis.on('synthesis-complete', event => {
      Perf.end();
      const useage = Perf.getInfo();
      event = { ...event, useage };
      this.emit('complete', event);
    });

    synthesis.start();
    this.synthesis = synthesis;
  }

  /**
   *
   * @returns { FFScene[] }
   */
  getScenes() {
    const creator = this.getCreator();
    return creator.children;
  }

  /**
   * Get the scene through index
   * @private
   * @param { number } index
   * @returns { FFScene }
   */
  getSceneByIndex(index) {
    const scenes = this.getScenes();
    return scenes[index];
  }

  /**
   * Get current scene from `timeline.frameData`.
   * @returns { FFScene }
   */
  getCurrentScene() {
    const frameData = this.timeline.getFrameData();
    const index = frameData.getLastSceneIndex();
    return this.getSceneByIndex(index);
  }

  /**
   * Get previou scene from `timeline.frameData`.
   * @returns { FFScene }
   */
  getPrevScene() {
    const frameData = this.timeline.getFrameData();
    const index = frameData.getPrevSceneIndex();
    return this.getSceneByIndex(index);
  }

  /**
   * Get parent creator
   * @private
   */
  getCreator() {
    return this.parent;
  }

  /**
   * Delete the cache intermediate folder
   * @private
   */
  removeCacheFiles() {
    if (this.rootConf('debug')) return;
    const dir = this.rootConf('detailedCacheDir');
    FS.rmDir(dir);
  }

  destroy() {
    // GLReset(this.gl)();
    this.stream.destroy();
    this.timeline.destroy();
    this.synthesis.destroy();
    this.removeCacheFiles();
    this.removeAllListeners();
    super.destroy();

    this.stop = true;
    this.gl = null;
    this.parent = null;
    this.stream = null;
    this.timeline = null;
    this.synthesis = null;
  }
}

module.exports = Renderer;
