'use strict';

/**
 * MoveLeft - Move left to disappear
 *
 * @object
 */

module.exports = {
  name: 'MoveLeft',
  paramsTypes: {},
  defaultParams: {},
  glsl: `
  #define PI 3.141592653589793
  #define HALF_PI 1.5707963267948966
    
  float pows(float p){
    return pow(p, 1.6);
  }
  
  float quarticInOut(float t) {
    return t < 0.5
      ? +8.0 * pow(t, 4.0)
      : -8.0 * pow(t - 1.0, 4.0) + 1.0;
  }
  
  float backIn(float t) {
    return pow(t, 3.0) - t * sin(t * PI);
  }
  
  vec4 blurToColor(vec2 uv, float blurSize){
    float invAspect = 1.;
    vec4 col = vec4(0.);
    for(float index = 0.; index < 30.; index++){
      vec2 bl = vec2((index/9. - 0.5) * blurSize * invAspect, 0.);
      vec2 newuv = uv + bl;
      col += getToColor(newuv);
    }
    col = col / 30.;
    return col;
  }
  
  vec4 transition (vec2 uv) {
    vec2 iResolution =vec2(1.0);
    vec2 pos = uv;
    float d = quarticInOut(1.-progress);
    pos.x = uv.x + d;
    //pos.y = zoomIn(uv.y, progress);
    //pos.x = zoomOut(pos.x, progress);
  
    vec4 result;
    vec4 col1 = getFromColor(uv);
    vec4 col2 = blurToColor(pos, .2*d);
  
    result = col2;
    if(uv.x> 1.0 - d){
      result = col1;
    }
    if(pos.x<0.){
      result = col1;
    }
    if(progress>=1.0){
      return getToColor(uv);
    }
  
    return result;
  }
`,
};
