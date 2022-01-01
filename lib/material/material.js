'use strict';

/**
 * Material - A abstract material base class
 * 素材类，设计的目的是把原始素材的【时间/画面】处理封装起来，供外部使用
 * 比如：视频素材，可以用ss/to做时间上的裁剪，也可以用rect做画面上的裁剪
 *      外面使用的时候，就直接用处理过的素材，不需要再考虑时间、空间上的偏移(offset)
 *
 * @class
 */

const min = require('lodash/min');
const path = require('path');
const DateUtil = require('../utils/date');
const { Rectangle } = require('inkpaint');
const { isBrowser } = require("browser-or-node");

const { nodeRequire } = require('../utils/utils');
const FS = nodeRequire('../utils/fs');

if (isBrowser) {
  Object.defineProperty(HTMLMediaElement.prototype, 'playing', {
    get: function(){
        return !!(this.currentTime > 0 && !this.paused && !this.ended && this.readyState > 2);
    }
  })
}

class Material {
  static DEFAULT_TIME = -1;
  static AUDIOS = [];
  static VIDEOS = [];
  static MAIN_PLAYER;

  static MAIN_DELAY() {
    if (!Material.MAIN_PLAYER || !Material.MAIN_PLAYER.player().playing
       || Material.MAIN_PLAYER.parent?.constructor.name !== 'FFScene') {
      Material.MAIN_PLAYER = Material.PLAYER(Material.VIDEOS) || Material.PLAYER(Material.AUDIOS);
    }
    return Material.MAIN_PLAYER ? (Material.MAIN_PLAYER.delay() * 1000) >> 0 : 0;
  }

  static PLAYER(players) {
    for (let i = 0; i < players.length; i++) {
      if (players[i].player().playing) return players[i];
    }
  }

  constructor(conf) {
    this.creator = null;
    this.info = {};
    this.path = '';
    this.start = Material.DEFAULT_TIME; // ss
    this.end = Material.DEFAULT_TIME; // to
    this.length = 0; // orig material length in time (seconds)
    this.fps = 30; // target fps
    this.duration = 0; // target container duration (seconds)
    this.parseConf(conf);
  }

  parseConf(conf) {
    this.conf = conf;
    this.type = conf.type;
    this.path = conf.src || conf.path || conf.image || conf.url;
    this.start = this.parseTimeNumber(conf.ss);
    this.end = this.parseTimeNumber(conf.to);
  }

  parseTimeNumber(time) {
    if (typeof time === 'string' && time.includes(':')) return DateUtil.hmsToSeconds(time);
    time = Number(time)
    return isNaN(time) ? Material.DEFAULT_TIME : time;
  }

  getStartOffset() {
    return this.start == Material.DEFAULT_TIME ? 0 : this.start;
  }

  getEndOffset() {
    const end = this.getStartOffset() + this.duration;
    return this.end == Material.DEFAULT_TIME ? end : min([end, this.end]);
  }

  getStartHms() {
    return DateUtil.secondsToHms(this.getStartOffset());
  }

  getEndHms() {
    return DateUtil.secondsToHms(this.getEndOffset());
  }

  getSliceOpts() {
    let opts = [];
    if (this.getStartOffset() > 0) opts = opts.concat(['-ss', this.getStartHms()]);
    if (this.getEndOffset() < this.length) opts = opts.concat(['-to', this.getEndHms()]);
    return opts;
  }

  getOutputPath(dir, fname) {
    FS.ensureDir(dir);
    return path.join(dir, fname);
  }

  /**
   * Get the width and height of the material resource frame scaled according to the scene scale
   * @param {number} width - The width of the scene
   * @param {number} height - The height of the scene
   * @return {array} [x, y, width, height]
   * @public
   */
  getSourceRect(width, height) {
    if (!this.info) return new Rectangle(0, 0, width, height);

    let w, h, x, y;
    const ow = this.info.width;
    const oh = this.info.height;
    const s1 = width / height;
    const s2 = ow / oh;
    if (s1 >= s2) {
      w = ow;
      h = (ow / s1) >> 0;
      x = 0;
      y = ((oh - h) / 2) >> 0;
    } else {
      h = oh;
      w = (oh * s1) >> 0;
      y = 0;
      x = ((ow - w) / 2) >> 0;
    }

    return new Rectangle(x, y, w, h);
  }

  /**
   * Obtain duration based on movie information
   * @return {number} movie information duration
   * @public
   */
  getDuration() {
    return min([this.length, this.getEndOffset() - this.getStartOffset()]);
  }

  toString() {
    return `${this.type}:${this.path}-length:${this.length}`;
  }

  destroy() {
    Material.MAIN_PLAYER = null;
    Material.MEDIA_PLAYERS = [];
    this.creator = null;
    this.info = null;
    this.path = '';
    this.length = 0;
  }
}

module.exports = Material;