[English](./README.md) | [简体中文](./README.zh-CN.md)

<p align="center">
  <img width="650px" src="https://tnfe.github.io/FFCreator/_media/logo/logo.png" />
</p>

<div align="center">
<a href="https://www.npmjs.com/ffcreator" target="_blank"><img src="https://img.shields.io/npm/v/ffcreator.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/ffcreator" target="_blank"><img src="https://img.shields.io/npm/l/ffcreator.svg" alt="Package License" /></a>
<a href="https://travis-ci.org/github/tnfe/FFCreator" target="_blank"><img src="https://travis-ci.org/tnfe/FFCreator.svg?branch=master" alt="Travis CI" /></a>
<a href="https://github.com/prettier/prettier" target="_blank"><img src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg" alt="Code Style"></a>
<a href="https://github.com/tnfe/FFCreator/pulls" target="_blank"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs"/></a>
<a href="https://nodejs.org" target="_blank"><img src="https://img.shields.io/badge/node-%3E%3D%208.0.0-brightgreen.svg" alt="Node Version" /></a>
</div>

## Overview

`FFCreator`是一个基于<a href="http://nodejs.org" target="_blank">node.js</a>的轻量、灵活的短视频加工库。您只需要添加几张图片或视频片段再加一段背景音乐，就可以快速生成一个很酷的视频短片。

