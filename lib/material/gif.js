'use strict';

/**
 * GifMaterial
 * @class
 */

const { isBrowser } = require("browser-or-node");
const VideoMaterial = require('./video');
const Utils = require('../utils/utils');

const { nodeRequire } = require('../utils/utils');
const probe = nodeRequire('ffmpeg-probe');
const FFmpegUtil = nodeRequire('../utils/ffmpeg');

class GifMaterial extends VideoMaterial {

  async init(opts) {
    const { duration, fps } = opts;
    this.disposal = 2; // use 2 as default
    this.duration = duration; // target container duration
    this.fps = fps; // target fps
    this.info = isBrowser ? {} : await probe(this.path);
    const { pixels, frameInfo } = await Utils.getPixels(this.path);
    if (!frameInfo || !frameInfo.length) {
      throw new Error('Invalid gif frame info: ', frameInfo);
    }
    this.frameInfo = frameInfo;
    this.imageData = [];
    const width = this.info.width = pixels.shape[1];
    const height = this.info.height = pixels.shape[2];
    const imgDataSize = width * height * pixels.shape[3];
    for (let i = 0; i < frameInfo.length; i++) {
      frameInfo[i].delay = frameInfo[i].delay / 100; // delay是0.01单位的int，这里统一转成秒
      if (!isBrowser) continue;
      const frame = pixels.data.slice(i*imgDataSize, (i+1)*imgDataSize);
      const imgData = new ImageData(new Uint8ClampedArray(frame.buffer), width, height);
      this.imageData.push(imgData);
    }
    this.length = this.info.duration = frameInfo.reduce((a,x) => a+x.delay, 0);
    this.frames = frameInfo.length;
    if (isBrowser) this.initCanvas(width, height);
    else this.command = FFmpegUtil.createCommand();
  }

  async extractGif(dir, name) {
    const output = this.getOutputPath(dir, `${name}_%d.png`);
    const fpsOpt = this.info.fps && this.info.fps < 60 ? "" : `-r ${this.fps}`;
    const outOpts = `-vsync cfr ${fpsOpt} -start_number 0`;
    const onProgress = (progress) => { this.frames = progress.frames };
    this.vpath = await this.ffCmdExec({ command: this.command, output, outOpts, onProgress });
    return this.vpath;
  }

  getFrame(index) {
    const i = index < this.frames ? index : this.frames - 1; // 保持最后一帧
    return isBrowser ? this.imageData[i] : this.vpath.replace('%d', i);
  }

  async getFrameByTime(time) {
    let tt = 0, disposal = 2, imgData = await this.getFrame(0);
    const { width, height } = this.canvas || {};
    if (isBrowser) this.clearCanvas(); // 清空画布(上一帧)
    for (let i = 0; i < this.frameInfo.length; i++) {
      tt += this.frameInfo[i].delay;
      if (tt > time) break;
      imgData = await this.getFrame(i);
      if (!isBrowser) continue;
      disposal = this.frameInfo[i].disposal > 2 ? disposal : this.frameInfo[i].disposal;
      // gif.disposal=1 不清空，覆盖
      if (disposal === 1) this.drawCanvas(imgData, width, height);
    }
    if (isBrowser && imgData) this.drawCanvas(imgData, width, height);
    return imgData;
  }

  destroy() {
    super.destroy();
    this.imageData = null;
    this.frameInfo = null;
  }
}

module.exports = GifMaterial;