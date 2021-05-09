'use strict';

/**
 * Fat - Zoom out glsl code
 *
 * @object
 */

module.exports = {
  name: 'Fat',
  paramsTypes: {},
  defaultParams: {},
  glsl: `
  const float PI = 3.1415927;

  float getDis(float dis){
    dis = pow(dis,0.65);
    return 1.*dis;
  }

  vec4 transition (vec2 uv) {
    vec2 center=vec2(.5);
    vec2 dv=center-uv;
    float k = (3./2.);
    float r = .16;
    float dis=length(dv);
    float sinFactor=((sin(progress*k*PI)-1.)+1.)*r;

    vec2 dv1=normalize(dv);
    vec2 offsets=dv1*sinFactor*getDis(dis);
    vec2 uv2=offsets+uv;
    vec2 uv3=offsets*1.2+uv;

    vec4 c=getToColor(uv);
    vec4 a=getToColor(uv2);
    vec4 b=getFromColor(uv3);

    if(progress<=.0) return getFromColor(uv);
    return mix(b,mix(a,c,progress), progress);
  }
`,
};
