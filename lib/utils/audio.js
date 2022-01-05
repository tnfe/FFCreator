'use strict';

/**
 * AudioUtil - Utils functions related to audio
 *
 * @object
 */
const { isBrowser } = require("browser-or-node");
if (isBrowser) window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext;

const AudioUtil = {
  setMediaElement(elm, opts) {
    const context = new AudioContext();
    const source = context.createMediaElementSource(elm);
    AudioUtil.connectSource(context, source, opts);
    return source;
  },

  connectSource(context, source, opts) {
    let sourceNode = source;
    if (opts) {
      const nodes = [];
      const { volume } = opts;

      if (volume) {
        const gainNode = context.createGain();
        gainNode.gain.value = volume;
        nodes.push(gainNode);
      }

      for (let node of nodes) {
        sourceNode.connect(node);
        sourceNode = node;
      }
    }
    sourceNode.connect(context.destination);
  }
}

module.exports = AudioUtil;