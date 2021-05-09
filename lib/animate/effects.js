'use strict';

/**
 * Effects - Some simulation css animation effects collection
 * Effect realizes the animation of `animate.css` _4.1.0_ version https://animate.style/
 *
 * ####Example:
 *
 *     const ani = Effects.getAnimation({ type, time, delay }, attr);
 *
 *
 * ####Note:
 *     The animation that was not written here (`animate.css` _4.1.0_)
 *     - Attention seekers
 *     bounce flash pulse rubberBand shakeX shakeY headShake swing tada wobble jello heartBeat
 *
 *     - Fading
 *     fadeInTopLeft fadeInTopRight fadeInBottomLeft fadeInBottomRight
 *     fadeOutTopLeft fadeOutTopRight fadeOutBottomRight fadeOutBottomLeft
 *
 *     - Flippers
 *     flip flipInX flipInY flipOutX flipOutY
 *
 *     - Lightspeed
 *     lightSpeedInRight lightSpeedInLeft lightSpeedOutRight lightSpeedOutLeft
 *
 *     - Specials
 *     hinge jackInTheBox
 *
 *
 * @class
 */

const merge = require('lodash/merge');
const isArray = require('lodash/isArray');
const forEach = require('lodash/forEach');
const shuffle = require('lodash/shuffle');
const cloneDeep = require('lodash/cloneDeep');
const Utils = require('../utils/utils');

const Effects = {};

/**
 * mappingFromToVal key
 */
const TARGET = '_target_';
const TARGET_UP = '_target_up_';
const TARGET_DOWN = '_target_down_';
const TARGET_LEFT = '_target_left_';
const TARGET_RIGHT = '_target_right_';
const TARGET_UP_BIG = '_target_up_big_';
const TARGET_DOWN_BIG = '_target_down_big_';
const TARGET_LEFT_BIG = '_target_left_big_';
const TARGET_RIGHT_BIG = '_target_right_big_';
const TARGET_ROTATE = '_target_rotate_';
const TARGET_ROTATE_LEFT = '_target_rotate_left_';
const TARGET_ROTATE_LEFT_BIG = '_target_rotate_left_big_';
const TARGET_ROTATE_RIGHT = '_target_rotate_right_';
const TARGET_ROTATE_RIGHT_BIG = '_target_rotate_right_big_';

/**
 * base props
 */
const TIME = 2;
const LONG_TIME = 30;
const DELAY_IN = 0.1;
const DELAY_OUT = 5;
const MIN_DIS = 150;
const MAX_DIS = 550;
const MIN_ROT = 90;
const MAX_ROT = 180;
const ZOOMING_SPEED = 0.05;
const MOVEING_SPEED = 20;

const INS = { time: TIME, delay: DELAY_IN, ease: 'Quadratic.Out', type: 'in' };
const OUTS = { time: TIME, delay: DELAY_OUT, ease: 'Quadratic.In', type: 'out' };
const INSING = { time: LONG_TIME, delay: DELAY_IN, type: 'ining' };
const OUTSING = { time: LONG_TIME, delay: DELAY_OUT, type: 'outing' };

/**
 * all effects config
 */
