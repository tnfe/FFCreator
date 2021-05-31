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
 *     1. Render the spritejs scene and save the data to frames
 *     2. Save frame file and add transition animation
 *     3. Use ffmpeg to synthesize video files
 *     4. Delete cache folder
 *
 * @class
 */

// const GLReset = require("gl-reset");
const GL = require('gl');
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

class Renderer extends FFBase {
  constructor({ creator }) {
    super({ type: 'renderer' });
    this.stop = false;
    this.parent = creator;
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
      const creator = this.getCreator();
      await creator.preProcessing();
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
    this.gl = GL(width, height);
  }

  /**
   * Binding gl context for each transition animation
   * @private
   */
  transBindGL() {
    forEach(this.getScenes(), scene => scene.transition.bindGL(this.gl));
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
    const rfps = this.rootConf('rfps');
    const timeline = new Timeline(rfps);
    timeline.annotate(scenes);
    this.timeline = timeline;
  }

  /**
   * Render a single frame, They are normal clips and transition animation clips.
   * @private
   */
  async renderFrame(callback) {
    const { timeline, gl } = this;
    const frameData = timeline.getFrameData();

    if (timeline.isOver()) {
      callback && callback(null);
      return null;
    }

    const { type, progress, sceneStart, sceneEnd, isLast, scenesIndex } = frameData;
    const creator = this.getCreator();
    let index, scene, data;

    // Various scene states
    // scene frameData start event
    if (sceneStart) {
      index = frameData.getLastSceneIndex();
      scene = this.getSceneByIndex(index);
      creator.addDisplayChild(scene);
      scene.start();
    }

    // scene frame end event
    if (sceneEnd && !isLast) {
      index = frameData.getFirstSceneIndex();
      scene = this.getSceneByIndex(index);
      creator.removeDisplayChild(scene);
    }

    FFLogger.info({ pos: 'renderFrame', msg: `current frame - ${timeline.frame}` });
    timeline.nextFrame();

    // Rendering logic part
    if (type === 'normal') {
      data = this.snapshotToBuffer();
    } else {
      const currScene = this.getSceneByIndex(scenesIndex[0]);
      const nextScene = this.getSceneByIndex(scenesIndex[1]);
      creator.addOnlyDisplayChild(currScene);
      const fromBuff = this.snapshotToBuffer();
      creator.addOnlyDisplayChild(nextScene);
      const toBuff = this.snapshotToBuffer();

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

    callback && callback(data);
    return data;
  }

  /**
   * Take a screenshot of node-canvas and convert it to buffer.
   * @private
   */
  snapshotToBuffer() {
    const conf = this.rootConf();
    const cacheFormat = conf.getVal('cacheFormat');
    const quality = conf.getVal('cacheQuality');
    const creator = this.getCreator();
    const canvas = creator.display.snapshot();
    const buffer = CanvasUtil.toBuffer({ type: cacheFormat, canvas, quality });
    return buffer;
  }

  /**
   * synthesis Video Function
   * @private
   */
  createSynthesis() {
    const { stream, timeline } = this;

    const conf = this.rootConf();
    const creator = this.getCreator();
    const audios = creator.concatAudios();
    const synthesis = new Synthesis(conf);
    synthesis.addInput(stream);
    synthesis.addAudios(audios);
    synthesis.setFramesNum(timeline.framesNum);

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

  getScenes() {
    const creator = this.getCreator();
    return creator.children;
  }

  /**
   * Get the scene through index
   * @private
   */
  getSceneByIndex(index) {
    const scenes = this.getScenes();
    return scenes[index];
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
