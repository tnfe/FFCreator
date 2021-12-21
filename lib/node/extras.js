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
    this.setAnchor(0.5);
    this.init && this.init(InkPaint);
    this.emit('init');
  }

  drawing(time) {
    this.update && this.update(time);
    this.emit('update');
  }

  destroy() {
    this.emit('destroy');
    super.destroy();
    this.update = null;
    this.container = null;
    this.destroyed && this.destroyed(InkPaint);
  }
}

module.exports = FFExtras;
