'use strict';

/**
 * Stretch - Stretch to both sides in the middle post processing
 *
 * @object
 */

module.exports = {
  name: 'Stretch',
  paramsTypes: {},
  defaultParams: {},
  glsl: `
  const float PI = 3.1415927;
  float quarticInOut(float t) {
    return t < 0.5? +8.0 * pow(t, 4.0): -8.0 * pow(t - 1.0, 4.0) + 1.0;
  }

  float hash(float n) { 
    return fract(sin(n) * 1e4); 
  }
  float hash(vec2 p) { 
    return fract(1e4 * sin(17.0 * p.x + p.y * 0.1) * (0.1 + abs(sin(p.y * 13.0 + p.x)))); 
  }
    
  float hnoise(vec2 x) {
    vec2 i = floor(x);
    vec2 f = fract(x);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }
    
  vec4 transition (vec2 uv) {
    vec2 newUv = (uv - vec2(0.5)) + vec2(0.5);
    float hn = hnoise(newUv.xy  / 10.0); 
    vec2 d = vec2(0.,normalize(vec2(0.5,0.5) - newUv.xy).y);
    float time = quarticInOut(progress);
    vec2 uv1 = newUv + d * time / 5.0 * (1.0 + hn / 2.0);
    vec2 uv2 = newUv - d * (1.0 - time) / 5.0 * (1.0 + hn / 2.0);

    return mix(getFromColor(uv1), getToColor(uv2), time);
  }
`,
};
