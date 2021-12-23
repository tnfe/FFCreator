'use strict';

/**
 * ImageMaterial
 * @class
 */

const Material = require('./material');
const Utils = require('../utils/utils');

class ImageMaterial extends Material {

  async init() {
    const { pixels } = await Utils.getPixels(this.path);
    if (!pixels || !pixels.shape || pixels.shape.length < 3) return;
    let shape = pixels.shape;
    if (shape.length > 3) shape = shape.slice(shape.length - 3);
    this.info.width = shape[0];
    this.info.height = shape[1];
  }

  width() {
    // todo: 处理 crop rect 逻辑
    return this.info.width || 0;
  }

  height() {
    return this.info.height || 0;
  }
}

module.exports = ImageMaterial;