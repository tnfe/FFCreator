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
const path = require('path');
const {Scene} = require('spritejs');
const Conf = require('./conf/conf');
const Pool = require('./core/pool');
const forEach = require('lodash/forEach');
const Renderer = require('./core/renderer');
const FFCon = require('./node/cons');
const Utils = require('./utils/utils');
const FFAudio = require('./audio/audio');
const FFLogger = require('./utils/logger');
const FFmpegUtil = require('./utils/ffmpeg');
const EventHelper = require('./event/helper');

class FFCreator extends FFCon {
  constructor(conf = {}) {
    super({type: 'creator', ...conf});

    this.audios = [];
    this.inCenter = false;
    this.conf = new Conf(conf);
    this.eventHelper = new EventHelper(this);

    this.createAppScene();
    this.createRenderer();
    this.addAudio(this.getConf('audio'));
  }

  /**
   * Create webgl scene display object
   * @private
   */
  createAppScene() {
    const width = this.getConf('width');
    const height = this.getConf('height');
    this.display = Pool.get('scene', () => new Scene({width, height}));
    this.display.width = width;
    this.display.height = height;
  }

  /**
   * Create Renderer instance - Core classes for rendering animations and videos.
   * @private
   */
  createRenderer() {
    this.renderer = new Renderer({threads: this.conf.threads, creator: this});
  }

  /**
   * Create output path, only used when using FFCreatorCenter.
   * @public
   */
  generateOutput() {
    let outputDir = this.getConf('outputDir');
    if (this.inCenter && outputDir) {
      this.setOutput(path.join(outputDir, `${Utils.uid()}.mp4`));
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
    args = typeof args === 'string' ? {path: args} : args;
    if (args.loop === undefined) args.loop = true;
    this.audios.push(new FFAudio(args));
  }

  /**
   * Add a virtual host.
   * @param {FFVtuber} vtuber - YouTuber
   * @public
   */
  addVtuber(vtuber) {
    this.vtuber = vtuber;
  }

  /**
   * Set the stage size of the scene
   * @param {number} width - stage width
   * @param {number} height - stage height
   * @public
   */
  setSize(width, height) {
    this.setConf('width', width);
    this.setConf('height', height);
    this.display.width = width;
    this.display.height = height;
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
  async start() {
    await Utils.sleep(20);
    this.addVtuberToScenes();
    this.addRenderEvent();
    this.renderer.start();
  }

  /**
   * Add the virtual anchor to all scenes
   * @private
   */
  addVtuberToScenes() {
    if (!this.vtuber) return;

    forEach(this.children, (scene, index) => {
      const vtuber = this.vtuber.clone();
      const period = vtuber.getPeriod();
      if (Utils.isArray2D(period)) vtuber.setPeriod(period[index]);
      scene.addChild(vtuber);
    });
  }

  /**
   * Prepare processing materials for each scene
   * @private
   */
  async preProcessing() {
    const scenes = this.children;
    for (let i = 0; i < scenes.length; i++) {
      const scene = scenes[i];
      for (let j = 0; j < scene.children.length; j++) {
        const node = scene.children[j];
        await node.preProcessing();
      }
    }

    // preload vtuber's textures
    if (this.vtuber && this.vtuber.texture) {
      // await this.display.preload(this.vtuber.texture.toArray());
    }
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
          audio.start = duration + audio.start;
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
   * Register to Renderer listen for events
   * @private
   */
  addRenderEvent() {
    // error handler
    const errorHandler = event => {
      this.eventHelper.emit('error', event);
      this.destroy();
    };

    // complete handler
    const completeHandler = event => {
      this.eventHelper.emit('complete', event);
      this.destroy();
    };

    // start
    this.renderer.on('render-start', this.eventHelper.bind('start'));
    this.renderer.on('render-progress', this.eventHelper.bind('progress'));
    // error
    this.renderer.on('render-error', errorHandler);
    this.renderer.on('synthesis-error', errorHandler);
    // complete
    this.renderer.on('all-complete', completeHandler);
  }

  destroy() {
    this.renderer.destroy();
    this.eventHelper.destroy();
    this.removeAllListeners();
    super.destroy();
    this.eventHelper = null;
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
