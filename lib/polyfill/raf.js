'use strict';

/**
 * fixRequestAnimationFrame - Patch requestAnimationFrame function under nodejs
 *
 * @function
 */

const fixRequestAnimationFrame = () => {
  let lastTime = 0;

  global.requestAnimationFrame = callback => {
    const currTime = new Date().getTime();
    const timeToCall = Math.max(0, Math.round(16.666 - (currTime - lastTime)));
    const id = setTimeout(() => {
      callback(currTime + timeToCall);
    }, timeToCall);

    lastTime = currTime + timeToCall;
    return id;
  };

  global.cancelAnimationFrame = id => clearTimeout(id);
};

module.exports = fixRequestAnimationFrame;
