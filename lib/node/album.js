'use strict';

/**
 * FFAlbum - A picture album component that supports multiple switching animation effects
 *
 * ####Example:
 *
 *     const album = new FFAlbum({
 *        list: [a01, a02, a03, a04],
 *        x: 100,
 *        y: 100,
 *        width: 500,
 *        height: 300
 *    });
 *
 * @class
 *
 */
const FFImage = require('./image');
const Pool = require('../core/pool');
const Utils = require('../utils/utils');
const forEach = require('lodash/forEach');
const isArray = require('lodash/isArray');
const FFLogger = require('../utils/logger');
const { Group, Sprite } = require('spritejs');
const Effects = require('../animate/effects');
const FFAnimation = require('../animate/animation');

class FFAlbum extends FFImage {
  constructor(conf = { list: [] }) {
    super({ type: 'album', ...conf });

    if (!conf.width)
      FFLogger.error({ pos: 'FFAlbum', error: 'This component must enter the width!' });

    this.tweens = [];
    this.children = [];
    this.width = conf.width;
    this.height = conf.height;
    this.showCover = conf.showCover;

    this.setDuration(conf.duration);
    this.setTransition(conf.transition);
    this.setTransTime(conf.time || conf.transTime);
    this.initAlbumList(conf.list);
  }

  /**
   * Set total album animation duration
   *
   * @param {number} duration album animation duration
   * @public
   */
  setDuration(duration = 2) {
    this.duration = duration;
  }

  /**
   * Set the way to switch the album animation
   *
   * @param {string} transition transition type
   * @public
   */
  setTransition(transition = 'random') {
    this.transition = transition;
  }

  /**
   * Set the transition time of each image
   *
   * @param {number} time transition time
   * @public
   */
  setTransTime(time = 1) {
    this.time = time;
  }

  setShowCover(showCover = false) {
    this.showCover = showCover;
  }

  /**
   * Get the width and height of the album component
   *
   * @return {array} [width, height] array
   * @public
   */
  getWH() {
    return [this.conf.width, this.conf.height];
  }

  /**
   * Create display object
   * @private
   */
  createDisplay() {
    this.display = Pool.get(this.type, () => new Group());
  }

  /**
   * Initialize the album picture list
   * @private
   */
  async initAlbumList(list) {
    this.list = list;
    await this.isReady();
    forEach(list, img => this.createSingleImage(img));
  }

  /**
   * Create a single image frame
   * @private
   */
  createSingleImage(img) {
    const [width, height] = this.getWH();
    const sp = Pool.get('album_sprite', () => new Sprite());
    this.draw({ display: sp, texture: img, width, height });
    this.addChildImageSprite(sp);
  }

  addChildImageSprite(sp) {
    sp.attr({ anchor: [0.5, 0.5] });
    this.display.append(sp);
    this.children.push(sp);
  }

  getTotalDuration() {
    return this.list.length * this.duration + this.time;
  }

  /**
   * Fill the transition animation of each single picture
   * @private
   */
  fillAlbumTweens() {
    const tweens = [];
    const aniNames = this.createAniNames();

    forEach(this.children, (sp, index) => {
      const type = index < aniNames.length ? aniNames[index] : aniNames[0];
      const time = this.isCover(index) ? 0 : this.time;
      const delay = index * this.duration;

      const aniObj = Effects.getAnimation({ type, time, delay }, sp.attributes);
      const parent = {
        display: sp,
        offsetX: 0,
        offsetY: 0,
        id: `album_sub${index}`,
      };

      const tween = new FFAnimation({ ...aniObj, parent });
      tween.autoOpacity = true;
      tweens.push(tween);
      if (!this.isCover(index)) sp.attr({ opacity: 0 });
    });

    return tweens;
  }

  /**
   * Create animation name
   * @private
   */
  createAniNames() {
    let aniNames = [];
    if (this.transition === 'random') this.transition = Effects.getRandomEffectName(20);
    if (isArray(this.transition)) {
      aniNames = aniNames.concat(this.transition);
    } else {
      aniNames.push(this.transition);
    }

    return aniNames;
  }

  /**
   * All resources materials and actions are ready
   * @return {Promise}
   * @public
   */
  isReady() {
    return new Promise(resolve => setTimeout(resolve, 1));
  }

  /**
   * Start rendering
   * @public
   */
  start() {
    super.start();
    const tweens = this.fillAlbumTweens();
    forEach(tweens, tween => tween.start());
    this.tweens = tweens;
  }

  /**
   * is face cover
   * @private
   */
  isCover(index) {
    return index === 0 && this.showCover;
  }

  destroyAlbumList() {
    const pool = this.rootConf('pool');
    forEach(this.children, sp => {
      this.deleteTexture(sp);
      sp.attr({ texture: null, width: null, height: null });
      pool && Pool.put('album_sprite', sp);
    });
  }

  destroyAlbumTweens() {
    forEach(this.tweens, tween => {
      Utils.destroyObj(tween.parent);
      tween.destroy();
    });
  }

  destroy() {
    try {
      this.destroyAlbumList();
      this.destroyAlbumTweens();
      this.display.removeAllChildren();

      this.conf.list.length = 0;
      this.children.length = 0;
      this.list = null;
    } catch (e) {}

    super.destroy();
  }
}

module.exports = FFAlbum;
