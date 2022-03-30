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
const { createCanvas, createImageData, WebGLRenderer, CanvasRenderer, Texture, Sprite, gl } = require('../../inkpaint/lib/index');
const CanvasUtil = require('../utils/canvas');
const { isBrowser } = require('browser-or-node');

class FFTransition extends FFClip {
  constructor(conf) {
    super({ type: 'trans', duration: 1, ...conf });
    const { name, params, resizeMode = 'stretch' } = this.conf;
    this.name = name;
    this.params = params;
    this.resizeMode = resizeMode;
  }

  createDisplay() {
    this.display = new Sprite(Texture.fromCanvas(createCanvas(1, 1)));
  }

  async preProcessing() {
    this.width = this.rootConf('width');
    this.height = this.rootConf('height');
    this.canvas = createCanvas(this.width, this.height);
    this.display.attr({ texture: Texture.fromCanvas(this.canvas) });
    if (this.rootConf('useGL')) {
      this.renderer = new WebGLRenderer({ width: this.width, height: this.height });
    } else {
      this.renderer = new CanvasRenderer({ width: this.width, height: this.height });
    }
    this.gl = gl(this.width, this.height);
    this.createTransitionSource(this.name);
    this.createTransition(this.gl);
  }

  annotate() {
    this._duration = this.duration;
    this._absStartTime = this.absStartTime;
    this._absEndTime = this._absStartTime + this._duration;
    this.addTimelineCallback();
    this.onTime = (absTime) => {
      const show = (absTime > this._absStartTime && absTime < this._absEndTime);
      show ? this.show() : this.hide();
      return show;
    }
  }

  get default() {
    return { duration: 1 };
  }

  get duration() {
    let duration = this.time(this.conf.duration);
    return !isNaN(duration) ? duration : this.time(this.default.duration);
  }

  get startTime() {
    return Math.max(0, (this.prevSibling?.endTime - this.duration) || 0);
  }

  get endTime() {
    // 跟start一样, 让后面的node, 也同时开始
    return this.startTime;
  }

  getSnapshotBuffer(display) {
    this.renderer.render(display);
    const canvas = this.renderer.view;
    const type = isBrowser ? 'canvas' : 'raw';
    canvas.rgbReverse = true; // 否则颜色是BGR，很奇怪
    return CanvasUtil.toBuffer({ type, canvas });
  }

  async drawing(timeInMs = 0, nextDeltaInMS = 0) {
    const absTime = timeInMs * 0.001;
    if (!this.onTime(absTime)) return false;
    const progress = (absTime - this._absStartTime) / this._duration;
    const prevBuffer = this.getSnapshotBuffer(this.prevSibling?.display);
    const nextBuffer = this.getSnapshotBuffer(this.nextSibling?.display);
    const { gl, width, height } = this;
    await this.render({ prevBuffer, nextBuffer, progress });
    const data = GLUtil.getPixelsByteArray({ gl, width, height });
    const imgData = createImageData(new Uint8ClampedArray(data.buffer), width, height);
    this.canvas.getContext('2d').putImageData(imgData, 0, 0);
    this.display.texture.baseTexture.update();
    return true;
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
  async render({ prevBuffer, nextBuffer, progress }) {
    if (!prevBuffer || !nextBuffer) return;

    const type = 'raw';
    const { gl, buffer, transition, params } = this;
    const width = gl.drawingBufferWidth;
    const height = gl.drawingBufferHeight;

    gl.clear(gl.COLOR_BUFFER_BIT);
    const prevPixels = await GLUtil.getPixels({ type, data: prevBuffer, width, height });
    const nextPixels = await GLUtil.getPixels({ type, data: nextBuffer, width, height });

    // prev
    const texturePrev = createTexture(gl, prevPixels);
    texturePrev.minFilter = gl.LINEAR;
    texturePrev.magFilter = gl.LINEAR;

    // next
    const textureNext = createTexture(gl, nextPixels);
    textureNext.minFilter = gl.LINEAR;
    textureNext.magFilter = gl.LINEAR;

    buffer.bind();
    transition.draw(progress, texturePrev, textureNext, width, height, params);

    texturePrev.dispose();
    textureNext.dispose();
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
