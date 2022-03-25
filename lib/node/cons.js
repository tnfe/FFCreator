'use strict';

/**
 * FFCon - display object container.
 *
 * ####Example:
 *
 *     class FFScene extends FFCon
 *
 * @class
 */
const FFClip = require('../core/clip');
const FFAudio = require('../audio/audio');
// const GLUtil = require('../utils/gl');
const Utils = require('../utils/utils');
const forEach = require('lodash/forEach');
const { Container, ProxyObj } = require('../../inkpaint/lib/index');

class FFCon extends FFClip {

  /**
   * Create display object
   * @private
   */
  createDisplay() {
    this.display = new Container();
    this.display.sortableChildren = true;
  }

  /**
   * Add the audio by config
   * @param {object|FFAudio} args - audio conf object
   * @public
   */
  addAudio(args) {
    this.addChild(args instanceof FFAudio ? args : new FFAudio(args));
  }

  addDisplayChild(childDisplay) {
    if (childDisplay.parent === this.display
       && this.display.children.includes(childDisplay)) {
      return;
    }

    this.display.addChild(childDisplay);
  }

  removeDisplayChild(childDisplay) {
    this.display.removeChild(childDisplay);
  }
}

module.exports = FFCon;
