'use strict';

/**
 * Materials - A material auxiliary management class
 *
 * ####Example:
 *
 *     const materials = new Materials();
 *     const endTime = materials.getDuration();
 *     const rect = materials.getSourceRect(width, height);
 *
 * @class
 */

const min = require('lodash/min');
const path = require('path');
const DateUtil = require('./date');
const FFLogger = require('../utils/logger');
const { Rectangle } = require('inkpaint');

const { safeRequire } = require('../utils/utils');
const FS = safeRequire('../utils/fs');
const probe = safeRequire('ffmpeg-probe');
const FFmpegUtil = safeRequire('../utils/ffmpeg');

const DEFAULT_TIME = -1;

class Materials {
  static MODE_FRONTEND = 'mfe';
  static MODE_BACKEND = 'mbe';

  constructor(conf) {
    this.info = null;
    this.path = '';
    this.apath = '';
    this.start = DEFAULT_TIME;
    this.end = DEFAULT_TIME;
    this.length = 0; // material length
    this.frames = 0;

    this.fps = 30; // target fps
    this.duration = 0; // target duration

    // for frontend player
    this.time = 0;
    this.prepareTime = 0;
    this.inited = false;
    this.playing = false;

    if (conf) {
      this.path = conf.src || conf.path || conf.image || conf.url;
      const ss = Number(conf.ss);
      const to = Number(conf.to);
      this.start = isNaN(ss) ? DEFAULT_TIME : ss;
      this.end = isNaN(to) ? DEFAULT_TIME : to;

      // for backend burner
      this.codec = conf.codec;
      this.clarity = conf.qscale || conf.clarity || 2;
      this.voImageExtra = conf.voImageExtra === undefined ? 'jpg' : conf.voImageExtra;
    }
  }

  prepare(time) {
    this.prepareTime = time;
    const delta = this.prepareTime - this.time;
    // console.log('prepare play', {pt:this.prepareTime, tt:this.time, delta, path:this.path});
    if (delta && !this.playing) {
      // todo: calc playbackRate by delta & adjust err
      this.$video.playbackRate = 1;
      this.$video.play();
      this.playing = true;
    }
  }

  pause() {
    if (!this.playing) return;
    this.$video && this.$video.pause();
    this.playing = false;
  }

  async getFrameByTime(time) {
    this.time = time;
    if (this.mode == Materials.MODE_BACKEND) {
      return this.getFrame((time * this.fps) >> 0);
    }

    return new Promise((resolve, reject) => {
      const width = 600;
      const height = 300;
      // console.log('ma.getFrameByTime', this.time, this.prepareTime, this.playing);
      if (!this.playing || this.time.toFixed(3) != this.prepareTime.toFixed(3)) {
        // seek to time + ss (start offset)
        const seekTime = min([this.getDuration(), this.time + this.getStartOffset()]);
        // not changed...
        if (this.$video.currentTime.toFixed(3) == seekTime.toFixed(3)) {
          return resolve(this.drawCanvas(width, height));
        }
        this.$video.currentTime = seekTime;
        this.$video.addEventListener('canplay', e => {
          console.log('canplay', this.$video.currentTime, this.path);
          resolve(this.drawCanvas(width, height));
        }, { once: true });
      } else {
        resolve(this.drawCanvas(width, height));
      }
    });
  }

  drawCanvas(width, height) {
    this.canvasContext.drawImage(this.$video, 0, 0, width, height);
    return this.canvas;
  }

