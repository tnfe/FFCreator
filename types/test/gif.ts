import { FFAudio, FFCreator, FFGifImage, FFImage, FFScene } from "ffcreator";

const path = require('path');
const colors = require('colors');

const createFFTask = () => {
    const bg1 = path.join(__dirname, '../../examples/assets/imgs/bg/06.jpg');
    const bg2 = path.join(__dirname, '../../examples/assets/imgs/bg/01.jpeg');
    const logo1 = path.join(__dirname, '../../examples/assets/imgs/logo/logo1.png');
    const logo2 = path.join(__dirname, '../../examples/assets/imgs/logo/logo2.png');
    const cart = path.join(__dirname, '../../examples/assets/imgs/gif/cart.gif');
    const hert = path.join(__dirname, '../../examples/assets/imgs/gif/hert.gif');
    const girl = path.join(__dirname, '../../examples/assets/imgs/gif/girl.gif');
    const audio = path.join(__dirname, '../../examples/assets/audio/05.wav');
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
    scene1.addChild(fbg1);

    // add gif image
    const fcart = new FFGifImage({ path: cart, x: width / 2, y: height / 2 - 100 });
    fcart.addEffect('zoomIn', 2, 1);
    fcart.setScale(0.8);
    scene1.addChild(fcart);

    const fgirl = new FFGifImage({ path: girl, x: width / 2, y: height + 100 });
    fgirl.addEffect('backInUp', 1.2, 1.5);
    fgirl.setAnchor(0.5, 1);
    scene1.addChild(fgirl);

    const fhert = new FFGifImage({ path: hert, x: width / 2, y: height / 2 - 250 });
    fhert.addEffect('fadeIn', 1.5, 0.5);
    fhert.addEffect('fadeOut', 1.5, 3.5);
    scene1.addChild(fhert);

    // add logo
    const flogo1 = new FFImage({ path: logo2, x: width / 2, y: 100 });
    flogo1.setScale(0.65);
    scene1.addChild(flogo1);

    scene1.setDuration(8);
    scene1.setTransition('ButterflyWaveScrawler', 1.5);
    creator.addChild(scene1);

    // add scene2 background
    const fbg2 = new FFImage({ path: bg2, x: width / 2, y: height / 2 });
    scene2.addChild(fbg2);
    // add logo
    const flogo2 = new FFImage({ path: logo2, x: width / 2, y: height / 2 - 80 });
    flogo2.setScale(0.9);
    flogo2.addEffect('fadeInDown', 1, 1.2);
    scene2.addChild(flogo2);

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
