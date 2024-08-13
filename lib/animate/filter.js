'use strict';

const createTexture = require('gl-texture2d');
const createShader = require('gl-shader');

const FFShader = require('./shader');
const GLUtil = require('../utils/gl');
const { FilterManager } = require('../filter');

/**
 * @typedef { import("./shader").GLFactory } GLFactory
 * @typedef { import("./shader").GL } GL
 */

/**
 * here code was modify from pkg: gl-transition.
 */

const vertexSource =
  '\
attribute vec2 _p;\
varying vec2 _uv;\
void main() {\
  gl_Position = vec4(_p, 0.0, 1.0);\
  _uv = vec2(0.5, 0.5) * (_p + vec2(1.0, 1.0));\
}\
';

/** @type { Record<string, function> } */
const resizeModes = {
  cover: r => `.5 + (uv - .5) * vec2(min(ratio / ${r}, 1.), min(${r} / ratio, 1.))`,
  contain: r => `.5 + (uv - .5) * vec2(max(ratio / ${r}, 1.), max(${r} / ratio, 1.))`,
  stretch: () => 'uv',
};
function concatFragmentCode(source, resizeMode) {
  const r = resizeModes[resizeMode];
  if (!r) throw new Error('invalid resizeMode=' + resizeMode);

  return `\
precision highp float;
varying vec2 _uv;
uniform sampler2D templateTexture;
uniform float progress, ratio, _textureR;
uniform float currentFrame, totalFrame, startFrame, endFrame;

vec4 getTextureColor(vec2 uv) {
  return texture2D(templateTexture, ${r('_textureR')});
}

${source}

void main() {
  gl_FragColor = entry_func(_uv);
}\
`;
}

class FFFilter extends FFShader {
  /**
   *
   * @param {{
   *   name: string;
   *   params?: Record<string, unknown>;
   * }} conf
   */
  constructor(conf) {
    super({ type: 'filter', ...conf });

    const { name, params = {}, resizeMode = 'stretch' } = this.conf;
    /** @type { string } */
    this.name = name;
    /** @type { Record<string, unknown> } */
    this.params = params;
    /** @type { string } */
    this.resizeMode = resizeMode;
  }

  /**
   * Binding webgl context
   * @param { GL } gl - webgl context
   * @public
   */
  bindGL(gl) {
    super.bindGL(gl);
    this.initializeFilterSource();
    this.initializeFilterShader();
  }

  initializeFilterSource() {
    if (!this.source) {
      this.source = FilterManager.getFilterByName(this.name);
      this.defer(() => {
        this.source = null;
      });
    }
  }

  initializeFilterShader() {
    if (!this.shader) {
      this.shader = createShader(
        this.gl,
        vertexSource,
        concatFragmentCode(this.source.glsl, this.resizeMode),
      );
      this.createBuffer(this.gl);
      this.defer(() => {
        this.shader.dispose();
        this.shader = null;
      });
    }
  }

  /**
   * Rendering function
   * @private
   * @param {{
   *   type: any;
   *   buffer: Buffer;
   *   progress: number;
   *   currentFrame: number;
   *   totalFrame: number;
   *   startFrame: number;
   *   endFrame: number;
   * }} props
   */
  async render(props) {
    const { type, buffer: data, progress, currentFrame, totalFrame, startFrame, endFrame } = props;

    if (!data) {
      return;
    }

    const { gl, buffer, params } = this;
    const width = gl.drawingBufferWidth;
    const height = gl.drawingBufferHeight;

    gl.clear(gl.COLOR_BUFFER_BIT);
    const pixels = await GLUtil.getPixels({ type, data, width, height });

    const texture = createTexture(gl, pixels);
    texture.minFilter = gl.LINEAR;
    texture.magFilter = gl.LINEAR;

    buffer.bind();
    this.draw(
      { progress, texture, width, height, currentFrame, totalFrame, startFrame, endFrame },
      params,
    );

    texture.dispose();
  }

  /**
   * here code was modify from pkg: gl-transition.
   * @param {{
   *   progress: number;
   *   texture: ReturnType<import("gl-texture2d")>;
   *   width: number;
   *   height: number;
   *   currentFrame: number;
   *   totalFrame: number;
   *   startFrame: number;
   *   endFrame: number;
   * }} data
   * @param { Record<string, unknown> } params
   */
  async draw(
    { progress, texture, width, height, currentFrame, totalFrame, startFrame, endFrame },
    params,
  ) {
    const { shader, source, gl } = this;
    shader.bind();
    shader.attributes._p.pointer();

    shader.uniforms.ratio = width / height;
    shader.uniforms.progress = progress;
    shader.uniforms.templateTexture = texture.bind(0);
    shader.uniforms._textureR = texture.shape[0] / texture.shape[1];
    shader.uniforms.totalFrame = totalFrame;
    shader.uniforms.currentFrame = currentFrame;
    shader.uniforms.startFrame = startFrame;
    shader.uniforms.endFrame = endFrame;

    let unit = 1;
    for (let key in source.paramsTypes) {
      const value = key in params ? params[key] : source.defaultParams[key];
      if (source.paramsTypes[key] === 'sampler2D') {
        if (!value) {
          console.warn(
            'uniform[' + key + ']: A texture MUST be defined for uniform sampler2D of a texture',
          );
        } else if (typeof value.bind !== 'function') {
          throw new Error('uniform[' + key + ']: A gl-texture2d API-like object was expected');
        } else {
          shader.uniforms[key] = value.bind(unit++);
        }
      } else {
        shader.uniforms[key] = value;
      }
    }
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
}

module.exports = FFFilter;
