import { FFAudio, FFCreator, FFGifImage, FFImage, FFRect, FFScene, FFText } from 'ffcreator';
const path = require('path');
const colors = require('colors');

const createFFTask = () => {
  const bg1 = path.join(__dirname, '../../examples/assets/imgs/bg/h04.jpg');
  const bg2 = path.join(__dirname, '../../examples/assets/imgs/bg/h05.jpg');
  const logo1 = path.join(__dirname, '../../examples/assets/imgs/logo/logo1.png');
  const logo2 = path.join(__dirname, '../../examples/assets/imgs/logo/logo2.png');
  const cover = path.join(__dirname, '../../examples/assets/imgs/cover/cover2.jpg');
  const money = path.join(__dirname, '../../examples/assets/imgs/gif/m.gif');
  const audio = path.join(__dirname, '../../examples/assets/audio/02.wav');
  const font1 = path.join(__dirname, '../../examples/assets/font/font1.ttf');
  const font2 = path.join(__dirname, '../../examples/assets/font/font2.ttf');
  const outputDir = path.join(__dirname, './output/');
  const cacheDir = path.join(__dirname, './cache/');

  // create creator instance
  const width = 800;
  const height = 600;

  const creator = new FFCreator({
    cacheDir,
    outputDir,
    width,
    height,
    parallel: 8,
  });

  creator.addAudio(
    new FFAudio({
      path: audio,
      volume: 1,
      fadeIn: 4,
      loop: true,
      ss: '00:00:07',
      to: '00:00:20',
    }),
  );

  const scene1 = new FFScene();
  const scene2 = new FFScene();

  const fb1 = new FFImage({ path: bg1, x: width / 2, y: height / 2 });
  scene1.addChild(fb1);

  const frect = new FFRect({
    color: '#f6b900',
    width: 300,
    height: 200,
    x: width / 2,
    y: height / 2,
  });
  frect.setColor('#044EC5');
  frect.addEffect('rotateIn', 1, 1);
  scene1.addChild(frect);

  // add fmoney image
  const fmoney = new FFGifImage({ path: money, x: 100, y: 200 });
  fmoney.addEffect('fadeInLeft', 1, 3);
  fmoney.setScale(0.3);
  scene1.addChild(fmoney);

  // add FFText Component
  const text1 = new FFText({ text: 'FFText组件demo', x: width / 2, y: 130, fontSize: 40 });
  text1.setColor('#ffffff');
  text1.setBackgroundColor('#bc05a9');
  text1.addEffect('fadeInUp', 1, 0.5);
  text1.alignCenter();
  text1.setFont(font1);
  text1.setStyle({ padding: 10 });
  scene1.addChild(text1);

  const text2 = new FFText({
    text: `Effects and animation of FFText`,
    color: '#333333',
    x: width / 2,
    y: 200,
    fontSize: 20,
  });
  text2.addEffect('fadeInDown', 1, 2);
  text2.alignCenter();
  scene1.addChild(text2);

  const text3 = new FFText({
    text: `FFCreator支持的文字效果`,
    color: '#ffffff',
    x: 200,
    y: 280,
  });
  text3.setFont(font2);
  text3.addEffect('zoomIn', 1, 2);
  text3.setStyle({
    fontSize: 46,
    fontStyle: 'italic',
    fontWeight: 'bold',
    fill: ['#ffffff', '#00ff99'], // gradient
  });
  scene1.addChild(text3);

  const text4 = new FFText({
    text: `FFCreator文字多行的示例，FFCreator文字
    多行的示例，FFCreator文字多行的示例，
    FFCreator文字多行的示例`,
    color: '#ffffff',
    x: 100,
    y: 420,
  });
  text4.addEffect('backInRight', 1, 3);
  text4.setStyle({
    fontFamily: 'Arial',
    fontSize: 26,
    fontStyle: 'italic',
    fontWeight: 'bold',
    color: '#00ff99',
    stroke: '#ff0000',
    strokeThickness: 8,
    dropShadow: true,
    dropShadowColor: '#000000',
    dropShadowBlur: 4,
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 6,
    wordWrap: true,
    wordWrapWidth: 1200,
  });
  scene1.addChild(text4);

  // add logo
  const flogo1 = new FFImage({ path: logo2, x: width / 2, y: 50 });
  flogo1.setScale(0.5);
  scene1.addChild(flogo1);

  scene1.setDuration(10);
  scene1.setTransition('hexagonalize', 2);
  creator.addChild(scene1);

  // add scene2 background
  const fbg2 = new FFImage({ path: bg2, x: width / 2, y: height / 2 });
  scene2.addChild(fbg2);

  // add logo
  const flogo2 = new FFImage({ path: logo2, x: width / 2, y: height / 2 - 80 });
  flogo2.setScale(0.9);
  flogo2.addEffect('fadeInDown', 1, 1.2);
  scene2.addChild(flogo2);

  const text5 = new FFText({
    text: `HELLO FFCREATOR`,
    color: '#ffffff',
    x: width / 2,
    y: 360,
  });
  text5.addEffect('backInDown', 1, 2);
  text5.setStyle({
    fontFamily: ['Microsoft YaHei', 'Helvetica', 'Tahoma'],
    fontSize: 32,
    fontStyle: 'italic',
    fontWeight: 'bold',
    color: '#00ac08',
    stroke: '#000000',
    strokeThickness: 10,
  });
  text5.alignCenter();
  scene2.addChild(text5);

  scene2.setDuration(5);
  creator.addChild(scene2);

  creator.start();
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


