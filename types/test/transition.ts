const path = require('path');
const colors = require('colors');
const shuffle = require('lodash/shuffle');
import { FFCreator, FFImage, FFScene, FFText } from 'ffcreator';

const width = 600;
const height = 400;
const logo1 = path.join(__dirname, '../../examples/assets/imgs/logo/logo1.png');
const logo2 = path.join(__dirname, '../../examples/assets/imgs/logo/logo2.png');
const audio = path.join(__dirname, '../../examples/assets/audio/01.wav');
const outputDir = path.join(__dirname, './output/');
const cacheDir = path.join(__dirname, './cache/');

const transitionDemoTask = () => {
  const trans = shuffle(['Windows4', 'Stretch', 'Radiation', 'TricolorCircle', 'cube']);
  const order = ['一', '二', '三', '四', '五'];

  // create creator instance
  const creator = new FFCreator({
    cacheDir,
    outputDir,
    width,
    height,
    audio,
    //cacheFormat:'jpg',
    highWaterMark: '10mb',
    frames: 6,
    debug: false,
  });

  for (let i = 1; i < 6; i++) {
    const transition = trans[i - 1];
    const text = `这是第 ${order[i - 1]} 屏`;
    const scene = creatScene({ index: i, transition, text });
    creator.addChild(scene);
  }

  creator.openLog();
  creator.start();

  creator.on('start', () => {
    console.log(`FFCreator start`);
  });

  creator.on('error', e => {
    console.log(`FFCreator error: ${JSON.stringify(e)}`);
  });

  creator.on('progress', e => {
    // console.log(colors.yellow(`FFCreator progress: ${(e.percent * 100) >> 0}%`));
  });

  creator.on('complete', e => {
    console.log(
      colors.magenta(`FFCreator completed: \n USEAGE: ${e.useage} \n PATH: ${e.output} `),
    );

    console.log(colors.green(`\n --- You can press the s key or the w key to restart! --- \n`));
  });

  return creator;
};

const creatScene = ({
  index,
  transition,
  text,
}: {
  index: number;
  transition: string;
  text: string;
}) => {
  const scene = new FFScene();
  scene.setBgColor('#3b3a98');
  scene.setDuration(5);
  scene.setTransition(transition, 1.5);

  // bg img
  const img = path.join(__dirname, `./assets/imgs/trans/0${index}.jpeg`);
  const bg = new FFImage({ path: img, x: width / 2, y: height / 2 });
  bg.addEffect({ type: 'zoomingIn', time: 5 });
  scene.addChild(bg);

  // title text
  const ftext = new FFText({ text, x: width / 2, y: height / 2 + 50, fontSize: 38 });
  ftext.alignCenter();
  ftext.addEffect('fadeInRight', 1, 1.3);
  ftext.setStyle({ color: '#30336b', backgroundColor: '#ffffff', padding: 10 });
  scene.addChild(ftext);

  // add logo2
  const logo = index === 1 ? logo2 : logo1;
  const flogo = new FFImage({ path: logo, x: width / 2, y: height / 2 - 100 });
  flogo.setScale(0.6);
  flogo.addEffect('fadeInLeft', 1, 1);
  scene.addChild(flogo);

  return scene;
};
