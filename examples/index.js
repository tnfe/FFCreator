const path = require('path');
const fs = require('fs-extra');
const colors = require('colors');
const inquirer = require('inquirer');
const imageDemo = require('./image');
const albumDemo = require('./album');
const videoDemo = require('./video');
const subtitleDemo = require('./subtitle');
const transitionDemo = require('./transition');

const initCommand = () => {
  inquirer
    .prompt([
      {
        type: 'rawlist',
        message: 'Please select the demo you want to run:',
        name: 'val',
        choices: [
          {
            name: 'Picture animation video',
            value: 'image',
          },
          {
            name: 'Album transition video',
            value: 'album',
          },
          {
            name: 'Subtitle and voice demo',
            value: 'subtitle',
          },
          {
            name: 'Scene transition effect',
            value: 'transition',
          },
          {
            name: 'Video animation demo',
            value: 'video',
          },
          {
            name: 'Clear all caches and videos',
            value: 'clear',
          },
        ],
      },
    ])
    .then(runDemo);
};

const runDemo = answer => {
  switch (answer.val) {
    case 'image':
      printRestartInfo();
      imageDemo();
      break;

    case 'album':
      printRestartInfo();
      albumDemo();
      break;

    case 'subtitle':
      printRestartInfo();
      subtitleDemo();
      break;

    case 'transition':
      printRestartInfo();
      transitionDemo();
      break;

    case 'video':
      printRestartInfo();
      videoDemo();
      break;

    case 'clear':
      clearAllFiles();
      break;
  }
};

const printRestartInfo = () =>
  console.log(colors.green(`\n --- You can press the s key or the w key to restart! --- \n`));

const clearAllFiles = () => {
  fs.remove(path.join(__dirname, './output'));
  fs.remove(path.join(__dirname, './cache'));
};

initCommand();
