'use strict';

/**
 * EventHelper - An auxiliary incident management helper
 * Used to manage events such as start, processing, error, etc., which can better save memory overhead.
 *
 * ####Example:
 *
 *     const eventHelper = new EventHelper(this);
 *     eventHelper.emit({type: 'start'});
 *     eventHelper.emit({type: 'complete'});
 *
 * @class
 */
const FFEvent = require('./event');
const Utils = require('../utils/utils');

class EventHelper {
  constructor(target) {
    this.index = 0;
    this.freq = 1;
    this.target = target;
    this.progressEvent = new FFEvent();
  }

  setFreq(freq) {
    this.freq = freq;
  }

  /**
   * Trigger the progress event
   * @public
   */
  emitProgress(obj) {
    this.progressEvent.init(obj);
    this.emit(this.progressEvent.type, this.progressEvent);
  }

  /**
   * To calculate the processing progress,
   * only one event is used here to save memory
   * @public
   */
  calAndEmitProgress({ type, state, percent }) {
    this.progressEvent.type = type;
    this.progressEvent.state = state;
    this.progressEvent.percent += percent;
    this.progressEvent.percent = Math.min(this.progressEvent.percent, 1);
    this.progressEvent.percent = Utils.floor(this.progressEvent.percent, 5);

    if (this.index % this.freq === 0 || percent >= 1) this.target.emit(type, this.progressEvent);
    this.index++;
  }

  /**
   * Trigger an error event, you can locate the location of the error
   * @public
   */
  emitError({ type, pos, error, errorType }) {
    const event = new FFEvent();
    event.pos = pos;
    event.errorType = errorType;
    event.error = Utils.getErrStack(error);

    this.target.emit(type, event);
  }

  /**
   * Trigger an ordinary event
   * @public
   */
  emit(type, args) {
    if (typeof type === 'object') {
      const event = new FFEvent(type);
      this.target.emit(event.type, event);
    } else {
      this.target.emit(type, args);
    }
  }

  bind(eventName) {
    return event => this.target.emit(eventName, event);
  }

  destroy() {
    this.index = 0;
    this.target = null;
  }
}

module.exports = EventHelper;
