'use strict';

/**
 * Slice - Reverse direction blinds effect post processing
 *
 * @object
 */

module.exports = {
  name: 'Slice',
  paramsTypes: {},
  defaultParams: {},
  glsl: `
  float NUM = 18.0;
  float PI = 3.1415927;
  vec2 direction = vec2(1.0, .0);

  float normalSine(float value) {
    return (sin(value) + 1.0) / 2.0;
  }

  float rand(float n){
    float num = 100.;
    float y = floor(n * num);
    y/=num;
    return fract(sin(y) * 43758.5453123);
  }

  float checker(vec2 uv) {
    float div = 2.0;
    float fy = floor(uv.x * NUM);
    float odd = fy - (div * floor(fy/div));
    return sign(odd);
  }

  vec4 transition (vec2 uv) {
    float iTime = (progress - .5)*PI;
    vec2 iResolution =vec2(1.0);

    float factor = 1.0 - ( 2.0 * checker(uv));
    vec2 offsetDirection = direction * factor;
    vec2 offset = offsetDirection * normalSine(iTime);
    vec2 wrapped = fract(uv + offset);
    
    vec4 fromColor = getFromColor(wrapped);
    vec4 toColor = getToColor(wrapped);
    return mix(fromColor,toColor,progress);
  }
`,
};
