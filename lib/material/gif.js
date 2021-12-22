'use strict';

/**
 * GifMaterial
 * @class
 */

const VideoMaterial = require('./video');
const Utils = require('../utils/utils');

class GifMaterial extends VideoMaterial {

  async getFrameByTime(time) {
    this.time = time;
    return this.getFrame((time * this.fps) >> 0);
  }

  async init(opts) {
    if (this.inited) return;
    this.inited = true;
    const { mode, duration, fps } = opts;
    this.mode = mode;
    this.duration = duration;
    this.fps = fps;
    const { pixels, frameInfo } = await Utils.getPixels(this.path);
    if (frameInfo && frameInfo.length > 0) {
      const frames = frameInfo.length;
      const duration = frameInfo.reduce((a,x) => a+x.delay, 0) / 100;
      this.info = { frames, duration };
      this.imageData = [];
      console.log('pixels', pixels);
      const width = pixels.shape[1];
      const height = pixels.shape[2];
      const imgDataSize = width * height * pixels.shape[3];
      for (let i = 0; i < frameInfo.length; i++) {
        const _data = pixels.data.slice(i*imgDataSize, (i+1)*imgDataSize);
        const imgData = new ImageData(new Uint8ClampedArray(_data.buffer), width, height);
        this.imageData.push(imgData);
      }
    } else {
      // invalid gif
    }

    //todo: check if duration is hms format by probe
    if (this.info?.duration) this.length = this.info.duration;
  }

  /**
   * Get the path of a certain frame in the Materials
   * @param {number} index - Frame number index
   * @return {string} Frame path
   * @public
   */
  getFrame(index) {
    const i = index < this.frames ? index : this.frames - 1; // 保持最后一帧
    return this.imageData[i];
  }

  destroy() {
    super.destroy();
    this.imageData = null;
  }
}

module.exports = GifMaterial;