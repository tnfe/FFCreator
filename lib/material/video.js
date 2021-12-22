'use strict';

/**
 * VideoMaterial
 * @class
 */

const { isBrowser } = require("browser-or-node");
const Material = require('./material');
const min = require('lodash/min');
const FFLogger = require('../utils/logger');

const { nodeRequire } = require('../utils/utils');
const probe = nodeRequire('ffmpeg-probe');
const FFmpegUtil = nodeRequire('../utils/ffmpeg');

class VideoMaterial extends Material {
  constructor(conf) {
    super(conf);

    // for frontend player
    this.time = 0;
    this.prepareTime = 0;
    this.inited = false;
    this.playing = false;

    // for backend burner
    this.codec = conf.codec;
    this.clarity = conf.qscale || conf.clarity || 2;
    this.voImageExtra = conf.voImageExtra === undefined ? 'jpg' : conf.voImageExtra;
  }

  prepare(time) {
    this.prepareTime = time;
    const delta = this.prepareTime - this.time;
    // console.log('prepare play', {pt:this.prepareTime, tt:this.time, delta, path:this.path});
    if (delta && !this.playing) {
      if (isBrowser) {
        // todo: calc playbackRate by delta & adjust err
        this.$video.playbackRate = 1;
        this.$video.play();
        this.playing = true;
      } else {
        /**
         * todo: may change pre-extract all imgs into 
         *       just-in-time read frames to save disk I/O or memory
         */
      }
    }
  }

  pause() {
    if (!this.playing) return;
    this.$video && this.$video.pause();
    this.playing = false;
  }

  async getFrameByTime(time) {
    this.time = time;
    if (!isBrowser) return this.getFrame((time * this.fps) >> 0);
    return new Promise((resolve, reject) => {
      const width = this.canvas.width;
      const height = this.canvas.height;
      // console.log('ma.getFrameByTime', this.time, this.prepareTime, this.playing);
      if (!this.playing || this.time.toFixed(3) != this.prepareTime.toFixed(3)) {
        // seek to time + ss (start offset)
        const seekTime = min([this.getDuration(), this.time]) + this.getStartOffset();
        // not changed...
        if (this.$video.currentTime.toFixed(3) == seekTime.toFixed(3)) {
          return resolve(this.drawCanvas(width, height));
        }
        this.$video.currentTime = seekTime;
        this.$video.addEventListener('canplay', () => {
          console.log('canplay', this.$video.currentTime, this.path);
          resolve(this.drawCanvas(width, height));
        }, { once: true });
        this.$video.addEventListener('error', e => reject(e));
      } else {
        resolve(this.drawCanvas(width, height));
      }
    });
  }

  drawCanvas(width, height) {
    this.canvasContext.drawImage(this.$video, 0, 0, width, height);
    return this.canvas;
  }

  async init(opts) {
    if (this.inited) return;
    this.inited = true;
    const { mode, duration, fps } = opts;
    this.mode = mode;
    this.duration = duration;
    this.fps = fps;
    if (isBrowser) {
      this.initCanvas();
      this.info = await this.browserProbe(this.$video);
    } else {
      this.info = await probe(this.path);
      this.info.duration /= 1000; // from ms -> s
      this.acommand = FFmpegUtil.createCommand();
      this.vcommand = FFmpegUtil.createCommand();
    }

    // todo: check if duration is hms format by probe
    this.length = this.info.duration;
  }

  initCanvas() {
    const size = 720;
    const videoSize = 300;

    this.canvas = document.createElement('canvas');
    // todo: canvas size should follow creator
    this.canvas.width = size;
    this.canvas.height = size;
    this.canvasContext = this.canvas.getContext('2d');

    this.$video = document.createElement('video');
    this.$video.crossOrigin = 'Anonymous';
    this.$video.style = "background:#000";
    this.$video.src = this.path;
    this.$video.width = videoSize;
    this.$video.height = videoSize;
    this.$video.controls = "controls";

    const testDom = document.getElementById('mira-player-debug-container');
    if (testDom) testDom.appendChild(this.$video);
    return this.canvas;
  }

  async browserProbe($el) {
    return new Promise((resolve, reject) => {
      $el.addEventListener('loadedmetadata', () => {
        const { duration, videoWidth, videoHeight } = $el;
        resolve({ width: videoWidth, height: videoHeight, duration });
      });
      $el.addEventListener('error', () => reject());
    });
  }

  /**
   * Get the path of a certain frame in the Materials
   * @param {number} index - Frame number index
   * @return {string} Frame path
   * @public
   */
  getFrame(index) {
    const i = index < this.frames ? index : this.frames - 1; // 保持最后一帧
    return this.vpath.replace('%d', i);
  }

  getSliceOpts() {
    let opts = [];
    if (this.getStartOffset() > 0) opts = opts.concat(['-ss', this.getStartHms()]);
    if (this.getEndOffset() < this.length) opts = opts.concat(['-to', this.getEndHms()]);
    return opts;
  }

  /**
   * Extract the audio file from the movie
   * @public
   */
  async extractAudio(dir, name) {
    const output = this.getOutputPath(dir, `${name}.mp3`);
    const outOpts = this.getSliceOpts();
    const command = this.acommand.noVideo().audioCodec('libmp3lame');
    this.apath = await this.ffCmdExec({ command, output, outOpts });
    return this.apath;
  }

  /**
   * Extract the images file from the movie
   * @public
   */
  async extractVideo(dir, name) {
    let outOpts = `-loglevel info -pix_fmt rgba -start_number 0`.split(' ');
    outOpts = outOpts.concat(`-vf fps=${this.fps} -qscale:v ${this.clarity}`.split(' '));
    outOpts = outOpts.concat(this.getSliceOpts());
    const inOpts = this.codec ? `-c:v ${this.codec}` : "";
    const output = this.getOutputPath(dir, `${name}_%d.${this.voImageExtra}`);
    const onProgress = (progress) => { this.frames = progress.frames };
    this.vpath = await this.ffCmdExec({ command:this.vcommand, output, inOpts, outOpts, onProgress });
    return this.vpath;
  }

  ffCmdExec({ command, output, inOpts, outOpts, onProgress }) {
    const opt = function(opts) {
      if (typeof opts === "string") opts = opts.split(' ');
      if (opts instanceof Array) opts = opts.filter(a => a !== '');
      return opts;
    }
    inOpts && command.inputOptions(opt(inOpts));
    outOpts && command.outputOptions(opt(outOpts));
    command.addInput(this.path).output(output);
    return new Promise((resolve, reject) => {
      command
        .on('start', commandLine => {
          FFLogger.info({ pos: 'Material', msg: `${this.type} preProcessing start: ${commandLine}` });
        })
        .on('progress', progress => {
          onProgress && onProgress(progress);
        })
        .on('end', () => {
          FFLogger.info({ pos: 'Material', msg: `${this.type} preProcessing completed: ${this}` });
          resolve(output);
        })
        .on('error', error => {
          FFLogger.error({ pos: 'Material', msg: `${this.type} preProcessing error: `, error });
          reject(error);
        });
      command.run();
    });
  }

  destroy() {
    super.destroy();
    if (this.$video) {
      this.$video.remove();
      this.$video = null;
    }
    if (this.canvas) {
      this.canvas.remove();
      this.canvas = null;
      this.canvasContext = null;
      this.playing = false;
    }
    this.inited = false;
    this.acommand && FFmpegUtil.destroy(this.acommand);
    this.vcommand && FFmpegUtil.destroy(this.vcommand);
  }
}

module.exports = VideoMaterial;