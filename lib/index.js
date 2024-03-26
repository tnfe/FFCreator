'use strict';

/*!
 * FFCreator - a lightweight and flexible short video production library
 * Copyright(c) TNFE Team
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/mit-license.php
 */

require('./polyfill/polyfill')();

const echarts = require('echarts');
const FFCreator = require('./creator');
const FFNode = require('./node/node');
const FFRect = require('./node/rect');
const FFText = require('./node/text');
const FFImage = require('./node/image');
const FFChart = require('./node/chart');
const FFVideo = require('./node/video');
const FFScene = require('./node/scene');
const FFAlbum = require('./node/album');
const FFExtras = require('./node/extras');
const FFLottie = require('./node/lottie');
const FFGifImage = require('./node/gif');
const FFVtuber = require('./node/vtuber');
const FFSubtitle = require('./node/subtitle');
const FFVideoAlbum = require('./node/videos');
const FFAudio = require('./audio/audio');
const FFTween = require('./animate/tween');
const FFLogger = require('./utils/logger');
const FFmpegUtil = require('./utils/ffmpeg');
const FFCreatorCenter = require('./center/center');

module.exports = {
  echarts,
  FFCreator,
  FFNode,
  FFRect,
  FFText,
  FFImage,
  FFVideo,
  FFScene,
  FFChart,
  FFAudio,
  FFAlbum,
  FFLottie,
  FFExtras,
  FFGifImage,
  FFVtuber,
  FFSubtitle,
  FFVideoAlbum,
  FFTween,
  FFLogger,
  FFmpegUtil,
  FFCreatorCenter,
};
