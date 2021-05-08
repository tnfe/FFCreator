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

const GLUtil = {
  byteArray: null,
  getPixelsByteArray({gl, width, height}) {
    if (!this.byteArray) this.byteArray = new Uint8Array(width * height * 4);

    gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, this.byteArray);
    return this.byteArray;
  },
  
  enableBlendMode(gl) {
    gl.blendEquation(gl.FUNC_ADD);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.enable(gl.BLEND);
  },
};

module.exports = GLUtil;
