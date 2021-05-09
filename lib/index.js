'use strict';

/*!
 * FFCreator - a lightweight and flexible short video production library
 * Copyright(c) TNFE Team
 *
 * Licensed under the MIT license:
 *  http://www.opensource.org/licenses/mit-license.php
 */

require('./polyfill/polyfill')();

const FFCreator = require('./creator');
const FFNode = require('./node/node');
const FFText = require('./node/text');
const FFImage = require('./node/image');
const FFVideo = require('./node/video');
const FFScene = require('./node/scene');
const FFAlbum = require('./node/album');
const FFVtuber = require('./node/vtuber');
const FFSubtitle = require('./node/subtitle');
const FFAudio = require('./audio/audio');
const FFTween = require('./animate/tween');
const FFLogger = require('./utils/logger');
const FFCreatorCenter = require('./center/center');

module.exports = {
  FFCreator,
  FFNode,
  FFText,
  FFImage,
  FFVideo,
  FFScene,
  FFAudio,
  FFAlbum,
  FFVtuber,
  FFSubtitle,
  FFTween,
  FFLogger,
  FFCreatorCenter,
};
