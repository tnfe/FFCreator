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
    this.sceneOver = false;
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

  getPrevSceneIndex() {
    const { scenesIndex } = this;
    const index = this.getFirstSceneIndex();

    if (scenesIndex.length >= 2) return index;
    return index - 1;
  }
}

module.exports = FrameData;
