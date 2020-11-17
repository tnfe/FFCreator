'use strict';

/**
 * Oblique - Blowing effect post processing
 *
 * @object
 */

module.exports = {
  name: 'Oblique',
  paramsTypes: {bgcolor: 'vec4'},
  defaultParams: {bgcolor: [0, 0, 0, 1]},
  glsl: `
  const float PI = 3.1415927;
  const float seed = 265.5;
  const float rotAngle = PI/4.;
  const float sliceCount = 10.0;

  float random (in vec2 st) { 
    return fract(sin(dot(st.xy,vec2(12.9798,78.323)))*43758.5453234);
  }

  mat2 rot2m(float a){
    float s = sin(a);
    float c = cos(a);
    return mat2(c, -s, s, c);
  }

  float slices(in vec2 p, float count){
    p *= rot2m(rotAngle);
    float x = p.x * count;
    float v = random( vec2(floor(x)) + seed * count * 0.5 );
    return v;
  }

  float randomSlices(in vec2 p){
      float s1 = 1.0, s2 = 0.0;
      for(float i = 1.0; i < sliceCount; ++i){
          float t = slices(p, 2.0 * i);
          
          s1 = min(s1, t);
          s2 = max(s2, t);
      }
      return (s1 + s2) * 0.5;
  }

  vec4 pic(float v, vec2 uv, vec2 sp){
      float m1 = (v + 1.0);
      m1 = 1.0 / pow(m1, 0.25);
      
      float m2 = (2.0 - v);
      m2 = 1.0 / pow(m2, 0.25);
      
      vec2 uv1 = (uv - sp) * m1 + sp;
      vec2 uv2 = (uv - sp) * m2 + sp;
      
      vec4 colA = getFromColor( fract(uv1) );
      vec4 colB = getToColor( fract(uv2) );
      
      return mix(colA, colB, v);
  }

  vec4 transition (vec2 uv) {
      float iTime = progress*PI;
      vec2 iResolution =vec2(1.0);
      float v = randomSlices(uv);
      
      float b = smoothstep(0.0, v, sin(iTime * 0.7));
      vec2 sp = vec2(v, random(vec2(v) ) ) * 0.5;
      
      return pic(b, uv, sp );
  }
`,
  author: 'https://www.shadertoy.com/view/ltVSzd',
};
