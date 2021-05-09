'use strict';

/**
 * CircleCrop - Circle zoom effect shader code
 *
 * @object
 */

module.exports = {
  name: 'CircleCrop',
  paramsTypes: { bgcolor: 'vec4' },
  defaultParams: { bgcolor: [0, 0, 0, 1] },
  glsl: `
  uniform vec4 bgcolor; // = vec4(0.0, 0.0, 0.0, 1.0)

  vec2 ratio2 = vec2(1.0, 1.0 / ratio);
  float s = pow(2.0 * abs(progress - 0.5), 3.0);

  vec4 transition(vec2 p) {
    float dist = length((vec2(p) - 0.5) * ratio2);

    return mix(
      progress < 0.5 ? getFromColor(p) : getToColor(p),
      bgcolor,
      smoothstep(s, s+0.01, dist)
    );
  }
`,
};
