const path = require('path');
const colors = require('colors');
const startAndListen = require('./listen');
const { FFCreatorCenter, FFScene, FFAudio, FFAlbum, FFText, FFImage, FFCreator } = require('../');

const createFFTask = () => {
  const bg = path.join(__dirname, './assets/imgs/bg/02.jpeg');
  const logo1 = path.join(__dirname, './assets/imgs/logo/logo1.png');
  const logo2 = path.join(__dirname, './assets/imgs/logo/logo2.png');
  const img1 = path.join(__dirname, './assets/imgs/album/01.jpeg');
  const img2 = path.join(__dirname, './assets/imgs/album/02.jpeg');
  const img3 = path.join(__dirname, './assets/imgs/album/03.jpeg');
  const img4 = path.join(__dirname, './assets/imgs/album/04.jpeg');
  const img5 = path.join(__dirname, './assets/imgs/album/05.jpeg');
  const cover = path.join(__dirname, './assets/imgs/cover/cover1.jpg');
  const audio = path.join(__dirname, './assets/audio/03.wav');
  const outputDir = path.join(__dirname, './output/');
  const cacheDir = path.join(__dirname, './cache/');

  // create creator instance
  const width = 576;
  const height = 1024;
  const creator = new FFCreator({
    cover,
    cacheDir,
    outputDir,
    width,
    height,
    debug: false,
    log: true,
  });

  creator.addAudio(new FFAudio({ path: audio, volume: 0.9, fadeIn: 4, fadeOut: 4, loop: true }));

  // create FFScene
  const scene1 = new FFScene();
  const scene2 = new FFScene();
  scene1.setBgColor('#3b3a98');
  scene2.setBgColor('#b33771');

  // add new album
  const album = new FFAlbum({
    list: [img1, img2, img3, img4, img5],
    x: width / 2,
    y: height / 2,
    width: width,
    height: 384,
    showCover: false,
  });
  album.setTransition('zoomIn');
  album.setDuration(2);
  scene1.addChild(album);

  // add title
  const text1 = new FFText({ text: '多图相册DEMO', x: width / 2, y: 150, fontSize: 40 });
  text1.setColor('#ffffff');
  text1.setBackgroundColor('#01003c');
  text1.addEffect('fadeInUp', 1, 1);
  text1.alignCenter();
  text1.setStyle({ padding: 10 });
  scene1.addChild(text1);

  const text2 = new FFText({
    text: '可以支持多种动画切换和自定义动画效果',
    x: width / 2,
    y: 250,
    fontSize: 24,
  });
  text2.setColor('#ffffff');
  text2.addEffect('fadeInUp', 1, 2);
  text2.alignCenter();
  scene1.addChild(text2);

  // add logo
  const flogo2 = new FFImage({ path: logo2, x: width / 2, y: 60 });
  flogo2.setScale(0.6);
  scene1.addChild(flogo2);

  scene1.setDuration(album.getTotalDuration() + 1);
  scene1.setTransition('Shake', 1.5);
  creator.addChild(scene1);

  // add scene2 background
  const fbg = new FFImage({ path: bg });
  fbg.setXY(width / 2, height / 2);
  scene2.addChild(fbg);
  // add logo
  const flogo1 = new FFImage({ path: logo1, x: width / 2, y: height / 2 - 150 });
  flogo1.addEffect('fadeInDown', 1, 1.2);
  scene2.addChild(flogo1);

  scene2.setDuration(5);
  creator.addChild(scene2);

  creator.start();
  // creator.openLog();

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
