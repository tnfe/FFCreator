'use strict';

/**
 * FFNode Class - FFCreator displays the basic class of the object,
 * Other display objects need to inherit from this class.
 *
 * ####Example:
 *
 *     const node = new FFNode({ x: 10, y: 20 });
 *
 * @class
 */

const FFBase = require('../core/base');
const FFAnimations = require('../animate/animations');
const { DisplayObject, BLEND_MODES } = require('inkpaint');
const TimelineUpdate = require('../timeline/update');

class FFNode extends FFBase {
  /**
   * FFNode constructor
   *
   * @constructor
   * @param {object} conf - FFNode related configuration items
   * @param {number} conf.x - x coordinate of FFNode
   * @param {number} conf.y - y coordinate of FFNode
   * @param {number} conf.scale - scale of FFNode
   * @param {number} conf.rotate - rotation of FFNode
   * @param {number} conf.opacity - opacity of FFNode
   */
  constructor(conf = {}) {
    super({ type: 'node', ...conf });

    const { x = 0, y = 0, scale = 1, rotate = 0, opacity = 1, preload = false } = this.conf;

    this.index = 0;
    this.offsetX = 0;
    this.offsetY = 0;
    this.duration = 0;
    this.parent = null;
    this.preload = preload;
    //
    this.t = 0;
    this.removeTime = 999999 * 1000;

    this.createDisplay();
    this.setXY(x, y);
    this.setScale(scale);
    this.setRotate(rotate);
    this.setOpacity(opacity);
    this.animations = new FFAnimations(this);
    this.updateRemoveCallback = this.updateRemoveCallback.bind(this);
  }

  /**
   * Create display object.
   * @private
   */
  createDisplay() {
    this.display = new DisplayObject();
  }

  /**
   * Set display object registration center
   * @param {number} anchor
   * @public
   */
  setAnchor(anchorX, anchorY) {
    anchorY = anchorY === undefined ? anchorX : anchorY;
    this.display.anchor.set(anchorX, anchorY);
  }

  /**
   * Set display object scale
   * @param {number} scale
   * @public
   */
  setScale(scale = 1) {
    this.display.scale.set(scale, scale);
    this.display.setScaleToInit();
  }

  /**
   * Set display object rotation
   * @param {number} rotation
   * @public
   */
  setRotate(rotation = 0) {
    // rotation = rotation * (3.1415927 / 180);
    this.display.rotation = rotation;
  }

  /**
   * set display object rotation by deg
   * @param deg
   */
  setRotateDeg(deg = 0) {
    deg = deg * (3.1415927 / 180);
    this.display.rotation = deg;
  }

  /**
   * Set the duration of node in the scene
   * @param {number} duration
   * @public
   */
  setDuration(duration) {
    this.duration = duration;
  }

  /**
   * Set the duration of node in the scene
   * @param {number} duration
   * @public
   */
  setOffset(offsetX, offsetY) {
    const scale = this.display.scale.x;
    this.offsetX = offsetX * scale;
    this.offsetY = offsetY * scale;

    this.display.x += this.offsetX;
    this.display.y += this.offsetY;
  }

  /**
   * Set display object x,y position
   * @param {number} x - x position
   * @param {number} y - y position
   * @public
   */
  setXY(x = 0, y = 0) {
    this.display.x = x + this.offsetX;
    this.display.y = y + this.offsetY;
  }

  /**
   * Set display object opacity
   * @param {number} opacity
   * @public
   */
  setOpacity(opacity) {
    this.display.alpha = opacity;
  }

  /**
   * Set display object width and height
   * @param {number} width - object width
   * @param {number} height - object height
   * @public
   */
  setWH(width, height) {
    this.setSize(width, height);
  }

  /**
   * Set display object width and height
   * @param {number} width - object width
   * @param {number} height - object height
   * @public
   */
  setSize(width, height) {
    this.conf.width = width;
    this.conf.height = height;
  }

  /**
   * Whether to enable preload
   * @param {boolean} preload - enable preload
   * @public
   */
  setPreload(preload) {
    this.preload = preload;
  }

  /**
   * Add blend filter
   * @param {boolean} blend - blend filter mode
   * @public
   */
  addBlend(blend = '') {
    const blendMode = BLEND_MODES[blend.toUpperCase()];
    if (blendMode) this.display.blendMode = blendMode;
  }

  /**
   * Get display object x position
   * @return {number} x
   * @public
   */
  getX() {
    return this.display.x;
  }

  /**
   * Get display object y position
   * @return {number} y
   * @public
   */
  getY() {
    return this.display.y;
  }

  /**
   * Get display object width and height
   * @return {array} [width, height]
   * @public
   */
  getWH() {
    const { width = 0, height = 0 } = this.conf;
    if (width && height) {
      return [width, height];
    } else {
      return [this.display.width, this.display.height];
    }
  }

  /**
   * Get the delay time of the animation
   * @return {number} animation delay time
   * @public
   */
  getDelayTime() {
    return this.animations.getDelayTime() / 1000;
  }

  getDurationTime() {
    return this.animations.getDurationTime() / 1000;
  }

  getWidth() {
    return this.getWH()[0];
  }

  getHeight() {
    return this.getWH()[1];
  }

  getProp(key) {
    return this.display[key];
  }

  /**
   * Add one/multiple animations or effects
   * @public
   */
  setAnimations(animations) {
    this.animations.setAnimations(animations);
  }

  /**
   * Add special animation effects
   * @param {string} type - animation effects name
   * @param {number} time - time of animation
   * @param {number} delay - delay of animation
   * @public
   */
  addEffect(type, time, delay) {
    this.animations.addEffect(type, time, delay);
  }

  addAnimate(animation) {
    return this.animations.addAnimate(animation);
  }

  /**
   * Get the URL that needs to be preloaded
   * @public
   */
  getPreloadUrls() {
    return null;
  }

  /**
   * Get asset from root
   * @public
   */
  getAsset(url) {
    if (!this.preload) return url;

    const root = this.root();
    if (root && root.loader) {
      const resource = root.loader.resources[url];
      return resource ? resource.texture : url;
    }

    return url;
  }

  /**
   * Material preprocessing
   * @return {Promise}
   * @public
   */
  preProcessing() {
    return new Promise(resolve => resolve());
  }

  /**
   * Number degree of blur
   * @param {number} blur - number degree of blur
   * @public
   */
  setBlur(blur) {
    this.display.blur = blur;
  }

  /**
   * Start rendering
   * @public
   */
  start() {
    this.animations.start();
  }

  remove(time) {
    this.removeTime = time * 1000;
    TimelineUpdate.addFrameCallback(this.updateRemoveCallback);
  }

  updateRemoveCallback(time, delta) {
    this.t += delta;
    if (this.t >= this.removeTime) {
      if (this.parent) this.parent.removeChild(this);
    }
  }

  /**
   * Destroy the component
   * @public
   */
  destroy() {
    TimelineUpdate.removeFrameCallback(this.updateRemoveCallback);
    this.animations.destroy();
    this.display.destroy(true);
    super.destroy();

    this.animations = null;
    this.display = null;
    this.parent = null;
  }
}

module.exports = FFNode;
