'use strict';

/**
 * Conf - A encapsulated configuration class is used to better manage configuration related
 *
 * ####Example:
 *
 *     const conf = new Conf(conf);
 *     const val = conf.getVal(key);
 *     conf.setVal(key, val);
 *
 * @object
 */
const path = require('path');
const mtempy = require('mtempy');
const Utils = require('../utils/utils');

class Conf {
  constructor(conf = {}) {
    this.conf = conf;

    this.conf.pathId = Utils.genUuid();
    this.copyByDefaultVal(conf, 'crf', 20);
    this.copyByDefaultVal(conf, 'vb', null);
    this.copyByDefaultVal(conf, 'pool', false);
    this.copyByDefaultVal(conf, 'debug', false);
    this.copyByDefaultVal(conf, 'audioLoop', true);
    this.copyByDefaultVal(conf, 'ffmpeglog', false);
    this.copyByDefaultVal(conf, 'preset', 'medium');
    this.copyByDefaultVal(conf, 'cacheFormat', 'raw');
    this.copyByDefaultVal(conf, 'cacheQuality', 80);
    this.copyByDefaultVal(conf, 'defaultOutputOptions', true);

    this.copyFromMultipleVal(conf, 'fps', 'fps', 24);
    this.copyFromMultipleVal(conf, 'width', 'w', 800);
    this.copyFromMultipleVal(conf, 'height', 'h', 450);
    this.copyFromMultipleVal(conf, 'rfps', 'renderFps', 60);
    this.copyFromMultipleVal(conf, 'outputDir', 'dir', path.join('./'));
    this.copyFromMultipleVal(conf, 'cacheDir', 'cacheDir', mtempy.directory());
    this.copyFromMultipleVal(conf, 'output', 'out', path.join('./', `${this.conf.pathId}.mp4`));
    this.copyFromMultipleVal(conf, 'parallel', 'frames', 5);
    this.copyFromMultipleVal(conf, 'highWaterMark', 'size', '1mb');
  }

  /**
   * Get the val corresponding to the key
   * @param {string} key - key
   * @return {any} val
   * @public
   */
  getVal(key) {
    if (key === 'detailedCacheDir') return this.getCacheDir();
    return this.conf[key];
  }

  /**
   * Set the val corresponding to the key
   * @param {string} key - key
   * @param {any} val - val
   * @public
   */
  setVal(key, val) {
    this.conf[key] = val;
  }

  /**
   * Get the width and height in the configuration (add separator)
   * @param {string} dot - separator
   * @retrun {string} 'widthxheight'
   * @public
   */
  getWH(dot = 'x') {
    return this.getVal('width') + dot + this.getVal('height');
  }

  /**
   * Get the cache directory
   * @retrun {string} path
   * @public
   */
  getCacheDir() {
    let cacheDir = this.getVal('cacheDir');
    let pathId = this.getVal('pathId');
    return path.join(cacheDir, pathId);
  }

  copyByDefaultVal(conf, key, defalutVal) {
    this.conf[key] = conf[key] === undefined ? defalutVal : conf[key];
  }

  /**
   * Guarantee that a key must have value
   * @public
   */
  copyFromMultipleVal(conf, key, otherKey, defalutVal) {
    this.conf[key] = conf[key] || conf[otherKey] || defalutVal;
  }

  /**
   * A fake proxy Conf object
   * @public
   */
  static getFakeConf() {
    return fakeConf;
  }
}

const fakeConf = {
  // eslint-disable-next-line
  getVal(key) {
    return null;
  },
  // eslint-disable-next-line
  setVal(key, val) {
    return null;
  },
};

module.exports = Conf;
