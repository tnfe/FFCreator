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
const { Sprite, Texture, Rectangle, createCanvas } = require('../../inkpaint/lib/index');
const { isBrowser } = require("browser-or-node");

class FFImage extends FFNode {
  constructor(conf = { animations: [] }) {
    super({ type: 'image', preload: true, ...conf });
    if (conf.resetPos || conf.resetXY) this.resetLeftTop();
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
    if (min) this.min = min;
    if (max) this.max = max;
  }

  /**
   * Create display object.
   * @private
   */
  createDisplay() {
    this.display = new Sprite(Texture.fromCanvas(createCanvas(1, 1)));
    this.setAnchor(0.5);
    this.setDisplaySize();
  }

  annotate() {
    super.annotate();
    // set material duration
    this.material.duration = this.duration;
    // console.log('annotate', this.id, this.duration);
  }

  async prepareMaterial() {
    await super.prepareMaterial();
    this.initDraw();
    if (this.min && this.max) {
      this.material.setCutoutColor(this.min, this.max);
      this.display.texture.setCutoutColor(this.min, this.max); // for extract img
    }
  }

  async preProcessing() {
    this.material = this.createMaterial(this.conf);
    this.material.duration = this.duration;
    const { min, max, colormin, colormax } = this.conf;
    this.setCutoutColor((min || colormin), (max || colormax));
    this.material.creator = this.root();
    const fps = this.rootConf('fps');
    await this.material.init({ fps });
    this.fitSize();
    this.display.attr({ texture: Texture.fromCanvas(this.material.canvas) });
    this.fitTexture();
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
      const fit = this.conf['object-fit'];
      if (!fit || fit === 'cover') scale = Math.max(width/w, height/h);
      else if (fit === 'contain') scale = Math.min(width/w, height/h);
      else if (fit === 'none') scale = 1.0;
      else if (fit === 'scale-down') scale = Math.min(1.0, Math.min(width/w, height/h));
      else if (fit === 'fill') return src.attr({ width, height }); // inkpaint默认是fill, 即宽高拉伸
      width = w * scale, height = h * scale;
    }
    src.attr({ width, height });
    this.setScale(scale); // scale必须设置，是考虑到有动画的情况下宽高设置是不准的
  }

  fitTexture(src) {
    let { 'object-fit': fit, 'object-position': position } = this.conf;
    if (fit === 'fill') return; // fill直接拉伸
    let { width, height } = this.conf; // container size with scaled
    src = src || this.display; // resource
    if (src.scale.x <= 0 || src.scale.y <= 0) return;
    const mw = this.material.width();
    const mh = this.material.height();

    // map to un-scaled size
    width /= src.scale.x;
    height /= src.scale.y;

    if (!width || !height) {
      return src.texture.frame = new Rectangle(0, 0, mw, mh);
    }

    if (!Array.isArray(position) || position.length != 2) position = [0.5, 0.5];
    let [ left, top ] = position;
    left = isNaN(Number(left)) ? 0.5 : Math.max(0, Math.min(1, left));
    top = isNaN(Number(top)) ? 0.5 : Math.max(0, Math.min(1, top));

    // frame with ori-size
    const w = Math.min(width, mw);
    const h = Math.min(height, mh);
    const x = (mw - w) * left;
    const y = (mh - h) * top;
    src.texture.frame = new Rectangle(x, y, w, h);
  }

  /**
   * Functions for drawing images
   * @private
   */
  draw({ display, texture, useCache = false }) {
    if (!texture || isBrowser) return;
    display = display || this.display;
    if (texture.constructor.name === 'ImageData') {
      display.texture.baseTexture.source = texture;
      display.texture.baseTexture.update();
    } else if (texture instanceof Texture) {
      display.texture.destroy();
      display.texture = texture;
      this.fitTexture(display); // 因为替换了texture, 所以需要再适配一下
    } else {
      display.texture.updateSource(texture, useCache);
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
    }
  }

  initDraw() {
    const texture = this.material.imageData;
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
