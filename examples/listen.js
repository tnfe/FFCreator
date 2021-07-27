const keypress = require('keypress');

const startAndListen = func => {
  keypress(process.stdin);

  process.stdin.on('keypress', function(ch, key) {
    console.log('got "keypress"', key);
    if (key && (key.name === 's' || key.name === 'w')) {
      func();
    }

    if (key && (key.name === 'q' || (key.name === 'c' && key.ctrl === true))) {
      process.exit();
    }
  });
  process.stdin.setRawMode(true);
  process.stdin.resume();

  func();
};

module.exports = startAndListen;
