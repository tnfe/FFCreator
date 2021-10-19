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
const FFAudio = require('../audio/audio');
const FFLogger = require('../utils/logger');
const CanvasUtil = require('../utils/canvas');
const { createCanvas, Sprite, Texture } = require('inkpaint');
const FFTransition = require('../animate/transition');

class FFScene extends FFCon {
  constructor(conf = {}) {
    super({ type: 'scene', ...conf });

    this.audios = [];
    this.background = null;
    this.duration = 10;
    this.frameCursor = 0;
    this.state = 'start';
    this.pathId = Utils.genUuid();

    this.setTransition('fade', 0);
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

    this.transition = new FFTransition({ name, duration, params });
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
  setBgColor(color = '#000000') {
    if (!this.bgCanvas) {
      const { bgSize = 400 } = this.conf;
      this.bgCanvas = createCanvas(bgSize, bgSize);
    }
    CanvasUtil.fillRect({ canvas: this.bgCanvas, color });

    if (this.background) this.display.removeChild(this.background);
    this.background = new Sprite(Texture.fromCanvas(this.bgCanvas));
    this.display.addChildAt(this.background, 0);
  }

  /**
   * Fast approximate anti-aliasing (FXAA) is a screen-space anti-aliasing algorithm
   * @param {boolean} fxaa anti-aliasing (FXAA)
   * @public
   */
  setFXAA(fxaa) {
    this.display.fxaa = fxaa;
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
   * Reset the size of the backgroud image
   * @private
   */
  resizeBackground() {
    const { background } = this;
    if (!background) return;
    const width = this.rootConf('width');
    const height = this.rootConf('height');
    background.width = width;
    background.height = height;
  }

  /**
   * Start rendering
   * @public
   */
  start() {
    super.start();
    this.resizeBackground();
    forEach(this.children, child => child.start());
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
    const fps = this.rootConf('fps');
    return Math.floor(fps * this.duration);
  }

  /**
   * Get the number of frames of transition animation
   * @private
   */
  getTransFramesNum() {
    const fps = this.rootConf('fps');
    return Math.floor(fps * this.transition.duration);
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

  destroyAudios() {
    forEach(this.audios, audio => audio.destroy());
    this.audios.length = 0;
  }

  destroy() {
    this.destroyAudios();
    this.transition.destroy();
    this.transition = null;
    this.background = null;
    this.bgCanvas = null;
    super.destroy();
  }
}

module.exports = FFScene;
