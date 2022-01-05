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
const Material = require('../material/material');
const { Howl } = require('howler');
const { isBrowser } = require("browser-or-node");

class FFAudio extends FFBase {
  constructor(conf) {
    super({ type: 'audio', ...conf});
    conf = typeof conf === 'string' ? { path: conf } : conf;
    this.material = new Material(conf);
    const {
      bg = false,
      loop = false,
      start,
      startTime,
      end,
      endTime,
      volume = -1,
      fadeIn = -1,
      fadeOut = -1,
    } = conf;

    this.bg = bg;
    this.loop = loop;
    this.volume = volume;
    this.startTime = start || startTime || 0;
    this.endTime = end || endTime || Math.pow(10, 9);
    this.fadeIn = fadeIn;
    this.fadeOut = fadeOut;
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

  preProcessing() {
    if (!isBrowser) return;
    const pp = this.parent;
    this.material.duration = pp.getDuration ? pp.getDuration() : pp.duration;
    this.audio = new Howl({ src: [this.material.path], autoSuspend: false });
    return new Promise((resolve, reject) => {
      this.audio.once('load', () => {
        this.material.length = this.audio.duration();
        this.audio.volume(this.volume);
        this.endTime = Math.min(this.parent.duration, this.endTime);
        resolve();
      });
      this.audio.once('loaderror', e => reject(e));
    });
  }

  start() {
    if (this.started || !isBrowser) return false;
    this.drawing = this.drawing.bind(this);
    this.addFrameCallback(this.drawing);
    return this.started = true;
  }

  end() {
    if (!isBrowser || !this.playing) return;
    this.fading = false; // unlock
    this.playing = false;
    this.audio.pause();
  }

  async play(time) {
    if (!isBrowser || this.playing) return;
    const seekTime = Math.min(this.material.getDuration(), time) + this.material.getStartOffset();
    this.playing = true;
    this.audio.seek(seekTime);
    this.audio.rate(this.creator().playbackRate);
    this.audio.play();
  }

  async drawing(timeInMs = 0, nextDeltaInMS = 0) {
    if (!this.parent.started) return this.end();

    // timeInMs 是绝对时间，需要先相对parent求相对时间 sceneTime
    const sceneTime = (timeInMs / 1000) - this.parent.startTime;
    if (sceneTime < this.startTime || sceneTime >= this.endTime) return this.end();
    this.currentTime = sceneTime - this.startTime; // currentTime是当前素材的时间

    // fadeIn/fadeOut
    if (nextDeltaInMS) {
      if (this.currentTime < this.fadeIn) {
        const from = this.volume * (this.currentTime / this.fadeIn);
        this.fade(from, this.volume, this.fadeIn - this.currentTime, timeInMs);
      } else if (this.endTime - sceneTime < this.fadeOut) {
        const dur = this.endTime - sceneTime;
        const from = this.volume * (dur / this.fadeOut);
        this.fade(from, 0, dur, timeInMs);
      }
    }

    // loop
    const matDuration = this.material.getDuration();
    while (this.loop && this.currentTime >= matDuration) {
      this.currentTime = Math.max(0.0, this.currentTime - matDuration);
    }

    if (!nextDeltaInMS) return this.end();
    const nextTime = this.currentTime + (nextDeltaInMS / 1000);
    nextTime < matDuration ? this.play(this.currentTime) : this.end();
  }

  fade(from, to, duration, now) {
    if (this.fading > now) return;
    duration = (duration * 1000) >> 0;
    console.log('fade', {from, to, duration, now});
    this.audio.fade(from, to, duration);
    this.fading = now + duration;
  }

  addInput(command) {
    command.addInput(this.material.path);
    if (this.loop) command.inputOptions(['-stream_loop', '-1']);
    const sliceOpts = this.material.getSliceOpts();
    if (sliceOpts) command.addInputOptions(sliceOpts);
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
    const delay = (this.startTime * 1000) >> 0;
    return `adelay=${delay}|${delay}`;
  }

  toVolumeFilter() {
    const { volume = -1 } = this;
    if (volume === -1) return '';
    return `,volume=${volume}`;
  }

  toFadeInFilter() {
    const { fadeIn = -1, startTime = 0 } = this;
    if (fadeIn === -1) return '';
    return `,afade=t=in:st=${startTime}:d=${fadeIn}`;
  }

  toFadeOutFilter(duration) {
    const { fadeOut = -1 } = this;
    if (fadeOut === -1) return '';

    const start = Math.max(0, duration - fadeOut);
    return `,afade=t=out:st=${start}:d=${fadeOut}`;
  }

  destroy() {
    this.removeFrameCallback(this.drawing);
    super.destroy();
    this.material.destroy();
    if (this.audio) {
      this.audio.unload();
      this.audio = null;
    }
  }
}

module.exports = FFAudio;
