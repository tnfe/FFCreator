'use strict';

/**
 * FFCreator - FFCreator main class, a container contains multiple scenes and pictures, etc.
 * Can be used alone, more often combined with FFCreatorCenter.
 *
 * ####Example:
 *
 *     const creator = new FFCreator({ cacheDir, outputDir, width: 800, height: 640, audio });
 *     creator.addChild(scene2);
 *     creator.output(output);
 *     creator.start();
 *
 *
 * ####Note:
 *     The library depends on `ffmpeg` and `webgl` (linux server uses headless-webgl).
 *
 * @class
 */

const { isBrowser } = require("browser-or-node");

const path = require('path');
const Conf = require('./conf/conf');
const Pool = require('./core/pool');
const FFCon = require('./node/cons');
const Utils = require('./utils/utils');
const FFAudio = require('./audio/audio');
const FFLogger = require('./utils/logger');
const forEach = require('lodash/forEach');
const Renderer = require('./core/renderer');
const Effects = require('./animate/effects');
const { Application, Loader, settings, destroyAndCleanAllCache } = require('inkpaint');
const { nodeRequire } = require('./utils/utils');
const FFmpegUtil = nodeRequire('../utils/ffmpeg');

class FFCreator extends FFCon {
  constructor(conf = {}) {
    super({ type: 'creator', ...conf });

    // browser render
    if (conf.canvas) conf.cacheFormat = 'canvas';

    this.audios = [];
    this.inCenter = false;
    this.conf = new Conf(conf);
    this.loader = new Loader();

    this.createApp();
    this.createRenderer();
    this.addAudio(this.getConf('audio'));
    this.switchLog(this.getConf('log'));
  }

  /**
   * Create webgl scene display object
   * @private
   */
  createApp() {
    this.resetSize();
    const width = this.getConf('width');
    const height = this.getConf('height');
    const render = this.getConf('render');
    const clarity = this.getConf('clarity');
    const antialias = this.getConf('antialias');
    const useGL = render !== 'canvas';
    const key = `${this.type}_${render}`;
    settings.PRECISION_FRAGMENT = `${clarity}p`;

    // browser render
    const view = !useGL ? this.getConf('canvas') : null;
    if (isBrowser && !view) throw new Error(`Browser rendering need canvas!`);

    const app = Pool.get(
      key,
      () =>
        new Application(width, height, {
          backgroundColor: 0x000000,
          useGL,
          antialias,
          view,
        }),
    );
    app.renderer.resize(width, height);
    this.display = app.stage;
    this.app = app;
  }

  /**
   * Create Renderer instance - Core classes for rendering animations and videos.
   * @private
   */
  createRenderer() {
    this.renderer = new Renderer({ creator: this });
  }

  /**
   * Create output path, only used when using FFCreatorCenter.
   * @public
   */
  generateOutput() {
    const ext = this.getConf('ext');
    const outputDir = this.getConf('outputDir');
    if (this.inCenter && outputDir) {
      this.setOutput(path.join(outputDir, `${Utils.genUuid()}.${ext}`));
    }
  }

  /**
   * Get FFmpeg command line.
   * @return {function} FFmpeg command line
   * @public
   */
  getFFmpeg() {
    return FFmpegUtil.getFFmpeg();
  }

  /**
   * Set as the first frame cover page image
   * @param {string} face - the cover face image path
   * @public
   */
  setCover(cover) {
    this.setConf('cover', cover);
  }

  /**
   * Set the fps of the composite video.
   * @param {number} fps - the fps of the composite video
   * @public
   */
  setFps(fps) {
    this.setConf('fps', fps);
  }

  /**
   * Set the total duration of the composite video.
   * @param {number} duration - the total duration
   * @public
   */
  setDuration(duration) {
    this.setConf('duration', duration);
  }

  /**
   * Set configuration.
   * @param {string} key - the config key
   * @param {any} val - the config val
   * @public
   */
  setConf(key, val) {
    this.conf.setVal(key, val);
  }

  /**
   * Get configuration.
   * @param {string} key - the config key
   * @return {any}  the config val
   * @public
   */
  getConf(key) {
    return this.conf.getVal(key);
  }

  /**
   * Add background sound.
   * @param {string|objecg} args - the audio config
   * @public
   */
  addAudio(args) {
    if (!args) return;
    args = typeof args === 'string' ? { path: args } : args;
    if (args.loop === undefined) args.loop = true;
    this.addChild(new FFAudio(args));
  }

  /**
   * Create new effect and add to effects object
   * @param {string} name - the new effect name
   * @param {object} valObj - the new effect value
   * @public
   */
  createEffect(name, valObj) {
    Effects.createEffect(name, valObj);
  }

