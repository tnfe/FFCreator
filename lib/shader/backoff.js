'use strict';

/**
 * BackOff - Four windows fade out shader code
 *
 * @object
 */

module.exports = {
  name: 'BackOff',
  paramsTypes: {},
  defaultParams: {},
  glsl: `
  float superstep(float a, float x){
    float v = smoothstep(a-0.1,a,x);
    return pow(v, 1.2);
  }

  vec4 transition (vec2 uv) {
    vec2 p=uv.xy/vec2(1.0).xy;
    vec4 a=getFromColor(p);
    vec4 b=getToColor(p);

    if(uv.x<=.5&&uv.y<=.5){
      return mix(a, b, superstep(1.0-p.y,progress));
    }else if(uv.x<=1.&&uv.y<=.5){
      return mix(a, b, superstep(0.0+p.x,progress));
    }else if(uv.x>=.5&&uv.y>=.5){
      return mix(a, b, superstep(0.0+p.y,progress));
    }else{
      return mix(a, b, superstep(1.0-p.x,progress));
    }
  }
`,
};
