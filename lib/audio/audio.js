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
const TimelineUpdate = require('../timeline/update');
const { isBrowser } = require("browser-or-node");

class FFAudio extends FFBase {
  constructor(conf) {
    super({ type: 'audio' });
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
    this.preload = false;
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
    return new Promise((resolve, reject) => {
      this.$audio = document.createElement('audio');
      this.$audio.addEventListener('loadedmetadata', () => {
        this.material.length = this.$audio.duration;
        resolve();
      });
      this.$audio.addEventListener('error', () => reject());
      this.$audio.src = this.material.path;
      if (this.volume > 0) this.$audio.volume = this.volume;
    });
  }

  start() {
    if (this.started || !isBrowser) return false;
    this.drawing = this.drawing.bind(this);
    TimelineUpdate.addFrameCallback(this.drawing);
    return this.started = true;
  }

  end(time) {
    if (!isBrowser) return;
    if (this.$audio) {
      if (time > 0) this.$audio.currentTime = time;
      this.$audio && this.$audio.pause();
    }
    setTimeout(() => {this.playing = false}, 100);
  }

  play(time, delta) {
    if (this.playing) return;
    const seekTime = Math.min(this.material.getDuration(), time) + this.material.getStartOffset();
    if (!delta || Math.abs(seekTime - this.$audio.currentTime) > 0.3) {
      this.$audio.currentTime = seekTime;
    }
    this.playing = true;
    this.$audio.playbackRate = 1;
    this.$audio.play();
  }

  async drawing(timeInMs = 0, nextDeltaInMS = 0) {
    if (!this.parent.started) return this.end();

    // todo: repeat code with gif drawing
    // timeInMs 是绝对时间，需要先相对parent求相对时间 sceneTime
    const sceneTime = (timeInMs / 1000) - this.parent.startTime;
    if (sceneTime < this.startTime || sceneTime >= this.endTime) return this.end();

    // currentTime是当前素材的时间
    this.currentTime = sceneTime - this.startTime;
    const matDuration = this.material.getDuration();
    while (this.loop && this.currentTime >= matDuration) {
      this.currentTime = Math.max(0.0, this.currentTime - matDuration);
    }

    if (!nextDeltaInMS) return this.end(this.currentTime);
    const nextTime = this.currentTime + (nextDeltaInMS / 1000);
    nextTime < matDuration ? this.play(this.currentTime, nextDeltaInMS/1000) : this.end(this.currentTime);
  }

  addInput(command) {
    const { loop, path } = this;
    command.addInput(path);
    if (loop) command.inputOptions(['-stream_loop', '-1']);
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

  destroy() {
    super.destroy();
    TimelineUpdate.removeFrameCallback(this.drawing);
  }
}

module.exports = FFAudio;
