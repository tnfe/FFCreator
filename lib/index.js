'use strict';

/*!
 * FFCreator - a lightweight and flexible short video production library
 * Copyright(c) TNFE Team
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/mit-license.php
 */

// require('./polyfill/polyfill')();

const FFCreator = require('./creator');
const FFSpine = require('./node/spine');
const FFTransition = require('./animate/transition');
const FFNode = require('./node/node');
const FFRect = require('./node/rect');
const FFText = require('./node/text');
const FFImage = require('./node/image');
// const FFChart = require('./node/chart');
const FFVideo = require('./node/video');
const FFScene = require('./node/scene');
const FFAlbum = require('./node/album');
const FFExtras = require('./node/extras');
const FFGifImage = require('./node/gif');
const FFSubtitle = require('./node/subtitle');
// const FFVideoAlbum = require('./node/videos');
const FFAudio = require('./audio/audio');
const FFTween = require('./animate/tween');
const FFLogger = require('./utils/logger');
const FFCreatorCenter = require('./center/center');

const TYPES = {
  canvas: FFCreator,
  spine: FFSpine,
  transition: FFTransition,
  scene: FFScene,
  node: FFNode,
  text: FFText,
  image: FFImage,
  video: FFVideo,
  audio: FFAudio,
  gif: FFGifImage,
  div: FFRect,
}

const Factory = {
  debug: false,
  cacheNode: null,
  async fromJson(json, cache, progress) {
    const { type, children, ...others } = json;

    let childNodes = [];
    for (let child of children) {
      childNodes.push(this.fromJson(child, cache, progress));
    }
    childNodes = await Promise.all(childNodes);

    if (this.debug) {
      console.log('TYPE', type, others);
      if (type == 'canvas') others.log = true;
    }

    const node = new TYPES[type](others)

    // Fix a small bug of FFCreator. Will send pull request
    if (others.anchor) {
      if (Array.isArray(others.anchor)) node.setAnchor(...others.anchor);
      else node.setAnchor(others.anchor);
    }

    if (type == 'text') {
      node.setStyle(others)
      if (others.fontFamily) {
        node.setFont(others.fontFamily)
      }
    }

    if (others.animate) {
      node.addAnimate(JSON.parse(others.animate))
      if (this.debug) console.log('ANIMATE', JSON.parse(others.animate), node.animations)
    }

    if (others.effect) {
      const { effect, effectTime, effectDelay } = others
      if (this.debug) console.log('EFFECT', effect, effectTime, effectDelay)
      node.addEffect(effect.split(','), effectTime, effectDelay)
    }

    for (let childNode of childNodes) {
      node.addChild(childNode);
    }

    if (this.cacheNode) cache.push(this.cacheNode(node, progress));
    return node
  },
  async getCreator(data, opt, progress) {
    const cache = [];
    const res = await this.fromJson({ ...data, ...opt }, cache, progress);
    await Promise.all(cache);
    return res;
  },
  async fromXml(xml, opt, progress) {
    const { parseXml } = require('./utils/xml');
    const data = parseXml(xml);
    if (this.debug) console.log('parser xml -> json', data);
    return await this.getCreator(data.children[0], opt, progress);
  },
  async from(value, opt, progress=null) {
    if (typeof value === 'string' && value.includes('<miraml>')) { // miraml
      return await this.fromXml(value, opt, progress);
    }
    if (typeof value === 'string' && value.trim().startsWith('{')) { // json string
      value = JSON.parse(value);
    }
    if (value instanceof Object && value.type === 'canvas') {
      return await this.getCreator(value, opt, progress);
    }
    throw new Error('invalid value');
  }
}

module.exports = {
  // echarts,
  Factory,
  FFCreator,
  FFSpine,
  FFNode,
  FFRect,
  FFText,
  FFImage,
  FFVideo,
  FFScene,
  FFAudio,
  FFAlbum,
  FFExtras,
  FFGifImage,
  FFSubtitle,
  // FFVideoAlbum,
  FFTween,
  FFTransition,
  FFLogger,
  FFCreatorCenter,
};
