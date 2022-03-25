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

const min = require('lodash/min');
const FFClip = require('../core/clip');
const FFAnimations = require('../animate/animations');
const { DisplayObject, BLEND_MODES } = require('../../inkpaint/lib/index');

class FFNode extends FFClip {
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
    this.preload = preload;

    this.createDisplay();
    this.setXY(x, y);
    this.setScale(scale);
    this.setRotate(rotate);
    this.setOpacity(opacity);
    this.animations = new FFAnimations(this);
  }

  show() {
    super.show();
    this.animations.start();
  }

  hide() {
    super.hide();
    this.animations.stop();
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
    this.scale = scale;
    this.display.scale.set(scale, scale);
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
   * Set the duration of node in the scene
   * @param {number} duration
   * @public
   */
  setDuration(duration) {
    this.duration = duration;
  }

  /**
   * Set display object x,y position
   * @param {number} x - x position
   * @param {number} y - y position
   * @public
   */
  setXY(x = 0, y = 0) {
    this.display.x = x;
    this.display.y = y;
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

  getAnchor() {
    return this.display.anchor;
  }

  getRotation() {
    return this.display.rotation;
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

  getXY() {
    return [this.display.x, this.display.y];
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

  // /**
  //  * Get the delay time of the [type=in] animation
  //  * @return {number} animation delay time
  //  * @public
  //  */
  // getDelayTime() {
  //   return this.animations.getDelayTime() / 1000;
  // }

  // getDurationTime() {
  //   return this.animations.getDurationTime() / 1000;
  // }

  // getDuration() {
  //   const durs = [];
  //   // parent duration
  //   let dur = this.parent.getDuration ? this.parent.getDuration() : this.parent.duration;
  //   if (dur) {
  //     // animation duration
  //     const aniDur = this.getDurationTime();
  //     if (aniDur < dur) dur = aniDur; // min end time
  //     dur -= this.getDelayTime(); // offset start time
  //     if (dur < 0) dur = 0; // start time may later than container duration
  //     durs.push(dur);
  //   }
  //   // this duration
  //   if (this.duration) durs.push(this.duration);
  //   return min(durs);
  // }

  getWidth() {
    return this.getWH()[0];
  }

  getHeight() {
    return this.getWH()[1];
  }

  getProp(key) {
    return this.display[key];
  }

  fitSize() {
    let { width, height } = this.conf;
    this.display.attr({ width, height });
  }

  fitTexture() {

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
   * Number degree of blur
   * @param {number} blur - number degree of blur
   * @public
   */
  setBlur(blur) {
    this.display.blur = blur;
  }

  /**
   * Destroy the component
   * @public
   */
  destroy() {
    this.animations.destroy();
    this.display.destroy(true);
    super.destroy();

    this.animations = null;
    this.display = null;
    this.parent = null;
  }
}

module.exports = FFNode;