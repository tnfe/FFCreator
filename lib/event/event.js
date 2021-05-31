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
    event.type = event.type || 'normal';
    Object.assign(this, event);
  }
}

module.exports = FFEvent;
