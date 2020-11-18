'use strict';

/**
 * Frames - Video frames Class, Used to easily manage multiple picture frames
 *
 * ####Example:
 *
 *     const frames = new Frames();
 *     frames.add(index, buffer);
 *     const data = frames.get(index);
 *
 * @class
 */
const forEach = require('lodash/forEach');
const FFLogger = require('./logger');
class Frames {
  constructor() {
    this.frameStart = 0;
    this.frames = []; // frame array
  }

  /**
   * Add a single picture frame
   * @param {number} i - index
   * @param {any} val - picture frame
   * @public
   */
  add(i, val) {
    this.frames[i] = val;
  }

  /**
   * Clear all frames
   * @public
   */
  empty() {
    this.destroy();
  }

  /**
   * Get the frame length
   * @return {number} length
   * @public
   */
  total() {
    return this.frames.length;
  }

  /**
   * Get the frame length
   * @return {number} length
   * @public
   */
  get(i) {
    return this.frames[i];
  }

  /**
   * Loop through frames
   * @return {function} func
   * @public
   */
  forEach(func) {
    forEach(this.frames, func);
  }

  /**
   * Test how many empty frames
   * @public
   */
  testing() {
    this.forEach((frame, index) => {
      if (!frame) FFLogger.log(`empty frame: ${index}`);
    });
  }

  /**
   * Check for empty frames
   * @return {boolean} has empty frames
   * @public
   */
  noEmptyFrame() {
    let no = true;
    this.forEach(frame => {
      if (!frame) no = true;
    });

    return no;
  }

  destroy() {
    for (let i = this.frames.length - 1; i >= 0; i--) {
      delete this.frames[i];
    }
    this.frames.length = 0;
  }
}

module.exports = Frames;
