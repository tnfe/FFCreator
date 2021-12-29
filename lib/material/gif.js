'use strict';

/**
 * GifMaterial
 * @class
 */

const VideoMaterial = require('./video');
const Utils = require('../utils/utils');
const { ImageData } = require('../utils/canvas');

class GifMaterial extends VideoMaterial {

  async init(opts) {
    const { duration, fps } = opts;
    this.disposal = 2; // use 2 as default
    this.duration = duration; // target container duration
    this.fps = fps; // target fps
    this.info = {};
    const { pixels, frameInfo } = await Utils.getPixels(this.path);
    let offset = 1;
    if (!frameInfo || !frameInfo.length) {
      if (pixels && pixels.shape.length === 3) { // single frame
        this.frameInfo = [{ delay: Math.pow(10, 9), disposal:1 }]; // mock frame info
        offset = 0;
      } else {
        throw new Error('Invalid gif frame info: ', frameInfo);
      }
    } else {
      this.frameInfo = frameInfo;
    }
    this.imageData = [];
    const width = this.info.width = pixels.shape[offset + 0];
    const height = this.info.height = pixels.shape[offset + 1];
    const imgDataSize = width * height * pixels.shape[offset + 2];
    for (let i = 0; i < this.frameInfo.length; i++) {
      this.frameInfo[i].delay = this.frameInfo[i].delay / 100; // delay是0.01单位的int，这里统一转成秒
      const frame = pixels.data.slice(i*imgDataSize, (i+1)*imgDataSize);
      const imgData = new ImageData(new Uint8ClampedArray(frame.buffer), width, height);
      this.imageData.push(imgData);
    }
    this.length = this.info.duration = this.frameInfo.reduce((a,x) => a+x.delay, 0);
    this.frames = this.frameInfo.length;
    this.canvas = this.initCanvas(width, height);
    this.canvasContext = this.canvas.getContext('2d');
  }

  getFrame(index) {
    const i = index < this.frames ? index : this.frames - 1; // 保持最后一帧
    return this.imageData[i];
  }

  async getFrameByTime(time) {
    let tt = 0, disposal = 2, imgData = this.getFrame(0);
    const { width, height } = this.canvas || {};
    this.clearCanvas(); // 清空画布(上一帧)
    for (let i = 0; i < this.frameInfo.length; i++) {
      tt += this.frameInfo[i].delay;
      if (tt > time) break;
      imgData = this.getFrame(i);
      disposal = this.frameInfo[i].disposal > 2 ? disposal : this.frameInfo[i].disposal;
      // gif.disposal=1 不清空，覆盖
      if (disposal === 1) this.drawCanvas(imgData, width, height);
    }
    if (imgData) this.drawCanvas(imgData, width, height);
    return this.canvasContext.getImageData(0, 0, width, height);
  }

  destroy() {
    super.destroy();
    this.imageData = null;
    this.frameInfo = null;
  }
}

module.exports = GifMaterial;