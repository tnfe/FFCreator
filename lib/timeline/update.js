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
const TWEEN = require('@tweenjs/tween.js/dist/tween.umd');

function resetTween() {
  TWEEN.now = () => 1; // new Date().getTime()
}

const TimelineUpdate = {
  time: 0,
  cbs: [],

  /**
   * TimelineUpdate update function
   * @param {number} delta - delta time
   * @param {number} timeInMs - Jump to time (ms)
   * @public
   */
  async update(delta = 0, timeInMs = -1) {
    if (!this.time) {
      this.time = timeInMs >= 0 ? timeInMs : TWEEN.now();
      TWEEN.now = () => this.time;
    } else {
      this.time = timeInMs >= 0 ? timeInMs : this.time + delta;
    }

    // console.log('update', {ttt: this.time, timeInMs, delta, cbs:this.cbs.length});
    TWEEN.update(this.time);
    return Promise.all(this.cbs.map(cb => cb(this.time, delta)));
  },

  /**
   * Add callback hook
   * @param {function} callback - callback function
   * @public
   */
  addFrameCallback(callback) {
    if (!callback) return;
    this.cbs.push(callback);
  },

  /**
   * Remove callback hook
   * @param {function} callback - callback function
   * @public
   */
  removeFrameCallback(callback) {
    if (!callback) return;

    const index = this.cbs.indexOf(callback);
    if (index > -1) this.cbs.splice(index, 1);
  },

  destroy() {
    this.cbs = [];
    this.time = 0;
    resetTween();
  }
};

resetTween();
module.exports = TimelineUpdate;
