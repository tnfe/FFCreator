'use strict';

/**
 * CanvasUtil - A canvas tool function library
 *
 * ####Example:
 *
 *   const buffer = CanvasUtil.toBuffer({ type:"jpg", canvas, quality });
 *
 * @object
 */

const { createCanvas, createImageData } = require('node-canvas-webgl');

const CanvasUtil = {
  canvas: null,

  /**
   * Get a unique canvas instance
   * @param {number} width - canvas width
   * @param {number} height - canvas height
   * @return {Canvas} a unique canvas instance
   * @public
   */
  getCanvas({ width, height }) {
    if (!this.canvas) this.canvas = createCanvas(width, height);
    this.canvas.width = width;
    this.canvas.height = height;

    return this.canvas;
  },

  /**
   * Utility function to get buffer
   * @param {string} type - picture format type
   * @param {Canvas} canvas - Container canvas
   * @param {number} quality - picture quality
   * @return {buffer} The returned buffer value
   * @public
   */
  toBuffer({ type, canvas, quality = 70 }) {
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
        buffer = canvas.toBuffer('image/jpeg', { quality: quality / 100 });
        break;

      default:
        buffer = canvas.toBuffer('raw');
        break;
    }

    return buffer;
  },

  /**
   * Draw buffer or array data onto the canvas object
   * @param {number} width - canvas width
   * @param {number} height - canvas height
   * @param {array|buffer} data - buffer or array data
   * @return {Canvas} a unique canvas instance
   * @public
   */
  draw({ width, height, data }) {
    const canvas = this.getCanvas({ width, height });
    const ctx = canvas.getContext('2d');
    const imageData = createImageData(new Uint8ClampedArray(data), width, height);

    // ctx.clearRect(width, height);
    ctx.putImageData(imageData, 0, 0);
    return canvas;
  },
};

module.exports = CanvasUtil;
