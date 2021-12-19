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

const { safeRequire } = require('../utils/utils');
const FS = safeRequire('../utils/fs');
const Perf = safeRequire('../utils/perf');
const Synthesis = safeRequire('../core/synthesis');
const FFStream = safeRequire('../utils/stream');

const { gl } = require('inkpaint');
const forEach = require('lodash/forEach');
const GLUtil = require('../utils/gl');
const FFLogger = require('../utils/logger');
const CanvasUtil = require('../utils/canvas');
const Timeline = require('../timeline/timeline');
const FFBase = require('../core/base');
const TWEEN = require('@tweenjs/tween.js');

class Renderer extends FFBase {
  constructor({ creator }) {
    super({ type: 'renderer' });
    this.stop = false;
    this.parent = creator;
  }

  async jumpTo(timeInMs) {
    await this.timeline.jumpTo(timeInMs);
    this.renderFrame();
  }

  async play(playRate=1.0, callback) {
    this.playRate = playRate;
    if (!this.timer) {
      // todo: 其实这个time根本没关系，应该换成 window.requestAnimationFrame(draw)
      const time = 1000 / this.timeline.fps;
      this.timer = setInterval(() => {
        this.renderFrame(frameData => {
          if (frameData === null) this.pause(); // at end
        });
        callback && callback(TWEEN.now());
      }, time)
    }
  }

  async pause() {
    this.playRate = 0;
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    await this.timeline.pause();
    this.snapshotToBuffer();
  }

  /**
   * Start rendering
   * @async
   * @public
   */
  async start() {
    this.emit({ type: 'start' });
    await this.preProcessing();

    const creator = this.getCreator();
    this.backendRender = !creator.conf.getVal('canvas');
    if (this.backendRender) Perf.start();
    this.createGL();
    this.transBindGL();
    if (this.backendRender) this.configCache();
    if (this.backendRender) this.createStream();
    this.createTimeline();
    if (this.backendRender) this.createSynthesis();

    // front-end render: do not start play by set rate=0
    this.playRate = this.backendRender ? 1 : 0;

    // front-end render: render cover ??
    if (!this.backendRender) this.renderFrame();
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
            url && loader.add(url, url);
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
    this.gl = gl(width, height);
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
    const fps = this.rootConf('fps');
    const timeline = new Timeline(fps);
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

    const { type, progress, scenesIndex} = frameData;
    const creator = this.getCreator();
    let scene, data;

    // console.log('renderer.renderFrame', {frame, scenesIndex});

    const scenes = this.getScenes();
    for (let i = 0; i < scenes.length; i++) {
      scene = scenes[i];
      const showing = scene.showing();
      if (scenesIndex.includes(i)) {
        //should shown
        if (!showing) scene.start();
      } else {
        //should hidden
        if (showing) scene.end();
      }
    }

    FFLogger.info({ pos: 'renderFrame', msg: `current frame - ${timeline.frame}` });
    timeline.nextFrame(this.playRate);

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
    const creator = this.getCreator();
    creator.render();

    const cacheFormat = conf.getVal('cacheFormat');
    const quality = conf.getVal('cacheQuality');
    const canvas = creator.app.view;
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
    // canvas: front-end render has no cache
    if (this.rootConf('debug') || this.rootConf('canvas')) return;
    const dir = this.rootConf('detailedCacheDir');
    FS.rmDir(dir);
  }

  destroy() {
    // GLReset(this.gl)();
    this.stream && this.stream.destroy();
    this.timeline && this.timeline.destroy();
    this.synthesis && this.synthesis.destroy();
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
