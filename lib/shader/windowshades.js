'use strict';

/**
 * WindowShades - Variant shutter effect post processing
 *
 * @object
 */

module.exports = {
  name: 'WindowShades',
  paramsTypes: {},
  defaultParams: {},
  glsl: `
  float getSpeed(float t, float speed){
    float d = 0.7*speed;
    float k = 1./(1.-d);
    float b = -1./(1.-d)*d;
    float y = k*t+b; 
    y = clamp(y, 0., 1.);
    return y*y;
  }

  vec4 transition (vec2 uv) {
    vec2 iResolution = vec2(1.0);
    float t = progress;
      
    vec4 result = getToColor(uv);
    vec4 result2 = getToColor(uv);
    vec2 translate = vec2(uv.x,uv.y);
        
    float div = 2.0;
    float num = 20.0;
    float fy = floor(uv.y * num);
    float odd = fy - (div * floor(fy/div));
    float speed = (fy/num);
      
    if( odd == 0.0){
      translate.x = translate.x - getSpeed(t, speed);    
      result = getFromColor(translate);
      if(translate.x<0.0){
        result.rgb = result2.rgb;
      }
    }else{
      translate.x = translate.x + getSpeed(t, speed);    
      result = getFromColor(translate);
      if(translate.x>1.0){
        result.rgb = result2.rgb;
      }
    }
    
    return result;
  }
`,
};
