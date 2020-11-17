'use strict';

/**
 * Sunflower - Imitating a sunflower effect post processing
 *
 * @object
 */

module.exports = {
  name: 'Sunflower',
  paramsTypes: {},
  defaultParams: {},
  glsl: `
  const float PI = 3.1415927;
  const float NUM = 8.;

  float getStep(vec2 p, float speed){
    float circPos = atan(p.y - 0.5, p.x - 0.5) + progress * speed;
    float modPos = mod(circPos, PI / NUM);
    float signed = sign(progress - modPos);
    return smoothstep(signed-.2,signed, 0.5);
  }

  vec4 transition(vec2 uv) {
    vec2 p = uv.xy / vec2(1.0).xy;
    vec2 center = vec2(.5);
    float len = length(p-center);
    for(float i=0.;i<=1.;i+=1./20.){
      vec4 color = mix(getToColor(p), getFromColor(p), getStep(p, (1.-i)*6.));
      if(len<i) return color;
    }
  }
`,
};
