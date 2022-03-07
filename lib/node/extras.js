'use strict';

/**
 * FFExtras - A component that can be expanded freely
 *
 * ####Example:
 *
 *     const extras = new FFExtras();
 *     extras.init = function(InkPaint){ ... }
 *     extras.update = function(InkPaint){ ... }
 *     extras.destroyed = function(InkPaint){ ... }
 *     scene.addChild(extras);
 *
 * @class
 */
const InkPaint = require('inkpaint');
const FFNode = require('./node');
const TimelineUpdate = require('../timeline/update');

class FFExtras extends FFNode {
  constructor(conf = { animations: [] }) {
    super({ type: 'extras', ...conf });
  }

  /**
   * Create display object.
   * @private
   */
  createDisplay() {
    this.display = new InkPaint.Container();
    this.container = this.display;
  }

  /**
   * Start rendering
   * @private
   */
  start() {
    super.start();
    this.drawing = this.drawing.bind(this);
    TimelineUpdate.addFrameCallback(this.drawing);
    this.init && this.init(InkPaint);
    this.emit('init');
  }

  drawing(time, delta) {
    this.update && this.update(InkPaint, time, delta);
    this.emit('update');
  }

  destroyContainer() {
    try {
      this.container.destroy();
      this.container.removeAllChildren();
    } catch (e) {}
  }

  destroy() {
    super.destroy();
    this.destroyContainer();
    TimelineUpdate.removeFrameCallback(this.drawing);

    this.destroyed && this.destroyed(InkPaint);
    this.emit('destroy');

    this.update = null;
    this.drawing = null;
    this.container = null;
  }
}

module.exports = FFExtras;
