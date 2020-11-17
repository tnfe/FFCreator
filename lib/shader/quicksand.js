'use strict';

/**
 * Quicksand - Blowing effect post processing
 *
 * @object
 */

module.exports = {
  name: 'Quicksand',
  paramsTypes: {},
  defaultParams: {},
  glsl: `
  #define M_PI 3.1415926535897932384626433832795

  vec4 transition (vec2 uv) {
    vec4 color1 = getFromColor(uv+(getToColor(uv).rb)*progress);
    return mix(color1, getToColor(uv), progress);
  }
`,
};
