'use strict';

/**
 * Windows4 - Four windows open effect post processing
 *
 * @object
 */

module.exports = {
  name: 'Windows4',
  paramsTypes: {},
  defaultParams: {},
  glsl: `
  #define PI 3.141592653589793

  float superstep(float a, float x){
    float v = smoothstep(a-0.1,a,x);
    return pow(v, 1.2);
  }
  
  float quarticInOut(float t) {
    return t < 0.5
      ? +8.0 * pow(t, 4.0)
      : -8.0 * pow(t - 1.0, 4.0) + 1.0;
  }
  
  float backOut(float t) {
    float f = t < 0.5
      ? 2.0 * t
      : 1.0 - (2.0 * t - 1.0);
  
    float g = pow(f, 3.0) - f * sin(f * PI);
  
    return t < 0.5
      ? 0.5 * g
      : 0.5 * (1.0 - g) + 0.5;
  }
  
  vec4 getColor(vec2 uv, vec2 direction){
    vec2 p = uv + quarticInOut(progress) * sign(direction);
    vec2 f = fract(p);
    
    return mix(
      getToColor(f),
      getFromColor(f),
      step(0.0, p.y) * step(p.y, 1.0) * step(0.0, p.x) * step(p.x, 1.0)
    );
  }
  
  vec4 transition (vec2 uv) {
    if(uv.x<=.5&&uv.y<=.5){
      return getColor(uv, vec2(0., 1.));
    }else if(uv.x<=1.&&uv.y<=.5){
      return getColor(uv, vec2(-1., 0.));
    }else if(uv.x>=.5&&uv.y>=.5){
      return getColor(uv, vec2(0., -1.));
    }else{
      return getColor(uv, vec2(1., 0.));
    }
  }
`,
};