  /**
   * Set the stage size of the scene
   * @param {number} width - stage width
   * @param {number} height - stage height
   * @public
   */
  resetSize(width, height) {
    if (!width) {
      width = this.getConf('width');
      height = this.getConf('height');
    }

    this.setConf('width', Utils.courtship(width));
    this.setConf('height', Utils.courtship(height));
  }

  /**
   * Set the video output path
   * @param {string} output - the video output path
   * @public
   */
  setOutput(output) {
    this.setConf('output', path.normalize(output));
  }

  /**
   * Get the video output path
   * @return {string} output - the video output path
   * @public
   */
  getFile() {
    return this.getConf('output');
  }

  /**
   * Render the scene of the inkpaint app
   * @public
   */
  render() {
    try {
      this.app.render();
    } catch (e) {
      console.log(`App render error`, e);
    }
  }

  /**
   * Set the video output path
   * @param {string} output - the video output path
   * @public
   */
  output(output) {
    this.setOutput(output);
  }

  /**
   * Open logger switch
   * @public
   */
  openLog() {
    FFLogger.enable = true;
  }

  /**
   * Close logger switch
   * @public
   */
  closeLog() {
    FFLogger.enable = false;
  }

  switchLog(log) {
    if (log) this.openLog();
    else this.closeLog();
  }

  /**
   * Hook handler function
   * @public
   */
  setInputOptions(opts) {
    this.setConf('inputOptions', opts);
  }

  setOutOptions(opts) {
    this.setConf('outputOptions', opts);
  }

  /**
   * Start video processing
   * @public
   */
  async start(delay = 25) {
    await Utils.sleep(delay);
    // for audio
    this.started = true;
    this.startTime = 0;
    this.addRenderEvent();
    this.renderer.start();
  }

  /**
   * Start video play
   * @public
   */
  async play(playRate=1, callback) {
    this.renderer.play(playRate, callback);
  }

  /**
   * Pause video play
   * @public
   */
  async pause() {
    this.renderer.pause();
  }

  async jumpTo(timeInMs) {
    const time = Number(timeInMs);
    if (isNaN(time) || time < 0) throw new Error("jump to invalid time", timeInMs);
    this.renderer.jumpTo(time);
  }

  /**
   * Register to Renderer listen for events
   * @private
   */
  addRenderEvent() {
    this.bubble(this.renderer);
    const destroy = async () => {
      await Utils.sleep(20);
      this.destroy();
    };
    this.renderer.on('error', destroy);
    this.renderer.on('complete', destroy);
  }

  /**
   * Combine all sounds audio into an array
   * @private
   */
  concatAudios() {
    let audios = [].concat(this.audios);
    const scenes = this.children;

    forEach(scenes, (scene, index) => {
      forEach(scene.audios, audio => {
        if (index > 0) {
          const duration = this.getPrevScenesDuration(index - 1);
          audio.startTime = duration + audio.startTime;
        }
      });
      audios = audios.concat(scene.audios);
    });
    return audios;
  }

  /**
   * Get the duration of the previous scene
   * @private
   */
  getPrevScenesDuration(index) {
    let duration = 0;
    const scenes = this.children;
    for (let i = 0; i <= index; i++) {
      const scene = scenes[i];
      duration += scene.getRealDuration();
    }

    return duration;
  }

  /**
   * Get all sub nodes
   * @public
   */
  allNodes() {
    const scenes = this.children;
    let nodes = [];
    for (let i = 0; i < scenes.length; i++) {
      const scene = scenes[i];
      nodes = nodes.concat(scene.children).concat(scene.audios)
    }
    return nodes;
  }

  /**
   * Destroy the App class created by InkPaint
   * @private
   */
  destroyApp() {
    const pool = this.getConf('pool');
    const render = this.getConf('render');

    if (pool) {
      this.app.destroyChildren(true);
      Pool.put(`${this.type}_${render}`, this.app);
    } else {
      this.app.destroy(true, true);
    }

    destroyAndCleanAllCache();
    this.app = null;
  }

  destroy() {
    this.loader.destroy();
    this.renderer.destroy();
    this.destroyApp();
    super.destroy();

    this.conf = null;
    this.loader = null;
    this.display = null;
    this.renderer = null;
    this.inCenter = false;
  }

  /**
   * Set the installation path of the current server ffmpeg.
   * @param {string} path - installation path of the current server ffmpeg
   * @public
   */
  static setFFmpegPath(path) {
    FFmpegUtil.setFFmpegPath(path);
  }

  /**
   * Set the installation path of the current server ffprobe.
   * @param {string} path - installation path of the current server ffprobe
   * @public
   */
  static setFFprobePath(path) {
    FFmpegUtil.setFFprobePath(path);
  }
}

module.exports = FFCreator;
