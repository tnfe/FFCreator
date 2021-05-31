'use strict';

/**
 * FFSubtitle - Subtitle component, can be used in conjunction with voice-to-subtitle tts
 *
 * ####Example:
 *
 *     const text = "《街头霸王5》是卡普空使用虚幻引擎开发的3D格斗游戏.";
 *     const subtitle = new FFSubtitle({ x: 320, y: 520 });
 *     subtitle.setText(text);
 *
 * @class
 */
const FFNode = require('./node');
const Pool = require('../core/pool');
const { Label } = require('spritejs');
const probe = require('ffmpeg-probe');
const forEach = require('lodash/forEach');
const FFTween = require('../animate/tween');
const DateUtil = require('../utils/date');
const TimelineUpdate = require('../timeline/update');
const Materials = require('../utils/materials');
const Utils = require('../utils/utils');
const { registerFont } = require('node-canvas-webgl');

const DIS = 40;
const SIGN = '_$_';
class FFSubtitle extends FFNode {
  constructor(conf = { text: '', style: { fontSize: 24 } }) {
    super({ type: 'subtitle', ...conf });

    const { comma = true, startTime, text = '' } = conf;
    const regexp = comma ? /(。|？|\?|!|！|；|，)/gi : /(。|？|\?|!|！|；)/gi;
    this.setRegexp(regexp);
    this.setDefaultStyle();
    this.setStartTime(startTime);

    this.time = 0;
    this.index = 0;
    this.text = text;
    this.textList = [];
    this.frameBuffer = 6;
    this.materials = new Materials();
  }

  /**
   * Create display object.
   * @private
   */
  createDisplay() {
    const { fontSize = 20 } = this.conf;
    this.display = Pool.get(this.type, () => new Label());
    this.display.attr({ fontSize, opacity: 0 });
    this.setAnchor(0.5);
  }

  /**
   * Set frame buffer
   * @param {buffer} frameBuffer - frame buffer
   * @public
   */
  setFrameBuffer(frameBuffer) {
    this.frameBuffer = frameBuffer;
  }

  /**
   * Set up voice narration
   * @param {string} speech - voice narration
   * @public
   */
  setSpeech(speech) {
    this.conf.speech = speech;
  }

  /**
   * Set up voice dialogue
   * @param {string} speech - voice narration
   * @public
   */
  setAudio(speech) {
    this.setSpeech(speech);
  }

  /**
   * Set Subtitle text
   * @param {string} text - Subtitle text
   * @public
   */
  setText(text) {
    this.conf.text = text;
  }

  /**
   * Set segmentation regular
   * @param {regexp} regexp - segmentation regular
   * @public
   */
  setRegexp(regexp) {
    this.regexp = regexp;
  }

  /**
   * Set text font size
   * @param {number} fontSize - text font size
   * @public
   */
  setFontSize(fontSize) {
    this.conf.fontSize = fontSize;
    this.display.attr({ fontSize });
  }

  /**
   * Set total animation duration
   *
   * @param {number} duration album animation duration
   * @public
   */
  setDuration(duration = 5) {
    this.conf.duration = duration;
  }

  /**
   * Set background color
   * @param {string} backgroundColor - the background color value
   * @public
   */
  setBackgroundColor(backgroundColor) {
    this.setBackground(backgroundColor);
  }

  /**
   * Set background color
   * @param {string} backgroundColor - the background color value
   * @public
   */
  setBackground(bgcolor) {
    this.display.attr({ bgcolor });
  }

  /**
   * Set text color value
   * @param {string} color - the text color value
   * @public
   */
  setColor(color) {
    this.display.attr({ fillColor: color });
  }

  /**
   * Set text font file path
   * @param {string} file - text font file path
   * @public
   */
  setFont(fontFamily) {
    if (/.*\.(ttf|otf|svg|woff|woff2|eot)$/gi.test(fontFamily)) {
      this.setFontByFile(fontFamily);
    } else {
      this.display.attr({ fontFamily });
    }
  }

