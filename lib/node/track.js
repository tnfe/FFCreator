const FFClip = require('../core/clip');

class FFTrack extends FFClip {
  constructor(conf = {}) {
    super({ type: 'track', ...conf });
  }

  addChild(child) {
    super.addChild(child);
    // set prev/next sibling.
    for (let i = 0; i < this.children.length; i++) {
      if (i == 0) continue;
      const prevSibling = this.children[i - 1];
      this.children[i].prevSibling = prevSibling;
      prevSibling.nextSibling = this.children[i];
    }
  }

  createDisplay() { }

  annotate() {
    const lastChild = this.children[this.children.length - 1];
    this.lastChildEndTime = lastChild.endTime;
  }

  get startTime() {
    return 0;
  }

  get duration() {
    return this.endTime - this.startTime;
  }

  get endTime() {
    return this.lastChildEndTime;
  }

}

module.exports = FFTrack;