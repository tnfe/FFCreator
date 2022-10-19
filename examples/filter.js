const { FFCreator, FFScene, FFFilter, FFText, FilterManager } = require('../index');
const path = require('path');
const { cwd } = require('process');

// register custom filter.
FilterManager.register({
  name: 'Glitch',
  paramsTypes: {
    offset: 'float',
    speed: 'float',
  },
  defaultParams: {
    offset: 0.1,
    speed: 0.15,
  },
  glsl: `precision highp float;
  uniform float offset;
  uniform float speed;

  float random (vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233)))* 43758.5453123);
  }
  float random (float x, float y) {
    return random(vec2(x, y));
  }
  float random (vec2 st ,float min, float max) {
    return min + random(st) * (max - min);
  }
  float random (float x, float y, float min, float max) {
    return random(vec2(x, y), min, max);
  }

  vec4 entry_func (vec2 uv) {
    vec3 color = getTextureColor(uv).rgb;
    float maxOffset = offset / 6.0;
    float flag = floor(currentFrame * speed * 50.0);
    float maxSplitOffset = offset / 2.0;

    for (float i = 0.0; i < 10.0; i += 1.0) {
      float flagOffset = flag + offset;
      float sliceY = random(flagOffset, 1999.0 + float(i));
      float sliceH = random(flagOffset, 9999.0 + float(i)) * 0.25;
      float hOffset = random(flagOffset, 9625.0 + float(i), -maxSplitOffset, maxSplitOffset);
      vec2 splitOff = uv;
      splitOff.x += hOffset;
      splitOff = fract(splitOff);
      if (uv.y > sliceY && uv.y < fract(sliceY+sliceH)) {
        color = getTextureColor(splitOff).rgb;
      }
    }

    vec2 textureOffset = vec2(random(flag + maxOffset, 9999.0, -maxOffset, maxOffset), random(flag, 9999.0, -maxOffset, maxOffset));
    vec2 uvOff = fract(uv + textureOffset);

    float rnd = random(flag, 9999.0);
    if (rnd < 0.33) {
      color.r = texture2D(templateTexture, uvOff).r;
    } else if (rnd < 0.66) {
      color.g = texture2D(templateTexture, uvOff).g;
    } else {
      color.b = texture2D(templateTexture, uvOff).b;
    }

    return vec4(color, 1.0);
  }`,
});

const instance = new FFCreator({
  width: 400,
  height: 360,
  debug: true,
});

instance.setOutput(path.resolve(cwd(), `./Glitch.mp4`));

const scene = new FFScene();
scene.setDuration(2);
scene.setFilter(
  new FFFilter({
    name: 'Glitch',
  }),
);
scene.setTransition('fade', 1);
scene.addChild(
  new FFText({
    text: 'text',
    style: {
      fontSize: 32,
    },
    color: '#0AF0FF',
    x: 40,
    y: 40,
  }),
);
scene.addChild(
  new FFText({
    text: 'Hello World!',
    style: {
      fontSize: 40,
      background: '#040404',
    },
    color: '#AE00DF',
    x: 100,
    y: 200,
  }),
);
instance.addChild(scene);

const scene2 = new FFScene();
scene2.setDuration(2);
scene2.setBgColor('#000000');
scene2.addChild(
  new FFText({
    text: 'All Right!',
    style: {
      fontSize: 48,
    },
    color: '#FFFFFF',
    x: 120,
    y: 120,
  }),
);
instance.addChild(scene2);

instance.start();
