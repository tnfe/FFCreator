'use strict';

/**
 * Fluidly - Simulate flip book switching effect
 *
 * @object
 */

module.exports = {
  name: 'Fluidly',
  paramsTypes: {},
  defaultParams: {},
  glsl: `
  #define PI 3.14159265359
  vec2 accel = vec2(0.01);

  vec2 mirror(vec2 v) {
    vec2 m = mod(v, 2.0);
    return mix(m, 2.0 - m, step(1.0, m));
  }

  float tri(float p) {
    return mix(p, 1.0 - p, step(0.5, p))*2.0;
  }

  vec4 transition (vec2 uv) {
    vec2 iResolution = vec2(1.0);
    float iTime = progress;

    vec2 vuv1 = uv - 0.5;
    vuv1 *= vec2(1.,iResolution.y/iResolution.x);
    vuv1 += 0.5;

    float p = pow(min(cos(PI * (mod(iTime,2.)-1.) / 2.), 1. - abs(mod(iTime,2.) - 1.)  ), 1. );
    float delayValue = p*7. - uv.y*2. + uv.x - 2.0 ;
    delayValue = clamp(delayValue,0.,1.);

    vec2 acc = vec2(0.5,2.);
    vec2 translateValue = p + delayValue * acc;
    vec2 translateValue1 = vec2(-0.5,1.)* translateValue;
    vec2 translateValue2 = vec2(-0.5,1.) * (translateValue - 1.0 - acc);

    vec2 w = sin( sin(iTime)*vec2(0,0.3) + uv*vec2(0,4.)) * vec2(0, 0.5);
    vec2 xy = w*(tri(p)*0.5 + tri(delayValue)*0.5);

    vec2 uv1 = vuv1 + translateValue1 + xy;
    vec2 uv2 = vuv1 + translateValue2 + xy;

    vec4 t0 = getFromColor(mirror(uv1));
    vec4 t1 = getToColor(mirror(uv2));
    return mix(t0, t1, delayValue);
  }
`,
  author: 'https://www.shadertoy.com/view/wsjGWW',
};
