'use strict';

/**
 * FFAnimations - A collection class used to manage animation
 *
 * ####Example:
 *
 *     const animations = new FFAnimations(this);
 *     animations.setAnimations(animations);
 *     animations.addAnimate(animation);
 *
 *
 * @class
 */
const clone = require('lodash/clone');
const forEach = require('lodash/forEach');
const Effects = require('./effects');
const FFAnimation = require('./animation');

class FFAnimations {
  constructor(target) {
    this.list = [];
    this.target = target;
  }

  /**
   * Set up the animations collection
   * @param {array} animations - FFAnimation class array
   * @public
   */
  setAnimations(animations = []) {
    forEach(animations, ani => this.addAnimate(ani));
  }

  /**
   * Add a FFAnimate animation
   * @param {FFAnimation|object} animation -  A FFAnimation instance or a animate conf
   * @public
   */
  addAnimate(animation) {
    if (!animation.isFFAni) {
      const parent = this.target;
      animation = new FFAnimation({ ...animation, parent });
    }

    this.list.push(animation);
    return animation;
  }

  addEffect(a, b, c) {
    const { display } = this.target;
    const attrs = display.attributes;
    const conf = b === undefined ? clone(a) : { type: a, time: b, delay: c };
    const ani = Effects.getAnimation(conf, attrs);
    if (ani) this.addAnimate(ani);
  }

  /**
   * Start all animations and play sequentially
   * @public
   */
  start() {
    if (!this.list.length) return;
    const firstAni = this.getFirstAni();
    firstAni.setAttr();
    forEach(this.list, ani => ani.start());
  }

  /**
   * Stop all animations
   * @public
   */
  stop() {
    forEach(this.list, ani => ani.stop());
  }

  /**
   * Get the first animation (the one with the least delay)
   * @private
   */
  getFirstAni() {
    let first = this.list[0];
    forEach(this.list, ani => {
      if (first.delay > ani.delay) first = ani;
    });

    return first;
  }

  /**
   * Get the first delay time of the animation
   * @public
   */
  getDelayTime() {
    if (!this.list.length) return 0;
    return this.getFirstAni().delay;
  }

  /**
   * The first animation starting event
   * @public
   */
  onAniStart(callback) {
    if (!this.list.length) return callback();

    const firstAni = this.getFirstAni();
    firstAni.on('start', callback);
  }

  destroy() {
    this.target = null;
    forEach(this.list, ani => ani.destroy());
    this.list.length = 0;
  }
}

module.exports = FFAnimations;
