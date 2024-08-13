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
const createTexture = require('gl-texture2d');
const createTransition = require('gl-transition').default;

const FFShader = require('./shader');
const GLUtil = require('../utils/gl');
const ShaderManager = require('../shader/shader');

/**
 * @typedef { import("./shader").GLFactory } GLFactory
 * @typedef { import("./shader").GL } GL
 */

class FFTransition extends FFShader {
  constructor(conf) {
    super({ type: 'transition', ...conf });

    const { name, duration = 1, params, resizeMode = 'stretch' } = this.conf;
    this.name = name;
    this.params = params;
    this.resizeMode = resizeMode;
    this.duration = duration;
  }

  /**
   * Binding webgl context
   * @param { GL } gl - webgl context
   * @public
   */
  bindGL(gl) {
    super.bindGL(gl);
    this.createTransitionSource(this.name);
    this.createTransition(gl);
  }

  /**
   * Create glsl source file for transition
   * @private
   * @param { string } name
   */
  createTransitionSource(name) {
    const source = ShaderManager.getShaderByName(name);
    if (!this.source && source) {
      this.source = source;
      this.defer(() => (this.source = null));
    }
    return source;
  }

  /**
   * Create VBO code
   * @private
   * @param { GL } gl
   */
  createTransition(gl) {
    if (this.transition) return;

    const { resizeMode } = this;
    this.createBuffer(gl);
    this.transition = createTransition(gl, this.source, { resizeMode });
    this.defer(() => {
      this.transition.dispose();
      this.transition = null;
    });
    return this.transition;
  }

  /**
   * Rendering function
   * @private
   * @param {{
   *   type: any;
   *   fromBuff: Buffer;
   *   toBuff: Buffer;
   *   progress: number;
   * }} props
   */
  async render(props) {
    const { type, fromBuff, toBuff, progress } = props;

    if (!fromBuff || !toBuff) return;

    const { gl, buffer, transition, params } = this;
    const width = gl.drawingBufferWidth;
    const height = gl.drawingBufferHeight;

    gl.clear(gl.COLOR_BUFFER_BIT);
    const fromPixels = await GLUtil.getPixels({ type, data: fromBuff, width, height });
    const toPixels = await GLUtil.getPixels({ type, data: toBuff, width, height });

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
}

module.exports = FFTransition;
