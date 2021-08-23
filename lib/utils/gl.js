'use strict';

/**
 * GLUtil - A OpenGl tool function library
 *
 * ####Example:
 *
 *
 *
 * @object
 */
const util = require('util');
const ndarray = require('ndarray');
const getPixels = require('get-pixels');

const getPixelsFunc = util.promisify(getPixels);

const GLUtil = {
  byteArray: null,
  getPixelsByteArray({ gl, width, height }) {
    const byteArray = new Uint8Array(width * height * 4);
    gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, byteArray);
    return byteArray;
  },

  enableBlendMode(gl) {
    gl.blendEquation(gl.FUNC_ADD);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.enable(gl.BLEND);
  },

  /**
   * Get the pixel data of the image
   * https://github.com/stackgl/gl-texture2d/issues/16
   * @public
   */
  async getPixels({ type, data, width, height }) {
    if (type === 'raw') {
      return ndarray(data, [width, height, 4], [4, width * 4, 1]);
    } else {
      return await getPixelsFunc(data, `image/${type}`);
    }
  },
};

module.exports = GLUtil;