Effects.effects = {
  // Fading In Out
  fadeIn: { from: { opacity: 0 }, to: { opacity: 1 }, ...INS, ease: 'Linear.None' },
  fadeOut: { from: { opacity: 1 }, to: { opacity: 0 }, ...OUTS },
  fadeInLeft: ['fadeIn', { ...INS, from: TARGET_LEFT, to: TARGET }],
  fadeInRight: ['fadeIn', { ...INS, from: TARGET_RIGHT, to: TARGET }],
  fadeInUp: ['fadeIn', { ...INS, from: TARGET_DOWN, to: TARGET }],
  fadeInDown: ['fadeIn', { ...INS, from: TARGET_UP, to: TARGET }],
  fadeInLeftBig: ['fadeIn', { ...INS, from: TARGET_LEFT_BIG, to: TARGET }],
  fadeInRightBig: ['fadeIn', { ...INS, from: TARGET_RIGHT_BIG, to: TARGET }],
  fadeInUpBig: ['fadeIn', { ...INS, from: TARGET_DOWN_BIG, to: TARGET }],
  fadeInDownBig: ['fadeIn', { ...INS, from: TARGET_UP_BIG, to: TARGET }],
  fadeOutLeft: ['fadeOut', { ...OUTS, from: TARGET, to: TARGET_LEFT }],
  fadeOutRight: ['fadeOut', { ...OUTS, from: TARGET, to: TARGET_RIGHT }],
  fadeOutUp: ['fadeOut', { ...OUTS, from: TARGET, to: TARGET_UP }],
  fadeOutDown: ['fadeOut', { ...OUTS, from: TARGET, to: TARGET_DOWN }],
  fadeOutLeftBig: ['fadeOut', { ...OUTS, from: TARGET, to: TARGET_LEFT_BIG }],
  fadeOutRightBig: ['fadeOut', { ...OUTS, from: TARGET, to: TARGET_RIGHT_BIG }],
  fadeOutUpBig: ['fadeOut', { ...OUTS, from: TARGET, to: TARGET_UP_BIG }],
  fadeOutDownBig: ['fadeOut', { ...OUTS, from: TARGET, to: TARGET_DOWN_BIG }],

  // Back In Out
  backIn: [{ ...INS, from: { scale: 0.1 }, to: { scale: 1 }, ease: 'Back.Out' }, 'fadeIn'],
  backOut: [{ ...OUTS, from: { scale: 1 }, to: { scale: 0.3 }, ease: 'Back.In' }, 'fadeOut'],
  backInLeft: [
    'fadeIn',
    { from: { scale: 0.7 }, to: { scale: 1 } },
    { ...INS, from: TARGET_LEFT_BIG, to: TARGET, ease: 'Back.Out' },
  ],
  backInRight: [
    'fadeIn',
    { from: { scale: 0.7 }, to: { scale: 1 } },
    { ...INS, from: TARGET_RIGHT_BIG, to: TARGET, ease: 'Back.Out' },
  ],
  backInUp: [
    'fadeIn',
    { from: { scale: 0.7 }, to: { scale: 1 } },
    { ...INS, from: TARGET_DOWN_BIG, to: TARGET, ease: 'Back.Out' },
  ],
  backInDown: [
    'fadeIn',
    { from: { scale: 0.7 }, to: { scale: 1 } },
    { ...INS, from: TARGET_UP_BIG, to: TARGET, ease: 'Back.Out' },
  ],
  backOutLeft: [
    'fadeOut',
    { from: { scale: 1 }, to: { scale: 0.7 } },
    { ...OUTS, to: TARGET_LEFT_BIG, from: TARGET, ease: 'Back.In' },
  ],
  backOutRight: [
    'fadeOut',
    { from: { scale: 1 }, to: { scale: 0.7 } },
    { ...OUTS, to: TARGET_RIGHT_BIG, from: TARGET, ease: 'Back.In' },
  ],
  backOutUp: [
    'fadeOut',
    { from: { scale: 1 }, to: { scale: 0.7 } },
    { ...OUTS, to: TARGET_UP_BIG, from: TARGET, ease: 'Back.In' },
  ],
  backOutDown: [
    'fadeOut',
    { from: { scale: 1 }, to: { scale: 0.7 } },
    { ...OUTS, to: TARGET_DOWN_BIG, from: TARGET, ease: 'Back.In' },
  ],

  // Elastic In Out
  bounceIn: ['fadeIn', { ...INS, from: { scale: 0.1 }, to: { scale: 1 }, ease: 'Elastic.Out' }],
  bounceInDown: [
    'fadeIn',
    { from: { scale: 0.3 }, to: { scale: 1 } },
    { ...INS, from: TARGET_UP, to: TARGET, ease: 'Elastic.Out' },
  ],
  bounceInUp: [
    'fadeIn',
    { from: { scale: 0.3 }, to: { scale: 1 } },
    { ...INS, from: TARGET_DOWN, to: TARGET, ease: 'Elastic.Out' },
  ],
  bounceInLeft: [
    'fadeIn',
    { from: { scale: 0.3 }, to: { scale: 1 } },
    { ...INS, from: TARGET_LEFT, to: TARGET, ease: 'Elastic.Out' },
  ],
  bounceInRight: [
    'fadeIn',
    { from: { scale: 0.3 }, to: { scale: 1 } },
    { ...INS, from: TARGET_RIGHT, to: TARGET, ease: 'Elastic.Out' },
  ],
  bounceOut: ['fadeOut', { ...OUTS, from: { scale: 1 }, to: { scale: 0.3 }, ease: 'Elastic.In' }],
  bounceOutDown: [
    'fadeOut',
    { from: { scale: 1 }, to: { scale: 0.3 } },
    { ...OUTS, from: TARGET, to: TARGET_DOWN, ease: 'Elastic.In' },
  ],
  bounceOutLeft: [
    'fadeOut',
    { from: { scale: 1 }, to: { scale: 0.3 } },
    { ...OUTS, from: TARGET, to: TARGET_LEFT, ease: 'Elastic.In' },
  ],
  bounceOutRight: [
    'fadeOut',
    { from: { scale: 1 }, to: { scale: 0.3 } },
    { ...OUTS, from: TARGET, to: TARGET_RIGHT, ease: 'Elastic.In' },
  ],
  bounceOutUp: [
    'fadeOut',
    { from: { scale: 1 }, to: { scale: 0.3 } },
    { ...OUTS, from: TARGET, to: TARGET_UP, ease: 'Elastic.In' },
  ],

  // Rotate In Out
  rotateIn: ['fadeIn', { ...INS, from: TARGET_ROTATE_LEFT, to: TARGET_ROTATE }],
  rotateOut: ['fadeOut', { ...OUTS, from: TARGET_ROTATE, to: TARGET_ROTATE_RIGHT }],
  rotateInDownLeft: [
    'fadeIn',
    { from: TARGET_LEFT, to: TARGET },
    { from: { scale: 0.3 }, to: { scale: 1 } },
    { ...INS, from: TARGET_ROTATE_LEFT_BIG, to: TARGET_ROTATE },
  ],
  rotateInDownRight: [
    'fadeIn',
    { from: TARGET_RIGHT, to: TARGET },
    { from: { scale: 0.3 }, to: { scale: 1 } },
    { ...INS, from: TARGET_ROTATE_LEFT_BIG, to: TARGET_ROTATE },
  ],
  rotateInUpLeft: [
    'fadeIn',
    { from: TARGET_DOWN, to: TARGET },
    { from: { scale: 0.3 }, to: { scale: 1 } },
    { ...INS, from: TARGET_ROTATE_LEFT_BIG, to: TARGET_ROTATE },
  ],
  rotateInUpRight: [
    'fadeIn',
    { from: TARGET_UP, to: TARGET },
    { from: { scale: 0.3 }, to: { scale: 1 } },
    { ...INS, from: TARGET_ROTATE_LEFT_BIG, to: TARGET_ROTATE },
  ],
  rotateOutDownLeft: [
    'fadeOut',
    { from: TARGET, to: TARGET_LEFT },
    { from: { scale: 1 }, to: { scale: 0.3 } },
    { ...OUTS, from: TARGET_ROTATE, to: TARGET_ROTATE_RIGHT_BIG },
  ],
  rotateOutDownRight: [
    'fadeOut',
    { from: TARGET, to: TARGET_RIGHT },
    { from: { scale: 1 }, to: { scale: 0.3 } },
    { ...OUTS, from: TARGET_ROTATE, to: TARGET_ROTATE_RIGHT_BIG },
  ],
  rotateOutUpLeft: [
    'fadeOut',
    { from: TARGET, to: TARGET_UP },
    { from: { scale: 1 }, to: { scale: 0.3 } },
    { ...OUTS, from: TARGET_ROTATE, to: TARGET_ROTATE_RIGHT_BIG },
  ],
  rotateOutUpRight: [
    'fadeOut',
    { from: TARGET, to: TARGET_DOWN },
    { from: { scale: 1 }, to: { scale: 0.3 } },
    { ...OUTS, from: TARGET_ROTATE, to: TARGET_ROTATE_RIGHT_BIG },
  ],

  // Roll In Out
  rollIn: [
    'fadeInUp',
    { from: { scale: 0.5 }, to: { scale: 1 } },
    { ...INS, from: TARGET_ROTATE_LEFT_BIG, to: TARGET_ROTATE },
  ],
  rollOut: [
    'fadeOutDown',
    { from: { scale: 1 }, to: { scale: 0.5 } },
    { ...OUTS, to: TARGET_ROTATE_RIGHT_BIG, from: TARGET_ROTATE },
  ],

  // Zoom In Out
  zoomIn: ['fadeIn', { ...INS, from: { scale: 0.3 }, to: { scale: 1 } }],
  zoomInDown: [
    'fadeIn',
    { from: TARGET_UP, to: TARGET },
    { ...INS, from: { scale: 0.3 }, to: { scale: 1 }, ease: 'Back.Out' },
  ],
  zoomInLeft: [
    'fadeIn',
    { from: TARGET_LEFT, to: TARGET },
    { ...INS, from: { scale: 0.3 }, to: { scale: 1 }, ease: 'Back.Out' },
  ],
  zoomInRight: [
    'fadeIn',
    { from: TARGET_RIGHT, to: TARGET },
    { ...INS, from: { scale: 0.3 }, to: { scale: 1 }, ease: 'Back.Out' },
  ],
  zoomInUp: [
    'fadeIn',
    { from: TARGET_DOWN, to: TARGET },
    { ...INS, from: { scale: 0.3 }, to: { scale: 1 }, ease: 'Back.Out' },
  ],
  zoomOut: ['fadeOut', { ...OUTS, from: { scale: 1 }, to: { scale: 0.3 } }],
  zoomOutDown: [
    'fadeOut',
    { from: TARGET, to: TARGET_DOWN },
    { ...OUTS, from: { scale: 1 }, to: { scale: 0.3 }, ease: 'Back.In' },
  ],
  zoomOutLeft: [
    'fadeOut',
    { from: TARGET, to: TARGET_LEFT },
    { ...OUTS, from: { scale: 1 }, to: { scale: 0.3 }, ease: 'Back.In' },
  ],
  zoomOutRight: [
    'fadeOut',
    { from: TARGET, to: TARGET_RIGHT },
    { ...OUTS, from: { scale: 1 }, to: { scale: 0.3 }, ease: 'Back.In' },
  ],
  zoomOutUp: [
    'fadeOut',
    { from: TARGET, to: TARGET_UP },
    { ...OUTS, from: { scale: 1 }, to: { scale: 0.3 }, ease: 'Back.In' },
  ],

  // Slide In Out
  slideInDown: { ...INS, from: TARGET_UP, to: TARGET },
  slideInLeft: { ...INS, from: TARGET_LEFT, to: TARGET },
  slideInRight: { ...INS, from: TARGET_RIGHT, to: TARGET },
  slideInUp: { ...INS, from: TARGET_DOWN, to: TARGET },
  slideOutDown: { ...OUTS, to: TARGET_DOWN, from: TARGET },
  slideOutLeft: { ...OUTS, to: TARGET_LEFT, from: TARGET },
  slideOutRight: { ...OUTS, to: TARGET_RIGHT, from: TARGET },
  slideOutUp: { ...OUTS, to: TARGET_UP, from: TARGET },

  // background effect ing...
  zoomingIn: [{ ...INSING, from: { scale: 1 }, add: { scale: ZOOMING_SPEED }, mask: true }],
  zoomingOut: [{ ...INSING, from: { scale: 2 }, add: { scale: -ZOOMING_SPEED }, mask: true }],
  moveingLeft: [{ ...INSING, from: TARGET, add: { x: -MOVEING_SPEED } }],
  moveingRight: [{ ...INSING, from: TARGET, add: { x: MOVEING_SPEED } }],
  moveingUp: [{ ...INSING, from: TARGET, add: { y: -MOVEING_SPEED } }],
  moveingBottom: [{ ...INSING, from: TARGET, add: { y: MOVEING_SPEED } }],
  fadingIn: { ...INSING, from: { opacity: 0 }, to: { opacity: 1 } },
  fadingOut: { ...OUTSING, from: { opacity: 1 }, to: { opacity: 0 } },
};

