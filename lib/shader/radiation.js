'use strict';

/**
 * Radiation - Water ripple effect post processing
 *
 * @object
 */

module.exports = {
  name: 'Radiation',
  paramsTypes: {},
  defaultParams: {},
  glsl: `
  #define MPI 3.14159265
  float cprogress;
  float randomSeed;
  float PHI = 1.61803398874989484820459; 
      
  float LinearTween(float t, float start, float end){
    return t * start + (1. - t) * end;
  }
      
  float quadraticEaseIn(float t, float start, float end){
    return LinearTween(t * t, start, end);
  }
      
  vec4 radialWiggle(vec2 uv){
      vec2 center = vec2(0.5,0.5);
      vec2 toUV = uv - center;
      float distanceFromCenter = length(toUV);
      vec2  normToUV = toUV / distanceFromCenter;
      float angle = (cos(MPI/2.0*cprogress) + MPI) / (0.2 * MPI);
      float offset1 = getFromColor(vec2(angle, fract(cprogress/3. + distanceFromCenter/5. + randomSeed))).x * 3.0 - 1.0;
      float offset2 = offset1 * 2.0 * min(0.3, (1.-cprogress)) * distanceFromCenter;
      offset1 = offset1 * 2.0 * min(0.3, cprogress) * distanceFromCenter;
      
      vec4 c1 = getToColor(fract(center + normToUV * (distanceFromCenter + offset1)));
      vec4 c2 = getFromColor(fract(center + normToUV * (distanceFromCenter + offset2)));
      return mix(c1, c2, cprogress);
  }
      
  vec4 transition (vec2 uv) {
    vec2 iResolution = vec2(1.0);
    randomSeed = MPI ;
    cprogress  = quadraticEaseIn(progress, 0.0, 1.0);
    return radialWiggle(uv);
  }
`,
};
