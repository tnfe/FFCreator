'use strict';

/**
 * FFEvent - A FFCreator customized event class.
 *
 * ####Example:
 *
 *     const event = new FFEvent({type: 'start'});
 *     event.state = 'begin';
 *
 * @class
 */
class FFEvent {
  constructor(event) {
    this.init(event);
  }

  init(event = {}) {
    const {
      type = 'normal',
      command = null,
      error = null,
      errorType = '',
      output = '',
      state = '',
      percent = 0,
    } = event;

    this.type = type;
    this.output = output;
    this.error = error;
    this.state = state;
    this.command = command;
    this.percent = percent;
    this.errorType = errorType;
  }
}

module.exports = FFEvent;
