'use strict';

/**
 * FFVideo - Video component-based display component
 *
 * ####Example:
 *
 *     const video = new FFVideo({ path, width: 500, height: 350 });
 *     video.setAudio(true);
 *     video.setTimes("00:00:43", "00:00:50");
 *     scene.addChild(video);
 *
 *
 * ####Note
 *     https://spritejs.org/demo/#/video
 *
 * @class
 */
const path = require('path');
const min = require('lodash/min');
const FS = require('../utils/fs');
const FFImage = require('./image');
const probe = require('ffmpeg-probe');
const FFAudio = require('../audio/audio');
const DateUtil = require('../utils/date');
const FFLogger = require('../utils/logger');
const FFmpegUtil = require('../utils/ffmpeg');
const Materials = require('../utils/materials');
const TimelineUpdate = require('../timeline/update');
const { Sprite, Texture, BaseTexture } = require('inkpaint');

const DEFAULT_TIME = '-1';
class FFVideo extends FFImage {
  constructor(conf) {
    super({ type: 'video', ...conf });
    if (!conf.width)
      FFLogger.error({ pos: 'FFVideo', error: 'This component must enter the width!' });

    this.acommand = FFmpegUtil.createCommand();
    this.vcommand = FFmpegUtil.createCommand();

    this.materials = new Materials();
    this.index = 0;
    this.frameIndex = 0;
    this.startTime = DEFAULT_TIME; //"00:00:15"
    this.endTime = DEFAULT_TIME; //"00:00:15"
    this.codec = null;
    this.preload = false;
  }

  /**
   * Get display object width and height
   * @return {array} [width, height]
   * @public
   */
  getWH() {
    const { width = 50, height = 50 } = this.conf;
    return [width, height];
  }

  /**
   * Whether to play sound
   * @param {boolean} audio - Whether to play sound
   * @public
   */
  setAudio(audio = true) {
    this.conf.audio = audio;
  }

  /**
   * Whether to loop the video
   * @param {boolean} audio - Whether to loop the video
   * @public
   */
  setLoop(loop) {
    this.video.loop = loop;
  }

  /**
   * Set start/end time
   * @param {string|number} startTime - start time
   * @param {string|number} endTime - end time
   * @public
   */
  setTimes(startTime, endTime) {
    this.setStartTime(startTime);
    this.setEndTime(endTime);
  }

  /**
   * Set start time
   * @param {string|number} startTime - start time
   * @public
   */
  setStartTime(startTime) {
    startTime = typeof startTime === 'number' ? DateUtil.secondsToHms(startTime) : startTime;
    this.startTime = startTime;
  }

  /**
   * Set end time
   * @param {string|number} endTime - end time
   * @public
   */
  setEndTime(endTime) {
    if (this.startTime === DEFAULT_TIME) this.startTime = '00:00:00';
    endTime = typeof endTime === 'number' ? DateUtil.secondsToHms(endTime) : endTime;
    this.endTime = endTime;
  }

  /**
   * Set video codec
   * @param {string} codec such as 'libx264' or 'libvpx-vp9'
   * @public
   */
  setCodec(codec) {
    if (typeof codec === 'string') this.codec = codec;
  }

  /**
   * Create display object.
   * @private
   */
  createDisplay() {
    const { width = 300, height = 200 } = this.conf;
    this.display = new Sprite();
    this.display.attr({ width, height });
    this.setAnchor(0.5);
  }

  /**
   * Start rendering
   * @private
   */
  start() {
    this.animations.start();
    this.resetDuration();
    this.addTimelineCallback();
  }

  /**
   * Reset time of duration
   * @private
   */
  resetDuration() {
    const startTime = this.startTime === DEFAULT_TIME ? 0 : DateUtil.hmsToSeconds(this.startTime);
    const endTime = this.endTime === DEFAULT_TIME ? 0 : DateUtil.hmsToSeconds(this.endTime);

    const DIPS = 0.0;
    const realEndTime = this.materials.getDuration();
    const endMaxTime = startTime + this.parent.duration + DIPS;

    let rendTime = 10.0;
    if (endTime === 0) {
      rendTime = min([realEndTime, endMaxTime]);
    } else {
      rendTime = min([endTime, realEndTime, endMaxTime]);
    }

    this.setEndTime(rendTime);
  }

  /**
   * Add callback hook
   * @private
   */
  addTimelineCallback() {
    this.animations.onAniStart(() => {
      this.drawing = this.drawing.bind(this);
      TimelineUpdate.addFrameCallback(this.drawing);
    });
  }

