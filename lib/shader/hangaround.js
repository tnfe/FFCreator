'use strict';

/**
 * HangAround - Transition effect of non-parallel blinds
 *
 * @object
 */

module.exports = {
  name: 'HangAround',
  paramsTypes: {},
  defaultParams: {},
  glsl: `
  vec2 direction = vec2(-1.0, 0.0);
  const float PI = 3.1415927;

  float backIn(float t) {
    return pow(t, 3.0) - t * sin(t * PI);
  }

  float backOut(float t) {
    float f = 1.0 - t;
    return 1.0 - (pow(f, 3.0) - f * sin(f * PI));
  }

  vec4 transition(vec2 uv) {
    for(float i=0.;i<=1.1;i+=1./40.){
      float d = .3;
      float k = 1./d;
      float ds = i*(1.-d)/10.;
      float time = k*(progress-ds);
      time = clamp(time,0.,1.);
      //time = pow(time, .7);
      time = backOut(time);

      vec2 p = uv + time * sign(direction);
      vec2 f = fract(p);
      vec4 color = mix(
        getToColor(f),
        getFromColor(f),
        step(0.0, p.x) * step(p.y, 1.0) * step(0.0, p.x) * step(p.x, 1.0)
      );

      if((1.-uv.y)<=i) return color;
    }
  }
`,
};
