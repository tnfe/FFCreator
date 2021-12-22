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
    this.duration = duration; // target container duration
    this.fps = fps; // target fps
    this.info = isBrowser ? {} : await probe(this.path);
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
      if (!isBrowser) continue;
      const frame = pixels.data.slice(i*imgDataSize, (i+1)*imgDataSize);
      const imgData = new ImageData(new Uint8ClampedArray(frame.buffer), width, height);
      this.imageData.push(imgData);
    }
    this.length = this.info.duration = frameInfo.reduce((a,x) => a+x.delay, 0);
    this.frames = frameInfo.length;
    if (isBrowser) this.initCanvas(720, 720); // todo: 应该跟随creator尺寸？ 但只有大一些才不影响清晰度
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

  async getFrameByTime(time) {
    let tt = 0, imgData = isBrowser ? null : this.getFrame(0);
    for (let i = 0; i < this.frameInfo.length; i++) {
      tt += this.frameInfo[i].delay;
      if (tt > time) break;
      imgData = isBrowser ? this.imageData[i] : this.getFrame(i);
    }
    if (isBrowser && imgData) this.canvasContext.putImageData(imgData, 0, 0);
    return imgData;
  }

  destroy() {
    super.destroy();
    this.imageData = null;
    this.frameInfo = null;
  }
}

module.exports = GifMaterial;