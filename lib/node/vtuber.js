'use strict';

/**
 * FFVtuber - A simple virtual anchor component
 *
 * ####Example:
 *
 *     const vtuber = new FFVtuber({ path, x: 320, y: 520 });
 *     vtuber.setCutoutColor(90, 200);
 *
 * @class
 */
const FFVideo = require('./video');
const clone = require('lodash/clone');

class FFVtuber extends FFVideo {
  constructor(conf = { list: [] }) {
    super({ type: 'vtuber', ...conf });

    const { min, max, colormin, colormax } = this.conf;
    this.min = min || colormin;
    this.max = max || colormax;
  }

  /**
   * Get a cloned object
   * @return {FFVtuber} cloned object
   * @public
   */
  clone() {
    const vtuber = new FFVtuber(clone(this.conf));
    return vtuber;
  }

  /**
   * Turn on rgb cutout
   * @param {number} r red color
   * @param {number} g green color
   * @param {number} b blue color
   * @public
   */
  setCutoutColor(min, max) {
    this.min = min;
    this.max = max;
  }

  drawCoverImage() {
    super.drawCoverImage();
    const { min, max, display } = this;
    display.texture.setCutoutColor(min, max);
  }

  destroy() {
    super.destroy();
  }
}

module.exports = FFVtuber;
