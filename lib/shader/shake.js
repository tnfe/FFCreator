'use strict';

/**
 * Shake - Imitate tiktok shake effect post processing
 *
 * @object
 */

module.exports = {
  name: 'Shake',
  paramsTypes: {},
  defaultParams: {},
  glsl: `
  const float PI = 3.1415927;
  float random2d(vec2 n) { 
    return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
  }
  
  float randomRange (in vec2 seed, in float min, in float max) {
    return min + random2d(seed) * (max - min);
  }
  
  float insideRange(float v, float bottom, float top) {
    return step(bottom, v) - step(top, v);
  }
  
  float getSpeed(float progress){
    return pow(progress, 4.);
  }
  
  float AMT = 0.2; //0 - 1 glitch amount
  float SPEED = 0.6; //0 - 1 speed
     
  vec4 transition (vec2 p) {
    float iTime = progress*PI;
    vec2 iResolution =vec2(1.0);
    
    float time = floor(iTime * SPEED * 60.0);  
    vec2 uv = p.xy / iResolution.xy;
    vec3 outCol = getToColor(uv).rgb;
    
    float maxOffset = AMT/2.0;
    for (float i = 0.0; i < 10.0 * .45; i += 1.0) {
      float sliceY = random2d(vec2(time , 2345.0 + float(i)));
      float sliceH = random2d(vec2(time , 9035.0 + float(i))) * 0.25;
      float hOffset = randomRange(vec2(time , 9625.0 + float(i)), -maxOffset, maxOffset);
      vec2 uvOff = uv;
      uvOff.x += hOffset;
      if (insideRange(uv.y, sliceY, fract(sliceY+sliceH)) == 1.0 ){
        outCol = getToColor(uvOff).rgb;
      }
    }
  
    float maxColOffset = AMT/6.0;
    float rnd = random2d(vec2(time , 9545.0));
    vec2 colOffset = vec2(randomRange(vec2(time, 9545.0),-maxColOffset,maxColOffset), randomRange(vec2(time , 7205.0),-maxColOffset,maxColOffset));
    if (rnd < 0.33){
      outCol.r = getToColor(uv + colOffset).r;
      
    }else if (rnd < 0.66){
      outCol.g = getToColor(uv + colOffset).g;
    } else{
      outCol.b = getToColor(uv + colOffset).b;  
    }
    
    vec4 fromColor = getFromColor(p);
    vec4 toColor = vec4(outCol,1.0);
    
    if(progress>=1.) return getToColor(p);
    return mix(fromColor,toColor,getSpeed(progress));
  }
`,
};
