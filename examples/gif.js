const path = require('path');
const colors = require('colors');
const startAndListen = require('./listen');
const { FFCreatorCenter, FFAudio, FFScene, FFImage, FFGifImage, FFCreator, FFTransition } = require('../');

const createFFTask = () => {
  const bg1 = path.join(__dirname, './assets/imgs/bg/06.jpg');
  const bg2 = path.join(__dirname, './assets/imgs/bg/01.jpeg');
  const logo1 = path.join(__dirname, './assets/imgs/logo/logo1.png');
  const logo2 = path.join(__dirname, './assets/imgs/logo/logo2.png');
  const cat = path.join(__dirname, './assets/imgs/gif/cart.gif');
  const heart = path.join(__dirname, './assets/imgs/gif/hert.gif');
  const girl = path.join(__dirname, './assets/imgs/gif/girl.gif');
  const duck = path.join(__dirname, './assets/imgs/gif/duck.gif');
  const audio = path.join(__dirname, './assets/audio/05.wav');
  const outputDir = path.join(__dirname, './output/');
  const cacheDir = path.join(__dirname, './cache/');

  // create creator instance
  const width = 576 / 2;
  const height = 1024 / 2;
  const creator = new FFCreator({
    cacheDir,
    outputDir,
    width,
    height,
    debug: false,
    highWaterMark: '3mb',
    parallel: 8,
  });

  creator.addAudio(new FFAudio({ path: audio, volume: 0.9, fadeIn: 3 }));

  // create FFScene
  const scene1 = new FFScene();
  const scene2 = new FFScene();
  scene1.setBgColor('#0b0be6');
  scene2.setBgColor('#b33771');

  // add scene1 background
  const fbg1 = new FFImage({ path: bg1, x: width / 2, y: height / 2 });
  fbg1.setScale(0.5);
  scene1.addChild(fbg1);

  const fduck = new FFGifImage({ path: duck, x: width / 2, y: height / 2, width: width / 2, id: 'duck' });
  fduck.setAnchor(0.5, 0.5);
  scene1.addChild(fduck);

  // add gif image
  const fcat = new FFGifImage({ path: cat, x: width / 2, y: height / 2 - 50, id: 'cat' });
  fcat.addEffect('zoomIn', 2, 1);
  fcat.setScale(0.3);
  fcat.setSpeed(0.5);
  scene1.addChild(fcat);

  const fheart = new FFGifImage({ path: heart, x: width / 2, y: height / 2 - 100, id: 'heart' });
  fheart.addEffect('fadeIn', 1.5, 0.5);
  fheart.addEffect('fadeOut', 1.5, 3.5);
  fheart.setScale(0.5);
  scene1.addChild(fheart);

  const fgirl = new FFGifImage({ path: girl, x: width / 2, y: height + 125, id: 'girl', width: 150});
  fgirl.addEffect('backInUp', 1.2, 0.5);
  fgirl.setAnchor(0.5, 1);
  fgirl.setScale(0.5);
  fgirl.setSpeed(2);
  scene1.addChild(fgirl);

  // add logo
  const flogo1 = new FFImage({ path: logo1, x: width / 2, y: 50 });
  flogo1.setScale(0.35);
  scene1.addChild(flogo1);

  scene1.setDuration(5);
  // scene1.setTransition('ButterflyWaveScrawler', 1.5);
  creator.addChild(scene1);

  const trans = new FFTransition({name: 'ButterflyWaveScrawler', duration: 1.5});
  creator.addChild(trans);

  // add scene2 background
  const fbg2 = new FFImage({ path: bg2, x: width / 2, y: height / 2 });
  fbg2.setScale(0.5);
  scene2.addChild(fbg2);
  // add logo
  const flogo2 = new FFImage({ path: logo2, x: width / 2, y: height / 2 - 40 });
  flogo2.setScale(0.5);
  flogo2.addEffect('fadeInDown', 1, 1.2);
  scene2.addChild(flogo2);

  scene2.setDuration(2);
  creator.addChild(scene2);
  creator.start();
  //creator.openLog();

  creator.on('start', () => {
    console.log(`FFCreator start`);
  });

  creator.on('error', e => {
    console.log(colors.red(`FFCreator error: ${e.error}`));
  });

  creator.on('progress', e => {
    console.log(colors.yellow(`FFCreator progress: ${(e.percent * 100) >> 0}%`));
  });

  creator.on('complete', e => {
    console.log(
      colors.magenta(`FFCreator completed: \n USEAGE: ${e.useage} \n PATH: ${e.output} `),
    );

    console.log(colors.green(`\n --- You can press the s key or the w key to restart! --- \n`));
  });

  return creator;
};

module.exports = () => startAndListen(() => FFCreatorCenter.addTask(createFFTask));
