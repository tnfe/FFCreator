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

const { nodeRequire, awaitMap } = require('../utils/utils');
const FS = nodeRequire('../utils/fs');
const Perf = nodeRequire('../utils/perf');
const Synthesis = nodeRequire('../core/synthesis');
const FFStream = nodeRequire('../utils/stream');

const { gl } = require('inkpaint');
const forEach = require('lodash/forEach');
const GLUtil = require('../utils/gl');
const FFLogger = require('../utils/logger');
const CanvasUtil = require('../utils/canvas');
const Timeline = require('../timeline/timeline');
const FFBase = require('../core/base');
const { isBrowser } = require("browser-or-node");
const TWEEN = require(isBrowser ? '@tweenjs/tween.js/dist/tween.umd' : '@tweenjs/tween.js');

class Renderer extends FFBase {
  constructor({ creator }) {
    super({ type: 'renderer' });
    this.stop = false;
    this.parent = creator;
  }

  async jumpTo(timeInMs) {
    this.pause();
    await this.timeline.jumpTo(timeInMs);
    this.renderFrame();
  }

  async play(playRate=1.0, callback) {
    this.playRate = playRate;
    if (this.playing) return;
    this.playing = true;
    let timer = Date.now();
    const render = async () => {
      const now = Date.now();
      const deltaTime = (now - timer) * playRate; // in ms
      if (deltaTime > 0) {
        timer = now;
        this.renderFrame(frameData => {
          if (frameData === null) this.pause(); // at end
        });
        this.timeline.nextFrame(deltaTime);
        callback && callback(TWEEN.now());
      }
      if (this.playRate > 0) { // play
        window.requestAnimationFrame(render);
      } else { // pause
        this.playing = false;
        await this.timeline.pause();
        this.renderFrame();
      }
    }
    render();
  }

  async pause() {
    this.playRate = 0;
  }

  /**
   * Start rendering
   * @async
   * @public
   */
  async start() {
    this.emit({ type: 'start' });
    await this.preProcessing();

    if (!isBrowser) Perf.start();
    this.createGL();
    this.transBindGL();
    if (!isBrowser) this.configCache();
    if (!isBrowser) this.createStream();
    this.createTimeline();
    if (!isBrowser) this.createSynthesis();

    // start creator audios for browser
    const creator = this.getCreator();
    await awaitMap(creator.audios, async (audio) => {
      await audio.preProcessing();
      audio.start();
    })

    this.playRate = 0;
    this.renderFrame(); // render cover
    console.log('creator loaded!');
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
    const creator = this.getCreator();
    try {
      const preload = this.rootConf('preload');
      const { loader } = creator;

      const nodes = creator.allNodes();
      // sub child preProcessing, todo: 后端并发的跑会不会卡死？
      await awaitMap(nodes, node => node.preProcessing());

      // sub child preload
      await awaitMap(nodes, node => {
        if (preload && node.preload) {
          const urls = node.getPreloadUrls();
          forEach(urls, url => {
            // 必须加上跨域的选项，避免污染canvas之后影响动画
            url && loader.add(url, url, {crossOrigin: true});
          });
        }
      });
      await loader.loadAsync();

      creator.removeAllDisplayChildren();
    } catch (error) {
      if (isBrowser) console.log(error);
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
    stream.addPullFunc(this.nodeRenderFrame.bind(this));
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
    this.getCreator().duration = this.timeline.duration;
  }

  async nodeRenderFrame(callback) {
    const res = this.renderFrame(callback);
    await this.timeline.nextFrame();
    return res;
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

    const { type, progress, scenesIndex, frame} = frameData;
    const creator = this.getCreator();
    let data;

    const scenes = this.getScenes();
    for (let i = 0; i < scenes.length; i++) {
      scenesIndex.includes(i) ? scenes[i].start() : scenes[i].end();
    }

    // player暂停状态下，等渲染好了再做后面的截图
    if (isBrowser && this.playRate <= 0) await this.timeline.pause();
    FFLogger.info({ pos: 'renderFrame', msg: `current frame - ${frame}` });

    // Rendering logic part
    if (type === 'normal') {
      data = this.snapshotToBuffer();
    } else {
      // 转场动画
      const currScene = this.getSceneByIndex(scenesIndex[0]);
      const nextScene = this.getSceneByIndex(scenesIndex[1]);
      creator.addOnlyDisplayChild(currScene);
      const fromBuff = this.snapshotToBuffer();
      creator.addOnlyDisplayChild(nextScene);
      const toBuff = this.snapshotToBuffer();
      // todo: 如果不remove可能会在透明的时候有问题
      // 目前注释掉是因为scene.started已经设置过了，这里remove之后就不再会显示了
      // creator.removeAllDisplayChildren();

      const { transition } = currScene;
      const conf = this.rootConf();
      const width = conf.getVal('width');
      const height = conf.getVal('height');
      const quality = conf.getVal('cacheQuality');
      const cacheFormat = conf.getVal('cacheFormat');
      const type = (cacheFormat === 'canvas') ? 'raw' : cacheFormat;

      await transition.render({ type, fromBuff, toBuff, progress });
      data = GLUtil.getPixelsByteArray({ gl, width, height });

      if (cacheFormat === 'canvas') {
        // draw canvas
        const imgData = new ImageData(new Uint8ClampedArray(data.buffer), width, height);
        creator.app.view.getContext('2d').putImageData(imgData, 0, 0);
      } else if (cacheFormat !== 'raw') {
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
    // canvas: browser render has no cache
    if (this.rootConf('debug') || isBrowser) return;
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
