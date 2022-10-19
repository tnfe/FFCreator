'use strict';

/**
 * FFTransition - Class used to handle scene transition animation
 *
 * ####Example:
 *
 *     const transition = new FFTransition({ name, duration, params });
 *
 * @object
 */
const createBuffer = require('gl-buffer');

const FFBase = require('../core/base');

/**
 * @typedef { import("gl") } GLFactory
 * @typedef { ReturnType<GLFactory> } GL
 */

class FFShader extends FFBase {
  constructor(conf) {
    super({ type: 'shader', ...conf });
  }

  /**
   * Binding webgl context
   * @param { GL } gl - webgl context
   * @public
   */
  bindGL(gl) {
    this.gl = gl;
    this.defer(() => (this.gl = null));
  }

  /**
   * Create VBO
   * @private
   * @param { GL } gl
   */
  createBuffer(gl) {
    if (this.buffer) return;
    const data = [-1, -1, -1, 4, 4, -1];
    this.buffer = createBuffer(gl, data, gl.ARRAY_BUFFER, gl.STATIC_DRAW);
    this.defer(() => (this.buffer = null));
  }

  /**
   * Rendering function
   * @private
   * @abstract
   * @param { Record<string, unknown> } props
   */
  async render(props) {
    props;
    throw new Error('not implement function: render');
  }

  dispose() {
    this.buffer && this.buffer.dispose();
    this.transition && this.transition.dispose();
  }

  destroy() {
    this.dispose();
    super.destroy();
  }
}

module.exports = FFShader;
