'use strict';

/*!
 * FFCreator - a lightweight and flexible short video production library
 * Copyright(c) TNFE Team
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/mit-license.php
 */

// require('./polyfill/polyfill')();

// const echarts = require('echarts');
const InkPaint = require('../inkpaint/lib/index');
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

module.exports = {
  // echarts,
  InkPaint,
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