/**
 * +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 *  STATIC METHODS
 * +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 */

/**
 * Map pronouns to numeric values
 * @param {object} conf - Animation configuration-including time and delay, etc.
 * @param {object} attrs - Display object display attributes
 * @public
 */
Effects.getAnimation = function(conf, attrs) {
  const effect = this.getEffect(conf.type);
  if (!effect) return null;

  let ani = {};
  if (isArray(effect)) {
    for (let i = 0; i < effect.length; i++) {
      let ef = effect[i];
      // like 'fadeIn'
      if (typeof ef === 'string') ef = this.getEffect(ef);
      ef = this.mappingToRealAttr(ef, attrs, conf);
      ani = merge(ani, ef);
    }
  } else {
    ani = this.mappingToRealAttr(effect, attrs, conf);
  }

  return ani;
};

/**
 * Get effect based on type name
 * @param {string} type - type name
 * @public
 */
Effects.getEffect = function(type) {
  const effect = this.effects[type];
  if (!effect) return null;
  return cloneDeep(effect);
};

/**
 * Create new effect and add to effects object
 * @param {string} name - the new effect name
 * @param {object} valObj - the new effect value
 * @public
 */
Effects.createEffect = function(name, valObj) {
  const effect = {
    // from: {},
    // to: {},
    time: 1.2,
    delay: 0.1,
    type: 'in',
    ease: 'Linear.None',
    ...valObj,
  };
  this.effects[name] = effect;
};

