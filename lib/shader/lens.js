'use strict';

/**
 * Lens - 45 degree random blind transition effect
 *
 * @object
 */

module.exports = {
  name: 'Lens',
  paramsTypes: {},
  defaultParams: {},
  glsl: `
  #define GRID_SIZE 20.
  const float PI = acos(-1.);

  float screenIn(in vec2 uv) {
    float x = 1. - step(0.5, abs(uv.x-0.5));
    float y = 1. - step(0.5, abs(uv.y-0.5));
    float result = x * y;
    return result;
  }
  mat2 rotate(in float r) { float c=cos(r),s=sin(r); return mat2(c,-s,s,c); }
  float hash(in float v) { return fract(sin(v)*43237.5324); }
  float hash(in vec2 v) { return fract(sin(dot(v, vec2(12.9898, 78.233)))*43237.5324); }

  vec4 transitionFrame(float ratio, in vec2 st) {
    vec2 uv = st;
    uv *= rotate(PI/6.);

    uv.y *= GRID_SIZE;
    vec2 id = vec2(0.);
    id.y = floor(uv.y);
    uv.x *= GRID_SIZE*hash(id.y);
    id.x = id.y + floor(uv.x);

    float angle = sign(hash(id.x)*2.-1.);
    float offset = hash(id.x + id.y)+1.414;

    vec2 uv1 = st;
    vec2 uv2 = st + vec2(angle * offset * ratio, 0.)*rotate(-PI/6.);

    return screenIn(uv2)<1. ? getToColor(uv1) : getFromColor(uv2);
  }

  vec4 transition (vec2 uv) {
    vec2 iResolution = vec2(1.0);
    float iTime = progress*PI/2.0;
    float ratio = smoothstep(0., 1., sin(iTime));
    vec4 video = transitionFrame(ratio, uv);
    vec3 col = video.rgb;
    return vec4(col,1.0);
  }
`,
  author: 'https://www.shadertoy.com/view/wdcSzl',
};
