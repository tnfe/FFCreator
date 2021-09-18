const path = require('path');
const colors = require('colors');
const startAndListen = require('./listen');
const { FFCreatorCenter, FFScene, FFAlbum, FFText, FFImage, FFCreator } = require('../');

const createFFTask = () => {
  const logo2 = path.join(__dirname, './assets/imgs/logo/logo2.png');
  const img1 = path.join(__dirname, './assets/imgs/album/01.jpeg');
  const img2 = path.join(__dirname, './assets/imgs/album/02.jpeg');
  const img3 = path.join(__dirname, './assets/imgs/album/03.jpeg');
  const img4 = path.join(__dirname, './assets/imgs/album/04.jpeg');
  const img5 = path.join(__dirname, './assets/imgs/album/05.jpeg');
  const audio = path.join(__dirname, './assets/audio/03.wav');
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
    debug: false,
    //threads: 4,
    audio,
  });

  // add custom effect
  creator.createEffect('customEffect1', {
    from: { alpha: 0, y: 350, rotate: 2 * Math.PI, scale: 0.3 },
    to: { alpha: 1, y: 200, rotate: 0, scale: 1 },
    ease: 'Back.Out',
  });

  creator.createEffect('customEffect2', {
    from: { alpha: 0, x: -300, scale: 0.2, rotate: Math.PI },
    to: { alpha: 1, x: 0, scale: 1, rotate: 0 },
    ease: 'Back.InOut',
  });

  // create FFScene
  const scene1 = new FFScene();
  scene1.setBgColor('#3b3a98');

  // add new album
  const album = new FFAlbum({
    list: [img1, img2, img3, img4, img5],
    x: width / 2,
    y: height / 2,
    width: width,
    height: 384,
  });
  album.setTransition('customEffect2');
  album.setDuration(2);
  scene1.addChild(album);

  // add title
  const text = new FFText({ text: '多图相册DEMO', x: width / 2, y: 150, fontSize: 40 });
  text.setColor('#ffffff');
  text.setBackgroundColor('#01003c');
  text.addEffect('customEffect1', 1.8, 1);
  text.alignCenter();
  text.setStyle({ padding: [4, 20, 6, 20] });
  scene1.addChild(text);

  // add logo
  const flogo2 = new FFImage({ path: logo2, x: width / 2, y: 60 });
  flogo2.setScale(0.6);
  flogo2.addEffect('backInDown', 1, 3);
  scene1.addChild(flogo2);

  scene1.setDuration(album.getTotalDuration() + 2);
  creator.addChild(scene1);

  ////////////////////////////////////////////////////////////////
  creator.start();
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
