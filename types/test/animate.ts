import { FFAudio, FFCreator, FFGifImage, FFImage, FFScene, FFText, FFTween } from "ffcreator";

const path = require('path');
const colors = require('colors');

const createFFTask = () => {
    const bg1 = path.join(__dirname, '../../examples/assets/imgs/bg/h01.jpg');
    const bg2 = path.join(__dirname, '../../examples/assets/imgs/bg/h04.jpg');
    const logo1 = path.join(__dirname, '../../examples/assets/imgs/logo/logo1.png');
    const logo2 = path.join(__dirname, '../../examples/assets/imgs/logo/logo2.png');
    const cover = path.join(__dirname, '../../examples/assets/imgs/cover/cover2.jpg');
    const dragon = path.join(__dirname, '../../examples/assets/imgs/dragon.png');
    const mario = path.join(__dirname, '../../examples/assets/imgs/mario.png');
    const elephant = path.join(__dirname, '../../examples/assets/imgs/elephant.png');
    const money = path.join(__dirname, '../../examples/assets/imgs/gif/m.gif');
    const audio = path.join(__dirname, '../../examples/assets/audio/02.wav');
    const outputDir = path.join(__dirname, './output/');
    const cacheDir = path.join(__dirname, './cache/');

    // create creator instance
    const width = 800;
    const height = 600;
    const creator = new FFCreator({
      cover,
      cacheDir,
      outputDir,
      width,
      height,
      parallel: 8,
    });

    creator.addAudio(new FFAudio({ path: audio, volume: 0.9, fadeIn: 4, fadeOut: 4, loop: true }));
    // create FFScene
    const scene1 = new FFScene();
    const scene2 = new FFScene();

    // add scene1 background
    const fbg1 = new FFImage({ path: bg1, x: width / 2, y: height / 2 });
    // @todo 测试下是否支持
    fbg1.addEffect({ type: 'zoomingIn', time: 9 });
    scene1.addChild(fbg1);

    // add fmoney image
    const fmoney = new FFGifImage({ path: money, x: 100, y: 200 });
    fmoney.addEffect({
      type: 'fadeInLeft',
      time: 1,
      delay: 3,
    });
    fmoney.setScale(0.3);
    scene1.addChild(fmoney);

    // add FFText Component
    const text = new FFText({ text: '各类动画的DEMO', x: width / 2, y: 130, fontSize: 40 });
    text.setColor('#ffffff');
    text.setBackgroundColor('#bc05a9');
    // 多个动画效果组合
    text.addEffect(['fadeInUp', 'rotateIn', 'blurIn', 'zoomIn'], 1, 0.5);
    text.alignCenter();
    text.setStyle({ padding: 10 });
    scene1.addChild(text);

    // use FFTween
    const fdragon = new FFImage({ path: dragon, x: 500, y: 700, alpha: 0 });
    fdragon.setAnchor(0.5, 1);
    scene1.addChild(fdragon);
    FFTween.fromTo(
      fdragon,
      1,
      {
        alpha: 0,
        scale: 0.1,
      },
      {
        scale: 1,
        alpha: 1,
        delay: 2,
        y: 550,
        ease: 'Back.Out',
      },
    );

    const fdragon2 = new FFImage({ path: dragon, x: 700, y: 300, width: 320 / 2, height: 402 / 2 });
    fdragon2.addBlend('ADD');
    fdragon2.addEffect('bounceIn', 1, 1);
    scene1.addChild(fdragon2);

    const fmario = new FFImage({ path: mario, x: 500, y: 400, alpha: 0 });
    scene1.addChild(fmario);
    fmario.addAnimate({
      from: { x: -100, scale: 0.1, alpha: 0, rotate: 3.14 / 2 },
      to: { x: 160, scale: 0.6, alpha: 1, rotate: 0 },
      time: 1,
      delay: 4.3,
      ease: 'Back.Out',
    });

    const felephant = new FFImage({ path: elephant, x: 350, y: 300, alpha: 0 });
    scene1.addChild(felephant);
    felephant.addEffect(['fadeInUp', 'blurIn', 'zoomIn'], 1, 5);

    // add logo
    const flogo1 = new FFImage({ path: logo2, x: width / 2, y: 50 });
    flogo1.setScale(0.5);
    scene1.addChild(flogo1);

    scene1.setDuration(10);
    scene1.setTransition('cube', 2);
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
