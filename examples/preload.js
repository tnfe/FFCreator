const path = require('path');
const colors = require('colors');
const startAndListen = require('./listen');
const { FFCreatorCenter, FFScene, FFImage, FFCreator } = require('../');

const createFFTask = () => {
  const bg1 = path.join(__dirname, './assets/imgs/album/02.jpeg');
  const bg2 = path.join(__dirname, './assets/imgs/album/03.jpeg');
  const logo1 = path.join(__dirname, './assets/imgs/logo/logo1.png');
  const logo2 = path.join(__dirname, './assets/imgs/logo/logo2.png');
  const img1 =
    'https://gw.alicdn.com/imgextra/i3/O1CN01uRz3de23mzWofmPYX_!!6000000007299-2-tps-143-59.png';
  const img2 = 'http://qzonestyle.gtimg.cn/qz-proj/weishi-pc/img/index/logo-l@2x.png';
  const img3 = 'https://mat1.gtimg.com/sports/sports/3.png';
  const img4 = 'https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png';
  const img5 = path.join(__dirname, './assets/imgs/txlogo.png');
  const img6 = path.join(__dirname, './assets/imgs/baidu.png');
  const audio = path.join(__dirname, './assets/audio/05.wav');
  const outputDir = path.join(__dirname, './output/');
  const cacheDir = path.join(__dirname, './cache/');

  const imgs = [img1, img2, img3, img4, img5, img6];
  const effects = shuffle([
    'backIn',
    'rotateIn',
    'backInLeft',
    'fadeInUp',
    'zoomIn',
    'fadeInDown',
    'fadeInDownBig',
  ]);

  // create creator instance
  const width = 800;
  const height = 600;
  const creator = new FFCreator({
    cacheDir,
    outputDir,
    width,
    height,
    log: true,
    parallel: 8,
    //renderClarity: 'high',
    // render: 'canvas',
    // audio,
  });

  // create FFScene
  const scene1 = new FFScene();
  const scene2 = new FFScene();
  scene1.setBgColor('#00cd1d');
  scene2.setBgColor('#b33771');
  // scene1.setFXAA(true);

  // add scene1 background
  const fbg1 = new FFImage({ path: bg1, x: width / 2, y: height / 2 });
  scene1.addChild(fbg1);

  for (let i = 0; i < imgs.length; i++) {
    const d = 80;
    const x = randomA2B(d, width - d);
    const y = randomA2B(d, height - d);
    const fimg = new FFImage({ path: imgs[i], x, y });
    fimg.addEffect(effects[i], randomA2B(1, 2), randomA2B(0.8, 5));
    scene1.addChild(fimg);
  }

  // add logo
  const flogo1 = new FFImage({ path: logo1, x: width / 2 - 200, y: 100 });
  flogo1.setScale(0.5);
  scene1.addChild(flogo1);

  const flogo2 = new FFImage({ path: logo1, x: width / 2 + 200, y: 100 });
  scene1.addChild(flogo2);

  scene1.setDuration(8);
  scene1.setTransition('InvertedPageCurl', 1.5);
  creator.addChild(scene1);

  // add scene2 background
  const fbg2 = new FFImage({ path: bg2, x: width / 2, y: height / 2 });
  scene2.addChild(fbg2);
  // add logo
  const flogo3 = new FFImage({ path: logo2, x: width / 2, y: height / 2 - 80 });
  flogo3.setScale(0.9);
  flogo3.addEffect('fadeInDown', 1, 1.2);
  scene2.addChild(flogo3);

  scene2.setDuration(5);
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

function randomA2B(a, b, int) {
  const result = Math.random() * (b - a) + a;
  return int ? Math.floor(result) : result;
}

function shuffle(array) {
  return array.sort(() => 0.5 - Math.random());
}

module.exports = () => startAndListen(() => FFCreatorCenter.addTask(createFFTask));
