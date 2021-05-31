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

const Pool = require('../core/pool');
const FFBase = require('../core/base');
const { Sprite } = require('spritejs');
const FFAnimations = require('../animate/animations');

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

    const { x = 0, y = 0, scale = 1, rotate = 0, opacity = 1 } = this.conf;

    this.index = 0;
    this.offsetX = 0;
    this.offsetY = 0;
    this.duration = 0;
    this.anchor = 0.5;
    this.parent = null;

    this.createDisplay();
    this.setXY(x, y);
    this.setScale(scale);
    this.setRotate(rotate);
    this.setOpacity(opacity);
    this.animations = new FFAnimations(this);
  }

  /**
   * Create display object.
   * @private
   */
  createDisplay() {
    this.display = Pool.get(this.type, () => new Sprite());
  }

  /**
   * Set display object registration center
   * @param {number} anchor
   * @public
   */
  setAnchor(anchor) {
    this.anchor = anchor;
    this.display.attr({ anchor: [anchor, anchor] });
  }

  /**
   * Set display object scale
   * @param {number} scale
   * @public
   */
  setScale(scale = 1) {
    scale = [scale, scale];
    this.display.attr({ scale });
  }

  /**
   * Set display object rotate
   * @param {number} rotate
   * @public
   */
  setRotate(rotate = 0) {
    this.display.attr({ rotate });
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
    const scale = this.display.attributes.scale[0] || 1;
    this.offsetX = offsetX * scale;
    this.offsetY = offsetY * scale;
    const x = this.getX();
    const y = this.getY();

    this.display.attr({ x: x + this.offsetX, y: y + this.offsetY });
  }

  /**
   * Set display object x,y position
   * @param {number} x - x position
   * @param {number} y - y position
   * @public
   */
  setXY(x = 0, y = 0) {
    this.display.attr({ x: x + this.offsetX, y: y + this.offsetY });
  }

  /**
   * Set display object opacity
   * @param {number} opacity
   * @public
   */
  setOpacity(opacity) {
    this.display.attr({ opacity });
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
   * Get display object x,y position
   * @return {array} [x, y]
   * @public
   */
  getXY() {
    return this.display.attributes.pos || [0, 0];
  }

  /**
   * Get display object x position
   * @return {number} x
   * @public
   */
  getX() {
    return this.getProp('x');
  }

  /**
   * Get display object y position
   * @return {number} y
   * @public
   */
  getY() {
    return this.getProp('y');
  }

  /**
   * Get display object width and height
   * @return {array} [width, height]
   * @public
   */
  getWH() {
    if (this.conf.width) {
      const width = this.conf.width || 0;
      const height = this.conf.height || 0;
      return [width, height];
    } else {
      return this.display.contentSize || [0, 0];
    }
  }

  getDelayTime() {
    return this.animations.getDelayTime();
  }

  getWidth() {
    return this.getWH()[0];
  }

  getHeight() {
    return this.getWH()[1];
  }

  getProp(key) {
    return this.display.attributes[key];
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
   * All resources materials and actions are ready
   * @return {Promise}
   * @public
   */
  isReady() {
    return new Promise(resolve => resolve());
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
   * Start rendering
   * @public
   */
  start() {
    this.animations.start();
  }

  /**
   * Destroy the component
   * @public
   */
  destroy() {
    this.animations.destroy();
    super.destroy();
    this.display.attr({ width: null, height: null });
    const pool = this.rootConf('pool');
    pool && Pool.put(this.type, this.display);

    this.animations = null;
    this.display = null;
    this.parent = null;
  }
}

module.exports = FFNode;
