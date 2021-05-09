'use strict';

/**
 * Colorful - Color circle zoom bubble effect shader code
 *
 * @object
 */

module.exports = {
  name: 'Colorful',
  paramsTypes: {},
  defaultParams: {},
  glsl: `
  #define HALF_PI 1.57079632679
  vec4 colors[6];
  vec2 center = vec2(0.5, 0.5);

  float aasin(float t){
    float nt = t;
    if(nt<=.0) nt = 0.;
    if(nt>=1.) nt = 1.;
    return asin(nt)/HALF_PI;
  }

  vec4 getRgb(float r, float g, float b){
    float v255 = 255.0;
    return vec4(r/v255, g/v255, b/v255, 1.);
  }

  vec2 resetSize(vec2 size){
    vec2 nsize = size;
    if(ratio>1.){
      nsize.y = size.y / ratio;
    }else{
      nsize.x = size.x * ratio;
    }

    return nsize;
  }

  vec4 transition (vec2 uv) {
    colors[0]= getRgb(255., 212., 50.);
    colors[1]= getRgb(252., 92., 102.);
    colors[2]= getRgb(70., 170., 240.);
    colors[3]= getRgb(57., 105., 214.);
    colors[4]= getRgb(137., 84., 208.);
    colors[5]= getToColor(uv);

    float num = 6.0;
    float delay = .3;
    vec2 iResolution = vec2(1.0);
    float tha = progress *(1. + (num-1.) * delay);

    vec2 centerPx = iResolution.xy * center;
    vec2 ncenterPx = resetSize(centerPx);
    vec2 nuv = resetSize(uv);
    vec2 dis = nuv - ncenterPx;
    float dist = length(dis) / length(ncenterPx);

    vec4 color = getFromColor(uv);
    for(int i = 0; i < 6; i+=1) {
      float mixRatio = smoothstep(dist-0.015, dist, aasin(tha-delay*float(i)));
        color = mix(color, colors[i], mixRatio);
    }

    if(progress<=0.) return getFromColor(uv);
    return color;
  }
`,
};
