'use strict';

/**
 * FFAnimation - The class used to animate the display element
 *
 * ####Example:
 *
 *     const animation = new FFAnimation({ ...animation, parent });
 *     animation.start();
 *     animation.stop();
 *
 *
 * ####Note:
 *     Easeing function
 *     Type In-Out-InOut
 *     Ease Quadratic Cubic Quartic Quintic Exponential Circular Elastic Back Bounce
 *
 * @class
 */
const get = require('lodash/get');
const clone = require('lodash/clone');
const FFBase = require('../core/base');
const Utils = require('../utils/utils');
const DateUtil = require('../utils/date');
const TWEEN = require('@tweenjs/tween.js');

class FFAnimation extends FFBase {
  constructor(conf = { time: 0.7, delay: 0, ease: 'Linear.None' }) {
    super({ type: 'animation' });

    const { from, to, time = .7, delay = 0, ease = 'Linear.None', parent } = conf;
    this.from = from;
    this.to = to;
    this.ease = ease;
    this.parent = parent;
    this.proxyAttr = {};
    this.isFFAni = true;
    this.autoAlpha = false;

    this.time = DateUtil.toMilliseconds(time);
    this.delay = DateUtil.toMilliseconds(delay);
    this.tween = this.createTween();
  }

  /**
   * Create an Tween animation method
   * @return {Tween} new tween object
   * @private
   */
  createTween() {
    const { from, to } = this.getFromTo();
    const ease = get(TWEEN.Easing, this.ease);
    this.complement(from, to);
    this.proxyAttr = clone(from);

    return new TWEEN.Tween(from)
      .to(to, this.time)
      .delay(this.delay)
      .easing(ease)
      .onStart(() => {
        if (this.autoAlpha) {
          const { display } = this.parent;
          if (from.alpha === undefined) display.alpha = 1;
        }

        this.emit('start');
      })
      .onUpdate(() => {
        if (!this.proxyAttr) return;

        const { display } = this.parent;
        this.copyAndResetAttr(this.proxyAttr, from);
        display.attr(this.proxyAttr);
      })
      .onComplete(() => {
        this.emit('complete', this);
      });
  }

  /**
   * Clone node attributes to proxy objects
   * @param {object} proxy - the proxy object
   * @param {object} source - the source object
   * @private
   */
  copyAndResetAttr(proxy, source) {
    this.copyAttr(proxy, source);

    // reset alpha
    const alpha = source.alpha;
    if (alpha !== undefined) {
      proxy.alpha = Utils.floor(source.alpha, 2);
      proxy.alpha = Math.max(proxy.alpha, 0);
      proxy.alpha = Math.min(proxy.alpha, 1);
    }

    // reset x y
    const { x, y } = source;
    const { offsetX, offsetY } = this.parent;
    if (x !== undefined) {
      proxy.x = proxy.x + offsetX;
    }
    if (y !== undefined) {
      proxy.y = proxy.y + offsetY;
    }

    return proxy;
  }

  /**
   * Set attributes to display object
   * @private
   */
  setAttr() {
    const { display } = this.parent;
    const { from, to } = this.getFromTo();
    this.complement(from, to);
    this.copyAndResetAttr(this.proxyAttr, from);
    display.attr(this.proxyAttr);
  }

  /**
   * Complement two object attributes, align from and to
   * @param {object} from - tween from attributes
   * @param {object} to - tween to attributes
   * @private
   */
  complement(from, to) {
    const { display } = this.parent;
    for (let key in from) {
      if (to[key] === undefined) {
        to[key] = display.getAttr(key);
      }
    }

    for (let key in to) {
      if (from[key] === undefined) {
        from[key] = display.getAttr(key);
      }
    }
  }

  /**
   * Get the animation properties of from and to
   * @private
   */
  getFromTo() {
    const { display } = this.parent;
    const from = this.from || this.cloneFromSprite(display);
    const to = this.to || this.cloneFromSprite(display);
    return { from, to };
  }

  /**
   * Start this animation
   * @public
   */
  start() {
    this.tween.start();
  }

  /**
   * Stop this animation
   * @public
   */
  stop() {
    this.tween.stop();
  }

  /**
   * cloneFromSprite - clone the ffnode instance
   * @public
   */
  cloneFromSprite(target) {
    const node = {
      x: target.x,
      y: target.y,
      alpha: target.alpha,
      rotation: target.rotation,
      scale: target.scale.x,
    };

    return node;
  }

  copyAttr(a, b) {
    for (let key in b) {
      a[key] = b[key];
    }
  }

  destroy() {
    this.stop();
    this.proxyAttr = null;
    this.tween = null;
    this.parent = null;
    this.from = null;
    this.to = null;

    super.destroy();
  }
}

module.exports = FFAnimation;
