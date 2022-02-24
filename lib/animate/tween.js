'use strict';

/**
 * FFTween - The tween class that controls the animation movement of the display element
 *
 * ####Example:
 *
 *     FFTween.to(node, .5,{ x: 100, y: 100 });
 *     FFTween.fromTo(node, .5, { opacity: 0, y: 100 }, { opacity: 1, y: 0 });
 *
 * @object
 */
const get = require('lodash/get');
const clone = require('lodash/clone');
const DateUtil = require('../utils/date');
const TWEEN = require('@tweenjs/tween.js');

const FFTween = {
  /**
   * Tween to easing animation
   * @param {FFNode} target - target display object
   * @param {number} time - animation transition time
   * @param {object} toObj - animation transition properties
   * @public
   */
  to(target, time, toObj) {
    const from = target.display;
    const to = clone(toObj);
    const delay = to.delay || 0;
    const ease = to.ease;
    delete to['delay'];
    delete to['ease'];

    target.addAnimate({ from, to, time, delay, ease });
  },

  /**
   * Think of a from() like a backwards tween where you define where the values should START
   * @param {FFNode} target - target display object
   * @param {number} time - animation transition time
   * @param {object} fromObj - animation transition properties
   * @public
   */
  from(target, time, fromObj) {
    const to = target.display;
    const from = clone(fromObj);
    const delay = from.delay || 0;
    const ease = from.ease;
    delete from['delay'];
    delete from['ease'];

    target.addAnimate({ from, to, time, delay, ease });
  },

  /**
   * Lets you define BOTH the starting and ending values for an animation (as opposed to from()
   * and to() tweens which use the current state as either the start or end).
   * @param {FFNode} target - target display object
   * @param {number} time - animation transition time
   * @param {object} fromObj - from transition properties
   * @param {object} toObj - to transition properties
   * @public
   */
  fromTo(target, time, fromObj, toObj) {
    const from = clone(fromObj);
    const to = clone(toObj);
    const delay = to.delay || 0;
    const ease = to.ease;
    delete to['delay'];
    delete to['ease'];

    target.addAnimate({ from, to, time, delay, ease });
  },

  /**
   * Control the tween animation method of the underlying sprite
   * @param {Sprite} target - target display object
   * @param {number} time - animation transition time
   * @param {object} fromObj - from transition properties
   * @param {object} toObj - to transition properties
   * @public
   */
  spriteTweenFromTo(target, time, fromObj, toObj) {
    const from = clone(fromObj);
    const to = clone(toObj);
    const ease = get(TWEEN.Easing, to.ease || 'Quadratic.Out');
    let delay = to.delay || 0;
    time = DateUtil.toMilliseconds(time);
    delay = DateUtil.toMilliseconds(delay);

    delete to['delay'];
    delete to['ease'];

    const tween = new TWEEN.Tween(from)
      .to(to, time)
      .delay(delay)
      .easing(ease)
      .onUpdate(() => target.attr(from));

    return tween.start();
  },

  getTween() {
    return TWEEN.Tween;
  },

  getEase(ease) {
    return get(TWEEN.Easing, ease || 'Quadratic.Out');
  },

  getTWEEN() {
    return TWEEN;
  },
};

module.exports = FFTween;
