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
const ImageMaterial = require('../material/image');
const { Sprite, Texture, Rectangle } = require('inkpaint');
const { isBrowser } = require("browser-or-node");

class FFImage extends FFNode {
  constructor(conf = { animations: [] }) {
    super({ type: 'image', preload: true, ...conf });
    if (conf.resetPos || conf.resetXY) this.resetLeftTop();
    const { min, max, colormin, colormax } = this.conf;
    this.min = min || colormin;
    this.max = max || colormax;
    this.material = this.createMaterial(this.conf);
    this.cloneTexture = true;
  }

  /**
   * Create Image Material
   * @param {*} conf 
   * @returns {ImageMaterial}
   */
  createMaterial(conf) {
    return new ImageMaterial(conf);
  }

  /**
   * Turn on HSL cutout
   * @param {number} min min Hue value (from HSL)
   * @param {number} max max Hue value (from HSL)
   * @public
   */
  setCutoutColor(min, max) {
    this.min = min;
    this.max = max;
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

  async preProcessing() {
    // calc container duration
    this.material.creator = this.root();
    const duration = this.getDuration();
    const fps = this.rootConf('fps');
    await this.material.init({ duration, fps });
    this.fitSize();
  }

  fitSize() {
    let { width, height } = this.conf;
    const src = this.display; // resource
    const w = this.material.width();
    const h = this.material.height();
    if (!w || !h) return; // 获取原始素材的宽高失败，或已经被设置为0

    let scale;
    if (!width || !height) { // 宽高设置不全，根据源素材比例来适配
      if (width) scale = width / w, height = scale * h;
      else if (height) scale = height / h, width = scale * w;
      else scale = this.scale || 1.0, width = w * scale, height = h * scale;
    } else { // 宽高都设置了，根据fit属性来cover/contain/none/fill
      if (!this.conf.fit || this.conf.fit === 'cover') scale = Math.max(width/w, height/h);
      else if (this.conf.fit === 'contain') scale = Math.min(width/w, height/h);
      else if (this.conf.fit === 'none') scale = this.scale || 1.0;
      else if (this.conf.fit === 'fill') return; // inkpaint默认是fill, 即宽高拉伸
      width = w * scale, height = h * scale;
    }
    this.setScale(scale); // scale必须设置，是考虑到有动画的情况下宽高设置是不准的
    src.attr({ width, height });
  }

  fitTexture() {
    const { width, height } = this.conf; // container
    const src = this.display; // resource
    if (!width || !height || (width >= src.width && height >= src.height)) return;
    if (this.cloneTexture) src.texture = src.texture.clone();
    const x = (src.width - width) / (2 * src.scale.x);
    const y = (src.height - height) / (2 * src.scale.y);
    const w = width / src.scale.x;
    const h = height / src.scale.y;
    src.texture.frame = new Rectangle(x, y, w, h);
  }

  /**
   * Get the URL that needs to be preloaded
   * @public
   */
  getPreloadUrls() {
    return [this.material.path];
  }

  /**
   * Functions for drawing images
   * @private
   */
  draw({ display, texture, update = true }) {
    if (!texture) return;
    display = display || this.display;

    // set cutout color
    if (this.min && this.max) {
      this.material.setCutoutColor(this.min, this.max); // for canvas
      display.texture.setCutoutColor(this.min, this.max); // for img
    }

    if (isBrowser && texture instanceof HTMLElement) {
      // do nothing...
    } else if (texture instanceof Texture) {
      display.texture.destroy();
      display.texture = texture;
    } else if (update) {
      display.texture.updateSource(texture);
    } else {
      display.texture.destroy();
      display.texture = Texture.from(texture);
    }
    // set object-fit 
    this.fitTexture();
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
    if (!super.start()) return false;
    this.initDraw();
    return true;
  }

  initDraw() {
    const texture = this.getAsset(this.material.path);
    this.draw({ texture });
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
    this.material.destroy();
  }
}

module.exports = FFImage;
