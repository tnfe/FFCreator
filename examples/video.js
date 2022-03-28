const path = require('path');
const colors = require('colors');
const startAndListen = require('./listen');
const { FFCreatorCenter, FFScene, FFVideo, FFImage, FFCreator, FFTransition } = require('../');

const createFFTask = () => {
  const bg1 = path.join(__dirname, './assets/imgs/bg/h03.jpg');
  const bg2 = path.join(__dirname, './assets/imgs/bg/h02.jpg');
  const logo1 = path.join(__dirname, './assets/imgs/logo/logo1.png');
  const logo2 = path.join(__dirname, './assets/imgs/logo/logo2.png');
  const dragon = path.join(__dirname, './assets/imgs/dragon.png');
  const video1 = path.join(__dirname, './assets/video/video1.mp4');
  const outputDir = path.join(__dirname, './output/');
  const cacheDir = path.join(__dirname, './cache/');

  // create creator instance
  const width = 600;
  const height = 300;
  const creator = new FFCreator({
    cacheDir,
    outputDir,
    width,
    height,
    fps: 30,
    log: true,
    highWaterMark: '3mb',
  });
  // create FFScene
  const scene1 = new FFScene();
  const scene2 = new FFScene();
  scene1.setBgColor('#7e5fff');
  scene2.setBgColor('#2c3a47');

  const fbg1 = new FFImage({ path: bg1, x: width / 2, y: height / 2 });
  scene1.addChild(fbg1);
  // add bottom cloud
  const fvideo = new FFVideo({
    path: video1,
    width: height * 0.5,
    height: height * 0.5,
    fit: 'cover',
    x: width / 2,
    y: height / 2,
    ss: '00:00:03',
    to: '00:00:13',
    blur: 10,
  });
  fvideo.addEffect('backInUp', 0.5, 0.5);
  // fvideo.setScale(0.3);
  fvideo.setAudio(true);
  scene1.addChild(fvideo);

  // add dragon image
  const fdragon = new FFImage({ path: dragon, x: 100, y: height / 2 - 30 });
  fdragon.setScale(0.5);
  fdragon.addEffect('fadeInUp', 1, 0.5);
  scene1.addChild(fdragon);

  // add logo
  const flogo1 = new FFImage({ path: logo1, x: width / 2, y: 50 });
  flogo1.setScale(0.5);
  scene1.addChild(flogo1);

  scene1.setDuration(3);
  creator.addChild(scene1);

  const trans = new FFTransition({name: 'Magnifier', duration: 1.5});
  creator.addChild(trans);

  // add scene2 background
  const fbg2 = new FFImage({ path: bg2, x: width / 2, y: height / 2 });
  scene2.addChild(fbg2);

  // add logo
  const flogo2 = new FFImage({ path: logo2, x: width / 2, y: height / 2 - 20 });
  flogo2.setScale(0.9);
  flogo2.addEffect('zoomIn', 1, 1.2);
  scene2.addChild(flogo2);

  scene2.setDuration(3);
  creator.addChild(scene2);

  creator.start();
  //creator.openLog();

  creator.on('start', () => {
    console.log(`FFCreator start`);
  });

  creator.on('error', e => {
    console.log(`FFCreator error: ${e.error}`);
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
