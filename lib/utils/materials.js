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
const DateUtil = require('./date');
const { Rectangle } = require('inkpaint');

try {
  const probe = require('ffmpeg-probe');
  const FFmpegUtil = require('../utils/ffmpeg');
} catch (err) {}

class Materials {
  static MODE_FRONTEND = 'mfe';
  static MODE_BACKEND = 'mbe';

  constructor() {
    this.info = null;
    this.fps = 30;
    this.path = '';
    this.apath = '';
    this.start = 0;
    this.end = 0;
    this.length = 0;

    // for player
    this.time = 0;
    this.prepareTime = 0;
    this.inited = false;
    this.playing = false;
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
    return new Promise((resolve, reject) => {
      const width = 600;
      const height = 300;
      // console.log('ma.getFrameByTime', this.time, this.prepareTime, this.playing);
      if (!this.playing || this.time.toFixed(3) != this.prepareTime.toFixed(3)) {
        //seek to time
        this.$video.currentTime = this.time;
        this.$video.addEventListener('canplay', e => {
          console.log('canplay', this.$video.currentTime, this.path);
          this.canvasContext.drawImage(this.$video, 0, 0, width, height);
          resolve(this.canvas);
        }, { once: true });
      } else {
        this.canvasContext.drawImage(this.$video, 0, 0, width, height);
        resolve(this.canvas);
      }
    });
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

  init(src, mode) {
    if (this.inited) return;
    this.inited = true;
    this.path = src;
    if (mode == this.MODE_FRONTEND) this.initCanvas();
  }

  initCanvas() {
    this.canvas = document.createElement('canvas');
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

    const testDom = document.getElementById('mira-testv');
    if (testDom) testDom.appendChild(this.$video);
    return this.canvas;
  }

  async prepareInfo() {
    this.info = await (this.$video ? this.feProbe() : probe(this.path));
  }

  async feProbe() {
    return new Promise((resolve, reject) => {
      this.$video.addEventListener('loadedmetadata', e => {
        const { duration, videoWidth, videoHeight } = this.$video;
        resolve({ width: videoWidth, height: videoHeight, duration });
      });
      this.$video.addEventListener('error', e => reject());
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
    if (!this.info) return 0;

    let duration = this.info.duration;
    if (typeof duration === 'string') {
      if (duration.indexOf(':') > 0) duration = DateUtil.hmsToSeconds(duration);
      else duration = parseInt(duration);
    }

    return Math.floor(duration / 1000);
  }

  /**
   * Get the path of a certain frame in the Materials
   * @param {number} index - Frame number index
   * @return {string} Frame path
   * @public
   */
  getFrame(index) {
    if (index < this.length) return this.path.replace('%d', index);
    else return this.path.replace('%d', this.length - 1);
  }

  /**
   * Get the path of a certain frame in the Materials
   * convert ../img%d.jpeg or ../img[d].jpeg to ../img2.jpeg
   *
   * @param {number} index - Frame number index
   * @return {string} Frame path
   * @public
   */
  getFrame2(index) {
    return this.path.replace(/(\%d|\[d\]|\(d\))/gi, index);
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
}

module.exports = Materials;
