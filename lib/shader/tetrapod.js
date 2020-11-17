'use strict';

/**
 * Sunflower - Imitating a sunflower effect post processing
 *
 * @object
 */

module.exports = {
  name: 'Tetrapod',
  paramsTypes: {},
  defaultParams: {},
  glsl: `
  #define PI 3.141592653589793
  const float divisions=20.;
  
  float sfract(float time){
    if(time>=1.) return 1.;
    return fract(time);
  }
  
  vec4 transition (vec2 uv) {
    float iTime = progress;
    vec2 iResolution =vec2(1.0);
    vec2 st = uv;
      
    float t = sfract(iTime)*3.-1.;
    vec2 f_st = fract(st*divisions);
    vec2 i_st = floor(st*divisions);
    f_st -= 0.5;
    t = (1.-t+(i_st.x/divisions) - (1.-i_st.y/divisions));
    float fx = smoothstep(t-.2, t+.3, 1.-abs(f_st.x+f_st.y));
    float fy = smoothstep(t-.2, t+.3, 1.-abs((f_st.x)-(f_st.y)));
    float a = fx*fy;
      
    vec4 toColor = getToColor(st)*a;
    vec4 fromColor = getFromColor(uv);
    fromColor.a = 1.-iTime;
      
    if(progress>=1.) return getToColor(uv);
    return mix(fromColor, toColor , progress*progress);
  }
`,
};