  async getResource(url) {
    if (url.startsWith('blob:') || 1) return url;
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.responseType = 'blob';
      xhr.open("GET", url);
      xhr.onload = (e) => resolve(URL.createObjectURL(xhr.response));
      xhr.onerror = (e) => reject(xhr.responseText);
      xhr.onprogress = (e) => {
        console.log('preloading', url, (100 * e.loaded / e.total).toFixed(1) + '%');
      };
      xhr.send();
    });
  }

  async init(opts) {
    if (this.inited) return;
    this.inited = true;
    const { mode, duration, fps } = opts;
    this.mode = mode;
    this.duration = duration;
    this.fps = fps;
    // todo: 判断conf.type 
    if (mode == Materials.MODE_FRONTEND) {
      this.initCanvas();
      this.info = await this.feProbe(this.$video);
    } else {
      this.info = await probe(this.path);
      this.acommand = FFmpegUtil.createCommand();
      this.vcommand = FFmpegUtil.createCommand();
    }

    //todo: check if duration is hms format by probe
    console.log('material.init info', opts, this.info, this.path);
    this.length = this.info.duration;
  }

  initCanvas() {
    this.canvas = document.createElement('canvas');
    // todo: canvas size should follow creator
    this.canvas.width = 600;
    this.canvas.height = 300;
    this.canvasContext = this.canvas.getContext('2d');

    this.$video = document.createElement('video');
    this.$video.crossOrigin = 'Anonymous';
    this.$video.style = "background:#000";
    this.$video.src = this.path;
    this.$video.width = 300;
    this.$video.height = 300;
    this.$video.controls = "controls";

    const testDom = document.getElementById('mira-player-debug-container');
    if (testDom) testDom.appendChild(this.$video);
    return this.canvas;
  }

  async feProbe($el) {
    return new Promise((resolve, reject) => {
      $el.addEventListener('loadedmetadata', e => {
        const { duration, videoWidth, videoHeight } = $el;
        resolve({ width: videoWidth, height: videoHeight, duration });
      });
      $el.addEventListener('error', e => reject());
    });
  }

  /**
   * Get the width and height of the material resource frame scaled according to the scene scale
   * @param {number} width - The width of the scene
   * @param {number} height - The height of the scene
   * @return {array} [x, y, width, height]
   * @public
   */
  getSourceRect(width, height) {
    if (!this.info) return new Rectangle(0, 0, width, height);

    let w, h, x, y;
    const ow = this.info.width;
    const oh = this.info.height;
    const s1 = width / height;
    const s2 = ow / oh;
    if (s1 >= s2) {
      w = ow;
      h = (ow / s1) >> 0;
      x = 0;
      y = ((oh - h) / 2) >> 0;
    } else {
      h = oh;
      w = (oh * s1) >> 0;
      y = 0;
      x = ((ow - w) / 2) >> 0;
    }

    return new Rectangle(x, y, w, h);
  }

  /**
   * Obtain duration based on movie information
   * @return {number} movie information duration
   * @public
   */
  getDuration() {
    // if (!this.info) return 0;

    // let duration = this.info.duration;
    // if (typeof duration === 'string') {
    //   if (duration.indexOf(':') > 0) duration = DateUtil.hmsToSeconds(duration);
    //   else duration = parseInt(duration);
    // }

    // return Math.floor(duration / 1000);
    console.log('material.getDuration', {len:this.length, end:this.getEndOffset(), start:this.getStartOffset()});
    return min([this.length, this.getEndOffset() - this.getStartOffset()]);
  }

  /**
   * Get the path of a certain frame in the Materials
   * @param {number} index - Frame number index
   * @return {string} Frame path
   * @public
   */
  getFrame(index) {
    if (index < this.frames) return this.path.replace('%d', index);
    else return this.path.replace('%d', this.frames - 1); // 保持最后一帧
  }

  /**
   * Return a cloned Materials object
   * @return {Materials} A cloned Materials object
   * @public
   */
  clone() {
    const mat = new Materials();
    mat.info = this.info;
    mat.path = this.path;
    mat.apath = this.apath;
    mat.start = this.start;
    mat.end = this.end;
    mat.length = this.length;

    return mat;
  }

  destroy() {
    if (this.$video?.parentElement) this.$video.remove();
    this.canvas = null;
    this.canvasContext = null;
    this.inited = false;
    this.playing = false;
    this.$video = null;
    this.info = null;
    this.path = '';
    this.length = 0;
  }

  toString() {
    return `images:${this.length}-${this.path}`;
  }

  getStartOffset() {
    return this.start == DEFAULT_TIME ? 0 : this.start;
  }

  getEndOffset() {
    const end = this.getStartOffset() + this.duration;
    return this.end == DEFAULT_TIME ? end : min([end, this.end]);
  }

  getStartHms() {
    return DateUtil.secondsToHms(this.getStartOffset());
  }

  getEndHms() {
    return DateUtil.secondsToHms(this.getEndOffset());
  }

  getSliceOpts() {
    let opts = [];
    if (this.getStartOffset() > 0) opts = opts.concat(['-ss', this.getStartHms()]);
    if (this.getEndOffset() < this.length) opts = opts.concat(['-to', this.getEndHms()]);
    return opts;
  }

  /**
   * Extract the audio file from the movie
   * @private
   */
   extractAudio(dir, name) {
    return new Promise((resolve, reject) => {
      const opts = this.getSliceOpts();
      this.apath = this.getOutputPath(dir, `${name}.mp3`);

      this.acommand
        .addInput(this.path)
        .noVideo()
        .audioCodec('libmp3lame')
        .outputOptions(opts)
        .output(this.apath);

      this.acommand
        .on('end', () => {
          FFLogger.info({ pos: 'Material', msg: 'Audio preProcessing completed!' });
          resolve(this.apath);
        })
        .on('error', err => {
          FFLogger.error({ pos: 'Material', msg: 'Audio preProcessing error', error: err });
          reject(err);
        });

      this.acommand.run();
    });
  }

  /**
   * Extract the images file from the movie
   * @private
   */
  extractVideo(dir, name) {
    return new Promise((resolve, reject) => {
      const fps = this.fps;
      const qscale = this.clarity;
      let opts = `-loglevel info -pix_fmt rgba -start_number 0 -vf fps=${fps} -qscale:v ${qscale}`.split(
        ' ',
      );
      opts = opts.concat(this.getSliceOpts());

      this.vpath = this.getOutputPath(dir, `${name}_%d.${this.voImageExtra}`);
      this.vcommand.addInput(this.path);
      this.vcommand.inputOptions(this.codec ? ['-c:v', this.codec] : []);
      this.vcommand.outputOptions(opts);
      this.vcommand.output(this.vpath);
      this.vcommand
        .on('start', commandLine => {
          FFLogger.info({ pos: 'Material', msg: `Video preProcessing start: ${commandLine}` });
        })
        .on('progress', progress => {
          this.frames = progress.frames;
        })
        .on('end', () => {
          FFLogger.info({
            pos: 'Material',
            msg: `Video preProcessing completed: ${this}`,
          });
          // replace path
          this.path = this.vpath;
          resolve(this.vpath);
        })
        .on('error', err => {
          FFLogger.error({ pos: 'Material', msg: `Video preProcessing error`, error: err });
          reject(err);
        });
      this.vcommand.run();
    });
  }

  getOutputPath(dir, fname) {
    FS.ensureDir(dir);
    return path.join(dir, fname);
  }
}

module.exports = Materials;
