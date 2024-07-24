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
const forEach = require('lodash/forEach');
const FFTween = require('../animate/tween');
const DateUtil = require('../utils/date');
const ffprobe = require('../utils/ffprobe');
const CanvasUtil = require('../utils/canvas');
const Materials = require('../utils/materials');
const TimelineUpdate = require('../timeline/update');
const { ProxyObj, Text } = require('inkpaint');
const subsrt = require('@xsstomy/subsrt');
const fs = require('fs-extra');

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
    this.conf.text = text;
    this.textList = [];
    this.frameBuffer = 6;
    this.materials = new Materials();
  }

  /**
   * Get the path to get the subtitle
   * @return {string} subtitle path
   * @public
   */
  getPath() {
    return this.conf.path || this.conf.subtitle || this.conf.url;
  }

  getCaptions() {
    if (this.getPath()) {
      try {
        const content = fs.readFileSync(this.getPath(), 'utf8');
        const options = { verbose: true };
        const captions = subsrt.parse(content, options);
        return captions;
      } catch (e) {
        console.log(e);
      }
    }

    return [];
  }

  /**
   * Create display object.
   * @private
   */
  createDisplay() {
    const { fontSize = 20 } = this.conf;
    this.display = new ProxyObj();
    this.setStyle({ fontSize, alpha: 0 });
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
    this.setStyle({ fontSize });
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
  setBackground(backgroundColor) {
    this.setStyle({ backgroundColor });
  }

  /**
   * Set text color value
   * @param {string} color - the text color value
   * @public
   */
  setColor(color) {
    this.setStyle({ fill: color });
  }

  /**
   * Set text font file path
   * @param {string} font - text font file path
   * @public
   */
  setFont(font) {
    CanvasUtil.setFont(font, fontFamily => this.setStyle({ fontFamily }));
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
    this.display.updateStyle(style);
  }

  setAnimate(animate, aniTime = 0.5) {
    this.conf.animate = animate;
    this.conf.aniTime = aniTime;
  }

  setDefaultStyle() {
    const padding = 10;
    const { color = '#ffffff', stroke = '#000000', strokeThickness = 3 } = this.conf;
    this.setStyle({ color, padding, alpha: 0, stroke: stroke, strokeThickness: strokeThickness });
  }

  async preProcessing() {
    if (this.conf.speech) {
      this.materials.info = await ffprobe(this.conf.speech);
      const duration = this.materials.getDuration();
      this.setDuration(duration);
      return null;
    } else {
      return null;
    }
  }

  /**
   * replace to real Text Component
   * @private
   */
  substituteText() {
    const proxyObj = this.display;
    this.display = new Text();
    this.display.substitute(proxyObj);
  }

  start() {
    this.substituteText();
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
      this.display.text = '';
      this.setStyle({ alpha: 0 });
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
    const x = this.display.x;
    const y = this.display.y;

    switch (this.conf.animate) {
      case 'up':
        this.display.text = text;
        this.setStyle({ alpha: 0 });
        FFTween.spriteTweenFromTo(this.display, time, { alpha: 0, y: y + DIS }, { alpha: 1, y });
        break;

      case 'down':
        this.display.text = text;
        this.setStyle({ alpha: 0 });
        FFTween.spriteTweenFromTo(this.display, time, { alpha: 0, y: y - DIS }, { alpha: 1, y });
        break;

      case 'left':
        this.display.text = text;
        this.setStyle({ alpha: 0 });
        FFTween.spriteTweenFromTo(this.display, time, { alpha: 0, x: x - DIS }, { alpha: 1, x });
        break;

      case 'right':
        this.display.text = text;
        this.setStyle({ alpha: 0 });
        FFTween.spriteTweenFromTo(this.display, time, { alpha: 0, x: x + DIS }, { alpha: 1, x });
        break;

      default:
        this.display.text = text;
        this.setStyle({ alpha: 1 });
    }
  }

  replaceDot() {
    this.text = this.conf.text.replace(this.regexp, SIGN);
  }

  punctuation() {
    const fps = this.rootConf('fps');
    const duration = this.conf.duration;
    const totalLength = this.conf.text.length;
    const list = this.text.split(SIGN).filter(elem => elem);
    const captions = this.getCaptions();
    let start = 0;
    this.totalFrames = duration * fps + this.frameBuffer;

    if (captions.length > 0) {
      forEach(captions, paragraph => {
        const time = paragraph.duration / 1000;
        const frames = start + time * fps;
        const text = paragraph.text;
        console.log(text);
        this.textList.push({ start, frames, text, draw: false });
        start = frames;
      });
    } else {
      forEach(list, text => {
        // text += sign;
        const time = ((text.length + 1) / totalLength) * duration;
        const frames = start + time * fps;
        this.textList.push({ start, frames, text, draw: false });
        start = frames;
      });
    }
  }

  destroy() {
    this.text = '';
    this.textList.length = 0;
    this.display.text = '';
    TimelineUpdate.removeFrameCallback(this.drawing);

    this.materials.destroy();
    super.destroy();
  }
}

module.exports = FFSubtitle;