/**
 * Get a random effect name
 * @public
 */
Effects.getRandomEffectName = function() {
  let arr = [];
  const checkPushName = (type, key) => {
    if (type === 'in' && arr.indexOf(key) < 0) arr.push(key);
  };

  for (let key in this.effects) {
    const ef = this.effects[key];
    if (isArray(ef)) {
      forEach(ef, e => checkPushName(e.type, key));
    } else {
      checkPushName(ef.type, key);
    }
  }

  return shuffle(arr);
};

/**
 * Mapping to real attr, Reset attributes such as from to time
 * @param {string} type - type name
 * @private
 */
Effects.mappingToRealAttr = function(effect, attrs, conf) {
  // 1. reset from to
  effect.from = this.getMappingVal(effect.from, attrs);
  effect.to = this.getMappingVal(effect.to, attrs);
  // 2. merge conf time delay etc.
  effect = Utils.mergeExclude(effect, conf, ['type']);

  // 3. convert add to toVal
  if (effect.add) {
    effect.to = {};
    for (let key in effect.add) {
      if (key === 'scale') {
        effect.to[key] = effect.from[key] + effect.add[key] * effect.time;
      } else {
        effect.to[key] = effect.from[key] + effect.add[key] * effect.time;
      }
    }
  }

  return effect;
};

