'use strict';

/**
 * FFRect - A solid color rectangle component
 *
 * ####Example:
 *
 *     const rect = new FFRect({ color: "#cc22ff", width: 400, height: 300 });
 *     rect.setColor("#00cc22");
 *     scene.addChild(rect);
 *
 * @class
 */
const FFNode = require('./node');
const CanvasUtil = require('../utils/canvas');
const { createCanvas, Sprite, Texture } = require('inkpaint');

class FFRect extends FFNode {
  constructor(conf = { rect: '', style: { fontSize: 28 } }) {
    super({ type: 'rect', ...conf });
    const { color = '#044EC5' } = this.conf;
    this.setColor(color);
  }

  /**
   * Functions for drawing images
   * @private
   */
  createDisplay() {
    const [width, height] = this.getWH();
    if (!this.canvas) this.canvas = createCanvas(width, height);
    this.display = new Sprite(Texture.fromCanvas(this.canvas));
    this.setAnchor(0.5);
    this.setDisplaySize();
  }

  /**
   * Functions for setDisplaySize
   * @private
   */
  setDisplaySize() {
    const { display } = this;
    const [width, height] = this.getWH();

    if (width && height) {
      display.width = width;
      display.height = height;
      display.setScaleToInit();
    }
  }

  /**
   * Set display object width and height
   * @param {number} width - object width
   * @param {number} height - object height
   * @public
   */
  setWH(width, height) {
    this.setSize(width, height);
    this.setDisplaySize();
  }

  /**
   * Set rect color value
   * @param {string} color - the rect color value
   * @public
   */
  setColor(color) {
    this.color = color;
    CanvasUtil.fillRect({ canvas: this.canvas, color: this.color });
  }

  destroy() {
    this.canvas = null;
    super.destroy();
  }
}

module.exports = FFRect;
