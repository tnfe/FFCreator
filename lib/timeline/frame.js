'use strict';

/**
 * FrameData - A video picture frame data object
 *
 *
 * @class
 */

class FrameData {
  constructor(type) {
    this.type = type;
    this.scenesIndex = [];
    this.progress = 0;
    this.sceneStart = false;
    this.sceneEnd = false;
    this.isFirst = false;
    this.isLast = false;
  }

  getLastSceneIndex() {
    const { scenesIndex } = this;
    if (!scenesIndex.length) return 0;
    return scenesIndex[scenesIndex.length - 1];
  }

  getFirstSceneIndex() {
    const { scenesIndex } = this;
    if (!scenesIndex.length) return 0;
    return scenesIndex[0];
  }
}

module.exports = FrameData;
