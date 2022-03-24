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
    this.animations = [];
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
    this.animations.push(animation);
  }

  /**
   * Add a Default Effect animation
   * @public
   */
  addEffect(a, b, c) {
    const { display } = this.target;
    const conf = b === undefined ? clone(a) : { type: a, time: b, delay: c };
    const animation = Effects.getAnimation(conf, display);
    if (animation) this.addAnimate(animation);
  }

  initAnimation(animation) {
    if (!animation.isFFAni) {
      const parent = this.target;
      animation = new FFAnimation({ ...animation, parent });
    }

    animation.init();
    this.list.push(animation);
    return animation;
  }

  /**
   * Start all animations and play sequentially
   * @public
   */
  start() {
    if (!this.started) {
      forEach(this.animations, ani => this.initAnimation(ani));
      this.started = true;
    }

    if (!this.list.length) return;
    const firstAni = this.getFirstAni();
    // 如果已经超过了初始时间，就不再setAttr了，TWEEN会直接update
    if (!firstAni.mayStart()) firstAni.setAttr(); // 初始化设置
    else forEach(this.list, ani => ani.start());
  }

  /**
   * Stop all animations
   * @public
   */
  stop() {
    forEach(this.list, ani => ani.stop());
  }

  /**
   * The first animation starting event
   * @public
   */
  onAniStart(callback) {
    if (!this.getDelayTime()) return callback();

    const firstAni = this.getFirstAni();
    firstAni.on('start', callback);
  }

  /**
   * Get the sum of the duration of all animations
   * @public
   */
  getDurationTime() {
    let duration = Math.pow(10, 9);
    if (!this.list.length) return duration;

    forEach(this.list, ani => {
      if (ani.to && ani.to.type === 'out') {
        duration = ani.delay + ani.time;
      }
    });

    return duration;
  }

  /**
   * Get the first delay time of the [type=in] animation
   * @public
   */
  getDelayTime() {
    if (!this.list.length) return 0;
    const ani = this.getFirstAni();
    return ani.to && ani.to.type === 'in' ? ani.delay : 0;
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

  destroy() {
    this.target = null;
    forEach(this.list, ani => ani.destroy());
    this.list.length = 0;
    this.animations = [];
  }
}

module.exports = FFAnimations;
