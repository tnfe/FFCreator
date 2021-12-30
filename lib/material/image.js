'use strict';

/**
 * ImageMaterial
 * @class
 */

const Material = require('./material');
const { getPixels } = require('../utils/utils');
const { utils, createCanvas } = require('inkpaint');
const { ImageData } = require('../utils/canvas');

class ImageMaterial extends Material {

  async init() {
    if (!this.path) return;
    const { pixels } = await getPixels(this.path);
    if (!pixels || !pixels.shape || pixels.shape.length < 3) return;
    let shape = pixels.shape;
    if (shape.length > 3) shape = shape.slice(shape.length - 3);
    this.info.width = shape[0];
    this.info.height = shape[1];
  }

  getImage(imgData) {
    imgData = this.cutout(imgData);
    if (!(imgData instanceof ImageData)) return imgData;
    const canvas = createCanvas(imgData.width, imgData.height);
    canvas.getContext('2d').putImageData(imgData, 0, 0);
    return canvas;
  }

  initCanvas(w, h) {
    return createCanvas(w, h);
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
      this.tmpCanvas = null;
      this.tmpCanvasContext = null;
    }
  }
}

module.exports = ImageMaterial;