const path = require('path');
const colors = require('colors');
const startAndListen = require('./listen');
const { FFCreatorCenter, FFScene, FFImage, FFCreator, FFVideo, FFTransition, FFAudio } = require('../');

const createFFTask = () => {
  const bg1 = path.join(__dirname, './assets/imgs/bg/05.jpg');
  const bg2 = path.join(__dirname, './assets/imgs/bg/04.jpeg');
  const logo2 = path.join(__dirname, './assets/imgs/logo/logo2.png');
  const cloud = path.join(__dirname, './assets/imgs/cloud.png');
  const mars = path.join(__dirname, './assets/imgs/mars.png');
  const rock = path.join(__dirname, './assets/imgs/rock.png');
  const title = path.join(__dirname, './assets/imgs/title.png');
  const vtuber = path.join(__dirname, './assets/video/vtuber.mp4');
  const audio = path.join(__dirname, './assets/audio/01.wav');
  const audio_bg = path.join(__dirname, './assets/audio/05.wav');
  const outputDir = path.join(__dirname, './output/');
  const cacheDir = path.join(__dirname, './cache/');

  // create creator instance
  const width = 576;
  const height = 1024;
  const creator = new FFCreator({
    cacheDir,
    outputDir,
    width,
    height,
    // log: true,
    highWaterMark: '3mb',
    parallel: 8,
    fps: 30,
    audio_bg,
    // render: 'canvas',
  });

  // create FFScene
  const scene1 = new FFScene();
  const scene2 = new FFScene();
  scene1.setBgColor('#0b0be6');
  scene2.setBgColor('#b33771');

  // add scene1 background
  const fbg1 = new FFImage({ path: bg1, x: width / 2, y: height / 2 });
  fbg1.setBlur(10);
  scene1.addChild(fbg1);

  const fimg1 = new FFImage({
    path: bg2,
    x: width / 2,
    y: 0,
    width: 150,
    height: 150,
    id: 'img_cover',
    blur: 10,
    // default should be cover
  });
  fimg1.setAnchor(0.5, 0);
  fimg1.setScale(0.5);
  scene1.addChild(fimg1);

  const fimg2 = new FFImage({
    path: bg2,
    x: width / 2,
    y: (height / 2) - 150,
    width: 150,
    height: 150,
    fit: 'none',
    id: 'img_none',
  });
  fimg2.setAnchor(0.5);
  fimg2.setScale(0.5);
  scene1.addChild(fimg2);

  const fimg3 = new FFImage({
    path: bg2,
    x: width / 2,
    y: (height / 2) + 150,
    width: 150,
    height: 150,
    fit: 'fill',
    id: 'img_fill',
  });
  fimg3.setAnchor(0.5);
  fimg3.setScale(0.5);
  scene1.addChild(fimg3);

  const fimg4 = new FFImage({
    path: bg2,
    x: width / 2,
    y: height,
    width: 150,
    height: 150,
    fit: 'contain',
    id: 'img_contain',
  });
  fimg4.setAnchor(0.5, 1);
  fimg4.setScale(0.5);
  scene1.addChild(fimg4);

  // add bottom cloud
  const fcloud = new FFImage({ path: cloud, x: width });
  fcloud.setAnchor(1);
  fcloud.addAnimate({
    from: { y: height + 180 },
    to: { y: height },
    time: 0.8,
    ease: 'Back.Out',
  });
  scene1.addChild(fcloud);

  const fvtuber = new FFVideo({ path: vtuber, x: 0, y: height, width: width / 2, height: width / 4, fit: "cover" });
  fvtuber.setAnchor(0, 1);
  fvtuber.setCutoutColor(110, 130);
  scene1.addChild(fvtuber);

  // add mars ball
  const fmars = new FFImage({ path: mars, x: width / 2, y: height / 2 });
  fmars.addEffect(['rollIn', 'zoomIn'], 1.8, 0.8);
  scene1.addChild(fmars);

  // add rock image
  const frock = new FFImage({ path: rock, x: width / 2 + 100 });
  frock.addAnimate({
    from: { y: height / 2 + 720 },
    to: { y: height / 2 + 80 },
    time: 1,
    delay: 2.3,
    ease: 'Cubic.InOut',
  });
  scene1.addChild(frock);

  // add rock image
  const ftitle = new FFImage({ path: title, x: width / 2, y: height / 2 - 300 });
  ftitle.addEffect('fadeInUp', 1, 4);
  scene1.addChild(ftitle);

  // add logo
  const flogo1 = new FFImage({ path: logo2, x: width / 2, y: 50 });
  flogo1.setScale(0.5);
  scene1.addChild(flogo1);

  scene1.setDuration(3);
  // scene1.setTransition('InvertedPageCurl', 1.5);
  creator.addChild(scene1);

  const trans = new FFTransition({name: 'InvertedPageCurl', duration: 1.5});
  creator.addChild(trans);

  // add scene2 background
  const fbg2 = new FFImage({ path: bg2, x: width / 2, y: height / 2 });
  scene2.addChild(fbg2);
  // add logo
  const flogo2 = new FFImage({ path: logo2, x: width / 2, y: height / 2 - 80 });
  flogo2.setScale(0.9);
  flogo2.addEffect('fadeInDown', 1, 1.2);
  scene2.addChild(flogo2);

  scene2.addAudio(new FFAudio({src: audio, fadeOut: 1.5}));

  scene2.setDuration(3);
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
