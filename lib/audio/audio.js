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
const DateUtil = require('../utils/date');

class FFAudio extends FFBase {
  constructor(conf) {
    super({ type: 'audio' });

    conf = typeof conf === 'string' ? { path: conf } : conf;
    const {
      src,
      bg = false,
      path,
      loop = false,
      start,
      startTime,
      volume = -1,
      fadeIn = -1,
      fadeOut = -1,
      ss = -1,
      to = -1,
    } = conf;

    this.bg = bg;
    this.loop = loop;
    this.volume = volume;
    this.path = path || src;
    this.start = start || startTime || 0;
    this.fadeIn = fadeIn;
    this.fadeOut = fadeOut;
    this.ss = ss;
    this.to = to;
  }

  setLoop(loop) {
    this.loop = loop;
  }

  setVolume(volume) {
    this.volume = volume;
  }

  setFadeIn(fadeIn) {
    this.fadeIn = fadeIn;
  }

  setFadeOut(fadeOut) {
    this.fadeOut = fadeOut;
  }

  setSs(ss) {
    this.ss = ss;
  }

  setTo(to) {
    this.to = to;
  }

  addInput(command) {
    const { loop, ss, to, path } = this;

    command.addInput(path);
    if (loop) command.inputOptions(['-stream_loop', '-1']);
    if (this.hasSSTO()) {
      const s = DateUtil.secondsToHms(ss);
      const t = DateUtil.secondsToHms(to);
      command.addInputOption('-ss', s);
      command.addInputOption('-to', t);
    }
  }

  hasSSTO() {
    const { ss, to } = this;
    if (ss && ss !== -1 && to && to !== -1) {
      return true;
    }

    return false;
  }

  toFilterCommand({ index, duration }) {
    const input = `${1 + index}`;
    const output = `audio${index}`;
    const delay = this.toDelayFilter();
    const volume = this.toVolumeFilter();
    const fadeIn = this.toFadeInFilter();
    const fadeOut = this.toFadeOutFilter(duration);

    return `[${input}]${delay}${volume}${fadeIn}${fadeOut}[${output}]`;
  }

  toDelayFilter() {
    const delay = this.start * 1000;
    return `adelay=${delay}|${delay}`;
  }

  toVolumeFilter() {
    const { volume = -1 } = this;
    if (volume === -1) return '';
    return `,volume=${volume}`;
  }

  toFadeInFilter() {
    const { fadeIn = -1, start = 0 } = this;
    if (fadeIn === -1) return '';
    return `,afade=t=in:st=${start}:d=${fadeIn}`;
  }

  toFadeOutFilter(duration) {
    const { fadeOut = -1 } = this;
    if (fadeOut === -1) return '';

    const start = Math.max(0, duration - fadeOut);
    return `,afade=t=out:st=${start}:d=${fadeOut}`;
  }
}

module.exports = FFAudio;
