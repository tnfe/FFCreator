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
const TimelineUpdate = require('../timeline/update');
const { Sprite, Texture } = require('inkpaint');

class FFImage extends FFNode {
  constructor(conf = { animations: [] }) {
    super({ type: 'image', preload: true, ...conf });
    if (conf.resetPos || conf.resetXY) this.resetLeftTop();
  }

  /**
   * Get the path to get the Image
   * @return {string} img path
   * @public
   */
  getPath() {
    return this.conf.src || this.conf.path || this.conf.image || this.conf.url;
  }

  /**
   * Create display object.
   * @private
   */
  createDisplay() {
    this.display = new Sprite(Texture.newEmpty());
    this.setAnchor(0.5);
    this.setDisplaySize();
  }

  /**
   * Get the URL that needs to be preloaded
   * @public
   */
  getPreloadUrls() {
    const path = this.getPath();
    return [path];
  }

  /**
   * Functions for drawing images
   * @private
   */
  draw({ display, texture, update = false }) {
    if (!texture) return;
    display = display || this.display;

    if (texture instanceof Texture) {
      display.texture.destroy();
      display.texture = texture;
    } else if (update) {
      display.texture.updateSource(texture);
    } else {
      display.texture.destroy();
      display.texture = Texture.from(texture);
    }
  }

  /**
   * Delete historical texture Image
   * @private
   */
  deleteTexture(display) {
    if (!this.parent) return;
    if (!display.texture) return;
    // layer.deleteTexture(display.texture);
  }

  /**
   * Functions for setDisplaySize
   * @private
   */
  setDisplaySize() {
    const { display } = this;
    const { width, height } = this.conf;
    if (width && height) {
      display.width = width;
      display.height = height;
      display.setScaleToInit();
    }
  }

  /**
   * Start rendering
   * @public
   */
  start() {
    if (this.started) return;
    this.started = true;
    const path = this.getPath();
    const texture = this.getAsset(path);
    this.draw({ texture });
    this.setDisplaySize();
    this.animations.start();
    this.addTimelineCallback();
  }

  /**
   * Add callback hook
   * @private
   */
   addTimelineCallback() {
    this.drawing = this.drawing.bind(this);
    TimelineUpdate.addFrameCallback(this.drawing);
  }

  /**
   * Functions for drawing images
   * @private
   */
  async drawing(timeInMs = 0, nextDeltaInMS = 0) {
    if (!this.parent.started) return;
    if (nextDeltaInMS === 0) {
      // seek的时候，需要强制动一下
      this.animations.start() && timeInMs;
    }
  }

  /**
   * Functions for reset position left and top
   * @async
   * @private
   */
  resetLeftTop() {
    this.setAnchor(0);
  }

  destroy() {
    super.destroy();
  }
}

module.exports = FFImage;
