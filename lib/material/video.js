'use strict';

/**
 * VideoMaterial
 * @class
 */

const { isBrowser } = require("browser-or-node");
const ImageMaterial = require('./image');
const min = require('lodash/min');
const FFLogger = require('../utils/logger');

const { nodeRequire } = require('../utils/utils');
const probe = nodeRequire('ffmpeg-probe');
const FFmpegUtil = nodeRequire('../utils/ffmpeg');

class VideoMaterial extends ImageMaterial {
  constructor(conf) {
    super(conf);
    this.volume = conf.volume || 1;
    this.useAudio = conf.audio === undefined ? true : conf.audio;

    // for frontend player
    this.time = 0;
    this.prepareTime = 0;
    this.playing = false;

    // for backend burner
    this.codec = conf.codec;
    this.clarity = conf.qscale || conf.clarity || 2;
    this.voImageExtra = conf.voImageExtra === undefined ? 'jpg' : conf.voImageExtra;
  }

  async init(opts) {
    const { duration, fps } = opts;
    this.duration = duration; // target container duration
    this.fps = fps; // target fps
    if (isBrowser) {
      const debugContainer = document.getElementById('mira-player-debug-container');
      const vsize = 300; // todo: 好像这个尺寸并不影响渲染清晰度，默认300先
      this.$video = this.initVideo(this.path, vsize, vsize, debugContainer);
      if (!this.useAudio) this.$video.muted = true;
      else if (this.volume > 0) this.$video.volume = this.volume;
      this.info = await this.browserProbe(this.$video);
      this.canvas = this.initCanvas(this.info.width, this.info.height);
      this.canvasContext = this.canvas.getContext('2d');
    } else {
      this.info = await probe(this.path);
      this.info.duration /= 1000; // from ms -> s
      this.acommand = FFmpegUtil.createCommand();
      this.vcommand = FFmpegUtil.createCommand();
    }

    // todo: check if duration is hms format by probe
    this.length = this.info.duration;
  }

  initVideo(src, w, h, container) {
    const video = document.createElement('video');
    video.crossOrigin = 'Anonymous'; // 必须设置，不然可能*污染*canvas
    video.src = src;
    video.width = w;
    video.height = h;
    if (container) { // for debug view
      video.controls = "controls";
      video.style = "background:#000";
      container.appendChild(video);
    }
    return video;
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

  async grantPlay() {
    // safari只能在用户点击事件的回调里先play()，"获取权限"之后js才能后续play/pause
    const video = this.$video;
    const muted = video.muted; // 先mute，不出声
    video.muted = true;
    await video.play();
    video.pause(); // 开始play之后，立刻暂停并恢复原先的mute状态
    video.muted = muted;
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
      if (!this.playing || Math.abs(this.time - this.prepareTime) > 0.3) {
        // seek to time + ss (start offset)
        const seekTime = min([this.getDuration(), this.time]) + this.getStartOffset();
        // not changed...
        if (this.$video.currentTime.toFixed(3) == seekTime.toFixed(3)) {
          return resolve(this.drawCanvas(this.$video, width, height));
        }
        this.$video.currentTime = seekTime;
        this.$video.addEventListener('seeked', () => {
          console.log('seeked', this.$video.currentTime);
          resolve(this.drawCanvas(this.$video, width, height));
        }, { once: true });
        this.$video.addEventListener('error', e => reject(e));
      } else {
        // console.log('playing', time.toFixed(3), '+', (this.$video.currentTime - time).toFixed(3))
        resolve(this.drawCanvas(this.$video, width, height));
      }
    });
  }

  async drawCanvas(img, width, height) {
    this.canvasContext.drawImage(await this.getImage(img), 0, 0, width, height);
    return this.canvas;
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
    this.acommand && FFmpegUtil.destroy(this.acommand);
    this.vcommand && FFmpegUtil.destroy(this.vcommand);
  }
}

module.exports = VideoMaterial;