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

TWEEN.now = () => new Date().getTime();

const TimelineUpdate = {
  delta: 0,
  time: 0,
  startTime: 0,
  frame: 0,
  cbs: [],

  /**
   * TimelineUpdate update function
   * @param {number} fps - Frame rate
   * @public
   */
  update(fps = 60) {
    const delta = (1000 / fps);

    if (!this.startTime) {
      this.startTime = TWEEN.now();
      TWEEN.now = () => this.startTime;
    } else {
      this.frame += 1
    }

    this.time = this.startTime + this.frame * delta

    TWEEN.update(this.time);
    forEach(this.cbs, cb => cb(this.time, delta));
    this.delta = delta;
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
};

module.exports = TimelineUpdate;
