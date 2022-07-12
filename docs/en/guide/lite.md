![img](../../_media/logo/logo2.png)

# FFCreatorLite

> `FFCreatorLite` is the lite version of the `FFCreator` package. When you need to process a lot of video without special cool transition animation, `FFCreatorLite` may be a better choice.

FFCreator [https://github.com/tnfe/FFCreator](https://github.com/tnfe/FFCreator)
FFCreatorLite [https://github.com/drawcall/FFCreatorLite](https://github.com/drawcall/FFCreatorLite)

## Introduction

Don't simply understand `FFCreatorLite` as a simplified version of `FFCreator`. In fact, the implementation principles of the two are completely different. `FFCreatorLite` has 70% of the functions of `FFCreator`, but the processing speed is faster and the installation is extremely simple. So please choose which version of the library to use based on the actual usage.

- `FFCreator` uses `opengl` to process graphics rendering and `shader` post-processing to generate transition effects, and finally uses `FFmpeg` to composite the video.
- `FFCreatorLite` is completely developed based on `FFmpeg`, and generates animation and video by splicing `FFmpeg` command parameters. In fact, it took more time to write it, because it is not a simple task.

![img](../../_media/imgs/gif/lite1.gif)

#### In fact, `FFCreatorLite` can completely meet most of your daily needs. For more cases, please check [here](demo/lite.md)

## FFCreator VS FFCreatorLite

`FFCreatorLite` support pictures, videos, text, background music and various animation effects, and also support multiple scene stitching.

|                                     | `FFCre ator`                                                                  | `FFCreatorLite`                                                      |
| ----------------------------------- | ----------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| Implementation Principle            | `opengl`+`FFmpeg`                                                             | `FFmpeg`                                                             |
| Installation dependencies (`linux`) | `FFmpeg`, `cairo`, `libjpeg`, `g++`, etc.                                     | `FFmpeg` only                                                        |
| Contains components                 | Supports pictures, text, videos, subtitles, photo albums, virtual hosts, etc. | Does not support subtitles, photo albums, virtual hosts (expandable) |
| Support animation                   | Support simulation of `animate.css` animation and any custom animation        | Support simulation of `animate.css` animation and custom animation   |
| Animation quality                   | Animation quality is extremely fine                                           | Animation is slightly rough (sufficient for daily needs)             |
| Transition effects                  | Support nearly a hundred transition animation effects                         | Does not support transition animation                                |
| Video processing                    | Has video processing capabilities, but not strong                             | Video processing speed is super fast                                 |
| Production speed                    | 5 minutes video 1-2min                                                        | Speed ​​is 2-3 times the former                                      |
| Machine configuration               | Dual-core 1G is enough, graphics card is better                               | Configuration requirements are lower                                 |

### Differences

-Registration point: The default registration point of `FFCreatorLite` is the upper left corner and cannot be modified, while the default registration point of `FFCreator` is the center and can be modified.

-About fonts: In `FFCreatorLite`, `FFText` must pass in the font file, but `FFCreator` does not need it.

## When to use

> So when do you use the `FFCreatorLite` version?

Our suggestion is if you want to compose a dynamic photo album that is not too complicated. It is only composed of fade-in, flying, and zooming animations of multiple pictures or videos, no cool transition animations are required.
Because the installation of `FFCreatorLite` is extremely simple and almost no other dependencies are needed, and the synthesis speed of `FFCreatorLite` is extremely fast, even 2-3 times that of `FFCreator`.
If you pursue the ultimate performance and do not have very customized animation requirements, you can use `FFCreatorLite` to make it, it can complete your task faster.

##### For example

- [Case 1](https://h5.weishi.qq.com/weishi/feed/747vExjcQ1JuzGKpE) Picture animation + text animation, suitable for `FFCreator` development.
- [Case 2](https://h5.weishi.qq.com/weishi/feed/747vExjcQ1JuSxWyE) Video + text typesetting, suitable for `FFCreatorLite` development.

## How to use

### Install npm package

```shell
npm i ffcreatorlite --save
```

### Install FFmpeg

Installation tutorial

- `centos`[https://www.myfreax.com/how-to-install-ffmpeg-on-centos-7/](https://www.myfreax.com/how-to-install-ffmpeg-on-centos-7/)
- `windows`[https://windowsloop.com/install-ffmpeg-windows-10/](https://windowsloop.com/install-ffmpeg-windows-10/)

### Useage

```javascript
const {FFCreatorCenter, FFScene, FFImage, FFText, FFCreator} = require('ffcreatorlite');

// create creator instance
const creator = new FFCreator({
  cacheDir,
  outputDir,
  width: 600,
  height: 400,
  log: true,
});

// create FFScene
const scene1 = new FFScene();
const scene2 = new FFScene();
scene1.setBgColor('#ff0000');
scene2.setBgColor('#b33771');

// scene1
const fbg = new FFImage({path: bg1});
scene1.addChild(fbg);

const fimg1 = new FFImage({path: img1, x: 300, y: 60});
fimg1.addEffect('moveInRight', 1.5, 1.2);
scene1.addChild(fimg1);

const text = new FFText({text: 'This is the first screen', font, x: 100, y: 100});
text.setColor('#ffffff');
text.setBackgroundColor('#000000');
text.addEffect('fadeIn', 1, 1);
scene1.addChild(text);

scene1.setDuration(8);
creator.addChild(scene1);

// scene2
const fbg2 = new FFImage({path: bg2});
scene2.addChild(fbg2);
// logo
const flogo = new FFImage({path: logo, x: 100, y: 100});
flogo.addEffect('moveInUpBack', 1.2, 0.3);
scene2.addChild(flogo);

scene2.setDuration(4);
creator.addChild(scene2);

creator.start();

creator.on('progress', e => {
  console.log(colors.yellow(`FFCreatorLite progress: ${(e.percent * 100) >> 0}%`));
});

creator.on('complete', e => {
  console.log(
    colors.magenta(`FFCreatorLite completed: \n USEAGE: ${e.useage} \n PATH: ${e.output} `),
  );
});
```
