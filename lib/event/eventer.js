'use strict';

/**
 * FFEventer - An auxiliary incident management eventer
 * Used to manage events such as start, processing, error, etc., which can better save memory overhead.
 *
 * ####Example:
 *
 *     const events = new FFEventer(this);
 *     events.emit({type: 'start'});
 *     events.emit({type: 'complete'});
 *
 * @class
 */
const FFEvent = require('./event');
const EventEmitter = require('eventemitter3');
const Utils = require('../utils/utils');

class FFEventer extends EventEmitter {
  constructor() {
    super();
  }

  /**
   * Trigger the progress event
   * @public
   */
  emitProgress(data) {
    if (!this.progressEvent) this.progressEvent = new FFEvent();
    this.progressEvent.init(data);
    this.emit('progress', this.progressEvent);
  }

  /**
   * Trigger an error event, you can locate the location of the error
   * @public
   */
  emitError({ pos, error }) {
    const event = new FFEvent();
    event.pos = pos;
    event.error = Utils.getErrStack(error);
    this.emit('error', event);
  }

  /**
   * Trigger an ordinary event
   * @public
   */
  emit(type, args = {}) {
    if (typeof type === 'object') {
      const event = new FFEvent(type);
      type = event.type;
      args = event;
    } else {
      args.type = type;
    }

    super.emit(type, args);
    super.emit('*-*', args);
  }

  /**
   * Bundle bubbling function
   * @public
   */
  bubble(eventer) {
    eventer.on('*-*', event => this.emit(event.type, event));
  }

  destroy() {
    this.removeAllListeners();
  }
}

module.exports = FFEventer;