  setFontByFile(file) {
    const fontFamily = 'f' + Utils.toHash(file);
    if (!Utils.storage[fontFamily]) {
      registerFont(file, { family: fontFamily });
      Utils.storage[fontFamily] = true;
    }
    this.display.attr({ fontFamily });
  }

  setStartTime(startTime = 0) {
    startTime = startTime || 0;
    startTime = DateUtil.toMilliseconds(startTime);
    this.startTime = startTime;
  }

  /**
   * Set text style by object
   * @param {object} style - style by object
   * @public
   */
  setStyle(style) {
    if (style.color) style.fillColor = style.color;
    if (style.backgroundColor) style.bgcolor = style.backgroundColor;

    this.display.attr(style);
  }

  setAnimate(animate, aniTime = 0.5) {
    this.conf.animate = animate;
    this.conf.aniTime = aniTime;
  }

  setDefaultStyle() {
    const padding = [4, 12, 6, 12];
    const { color = '#ffffff', backgroundColor = '#00219c' } = this.conf;
    this.setStyle({ color, padding, backgroundColor, opacity: 0 });
  }

  async preProcessing() {
    if (this.conf.speech) {
      this.materials.info = await probe(this.conf.speech);
      const duration = this.materials.getDuration();
      this.setDuration(duration);
      return null;
    } else {
      return null;
    }
  }

  start() {
    super.start();
    this.replaceDot();
    this.punctuation();
    this.addTimelineCallback();
  }

  addTimelineCallback() {
    this.drawing = this.drawing.bind(this);
    TimelineUpdate.addFrameCallback(this.drawing);
  }

  drawing(time, delta) {
    this.time += delta;
    if (this.time < this.startTime) return;

    this.index++;
    if (this.index >= this.totalFrames) {
      this.display.attr({ text: '', opacity: 0 });
      return;
    }

    forEach(this.textList, textObj => {
      const { start, frames, text, draw } = textObj;
      if (this.index >= start && this.index <= frames && !draw) {
        this.showNewTextLine(text);
        textObj.draw = true;
      }
    });
  }

  showNewTextLine(text) {
    const time = this.conf.aniTime || 0.5;
    const x = this.display.attributes.x;
    const y = this.display.attributes.y;

    switch (this.conf.animate) {
      case 'up':
        this.display.attr({ text, opacity: 0 });
        FFTween.spriteTweenFromTo(
          this.display,
          time,
          { opacity: 0, y: y + DIS },
          { opacity: 1, y },
        );
        break;

      case 'down':
        this.display.attr({ text, opacity: 0 });
        FFTween.spriteTweenFromTo(
          this.display,
          time,
          { opacity: 0, y: y - DIS },
          { opacity: 1, y },
        );
        break;

      case 'left':
        this.display.attr({ text, opacity: 0 });
        FFTween.spriteTweenFromTo(
          this.display,
          time,
          { opacity: 0, x: x - DIS },
          { opacity: 1, x },
        );
        break;

      case 'right':
        this.display.attr({ text, opacity: 0 });
        FFTween.spriteTweenFromTo(
          this.display,
          time,
          { opacity: 0, x: x + DIS },
          { opacity: 1, x },
        );
        break;

      default:
        this.display.attr({ text, opacity: 1 });
    }
  }

  replaceDot() {
    this.text = this.conf.text.replace(this.regexp, SIGN);
  }

  punctuation() {
    const rfps = this.rootConf('rfps');
    const duration = this.conf.duration;
    const totalLength = this.conf.text.length;
    const list = this.text.split(SIGN).filter(elem => elem);
    let start = 0;
    this.totalFrames = duration * rfps + this.frameBuffer;

    forEach(list, text => {
      // text += sign;
      const time = (text.length / totalLength) * duration;
      const frames = start + time * rfps;
      this.textList.push({ start, frames, text, draw: false });
      start = frames;
    });
  }

  destroy() {
    this.text = '';
    this.textList.length = 0;
    this.display.attr({ text: '' });
    TimelineUpdate.removeFrameCallback(this.drawing);

    this.materials.destroy();
    super.destroy();
  }
}

module.exports = FFSubtitle;
