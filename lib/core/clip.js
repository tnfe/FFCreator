
const FFBase = require('./base');

class FFClip extends FFBase {
  parent = null;
  prevSibling = null;
  nextSibling = null;

  constructor(conf = {}) {
    super({ type: 'clip', ...conf });
    this.children = [];
    this.onTime = () => false;
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

  addDisplayChild(display) {
    this.parent.addDisplayChild(display);
  }

  removeDisplayChild(display) {
    this.parent.removeDisplayChild(display);
  }

  addTimelineCallback() {
    this.drawing = this.drawing.bind(this);
    this.addFrameCallback(this.drawing);
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

  annotate() {
    const start = this.absStart;
    const end = this.absEnd;
    let [ showStart, showEnd ] = [ start, end ];
    if (this.prevSibling?.type === 'transition') {
      showStart += this.prevSibling.duration;
    }
    if (this.nextSibling?.type === 'transition') {
      showEnd -= this.nextSibling.duration;
    }
    this.onTime = (absTime) => {
      if (absTime < showStart || absTime >= showEnd) {
        this.parent.removeDisplayChild(this.display);
      } else {
        this.parent.addDisplayChild(this.display);
      }
      return (absTime >= start && absTime < end);
    }
  }

  get allNodes() {
    let nodes = this.children;
    this.children.map(x => {
      nodes = nodes.concat(x.allNodes);
    });
    return nodes;
  }

  get absStart() {
    return this.parent.start + this.start;
  }

  get absEnd() {
    return this.parent.start + this.end;
  }

  get default() {
    return {
      start: this.prevSibling?.end || 0,
      end: '100%',
    }
  }

  get start() {
    const start = this.time(this.conf.start);
    return !isNaN(start) ? start : this.time(this.default.start);
  }

  get duration() {
    return this.end - this.start;
  }

  get end() {
    const end = this.time(this.conf.end);
    if (!isNaN(end)) return end;
    let duration = this.time(this.conf.duration);
    duration = !isNaN(duration) ? duration : this.time(this.default.duration);
    if (!isNaN(duration)) return this.start + duration;
    const defaultEnd = this.time(this.default.end);
    if (defaultEnd > this.start) return defaultEnd;
    return this.start + 1;
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
}

module.exports = FFClip;