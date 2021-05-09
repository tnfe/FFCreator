'use strict';

/**
 * FFAudio - audio component-can be used to play sound
 *
 * ####Example:
 *
 *     const audio = new FFAudio(args);
 *
 * ####Note:
 *     Adding multiple audio inputs to video with ffmpeg not working?
 *     https://superuser.com/questions/1191642/adding-multiple-audio-inputs-to-video-with-ffmpeg-not-working
 *
 * @class
 * @param {object} conf FFAudio component related configuration
 */
const FFBase = require('../core/base');

class FFAudio extends FFBase {
  constructor(conf) {
    super({ type: 'audio' });

    conf = typeof conf === 'string' ? { path: conf } : conf;
    const { src, bg = false, path, loop = false, start, startTime } = conf;

    this.bg = bg;
    this.loop = loop;
    this.path = path || src;
    this.start = start || startTime || 0;
  }
}

module.exports = FFAudio;
