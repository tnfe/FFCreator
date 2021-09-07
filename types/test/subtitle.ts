const path = require('path');
const colors = require('colors');
import { FFAlbum, FFCreator, FFImage, FFScene, FFSubtitle, FFText } from "ffcreator";
const createFFTask = () => {
    const bg = path.join(__dirname, '../../examples/assets/imgs/bg/04.jpeg');
    const img1 = path.join(__dirname, '../../examples/assets/imgs/album/06.jpeg');
    const img2 = path.join(__dirname, '../../examples/assets/imgs/album/05.jpeg');
    const img3 = path.join(__dirname, '../../examples/assets/imgs/album/04.jpeg');
    const img4 = path.join(__dirname, '../../examples/assets/imgs/album/03.jpeg');
    const img5 = path.join(__dirname, '../../examples/assets/imgs/album/02.jpeg');
    const logo = path.join(__dirname, '../../examples/assets/imgs/logo/logo2.png');
    const font1 = path.join(__dirname, '../../examples/assets/font/font1.ttf');
    const tts = path.join(__dirname, '../../examples/assets/audio/tts.wav');
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
    });

    // create FFScene
    const scene1 = new FFScene();
    const scene2 = new FFScene();
    scene1.setBgColor('#fc427b');
    scene2.setBgColor('#019333');

    // add image album
    const album = new FFAlbum({
      list: [img1, img2, img3, img4, img5],
      x: width / 2,
      y: height / 2,
      width: width,
      height: 384,
      showCover: true, // 默认显示封面
    });
    album.setTransition('fadeInLeft');
    album.setDuration(2.5);
    scene1.addChild(album);

    // add title text
    const text = new FFText({ text: 'FFCreator字幕DEMO', x: width / 2, y: 150, fontSize: 40 });
    text.setColor('#ffffff');
    text.setBackgroundColor('#019333');
    text.addEffect('fadeInUp', 1, 1);
    text.alignCenter();
    text.setStyle({ padding: 10 });
    scene1.addChild(text);

    // add logo
    const flogo2 = new FFImage({ path: logo, x: width / 2, y: 60 });
    flogo2.setScale(0.6);
    scene1.addChild(flogo2);

    // add audio to scene1
    scene1.addAudio(tts);

    // subtitle
    const title =
      '跟计算机工作酷就酷在这里，它们不会生气，能记住所有东西，还有，它们不会喝光你的啤酒。计算机就跟比基尼一样，省去了人们许多的胡思乱想。';
    const subtitle = new FFSubtitle({
      comma: true, // 是否逗号分割
      backgroundColor: '#00219C',
      color: '#fff',
      fontSize: 24,
      x: width / 2,
      y: height / 2 + 300,
    });
    subtitle.setText(title);
    subtitle.setFont(font1);
    subtitle.setSpeech(tts); // 语音配音-tts
    subtitle.frameBuffer = 24;
    // subtitle.setDuration(album.getTotalDuration() + 1); 没有tts配音时候可以手动设置
    scene1.addChild(subtitle);

    scene1.setDuration(album.getTotalDuration() + 1);
    scene1.setTransition('FastSwitch', 1.5);
    creator.addChild(scene1);

    // add scene2 background
    const fbg = new FFImage({ path: bg });
    fbg.setXY(width / 2, height / 2);
    scene2.addChild(fbg);

    // logo
    const flogo = new FFImage({ path: logo, x: width / 2, y: height / 2 - 150 });
    flogo.addEffect('fadeInDown', 1, 1.2);
    scene2.addChild(flogo);

    scene2.setDuration(4);
    creator.addChild(scene2);

    creator.start();
    creator.closeLog();

    creator.on('start', () => {
      console.log(`FFCreator start`);
    });

    creator.on('error', e => {
      console.log(`FFCreator error: ${JSON.stringify(e)}`);
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
