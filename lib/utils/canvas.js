'use strict';

/**
 * CanvasUtil - A canvas tool function library
 *
 * ####Example:
 *
 *
 *
 * @object
 */

const {createCanvas, createImageData} = require('node-canvas-webgl');

const CanvasUtil = {
  canvas: null,
  getCanvas({width, height}) {
    if (!this.canvas) this.canvas = createCanvas(width, height);
    this.canvas.width = width;
    this.canvas.height = height;

    return this.canvas;
  },

  toBuffer({type, canvas, quality = 70}) {
    quality = quality >> 0;
    quality = Math.min(quality, 100);
    let compressionLevel = 10 - 0.1 * quality;
    compressionLevel = compressionLevel >> 0;

    let buffer;
    switch (type) {
      case 'png':
      case 'gif':
        buffer = canvas.toBuffer('image/png', {
          compressionLevel,
          filters: canvas.PNG_FILTER_NONE,
        });
        break;

      case 'jpg':
      case 'jpeg':
        buffer = canvas.toBuffer('image/jpeg', {quality: quality / 100});
        break;

      default:
        buffer = canvas.toBuffer('raw');
        break;
    }

    return buffer;
  },

  draw({width, height, data}) {
    const canvas = this.getCanvas({width, height});
    const ctx = canvas.getContext('2d');
    const imageData = createImageData(new Uint8ClampedArray(data), width, height);

    //ctx.clearRect(width, height);
    ctx.putImageData(imageData, 0, 0);
    return canvas;
  },
};

module.exports = CanvasUtil;