今天，短视频已成为一种越来越流行的媒体传播形式。像[微视](https://weishi.qq.com/)和抖音这种 app 每天都会生产成千上万个精彩短视频, 而这些视频也为产品带来了巨大的流量和人气。
随之而来，如何让用户可以快速生产一个短视频；或者产品平台如何利用已有的图片、视频、音乐素材批量合成大量视频就成为一个技术难点。

`FFCreator`是一种轻量又简单的解决方案，只需要很少的依赖和较低的机器配置就可以快速开始工作。并且它模拟实现了[`animate.css`](https://animate.style/)90%的动画效果，您可以轻松地把 web 页面端的动画效果转为视频。

使用`FFCreator`和`vue.js`，可以开发可视化拖拽搭建短视频的web项目，使用就像h5搭建工具一样的简单，可以查看[**这里**](https://github.com/tnfe/shida)。

如果您想以更简单、更智能的方式生成精彩的视频短片，那么您可以想尝试 [**FFAIVideo**](https://github.com/drawcall/FFAIVideo) 这个Node.js项目。它利用目前行业流行的AI大模型（LLM）来自动生成短视频，让您的视频合成更加便捷、智能。

#### 更多介绍请查看[这里](https://tnfe.github.io/FFCreator/#/README)

## 特性

- 完全基于`node.js`开发，非常易于使用，并且易于扩展和开发。
- 依赖很少、易安装、跨平台，对机器配置要求较低。
- 视频制作速度极快，一个 5 分钟的视频只需要 1-2 分钟。
- 支持近百种场景炫酷过渡动画效果。
- 支持图片、声音、视频剪辑、文本等元素。
- 支持字幕组件、可以将字幕与语音 tts 结合合成音频新闻。
- 支持图表组件，可以制作数据可视化类视频。
- 支持简单（可扩展）的虚拟主播，您可以制作自己的虚拟主播。
- 包含`animate.css`90%的动画效果，可以将 css 动画转换为视频。

## Demo

<p align="center">
  <a href="https://tnfe.github.io/FFCreator/#/demo/normal"><img width="30%" src="https://github.com/tnfe/FFCreator/blob/master/docs/_media/imgs/demo/01.gif?raw=true" /></a>
  <img width="2%" src="https://github.com/tnfe/FFCreator/blob/master/docs/_media/imgs/demo/foo.png?raw=true" />
  <a href="https://tnfe.github.io/FFCreator/#/demo/normal"><img width="30%" src="https://github.com/tnfe/FFCreator/blob/master/docs/_media/imgs/demo/05.gif?raw=true" /></a>
  <img width="2%" src="https://github.com/tnfe/FFCreator/blob/master/docs/_media/imgs/demo/foo.png?raw=true" />
  <a href="https://tnfe.github.io/FFCreator/#/demo/normal"><img width="30%" src="https://github.com/tnfe/FFCreator/blob/master/docs/_media/imgs/demo/03.gif?raw=true" /></a>
</p>

## 使用

### Install npm Package

```
npm install ffcreator --save
or
yarn add ffcreator
```

Note: To run the preceding commands, Node.js and npm must be installed.

#### Node.js

```javascript
const { FFScene, FFText, FFVideo, FFAlbum, FFImage, FFCreator } = require("ffcreator");

// Create FFCreator instance
const creator = new FFCreator({
    cacheDir,
    outputDir,
    width: 800,
    height: 450
});

// Create scene
const scene = new FFScene();
scene.setBgColor("#ffcc22");
scene.setDuration(6);
scene.setTransition("GridFlip", 2);
creator.addChild(scene);

// Create Image and add animation effect
const image = new FFImage({ path: path.join(__dirname, "../assets/01.jpg") });
image.addEffect("moveInUp", 1, 1);
image.addEffect("fadeOutDown", 1, 4);
scene.addChild(image);

// Create Text
const text = new FFText({ text: "hello 你好", x: 400, y: 300 });
text.setColor("#ffffff");
text.setBackgroundColor("#000000");
text.addEffect("fadeIn", 1, 1);
scene.addChild(text);

// Create a multi-photo Album
const album = new FFAlbum({
    list: [img1, img2, img3, img4],   // 相册的图片集合
    x: 250,
    y: 300,
    width: 500,
    height: 300,
});
album.setTransition('zoomIn');      // 设置相册切换动画
album.setDuration(2.5);             // 设置单张停留时长
album.setTransTime(1.5);            // 设置单张动画时长
scene.addChild(album);

// Create Video
const video = new FFVideo({ path, x: 300, y: 50, width: 300, height: 200 });
video.addEffect("zoomIn", 1, 0);
scene.addChild(video);

creator.output(path.join(__dirname, "../output/example.mp4"););
creator.start();        // 开始加工
creator.closeLog();     // 关闭log(包含perf)

creator.on('start', () => {
    console.log(`FFCreator start`);
});
creator.on('error', e => {
    console.log(`FFCreator error: ${JSON.stringify(e)}`);
});
creator.on('progress', e => {
    console.log(colors.yellow(`FFCreator progress: ${e.state} ${(e.percent * 100) >> 0}%`));
});
creator.on('complete', e => {
    console.log(colors.magenta(`FFCreator completed: \n USEAGE: ${e.useage} \n PATH: ${e.output} `));
});
```

#### 一些基于FFCreator开发的优秀开源项目以及教程文章[这里](https://github.com/tnfe/awesome-ffcreator)

### 关于声音

声音是一个视频的灵魂, `FFCreator`支持多种添加音频方法。 您不仅可以添加全局背景音乐，还可以为每个场景设置自己的声音或配乐。

- In FFVideo - 打开视频背景音乐（默认关闭）。

```javascript
const video = new FFVideo({ path, x: 100, y: 150, width: 500, height: 350 });
video.setTimes('00:00:18', '00:00:33');
video.setAudio(true); // Turn on
```

- 添加一个全局背景音乐。

```javascript
const creator = new FFCreator({
  cacheDir,
  outputDir,
  audio: path, // background audio
});

// or
creator.addAudio({ path, loop, start });
```

- 为每个场景添加自己的单独音乐, 多用在自动配音场景。

```javascript
scene.addAudio(path);
// or
scene.addAudio({ path, loop, start });
```

### 关于缓存

FFCreator3.0+使用`node Stream`进行数据缓存，相比之前版本不但节省了磁盘空间而且加工速度得到进一步提升。

#### Stream 设置

- 通过设置`parallel`(or `frames`)来修改单次并行渲染的视频分帧数目。
  > 注：这里要根据您的机器实际配置情况来合理设置，并不是数值越大越好。

```javascript
parallel: 10,
```

- 设置`highWaterMark`, 关于 highWaterMark 水位线您可以通过[这里](http://nodejs.cn/api/stream/buffering.html)了解。

```javascript
highWaterMark: '6mb',
```

- 通过设置`pool`来开启或者关闭对象池方式，要根据您的机器实际配置情况来合理设置。

```javascript
pool: true,
```

## 安装

### 1. 安装`node-canvas`及`headless-gl`依赖

> ##### 若是有显示设备的电脑, 比如`windows`、`Mac OSX`系统的个人`pc`电脑或者有显卡或显示设备的`server`服务器, 则可跳过这一步无需安装此依赖。

如果您使用的是`Centos`、`Redhat`、`Fedora`系统, 可以使用`yum`来安装。

```shell
sudo yum install gcc-c++ cairo-devel pango-devel libjpeg-turbo-devel giflib-devel
```

安装[`Xvfb`](https://linux.die.net/man/1/xvfb)以及[`Mesa`](http://www.sztemple.cc/articles/linux%E4%B8%8B%E7%9A%84opengl-mesa%E5%92%8Cglx%E7%AE%80%E4%BB%8B)

```shell
sudo yum install mesa-dri-drivers Xvfb libXi-devel libXinerama-devel libX11-devel
```

如果您使用的是`Debian`、`ubuntu`系统, 则可以使用`apt`来安装。

```shell
sudo apt-get install libcairo2-dev libjpeg-dev libpango1.0-dev libgif-dev build-essential g++
sudo apt-get install libgl1-mesa-dev xvfb libxi-dev libx11-dev
```

### 2. 由于`FFCreator`依赖于`FFmpeg`，因此您需要安装`FFmpeg`的常规版本

- How to Install and Use FFmpeg on CentOS [https://linuxize.com/post/how-to-install-ffmpeg-on-centos-7/](https://linuxize.com/post/how-to-install-ffmpeg-on-centos-7/)
- How to Install FFmpeg on Debian [https://linuxize.com/post/how-to-install-ffmpeg-on-debian-9/](https://linuxize.com/post/how-to-install-ffmpeg-on-debian-9/)
- How to compiling from Source on Linux [https://www.tecmint.com/install-ffmpeg-in-linux/](https://www.tecmint.com/install-ffmpeg-in-linux/)

#### 更详细的教程请查看[这里](https://tnfe.github.io/FFCreator/#/guide/installation)

## 启动

- ### 启动项目

  - 若是有显示设备的电脑, 比如个人`pc`电脑或者有显卡或显示设备的`server`服务器, 正常启动。

```shell
npm start
```

- 无显示设备的服务器请使用`xvfb-run`命令启动程序, 关于`xvfb-run`命令更多的参数可以点击[这里](http://manpages.ubuntu.com/manpages/trusty/man1/xvfb-run.1.html)查看。

```shell
xvfb-run -s "-ac -screen 0 1280x1024x24" npm start
```

## 常见问题

1. #### 当安装时提示错误 missing package'xi'

```shell
No package 'xi'

foundgyp: Call to 'pkg-config --libs-only-l x11 xi xext' returned exit status 1 while in angle/src/angle.gyp. while loading dependencies of binding.gyp while trying to load binding.gyp
```

#### 解决

```shell
yum install libXi-devel libXinerama-devel libX11-devel
```

2. #### 可以正常启动程序但是报错 `doesn't support WebGL....`

#### 解决

The node app should be started as follows.

```shell
xvfb-run -s "-ac -screen 0 1280x1024x24" npm start
```

3. Npm 安装报错 `ERR! command sh -c node-pre-gyp install --fallback-to-build`

#### 解决

这可能是由您的 node 版本引起的。如果是 node`v15`，会出现此问题 [https://github.com/Automattic/node-canvas/issues/1645](https://github.com/Automattic/node-canvas/issues/1645)。请把 node 版本降低到`v14`。

## 贡献代码

非常欢迎您加入我们一起开发`FFCreator`，如果想要贡献代码请先阅读[这里](./CONTRIBUTING.md)。

## License

[MIT](./LICENSE)
