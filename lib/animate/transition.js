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
const createTexture = require('gl-texture2d');
const createTransition = require('gl-transition').default;

const FFClip = require('../core/clip');
const GLUtil = require('../utils/gl');
const ShaderManager = require('../shader/shader');
const { Container } = require('inkpaint');

class FFTransition extends FFClip {
  constructor(conf) {
    super({ type: 'transition', duration: 1, ...conf });
    const { name, params, resizeMode = 'stretch' } = this.conf;
    this.name = name;
    this.params = params;
    this.resizeMode = resizeMode;
  }

  createDisplay() {
    this.display = new Container();
  }

  annotate() {
    this._duration = this.duration;
    this._absStart = this.absStart;
    this._absEnd = start + this._duration;
    this.onTime = (absTime) => {
      if (absTime < this._absStart || absTime >= this._absEnd) {
        this.parent.removeDisplayChild(this.display);
        return false;
      } else {
        this.parent.addDisplayChild(this.display);
        return true;
      }
    }
  }

  get default() {
    return { duration: 1 };
  }

  get duration() {
    let duration = this.time(this.conf.duration);
    return !isNaN(duration) ? duration : this.time(this.default.duration);
  }

  get start() {
    return Math.max(0, (this.prevSibling?.end - this.duration) || 0);
  }

  get end() {
    // 跟start一样, 让后面的node, 也同时开始
    return this.start;
  }

  async drawing(timeInMs = 0, nextDeltaInMS = 0) {
    const absTime = timeInMs * 0.001;
    if (!this.onTime(absTime)) return false;
    const progress = (absTime - this._absStart) / this._duration;

    this.prevSibling?.display
    this.nextSibling?.display
    return true;
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
  async render({ type, fromBuff, toBuff, progress }) {
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
