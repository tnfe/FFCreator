'use strict';

const FFClip = require('./lib/core/clip');
const FFScene = require('./lib/node/scene');

const scene = new FFScene({});
scene.parent = { startTime: 0, duration: NaN };

const clip = new FFClip({});
scene.addChild(clip);

clip.conf.duration = 5;
scene.annotate();
console.log('--------');
console.log(clip.startTime, clip.duration, clip.endTime);
// console.log(scene.start);