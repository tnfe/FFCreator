'use strict';

/**
 * FFVtuber - A simple virtual anchor component
 *
 * ####Example:
 *
 *     const vtuber = new FFVtuber({ path, x: 320, y: 520, mode: 'video' });
 *     vtuber.setCutoutColor(90, 200);
 *
 * @class
 */
const FFVideo = require('./video');

class FFVtuber extends FFVideo {
  constructor(conf = { list: [] }) {
    super({ type: 'vtuber', ...conf });

    const { min, max, colormin, colormax, mode = 'video', path, start, end } = this.conf;
    this.min = min || colormin;
    this.max = max || colormax;
    this.mode = mode;

    if (this.mode !== 'video') {
      this.setPath(path, start, end);
    }
  }

  setPath(path, start, end) {
    this.materials.path = path;
    this.materials.start = start;
    this.materials.end = end;
    this.materials.length = end - start + 1;
    this.frameIndex = start;
  }

  /**
   * Material preprocessing
   * @return {Promise}
   * @public
   */
  async preProcessing() {
    if (this.mode === 'video') {
      await super.preProcessing();
    }
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

  /**
   * Draw a cover image
   * @private
   */
  drawCoverImage() {
    super.drawCoverImage();

    if (this.mode === 'video') {
      const { min, max, display } = this;
      display.texture.setCutoutColor(min, max);
    }
  }

  /**
   * draw the next frame
   * @private
   */
  nextFrame() {
    if (this.mode === 'video') {
      super.nextFrame();
    } else {
      const { length } = this.materials;
      this.frameIndex++;
      if (this.frameIndex >= length) {
        this.frameIndex = this.materials.start;
      }
    }
  }

  destroy() {
    super.destroy();
    this.drawing = null;
  }
}

module.exports = FFVtuber;
