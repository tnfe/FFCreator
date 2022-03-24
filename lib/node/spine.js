const FFTrack = require('./track');

class FFSpine extends FFTrack {
  constructor(conf = {}) {
    super({ type: 'spine', ...conf });
  }
}

module.exports = FFSpine;