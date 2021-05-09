'use strict';

/**
 * ShaderManager - A video transition shader manager (post-processing).
 *
 * ####Example:
 *
 *     const source = ShaderManager.getShaderByName(name);
 *
 *
 * ####Note:
 *     - Commonly used glsl function remarks
 *     clamp(x,a,b) - [a,b]
 *     fract(x) - 2.12312->0.12312
 *     mix(a,b,x) - x(1-a)+y*a
 *     step(a,x) - x<a =0 x>a =1
 *     // https://thebookofshaders.com/glossary/?search=smoothstep
 *     smoothstep(a,b,x) - x<a =0 x>b =1 [a,b] =3x^2-2x^3
 *     vec2 uv = fragCoord.xy/iResolution.xy [0-1] - transition(vec2 p)
 *
 * @object
 */

const sample = require('lodash/sample');
const forEach = require('lodash/forEach');
const transitions = require('gl-transitions');

const Fat = require('./fat');
const Lens = require('./lens');
const Slice = require('./slice');
const Shake = require('./shake');
const Stretch = require('./stretch');
const BackOff = require('./backoff');
const Fluidly = require('./fluidly');
const Oblique = require('./oblique');
const Windows4 = require('./windows4');
const Tetrapod = require('./tetrapod');
const Colorful = require('./colorful');
const MoveLeft = require('./moveleft');
const Sunflower = require('./sunflower');
const ZoomRight = require('./zoomright');
const WaterWave = require('./waterwave');
const Radiation = require('./radiation');
const Quicksand = require('./quicksand');
const Magnifier = require('./magnifier');
const FastSwitch = require('./fastswitch');
const HangAround = require('./hangaround');
const CircleCrop = require('./circlecrop');
const WindowShades = require('./windowshades');
const TricolorCircle = require('./tricolorcircle');

const extraTransitions = [
  Fat,
  Lens,
  Shake,
  Slice,
  Stretch,
  Fluidly,
  BackOff,
  Oblique,
  MoveLeft,
  Windows4,
  Colorful,
  Magnifier,
  Tetrapod,
  Sunflower,
  ZoomRight,
  Radiation,
  WaterWave,
  HangAround,
  FastSwitch,
  WindowShades,
  CircleCrop,
  TricolorCircle,
  Quicksand,
];

/**
 * ShaderManager
 */
const ShaderManager = {
  /**
   * Get the shader source code by name
   * @param {string} name - shader name
   * @return {string} shader source
   * @public
   */
  getShaderByName(name) {
    let shader = this.getFromArr(name, extraTransitions);
    if (!shader) shader = this.getFromArr(name, transitions);
    if (!shader && name.toLowerCase() == 'random') shader = this.getRandomShader();
    if (!shader) shader = this.getFromArr('fade', transitions);

    return shader;
  },

  getFromArr(name, arr) {
    let shader;
    forEach(arr, trans => {
      if (trans.name.toLowerCase() == name.toLowerCase()) shader = trans;
    });

    return shader;
  },

  getRandomShader() {
    return sample(transitions);
  },
};

module.exports = ShaderManager;
