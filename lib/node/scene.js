'use strict';

/**
 * FFScene - Scene component, a container used to load display object components.
 *
 * ####Example:
 *
 *     const scene = new FFScene();
 *     scene.setBgColor("#ffcc00");
 *     scene.setDuration(6);
 *     creator.addChild(scene);
 *
 * @class
 */
const FFCon = require('./cons');
const Utils = require('../utils/utils');
const forEach = require('lodash/forEach');
const Frames = require('../utils/frames');
const FFAudio = require('../audio/audio');
const FFLogger = require('../utils/logger');
const FFTransition = require('../animate/transition');

class FFScene extends FFCon {
  constructor(conf = {}) {
    super({type: 'scene', ...conf});

    this.audios = [];
    this.duration = 10;
    this.frameCursor = 0;
    this.state = 'start';
    this.pathId = Utils.uid();
    this.frames = new Frames();

    this.setTransition('fade', 600);
    this.setBgColor(conf.color || conf.bgcolor || conf.background);
  }

  /**
   * Set scene transition animation
   * @param {string|object} name - transition animation name or animation conf object
   * @param {number} duration - transition animation duration
   * @param {object} params - transition animation params
   * @public
   */
  setTransition(name, duration, params) {
    if (typeof name === 'object') {
      if (duration === undefined) {
        name = name.name;
        duration = name.duration;
        params = name.params;
      } else {
        FFLogger.error({
          pos: 'FFScene::setTransition',
          error: 'The first parameter is not of type object.',
        });
      }
    }

    this.transition = new FFTransition({name, duration, params});
  }

  /**
   * Add the background music of the scene
   * @param {object} args - music conf object
   * @public
   */
  addAudio(args) {
    const audio = new FFAudio(args);
    this.audios.push(audio);
  }

  /**
   * Set the time the scene stays in the scree
   * @param {number} duration - the time the scene
   * @public
   */
  setDuration(duration) {
    this.duration = duration;
  }

  /**
   * Set background color
   * @param {string} bgcolor - background color
   * @public
   */
  setBgColor(bgcolor = '#000000') {
    this.display.attr({bgcolor});
  }

  /**
   * Get the real stay time of the scene
   * @return {number} stay time of the scene
   * @public
   */
  getRealDuration(noRransition = true) {
    if (!this.transition) return this.duration;

    let transition = 0;
    if (noRransition) transition = this.transition.duration;
    return Math.max(0, this.duration - transition);
  }

  getFile() {
    return this.filepath;
  }

  /**
   * Start rendering
   * @public
   */
  start() {
    super.start();
    forEach(this.children, child => child.start());
  }

  /**
   * Add frames to the scene
   * @param {number} index - frame index
   * @param {buffer} buffer - frame buffer value
   * @public
   */
  pushFrame(index, buffer) {
    this.frames.add(index, buffer);
  }

  /**
   * Run to the next frame
   * @public
   */
  nextFrame() {
    this.frameCursor++;
    return this.frameCursor;
  }

  /**
   * Determine if the last frame is reached
   * @public
   */
  frameIsEnd() {
    const total = this.getFramesNum();
    if (this.frameCursor == total && this.state !== 'end') {
      this.state = 'end';
      return true;
    }

    return false;
  }

  /**
   * Determine if the last frame is over
   * @public
   */
  frameIsOver() {
    const total = this.getFramesNum();
    if (this.state == 'end') return true;
    if (this.frameCursor > total) return true;
    return false;
  }

  /**
   * Get the total number of frames
   * @private
   */
  getFramesNum() {
    const rfps = this.rootConf('rfps');
    return rfps * this.duration;
  }

  /**
   * Get the number of frames of transition animation
   * @private
   */
  getTransFramesNum() {
    const rfps = this.rootConf('rfps');
    return Math.floor(rfps * this.transition.duration);
  }

  /**
   * Release gl memory
   * @private
   */
  resetGL() {
    const renderer = this.display.renderer;
    renderer.clear();
    // const gl = this.display.gl;
    // GLReset(gl)();
  }

  deleteChildrenTexture() {
    for (let i = this.display.children.length - 1; i >= 0; i--) {
      const node = this.display.children[i];
      if (node.textureImage) {
        const layer = this.display;
        layer.deleteTexture(node.textureImage);
      }
    }
  }

  destroy() {
    forEach(this.audios, audio => audio.destroy());
    this.audios.length = 0;
    this.resetGL();
    this.deleteChildrenTexture();
    this.frames.destroy();
    this.transition.destroy();
    super.destroy();
  }
}

module.exports = FFScene;
