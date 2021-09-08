import { FFCreator, FFImage, FFScene } from "ffcreator";

const path = require('path');
const colors = require('colors');

const createFFTask = () => {
    const bg1 = path.join(__dirname, '../../examples/assets/imgs/bg/05.jpg');
    const bg2 = path.join(__dirname, '../../examples/assets/imgs/bg/04.jpeg');
    const logo2 = path.join(__dirname, '../../examples/assets/imgs/logo/logo2.png');
    const cloud = path.join(__dirname, '../../examples/assets/imgs/cloud.png');
    const mars = path.join(__dirname, '../../examples/assets/imgs/mars.png');
    const rock = path.join(__dirname, '../../examples/assets/imgs/rock.png');
    const title = path.join(__dirname, '../../examples/assets/imgs/title.png');
    const audio = path.join(__dirname, '../../examples/assets/audio/05.wav');
    const outputDir = path.join(__dirname, './output/');
    const cacheDir = path.join(__dirname, './cache/');

    // create creator instance
    const width = 576;
    const height = 1024;
    const creator = new FFCreator({
      cacheDir,
      outputDir,
      fps: 24,
      crf: 28,
      width,
      height,
      highWaterMark: '3mb',
      parallel: 8,
      audio,
    });

    // create FFScene
    const scene1 = new FFScene();
    const scene2 = new FFScene();
    scene1.setBgColor('#0b0be6');
    scene2.setBgColor('#b33771');

    // add scene1 background
    const fbg1 = new FFImage({ path: bg1, x: width / 2, y: height / 2 });
    scene1.addChild(fbg1);

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

    // add mars ball
    const fmars = new FFImage({ path: mars, x: width / 2, y: height / 2 });
    fmars.addEffect('rotateIn', 1, 0.8);
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

    scene1.setDuration(8);
    scene1.setTransition('InvertedPageCurl', 1.5);
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
