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
const CanvasUtil = require('../utils/canvas');
const { createCanvas, Sprite, Texture } = require('../../inkpaint/lib/index');

class FFScene extends FFCon {
  constructor(conf = {}) {
    super({ type: 'scene', ...conf });

    this.audios = [];
    this.background = null;
    this.defaultDuration = NaN;
    this.frameCursor = 0;
    this.state = 'start';
    this.pathId = Utils.genUuid();
    this.setBgColor(conf.color || conf.bgcolor || conf.background);
  }

  annotate() {
    const maxAbsEnd = Math.max(...this.allNodes.map(x => x.realAbsEndTime));
    this.defaultDuration = maxAbsEnd - this.absStartTime;
    super.annotate();
    this.resizeBackground();
  }

  get default() {
    return {
      startTime: super.default.startTime,
      duration: this.defaultDuration,
    }
  }

  /**
   * Set the time the scene stays in the scree
   * @param {number} duration - the time the scene
   * @public
   */
  setDuration(duration) {
    this.conf.duration = duration;
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

  destroy() {
    this.background = null;
    this.bgCanvas = null;
    super.destroy();
  }
}

module.exports = FFScene;