  /**
   * Functions for drawing images
   * @private
   */
  drawing() {
    const texture = this.materials.getFrame(this.frameIndex);
    this.display.updateBaseTexture(texture);
    this.nextFrame();
  }

  /**
   * draw the first image
   * @private
   */
  drawFaceImage() {
    const [width, height] = this.getWH();
    const frame = this.materials.getSourceRect(width, height);
    // const orig = new Rectangle(0, 0, width, height);
    // const trim = new Rectangle(0, 0, width, height);

    const texture = new Texture(new BaseTexture(), frame);
    this.display.texture = texture;
    this.display.attr({ width, height });
    this.drawing();
  }

  /**
   * draw the next frame of video
   * @private
   */
  nextFrame() {
    const ra = this.rootConf('rfps') / this.rootConf('fps');
    this.index++;
    if (this.index >= ra) {
      this.index = 0;
      this.frameIndex++;
    }
  }

  addAudioToScene() {
    if (!this.parent) return;
    if (!this.materials.apath) return;

    const audio = new FFAudio({
      path: this.materials.apath,
      start: this.getDelayTime(),
    });
    this.parent.addAudio(audio);
  }

  /**
   * Extract the audio file from the movie
   * @private
   */
  extractAudio() {
    return new Promise((resolve, reject) => {
      const opts = this.endTime == DEFAULT_TIME ? [] : ['-ss', this.startTime, '-to', this.endTime];
      this.materials.apath = this.getAOutput();

      this.acommand
        .addInput(this.getPath())
        .noVideo()
        .audioCodec('libmp3lame')
        .outputOptions(opts)
        .output(this.materials.apath);

      this.acommand
        .on('end', () => {
          FFLogger.info({ pos: 'FFVideo', msg: 'Audio preProcessing completed!' });
          resolve();
        })
        .on('error', err => {
          FFLogger.error({ pos: 'FFVideo', msg: 'Audio preProcessing error', error: err });
          reject(err);
        });

      this.acommand.run();
    });
  }

  /**
   * Extract the images file from the movie
   * @private
   */
  extractVideo() {
    return new Promise((resolve, reject) => {
      const fps = this.rootConf('fps');
      let opts = `-loglevel info -pix_fmt rgba -start_number 0 -vf fps=${fps}`.split(' ');
      let times = this.endTime == DEFAULT_TIME ? [] : ['-ss', this.startTime, '-to', this.endTime];
      opts = opts.concat(times);

      this.materials.path = this.getVOutput();
      this.vcommand.addInput(this.getPath());
      this.vcommand.inputOptions(this.codec ? ['-c:v', this.codec] : []);
      this.vcommand.outputOptions(opts);
      this.vcommand.output(this.materials.path);
      this.vcommand
        .on('start', commandLine => {
          FFLogger.info({ pos: 'FFVideo', msg: `Video preProcessing start: ${commandLine}` });
        })
        .on('progress', progress => {
          this.materials.length = progress.frames;
        })
        .on('end', () => {
          this.getVideoInfo().then(info => {
            this.materials.info = info;
            this.drawFaceImage();
            FFLogger.info({
              pos: 'FFVideo',
              msg: `Video preProcessing completed: ${this.materials}`,
            });
            resolve();
          });
        })
        .on('error', err => {
          FFLogger.error({ pos: 'FFVideo', msg: `Video preProcessing error`, error: err });
          reject(err);
        });
      this.vcommand.run();
    });
  }

  async getVideoInfo() {
    return await probe(this.getPath());
  }

  preProcessing() {
    const extractTask = this.conf.audio
      ? [this.extractVideo(), this.extractAudio()]
      : [this.extractVideo()];
    return Promise.all(extractTask).then(() => this.addAudioToScene());
  }

  getVOutput() {
    const dir = this.rootConf('detailedCacheDir');
    FS.ensureDir(dir);
    return path.join(dir, `${this.id}_%d.png`);
  }

  getAOutput() {
    const dir = this.rootConf('detailedCacheDir');
    FS.ensureDir(dir);
    return path.join(dir, `${this.id}_audio.mp3`);
  }

  destroy() {
    TimelineUpdate.removeFrameCallback(this.drawing);
    this.materials.destroy();
    FFmpegUtil.destroy(this.acommand);
    FFmpegUtil.destroy(this.vcommand);
    super.destroy();
  }
}

module.exports = FFVideo;
