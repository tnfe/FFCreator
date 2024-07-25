'use strict';

/**
 * Materials - A material auxiliary management class
 *
 * ####Example:
 *
 *     const materials = new Materials();
 *     const endTime = materials.getDuration();
 *     const rect = materials.getSourceRect(width, height);
 *
 * @class
 */
const DateUtil = require('./date');
const { Rectangle } = require('inkpaint');

class Materials {
  constructor() {
    this.info = null;
    this.path = '';
    this.apath = '';
    this.start = 0;
    this.end = 0;
    this.length = 0;
  }

  /**
   * Get the width and height of the material resource frame scaled according to the scene scale
   * @param {number} width - The width of the scene
   * @param {number} height - The height of the scene
   * @return {array} [x, y, width, height]
   * @public
   */
  getSourceRect(width, height) {
    if (!this.info) return new Rectangle(0, 0, width, height);

    const { streams = [{ width: 0, height: 0 }] } = this.info;
    let w, h, x, y;
    const ow = this.info.width || streams[0].width;
    const oh = this.info.height || streams[0].height;
    const s1 = width / height;
    const s2 = ow / oh;
    if (s1 >= s2) {
      w = ow;
      h = (ow / s1) >> 0;
      x = 0;
      y = ((oh - h) / 2) >> 0;
    } else {
      h = oh;
      w = (oh * s1) >> 0;
      y = 0;
      x = ((ow - w) / 2) >> 0;
    }

    return new Rectangle(x, y, w, h);
  }

  /**
   * Obtain duration based on movie information
   * @return {number} movie information duration
   * @public
   */
  getDuration() {
    if (!this.info) return 0;

    const { streams = [{ duration: 10 }] } = this.info;
    let duration = this.info.duration || parseFloat(streams[0].duration) * 1000;
    if (typeof duration === 'string') {
      if (duration.indexOf(':') > 0) duration = DateUtil.hmsToSeconds(duration);
      else duration = parseInt(duration);
    }

    return Math.floor(duration / 1000);
  }

  /**
   * Get the path of a certain frame in the Materials
   * @param {number} index - Frame number index
   * @return {string} Frame path
   * @public
   */
  getFrame(index) {
    if (index < this.length) return this.path.replace('%d', index);
    else return this.path.replace('%d', this.length - 1);
  }

  /**
   * Get the path of a certain frame in the Materials
   * convert ../img%d.jpeg or ../img[d].jpeg to ../img2.jpeg
   *
   * @param {number} index - Frame number index
   * @return {string} Frame path
   * @public
   */
  getFrame2(index) {
    return this.path.replace(/(\%d|\[d\]|\(d\))/gi, index);
  }

  /**
   * Return a cloned Materials object
   * @return {Materials} A cloned Materials object
   * @public
   */
  clone() {
    const mat = new Materials();
    mat.info = this.info;
    mat.path = this.path;
    mat.apath = this.apath;
    mat.start = this.start;
    mat.end = this.end;
    mat.length = this.length;

    return mat;
  }

  destroy() {
    this.info = null;
    this.path = '';
    this.length = 0;
  }

  toString() {
    return `images:${this.length}-${this.path}`;
  }
}

module.exports = Materials;
