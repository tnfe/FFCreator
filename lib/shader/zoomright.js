'use strict';

/**
 * ZoomRight - Paper effect post processing
 *
 * @object
 */

module.exports = {
  name: 'ZoomRight',
  paramsTypes: {},
  defaultParams: {},
  glsl: `
  const float PI = 3.1415927;

  float triangle(float x) {
    return 1.0 - abs(fract(x) - 0.5) * 2.0;
  }
  float smootherstep(float x) {
    return x * x * x * (x * (x * 6.0 - 15.0) + 10.0);
  }

  float endPosition(float radius, float offset, float rollPosition) {
    float rollLength = radius * 3.141592 / 2.0;
    float onRoll = min(offset + 1.0 - rollPosition, rollLength);
    return rollPosition + radius * sin(onRoll / radius);
  }

  float findRollPosition(float radius, float offset) {
    float lower = 1.0 - radius;
    float upper = 1.0;

    float mid = 0.0;
    for(int i = 0; i < 16; i++) {
      mid = (upper + lower) / 2.0;
      float position = endPosition(radius, offset, mid);
      if(position > 1.0) {
        upper = mid;
      } else {
        lower = mid;
      }
    }
    return mid;
  }

  vec4 transition (vec2 uv) {
      float iTime = progress*PI;
      vec2 iResolution =vec2(1.0);
      vec2 p = uv;
      
      float t = iTime / 5.0;
      float offset = smootherstep(triangle(t));

      float radius = 0.3;
      float flatLength = 1.0 - radius;
      float rollLength = radius * 3.141592 / 2.0;
      float fullLength = flatLength + rollLength;

      offset *= fullLength;
      float rollPosition = findRollPosition(radius, offset);
      float shadow;
      if(p.x < rollPosition) {
          uv.x -= offset;
          shadow = 1.0;
      } else {
          float a = asin((p.x - rollPosition) / radius);
          uv.x = a * radius - offset + rollPosition;
          uv.y = (p.y - 0.5) / (0.4 * cos(a) + 0.6) + 0.5;
          shadow = 0.5 * cos(a) + 0.5;
      }
      
      vec4 fromColor = getFromColor(uv);
      fromColor *= step(-uv.x, 0.0);
      fromColor *= step(-uv.y, 0.0);
      fromColor *= step(uv.y, 1.0);
      fromColor *= shadow;
      
      vec4 result = fromColor;
      vec4 toColor = getToColor(p);
      
      if(result.a<0.3) result = toColor;
      if(progress>1.) return toColor;
      return result;
  }
`,
  author: 'https://www.shadertoy.com/view/wssczB',
  createdAt: 'Mon, 12 Jun 2020 12:52:34 +0800',
  updatedAt: 'Mon, 12 Jun 2020 12:52:34 +0800',
};
