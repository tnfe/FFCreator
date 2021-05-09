'use strict';

/**
 * Magnifier - Water waves spread glsl code
 *
 * @object
 */

module.exports = {
  name: 'Magnifier',
  paramsTypes: {},
  defaultParams: {},
  glsl: `
  const float PI = 3.1415927;
  const float radius = .3;
  const float width = .35;

  float quarticIn(float t) {
      return pow(t, 4.0);
  }

  float parabola( float x, float k ) {
    return pow( 4. * x * ( 1. - x ), k );
  }

  vec4 transition (vec2 uv) {
    vec2 cuv = (uv - vec2(0.5)) + vec2(0.5);
    vec2 start = vec2(0.5,0.5);
    vec2 aspect = vec2(1.);
    float dt = parabola(progress, 1.);
    float time = quarticIn(progress);
    vec4 bg = getFromColor(fract(cuv+time*0.04));
    float prog = progress*0.66 + bg.g * 0.04;
    float circ = 1. - smoothstep(-width, 0.0, radius * distance(start*aspect, cuv*aspect) - prog*(1.+width));
    float intpl = pow(abs(circ), 1.);

    vec4 t1 = getFromColor((cuv - 0.5) * (1.0 - intpl) + 0.5 ) ;
    vec4 t2 = getToColor((cuv - 0.5) * intpl + 0.5 );
    return mix( t1, t2, intpl );
  }
`,
};
