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
const FFAudio = require('../audio/audio');
const DateUtil = require('../utils/date');
const FFLogger = require('../utils/logger');
const ffprobe = require('../utils/ffprobe');
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
    this.useCache = false;
    this.clarity = conf.qscale || conf.clarity || 2;
    this.audio = conf.audio === undefined ? true : conf.audio;
    this.loop = conf.loop === undefined ? false : conf.loop;
    this.voImageExtra = conf.voImageExtra === undefined ? 'jpg' : conf.voImageExtra;
    this.setDuration(conf.ss, conf.to);
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
    this.audio = audio;
  }

  /**
   * Whether to loop the video
   * @param {boolean} audio - Whether to loop the video
   * @public
   */
  setLoop(loop) {
    this.loop = loop;
  }

  /**
   * Set start/end time
   * @param {string|number} startTime - start time
   * @param {string|number} endTime - end time
   * @public
   */
  setDuration(startTime, endTime) {
    this.setStartTime(startTime);
    this.setEndTime(endTime);
  }

  /**
   * Set start time
   * @param {string|number} startTime - start time
   * @public
   */
  setStartTime(startTime) {
    if (startTime === undefined) return;
    if (startTime === DEFAULT_TIME) return;

    startTime = DateUtil.secondsToHms(startTime);
    this.startTime = startTime;
  }

  /**
   * Set end time
   * @param {string|number} endTime - end time
   * @public
   */
  setEndTime(endTime) {
    if (endTime === undefined) return;
    if (endTime === DEFAULT_TIME) return;

    endTime = DateUtil.secondsToHms(endTime);
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
    const [width, height] = this.getWH();
    this.display = new Sprite();
    this.display.attr({ width, height });
    this.setAnchor(0.5);
  }

  /**
   * Material preprocessing
   * @return {Promise}
   * @public
   */
  async preProcessing() {
    try {
      const info = await this.getVideoInfo();
      this.materials.info = info;
    } catch (e) {
      console.log(e);
    }

    this.resetDurationTime();
    if (this.audio){
      const { streams=[] } = this.materials.info;
      const hasAudioStream = streams.some(function(stream) {
        return stream.codec_type === 'audio';
      });
      if(hasAudioStream){
        await this.extractAudio();
      }
    }
    await this.extractVideo();
    this.addAudioToScene();
  }

  /**
   * Start rendering
   * @private
   */
  start() {
    this.drawCoverImage();
    this.animations.start();
    this.addTimelineCallback();
  }

  /**
   * Reset time of duration
   * @private
   */
  resetDurationTime() {
    let startTime, endTime, duration, maxDuration;
    const aniStartTime = this.getDelayTime();
    const aniEndTime = this.getDurationTime();
    const senceDuration = this.parent.duration;
    const timelineDuration = min([aniEndTime, senceDuration]);

    // if set end time
    if (this.endTime !== DEFAULT_TIME) {
      startTime = this.startTime === DEFAULT_TIME ? 0 : DateUtil.hmsToSeconds(this.startTime);
      endTime = DateUtil.hmsToSeconds(this.endTime);
      duration = endTime - startTime;
      maxDuration = timelineDuration - aniStartTime;

      if (duration > maxDuration) {
        endTime = startTime + maxDuration;
      }
      this.setDuration(startTime, endTime);
    }

    // if not set end time
    else {
      startTime = this.startTime === DEFAULT_TIME ? 0 : DateUtil.hmsToSeconds(this.startTime);
      maxDuration = timelineDuration - aniStartTime;
      endTime = startTime + maxDuration;
      this.setDuration(startTime, endTime);
    }
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
    this.display.updateBaseTexture(texture, this.useCache);
    this.nextFrame();
  }

  /**
   * draw the first cover image
   * @private
   */
  drawCoverImage() {
    const { display } = this;
    const [width, height] = this.getWH();
    const frame = this.materials.getSourceRect(width, height);
    const texture = new Texture(new BaseTexture(), frame);

    display.texture = texture;
    display.attr({ width, height });
    display.setScaleToInit();

    this.drawing();
  }

  /**
   * draw the next frame of video
   * @private
   */
  nextFrame() {
    const { length } = this.materials;

    this.index++;
    if (this.index >= 1) {
      this.index = 0;
      this.frameIndex++;

      if (this.loop && this.frameIndex >= length) {
        this.frameIndex = 0;
      }
    }
  }

  addAudioToScene() {
    if (!this.parent) return;
    if (!this.materials.apath) return;

    const audio = new FFAudio({
      path: this.materials.apath,
      start: this.getDelayTime(),
      loop: this.loop,
    });
    this.parent.addAudio(audio);
  }

  /**
   * Extract the audio file from the movie
   * @private
   */
  extractAudio() {
    return new Promise((resolve, reject) => {
      const opts =
        this.endTime === DEFAULT_TIME ? [] : ['-ss', this.startTime, '-to', this.endTime];
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
      const qscale = this.clarity;
      let opts = `-loglevel info -pix_fmt rgba -start_number 0 -vf fps=${fps} -qscale:v ${qscale}`.split(
        ' ',
      );
      let times = this.endTime === DEFAULT_TIME ? [] : ['-ss', this.startTime, '-to', this.endTime];
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
          FFLogger.info({
            pos: 'FFVideo',
            msg: `Video preProcessing completed: ${this.materials}`,
          });
          resolve();
        })
        .on('error', err => {
          FFLogger.error({ pos: 'FFVideo', msg: `Video preProcessing error`, error: err });
          reject(err);
        });
      this.vcommand.run();
    });
  }

  async getVideoInfo() {
    return await ffprobe(this.getPath());
  }

  getVOutput() {
    const dir = this.rootConf('detailedCacheDir');
    FS.ensureDir(dir);
    return path.join(dir, `${this.id}_%d.${this.voImageExtra}`);
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
