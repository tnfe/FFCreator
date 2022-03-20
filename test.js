'use strict';

const FFClip = require('./lib/node/clip');
const FFScene = require('./lib/node/scene');

const clip = new FFClip({
    duration: 2,
});
clip.prevSibling = {
    end: 5,
}
clip.parent = {
    start: 0,
    duration: 10,
}
const scene = new FFScene();

console.log(clip.start, clip.duration, clip.end);
// console.log(scene.start);