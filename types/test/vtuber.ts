const path = require('path');
const colors = require('colors');
import { FFAudio, FFCreator, FFGifImage, FFImage, FFScene, FFText, FFVtuber } from 'ffcreator';

const createFFTask = () => {
    const bg1 = path.join(__dirname, '../../examples/assets/imgs/bg/h01.jpg');
    const bg2 = path.join(__dirname, '../../examples/assets/imgs/bg/h04.jpg');
    const logo1 = path.join(__dirname, '../../examples/assets/imgs/logo/logo1.png');
    const logo2 = path.join(__dirname, '../../examples/assets/imgs/logo/logo2.png');
    const cover = path.join(__dirname, '../../examples/assets/imgs/cover/cover2.jpg');
    const dragon = path.join(__dirname, '../../examples/assets/imgs/dragon.png');
    const mario = path.join(__dirname, '../../examples/assets/imgs/mario.png');
    const vtuber = path.join(__dirname, '../../examples/assets/video/vtuber.mp4');
    const human = path.join(__dirname, '../../examples/assets/imgs/frames/h%d.png');
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
    // add scene1 background
    const fbg1 = new FFImage({ path: bg1, x: width / 2, y: height / 2 });
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
    const text = new FFText({ text: '两种类型 VTuber', x: width / 2, y: 130, fontSize: 40 });
    text.setColor('#ffffff');
    text.setBackgroundColor('#bc05a9');
    // 多个动画效果组合
    text.addEffect(['fadeInUp', 'rotateIn', 'blurIn', 'zoomIn'], 1, 0.5);
    text.alignCenter();
    text.setStyle({ padding: 10 });
    scene1.addChild(text);

    // use FFTween
    const fdragon = new FFImage({ path: dragon, x: 500, y: 400, alpha: 0 });
    fdragon.setAnchor(0.5, 1);
    fdragon.addEffect('fadeInUp', 1, 4);
    scene1.addChild(fdragon);

    const fmario = new FFImage({ path: mario, x: 500, y: 400, alpha: 0 });
    scene1.addChild(fmario);
    fmario.addAnimate({
      from: { x: 10, scale: 0.1, alpha: 0, rotate: 3.14 / 2 },
      to: { x: 460, scale: 0.6, alpha: 1, rotate: 0 },
      time: 1,
      delay: 4.3,
      ease: 'Back.Out',
    });

    const fvtuber = new FFVtuber({ path: vtuber, x: 0, y: height, width: 480, height: 480 });
    fvtuber.setAnchor(0, 1);
    fvtuber.setCutoutColor(110, 130);
    scene1.addChild(fvtuber);

    const fvtuber2 = new FFVtuber({
      path: human,
      x: 450,
      y: height,
      mode: 'frame',
      width: 480,
      height: 295,
    });
    fvtuber2.setAnchor(0, 1);
    fvtuber2.setPath(human, 1, 24);
    scene1.addChild(fvtuber2);
    //fvtuber.addEffect(['fadeInUp', 'blurIn', 'zoomIn'], 1, 5);

    // add logo
    const flogo1 = new FFImage({ path: logo2, x: width / 2, y: 50 });
    flogo1.setScale(0.5);
    scene1.addChild(flogo1);

    scene1.setDuration(20);
    scene1.setTransition('cube', 2);
    creator.addChild(scene1);

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
