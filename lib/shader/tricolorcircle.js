'use strict';

/**
 * Sunflower - The three-color sphere rotates and spreads post processing
 *
 * Note:
 * Judgment point is inside ellipse
 * (x-h)^2/a^2 + (y-k)^2/b^2 <= 1
 * float a = circle.z; float b = circle.z/radio;
 * (point.x-circle.x)^2/a^2 + (point.y-circle.y)^2/b^2 <= 1
 *
 * @object
 */

module.exports = {
  name: 'TricolorCircle',
  paramsTypes: {},
  defaultParams: {},
  glsl: `
  #define D120 2.09439510239
  #define D240 4.18879020479
      
  bool inEllipse(vec3 circle, vec2 point){
    float a,b;
    if(ratio>1.){
      a = circle.z; 
      b = circle.z*ratio;
    }else{
      a = circle.z / ratio; 
      b = circle.z;
    }
    float aa = a*a;
    float bb = b*b;
    float xx = pow(point.x-circle.x, 2.0);
    float yy = pow(point.y-circle.y, 2.0);
    
    if(xx/aa + yy/bb <= 1.0)
      return true; 
    return false;
  }
      
  vec4 transition (vec2 uv) {
    vec2 iResolution = vec2(1.0);
    vec2 po = uv.xy;
    vec2 sc = vec2(0.5);   
    float r = progress;       //Radius
    float d = 0.3;            //Distance
    float a = progress * 4.0; //Angle progress

    vec3 rC = vec3(sc.x + d * sin(a),         sc.y + d * cos(a),      r);
    vec3 gC = vec3(sc.x + d * sin(a + D120),  sc.y + d * cos(a + D120),   r);
    vec3 bC = vec3(sc.x + d * sin(a + D240),  sc.y + d * cos(a + D240),   r);

    vec4 col1 = getFromColor(uv);
    vec4 col0 = getToColor(uv);

    if(!inEllipse(rC, po))
      col0.r = col1.r;
    if(!inEllipse(gC, po))
      col0.g = col1.g;
    if(!inEllipse(bC, po))
      col0.b = col1.b;
      
    if(progress>=1.0) return col0;
    return col0;
  }
`,
  author: 'https://www.shadertoy.com/view/WdsyRX',
};
