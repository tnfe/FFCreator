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
const Utils = require('../utils/utils');
const forEach = require('lodash/forEach');
const isArray = require('lodash/isArray');
const FFLogger = require('../utils/logger');
const Effects = require('../animate/effects');
const { Container, Sprite } = require('../../inkpaint/lib/index');
const FFAnimation = require('../animate/animation');

class FFAlbum extends FFImage {
  constructor(conf = { list: [] }) {
    super({ type: 'album', ...conf });

    if (!conf.width)
      FFLogger.error({ pos: 'FFAlbum', error: 'This component must enter the width!' });

    this.albumAnimations = [];
    this.children = [];
    this.list = conf.list;
    this.width = conf.width;
    this.height = conf.height;
    this.showCover = conf.showCover;

    this.setDuration(conf.duration);
    this.setTransition(conf.transition);
    this.setTransTime(conf.time || conf.transTime);
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

  /**
   * Show album cover image
   *
   * @param {boolean} showCover Whether to show cover image
   * @public
   */
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
    const { width = 0, height = 0 } = this.conf;
    return [width, height];
  }

  /**
   * Get the URL that needs to be preloaded
   * @public
   */
  getPreloadUrls() {
    return this.list;
  }

  /**
   * Create display object
   * @private
   */
  createDisplay() {
    this.display = new Container();
  }

  getTotalDuration() {
    return this.list.length * this.duration + this.time;
  }

  async drawing(timeInMs = 0, nextDeltaInMS = 0) {
    const texture = await super.drawing(timeInMs, nextDeltaInMS);
    if (!texture) return false;
    if (nextDeltaInMS === 0) {
      forEach(this.albumAnimations, ani => {
        if (!ani.mayStart()) ani.setAttr(); // init attr
        ani.start();
      });
    }
    return texture;
  }

  /**
   * Fill the transition animation of each single picture
   * @private
   */
  createAlbumAnimations() {
    const animations = [];
    const aniNames = this.createAniNames();

    forEach(this.children, (sprite, index) => {
      const type = index < aniNames.length ? aniNames[index] : aniNames[0];
      const time = this.isCover(index) ? 0 : this.time;
      const delay = index * this.duration;

      const aniObj = Effects.getAnimation({ type, time, delay }, sprite);
      const parent = {
        display: sprite,
        id: `album_sub${index}`,
        parent: this.parent, // scene startTime needed in FFAnimation
      };

      const animation = new FFAnimation({ ...aniObj, parent });
      animation.autoAlpha = true;
      animation.index = index;
      animation.on('complete', () => this.hidePrevChilds(index));
      animations.push(animation);

      if (!this.isCover(index)) sprite.alpha = 0;
    });

    return animations;
  }

  /**
   * Hide useless sibling elements, to improve performance
   * @private
   */
  hidePrevChilds(index) {
    forEach(this.children, (sprite, i) => {
      sprite.visible = (i >= index);
    });
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

  initDraw() {
    forEach(this.list, image => this.createSingleImage(image));
    const animations = this.createAlbumAnimations();
    forEach(animations, ani => ani.start());
    this.albumAnimations = animations;
  }

  /**
   * Create a single image frame
   * @private
   */
  createSingleImage(image) {
    const [width, height] = this.getWH();
    const sprite = new Sprite();
    sprite.anchor.set(0.5);

    const texture = this.getAsset(image);
    this.draw({ display: sprite, texture });
    this.display.addChild(sprite);
    this.children.push(sprite);

    if (width) sprite.width = width;
    if (height) sprite.height = height;
  }

  /**
   * is face cover
   * @private
   */
  isCover(index) {
    return index === 0 && this.showCover;
  }

  destroyAlbumList() {
    forEach(this.children, sprite => {
      this.deleteTexture(sprite);
      sprite.destroy();
    });
  }

  destroyAlbumAnimations() {
    forEach(this.albumAnimations, ani => {
      Utils.destroyObj(ani.parent);
      ani.destroy();
    });
  }

  destroy() {
    try {
      this.destroyAlbumList();
      this.destroyAlbumAnimations();
      this.display.removeAllChildren();

      this.conf.list.length = 0;
      this.children.length = 0;
      this.list = null;
    } catch (e) {
      console.log(e);
    }

    super.destroy();
  }
}

module.exports = FFAlbum;
