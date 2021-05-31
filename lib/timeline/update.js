'use strict';

/**
 * TimelineUpdate - Simple timeline management tool
 *
 * ####Example:
 *
 *     TimelineUpdate.addFrameCallback(this.drawing);
 *
 * @class
 */
const forEach = require('lodash/forEach');
const TWEEN = require('@tweenjs/tween.js');

const TimelineUpdate = {
  time: 0,
  cbs: [],

  /**
   * TimelineUpdate update function
   * @param {number} rfps - Frame rate
   * @public
   */
  update(rfps = 60) {
    const delta = 1000 / rfps;
    if (!this.time) {
      this.time = TWEEN.now();
      TWEEN.now = () => this.time;
    } else {
      this.time += delta;
    }

    TWEEN.update(this.time);
    forEach(this.cbs, cb => cb(this.time, delta));
  },

  /**
   * Add callback hook
   * @param {function} callback - callback function
   * @public
   */
  addFrameCallback(callback) {
    this.cbs.push(callback);
  },

  /**
   * Remove callback hook
   * @param {function} callback - callback function
   * @public
   */
  removeFrameCallback(callback) {
    const index = this.cbs.indexOf(callback);
    if (index > -1) this.cbs.splice(index, 1);
  },
};

module.exports = TimelineUpdate;
