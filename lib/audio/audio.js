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

const FFClip = require('../core/clip');
const Material = require('../material/material');
const { Howl } = require('howler');
const { isBrowser } = require("browser-or-node");

class FFAudio extends FFClip {
  constructor(conf) {
    conf = typeof conf === 'string' ? { path: conf } : conf;
    super({ type: 'audio', ...conf});
    const {
      bg = false,
      loop = false,
      volume = -1,
      fadeIn = -1,
      fadeOut = -1,
    } = this.conf;

    this.bg = bg;
    this.loop = loop;
    this.volume = volume;
    this.fadeIn = fadeIn;
    this.fadeOut = fadeOut;
  }

  get default() {
    const _default = super.default;
    return {
      startTime: _default.startTime,
      endTime: this.loop ? _default.endTime : undefined,
      duration: this.loop ? undefined : this.material?.length,
    }
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
    this.material = new Material(this.conf);
    this.material.duration = this.parent.duration;
    this.material.length = 10;
    if (!isBrowser) {
      // todo: probe length
      return;
    }
    let path = this.material.path;
    // if (path.startsWith('http')) path += '?r=' + Math.random(); // for a wird bug...
    this.audio = new Howl({ src: [path], format: ['mp3'], autoSuspend: false });
    return new Promise((resolve, reject) => {
      this.audio.once('load', () => {
        this.material.length = this.audio.duration();
        this.audio.volume(this.volume);
        // this.endTime = Math.min(this.parent.duration, this.endTime);
        resolve();
      });
      this.audio.once('loaderror', e => reject(e));
    });
  }

  pause() {
    if (!isBrowser || !this.playing) return;
    this.fading = false; // unlock
    this.playing = false;
    this.audio.pause();
  }

  async play(time) {
    if (!isBrowser || this.playing) return;
    const seekTime = Math.min(this.material.getDuration(), time) + this.material.getStartOffset();
    this.playing = true;
    this.audio.volume(this.volume); // 需要重新设置，避免fade到0之后再seek就没声音
    this.audio.seek(seekTime);
    this.audio.rate(this.creator().playbackRate);
    this.audio.play();
  }

  async drawing(timeInMs = 0, nextDeltaInMS = 0) {
    if (!isBrowser) return false;
    let res = await super.drawing(timeInMs, nextDeltaInMS);
    if (!res) return this.pause();

    // timeInMs 是绝对时间，需要先相对parent求相对时间 relativeTime
    const relativeTime = (timeInMs / 1000) - this.parent.startTime;
    // currentTime是当前素材的时间
    this.currentTime = relativeTime - this.startTime;

    // fadeIn/fadeOut
    if (nextDeltaInMS) {
      if (this.currentTime < this.fadeIn) {
        const from = this.volume * (this.currentTime / this.fadeIn);
        this.fade(from, this.volume, this.fadeIn - this.currentTime, timeInMs);
      } else if (this.endTime - relativeTime < this.fadeOut) {
        const dur = this.endTime - relativeTime;
        const from = this.volume * (dur / this.fadeOut);
        this.fade(from, 0, dur, timeInMs);
      }
    }

    // loop
    const matDuration = this.material.getDuration();
    while (this.loop && this.currentTime >= matDuration) {
      this.currentTime = Math.max(0.0, this.currentTime - matDuration);
    }

    if (!nextDeltaInMS) return this.pause();
    const nextTime = this.currentTime + (nextDeltaInMS / 1000);
    nextTime < matDuration ? this.play(this.currentTime) : this.pause();
  }

  fade(from, to, duration, now) {
    if (this.fading > now) return;
    duration = (duration * 1000) >> 0;
    // console.log('fade', {from, to, duration, fading:this.fading, now});
    this.audio.fade(from, to, duration);
    this.fading = now + duration;
  }

  addInput(command) {
    command.addInput(this.material.path);
    if (this.loop) command.inputOptions(['-stream_loop', '-1']);
    const sliceOpts = this.material.getSliceOpts();
    if (sliceOpts) command.addInputOptions(sliceOpts);
  }

  toFilterCommand({ index }) {
    const input = `${1 + index}`;
    const output = `audio${index}`;
    const delay = this.toDelayFilter();
    const volume = this.toVolumeFilter();
    const fadeIn = this.toFadeInFilter();
    const fadeOut = this.toFadeOutFilter();
    return `[${input}]${delay}${volume}${fadeIn}${fadeOut}[${output}]`;
  }

  toDelayFilter() {
    const delay = (this.absStartTime * 1000) >> 0;
    return `adelay=${delay}|${delay}`;
  }

  toVolumeFilter() {
    const { volume = -1 } = this;
    if (volume === -1) return '';
    return `,volume=${volume}`;
  }

  toFadeInFilter() {
    const { fadeIn = -1, absStartTime = 0 } = this;
    if (fadeIn === -1) return '';
    return `,afade=t=in:st=${absStartTime}:d=${fadeIn}`;
  }

  toFadeOutFilter() {
    const { fadeOut = -1 } = this;
    if (fadeOut === -1) return '';
    // todo: consider material length < duration
    const start = Math.max(0, this.absEndTime - fadeOut);
    return `,afade=t=out:st=${start}:d=${fadeOut}`;
  }

  destroy() {
    super.destroy();
    this.material?.destroy();
    if (this.audio) {
      this.audio.unload();
      this.audio = null;
    }
  }
}

module.exports = FFAudio;
