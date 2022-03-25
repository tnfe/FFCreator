
const FFBase = require('./base');
const { DisplayObject } = require('../../inkpaint/lib/index');

class FFClip extends FFBase {
  parent = null;
  prevSibling = null;
  nextSibling = null;
  zIndex = 0;

  constructor(conf = {}) {
    super({ type: 'clip', ...conf });
    this.children = [];
    this.onTime = () => false;
    this.createDisplay();
  }

  createDisplay() {
    this.display = new DisplayObject();
  }

  addChild(child) {
    if (Array.isArray(child)) {
      child.map(x => this.addChild(x));
      return this;
    }
    if (this.children.includes(child)) return this;
    child.parent = this;
    this.children.push(child);
    return this;
  }

  removeChild(child) {
    //todo
  }

  addDisplayChild(display) {
    this.parent.addDisplayChild(display);
  }

  removeDisplayChild(display) {
    this.parent.removeDisplayChild(display);
  }

  addTimelineCallback() {
    if (this._drawing) return;
    this._drawing = this.drawing.bind(this);
    this.addFrameCallback(this._drawing);
  }

  async drawing(timeInMs = 0, nextDeltaInMS = 0) {
    if (!this.onTime(timeInMs * 0.001)) return false;
    if (nextDeltaInMS === 0) {
      // seek的时候，需要强制动一下
      this.animations && this.animations.start() && timeInMs;
    }
    return true;
  }

  preProcessing() {
    return new Promise(resolve => resolve());
  }

  prepareMaterial() {
    return new Promise(resolve => resolve());
  }

  show() {
    this.display.zIndex = this.zIndex;
    this.parent.addDisplayChild(this.display);
  }

  hide() {
    this.parent.removeDisplayChild(this.display);
  }

  annotate() {
    const start = this.absStartTime;
    const end = this.absEndTime;
    let [ showStart, showEnd ] = [ start, end ];
    if (this.prevSibling?.type === 'trans') {
      showStart += this.prevSibling.duration;
    }
    if (this.nextSibling?.type === 'trans') {
      showEnd -= this.nextSibling.duration;
    }
    // console.log('clip.annotate', this.id, {showStart, showEnd, start, end});
    this.addTimelineCallback();
    this.onTime = (absTime) => {
      const show = (absTime >= showStart && absTime < showEnd);
      const draw = (absTime >= start && absTime < end);
      show ? this.show() : this.hide();
      return draw;
    }
  }

  get basezIndex() {
    return Number(this.conf.zIndex) * 10000 || this.parent?.basezIndex || 0;
  }

  get allNodes() {
    let nodes = this.children;
    this.children.map(x => {
      nodes = nodes.concat(x.allNodes);
    });
    return nodes;
  }

  get absStartTime() {
    return this.parent.startTime + this.startTime;
  }

  get absEndTime() {
    return this.parent.startTime + this.endTime;
  }

  get default() {
    return {
      startTime: this.prevSibling?.endTime || 0,
      endTime: '100%',
    }
  }

  get startTime() {
    const start = this.time(this.conf.start);
    return !isNaN(start) ? start : this.time(this.default.startTime);
  }

  get duration() {
    return this.endTime - this.startTime;
  }

  get endTime() {
    const endTime = (() => {
      const end = this.time(this.conf.end);
      if (!isNaN(end)) return end;
      let duration = this.time(this.conf.duration);
      duration = !isNaN(duration) ? duration : this.time(this.default.duration);
      if (!isNaN(duration)) return this.startTime + duration;
      const defaultEnd = this.time(this.default.endTime);
      if (defaultEnd > this.startTime) return defaultEnd;
      return this.startTime + 1;
    })();
    if (this.parent.type !== 'scene') return endTime;
    // scene的子元素，会被截到跟它一样长
    return Math.min(this.parent.duration, endTime);
  }

  time(time) {
    const parentDuration = this.parent.duration;
    if (typeof(time) === 'string' && 
        time.endsWith('%') && !isNaN(time.replace('%', ''))) {
      time = parentDuration * Number(time.replace('%', '')) * 0.01;
    } else {
      time = Number(time);
    }
    return time < 0 ? parentDuration + time : time;
  }

  destroy() {
    super.destroy();
    this.removeFrameCallback(this._drawing);
    this.children.map(child => child.destroy());
    this.children = null;
    this.display = null;
  }
}

module.exports = FFClip;