Effects.getMappingVal = function(fakeVal, attrs) {
  let val = fakeVal;

  switch (fakeVal) {
    case TARGET:
      val = { x: attrs.x, y: attrs.y };
      break;

    // up / down/ left/ right
    case TARGET_LEFT:
      val = { x: attrs.x - MIN_DIS, y: attrs.y };
      break;
    case TARGET_RIGHT:
      val = { x: attrs.x + MIN_DIS, y: attrs.y };
      break;
    case TARGET_UP:
      val = { x: attrs.x, y: attrs.y - MIN_DIS };
      break;
    case TARGET_DOWN:
      val = { x: attrs.x, y: attrs.y + MIN_DIS };
      break;

    // big up / down/ left/ right
    case TARGET_LEFT_BIG:
      val = { x: attrs.x - MAX_DIS, y: attrs.y };
      break;
    case TARGET_RIGHT_BIG:
      val = { x: attrs.x + MAX_DIS, y: attrs.y };
      break;
    case TARGET_UP_BIG:
      val = { x: attrs.x, y: attrs.y - MAX_DIS };
      break;
    case TARGET_DOWN_BIG:
      val = { x: attrs.x, y: attrs.y + MAX_DIS };
      break;

    // rotate
    case TARGET_ROTATE:
      val = { rotate: attrs.rotate };
      break;
    case TARGET_ROTATE_LEFT:
      val = { rotate: attrs.rotate - MIN_ROT };
      break;
    case TARGET_ROTATE_LEFT_BIG:
      val = { rotate: attrs.rotate - MAX_ROT };
      break;
    case TARGET_ROTATE_RIGHT:
      val = { rotate: attrs.rotate + MIN_ROT };
      break;
    case TARGET_ROTATE_RIGHT_BIG:
      val = { rotate: attrs.rotate + MAX_ROT };
      break;
  }

  return val;
};

module.exports = Effects;
