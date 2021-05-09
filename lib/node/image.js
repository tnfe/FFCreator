'use strict';

/**
 * FFImage - Image component-based display component
 *
 * ####Example:
 *
 *     const img = new FFImage({ path, x: 94, y: 271, width: 375, height: 200, resetXY: true });
 *     img.addEffect("slideInDown", 1.2, 0);
 *     scene.addChild(img);
 *
 * @class
 */
const FFNode = require('./node');
const Pool = require('../core/pool');
const { Sprite } = require('spritejs');

class FFImage extends FFNode {
  constructor(conf = { animations: [] }) {
    super({ type: 'image', ...conf });
    if (conf.resetPos || conf.resetXY) this.resetLeftTop();
  }

  /**
   * Get the path to get the Image
   * @return {string} img path
   * @public
   */
  getPath() {
    return this.conf.path || this.conf.image || this.conf.url;
  }

  /**
   * Create display object.
   * @private
   */
  createDisplay() {
    this.display = Pool.get(this.type, () => new Sprite());
    this.draw({ display: this.display, texture: this.getPath() });
    this.setAnchor(0.5);
    this.resetSize();
  }

  /**
   * Functions for drawing images
   * @private
   */
  draw({ display, texture, deleteTexture = true, ...attrs }) {
    if (!texture) return;

    display = display || this.display;
    if (display.textureImage) {
      deleteTexture && this.deleteTexture(display);
      display.textureImage.src = texture;
      if (attrs) display.attr({ ...attrs });
    } else {
      display.attr({ texture, ...attrs });
    }
  }

  /**
   * Delete historical texture Image
   * @private
   */
  deleteTexture(display) {
    if (!this.parent) return;
    if (!display.textureImage) return;

    const layer = this.parent.display;
    layer.deleteTexture(display.textureImage);
  }

  /**
   * Functions for resize
   * @async
   * @private
   */
  async resetSize() {
    await this.isReady();
    const [width, height] = this.getWH();
    if (width && height) this.display.attr({ width, height });
  }

  /**
   * Functions for reset position left and top
   * @async
   * @private
   */
  async resetLeftTop() {
    await this.isReady();

    const [width, height] = this.getWH();
    const offsetX = width * this.anchor;
    const offsetY = height * this.anchor;
    this.setOffset(offsetX, offsetY);
  }

  async preProcessing() {
    return await this.isReady();
  }

  isReady() {
    return this.display.textureImageReady || super.isReady();
  }

  destroy() {
    super.destroy();
  }
}

module.exports = FFImage;
