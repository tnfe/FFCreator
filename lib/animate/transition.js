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
const ndarray = require('ndarray');
const createBuffer = require('gl-buffer');
const createTexture = require('gl-texture2d');
const createTransition = require('gl-transition').default;

const FS = require('../utils/fs');
const FFBase = require('../core/base');
const DateUtil = require('../utils/date');
const ShaderManager = require('../shader/shader');

class FFTransition extends FFBase {
  constructor(conf) {
    super({ type: 'transition', ...conf });

    const { name, duration = 600, params, resizeMode = 'stretch' } = this.conf;
    this.name = name;
    this.params = params;
    this.resizeMode = resizeMode;
    this.duration = DateUtil.toSeconds(duration);
  }

  /**
   * Binding webgl context
   * @param {GL} gl - webgl context
   * @public
   */
  bindGL(gl) {
    this.gl = gl;
    this.createTransitionSource(this.name);
    this.createTransition(gl);
  }

  /**
   * Create glsl source file for transition
   * @private
   */
  createTransitionSource(name) {
    const source = ShaderManager.getShaderByName(name);
    this.source = source;
    return source;
  }

  /**
   * Create VBO code
   * @private
   */
  createTransition(gl) {
    if (this.transition) return;

    const { resizeMode } = this;
    this.createBuffer(gl);
    this.transition = createTransition(gl, this.source, { resizeMode });
    return this.transition;
  }

  /**
   * Create VBO
   * @private
   */
  createBuffer(gl) {
    if (this.buffer) return;
    const data = [-1, -1, -1, 4, 4, -1];
    this.buffer = createBuffer(gl, data, gl.ARRAY_BUFFER, gl.STATIC_DRAW);
  }

  /**
   * Rendering function
   * @private
   */
  async render({ type, dir, from, to, progress }) {
    if (!from || !to) return;

    const { gl, buffer, transition, params } = this;
    const width = gl.drawingBufferWidth;
    const height = gl.drawingBufferHeight;

    gl.clear(gl.COLOR_BUFFER_BIT);
    const fromPixels = await this.getPixels({ type, dir, name: from, width, height });
    const toPixels = await this.getPixels({ type, dir, name: to, width, height });

    // from
    const textureFrom = createTexture(gl, fromPixels);
    textureFrom.minFilter = gl.LINEAR;
    textureFrom.magFilter = gl.LINEAR;

    // to
    const textureTo = createTexture(gl, toPixels);
    textureTo.minFilter = gl.LINEAR;
    textureTo.magFilter = gl.LINEAR;

    buffer.bind();
    transition.draw(progress, textureFrom, textureTo, width, height, params);

    textureFrom.dispose();
    textureTo.dispose();
  }

  /**
   * Get the pixel data of the image
   * https://github.com/stackgl/gl-texture2d/issues/16
   * @private
   */
  async getPixels({ type, dir, name, width, height }) {
    if (type === 'raw') {
      const data = FS.readFileSync({ dir, name, nofix: true });
      return ndarray(data, [width, height, 4], [4, width * 4, 1]);
    } else {
      return await FS.getPixelsAsync({ type, dir, name, nofix: true });
    }
  }

  dispose() {
    this.buffer && this.buffer.dispose();
    this.transition && this.transition.dispose();
  }

  destroy() {
    this.dispose();
    this.gl = null;
    this.source = null;
    this.buffer = null;
    this.transition = null;
  }
}

module.exports = FFTransition;
