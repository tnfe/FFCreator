'use strict';

/**
 * GifMaterial
 * @class
 */

const { isBrowser } = require("browser-or-node");
const VideoMaterial = require('./video');
const Utils = require('../utils/utils');

class GifMaterial extends VideoMaterial {

  async init(opts) {
    const { duration, fps } = opts;
    this.duration = duration; // target container duration
    this.fps = fps; // target fps
    this.info = {};
    const { pixels, frameInfo } = await Utils.getPixels(this.path);
    if (!frameInfo || !frameInfo.length) {
      throw new Error('Invalid gif frame info: ', frameInfo);
    }
    this.frameInfo = frameInfo;
    this.imageData = [];
    const width = pixels.shape[1];
    const height = pixels.shape[2];
    const imgDataSize = width * height * pixels.shape[3];
    for (let i = 0; i < frameInfo.length; i++) {
      frameInfo[i].delay = frameInfo[i].delay / 100; // delay是0.01单位的int，这里统一转成秒
      const frame = pixels.data.slice(i*imgDataSize, (i+1)*imgDataSize);
      const imgData = new ImageData(new Uint8ClampedArray(frame.buffer), width, height);
      this.imageData.push(imgData);
    }
    this.length = this.info.duration = frameInfo.reduce((a,x) => a+x.delay, 0);
    if (isBrowser) this.initCanvas(720, 720); // todo: 应该跟随creator尺寸？ 但只有大一些才不影响清晰度
  }

  async getFrameByTime(time) {
    let tt = 0, imgData;
    for (let i = 0; i < this.frameInfo.length; i++) {
      tt += this.frameInfo[i].delay;
      if (tt > time) break;
      imgData = this.imageData[i];
    }
    if (imgData) this.canvasContext.putImageData(imgData, 0, 0);
    return this.canvas;
  }

  destroy() {
    super.destroy();
    this.imageData = null;
    this.frameInfo = null;
  }
}

module.exports = GifMaterial;