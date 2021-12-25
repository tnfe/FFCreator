'use strict';

/**
 * ImageMaterial
 * @class
 */

const Material = require('./material');
const Utils = require('../utils/utils');
const { utils } = require('inkpaint')

class ImageMaterial extends Material {

  async init() {
    const { pixels } = await Utils.getPixels(this.path);
    if (!pixels || !pixels.shape || pixels.shape.length < 3) return;
    let shape = pixels.shape;
    if (shape.length > 3) shape = shape.slice(shape.length - 3);
    this.info.width = shape[0];
    this.info.height = shape[1];
  }

  async getImage(imgData) {
    imgData = this.cutout(imgData);
    const img = imgData instanceof ImageData ? await createImageBitmap(imgData) : imgData;
    return img;
  }

  initCanvas(w, h) {
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    return canvas;
  }

  clearCanvas() {
    this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  getImageData(imgSource) {
    const { width, height } = this.info;
    if (!this.tmpCanvas || !this.tmpCanvasContext) {
      this.tmpCanvas = this.initCanvas(width, height);
      this.tmpCanvasContext = this.tmpCanvas.getContext('2d');
    }
    this.tmpCanvasContext.drawImage(imgSource, 0, 0, width, height);
    return this.tmpCanvasContext.getImageData(0, 0, width, height);
  }

  setCutoutColor(min, max) {
    this.cutoutMin = min;
    this.cutoutMax = max;
  }

  cutout(imgData) {
    if (!this.cutoutMin || !this.cutoutMax || !this.canvas || !this.canvasContext) return imgData;
    if (!(imgData instanceof ImageData)) imgData = this.getImageData(imgData);
    for (let i = 0; i < imgData.data.length; i += 4) {
      const r = imgData.data[i + 0];
      const g = imgData.data[i + 1];
      const b = imgData.data[i + 2];
      const hsl = utils.rgb2hsl(r, g, b);
      if (hsl[0] > this.cutoutMin && hsl[0] < this.cutoutMax) {
        imgData.data[i + 3] = 0;
      }
    }
    this.clearCanvas(); // clear for transparent bg
    return imgData;
  }

  width() {
    // todo: 处理 crop rect 逻辑
    return this.info.width || 0;
  }

  height() {
    return this.info.height || 0;
  }

  destroy() {
    super.destroy();
    if (this.tmpCanvas) {
      this.tmpCanvas.remove();
      this.tmpCanvas = null;
      this.tmpCanvasContext = null;
    }
  }
}

module.exports = ImageMaterial;