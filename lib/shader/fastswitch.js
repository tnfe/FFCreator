'use strict';

/**
 * FastSwitch - Up and down dynamic fade cut in
 *
 * @object
 */

module.exports = {
  name: 'FastSwitch',
  paramsTypes: {},
  defaultParams: {},
  glsl: `
  #define PIS 3.141592653589793

  float sineInOut(float t) {
    return -0.5 * (cos(PIS * t) - 1.0);
  }

  vec4 transition (vec2 uv) {
    vec2 iResolution = vec2(1.0);
    float iTime = progress;

    vec4 _currentImage;
    vec4 _nextImage;
    float dispFactor = sineInOut(iTime * 1.);

    float intensity = 0.3;

    vec4 orig1 = getFromColor(uv);
    vec4 orig2 = getToColor(uv);
    _currentImage = getFromColor(vec2(uv.x, uv.y + dispFactor * (orig2.r * intensity)));
    _nextImage = getToColor(vec2(uv.x, uv.y + (1.0 - dispFactor) * (orig1.r * intensity)));

    vec4 finalTexture = mix(_currentImage, _nextImage, dispFactor);

    return finalTexture;
  }
`,
};
