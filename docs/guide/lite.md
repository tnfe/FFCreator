![img](../_media/logo/logo2.png)

# FFCreatorLite

> `FFCreatorLite`是`FFCreator`套装中的 lite 版本。当您要大量处理视频同时又不需要特别酷炫的过渡动画时, `FFCreatorLite`也许是更好的选择。

FFCreator [https://github.com/tnfe/FFCreator](https://github.com/tnfe/FFCreator)  
FFCreatorLite [https://github.com/tnfe/FFCreatorLite](https://github.com/tnfe/FFCreatorLite)

## 介绍

不要把`FFCreatorLite`简单理解为`FFCreator`的精简版或者功能阉割版，事实上这两者的实现原理完全不同。`FFCreatorLite`具备`FFCreator`70%的功能，但是处理速度却更快(快到你无法想象)并且安装异常简单。所以请您根据实际的使用情况，来选择具体使用哪个版本的库。

- `FFCreator`使用`opengl`来处理图形渲染并使用`shader`后处理来生成转场效果，最后使用`FFmpeg`合成视频。
- `FFCreatorLite`则完全基于`FFmpeg`开发，通过拼接`FFmpeg`命令参数来生成动画和视频。事实上编写它花费了更多的时间, 因为这并不是一项简单的工作。

![img](../_media/imgs/gif/lite1.gif)

#### 事实上`FFCreatorLite`完全可以满足你日常的大多数需求, 更多的案例请查看[这里](demo/lite.md)

## 对比

`FFCreatorLite`支持图片、视频、文字、背景音乐以及各种动画效果, 并且还支持多个场景拼接。

|                   | `FFCreator`                                  | `FFCreatorLite`                       |
| ----------------- | -------------------------------------------- | ------------------------------------- |
| 实现原理          | `opengl`+`FFmpeg`                            | `FFmpeg`                              |
| 安装依赖(`linux`) | `FFmpeg`、`cairo`、`libjpeg`、`g++`等        | 仅`FFmpeg`                            |
| 包含组件          | 支持图片、文字、视频、字幕、相册、虚拟主播等 | 不支持字幕、相册、虚拟主播(可扩展)    |
| 支持动画          | 支持模拟`animate.css`动画和任意自定义动画    | 支持模拟`animate.css`动画和自定义动画 |
| 动画品质          | 动画品质极其精细                             | 动画略显粗糙(日常需求足够用)          |
| 转场特效          | 支持近百种转场动画特效                       | 不支持转场动画                        |
| 视频处理          | 有视频处理能力, 但是不算强                   | 视频处理速度超快                      |
| 制作速度          | 5 分钟视频 1-2min                            | 速度为前者 2-3 倍                     |
| 机器配置          | 双核 1G 即可，有显卡更好                     | 配置要求更低                          |

### 一些区别

- 关于注册点: `FFCreatorLite`的默认注册点是左上角且无法修改, 而`FFCreator`默认注册点是中心而且可以修改。
- 关于字体: `FFCreatorLite`中`FFText`必须传入字体文件, 而`FFCreator`则不需要。

## 何时使用

> 那么您一般在何时使用`FFCreatorLite`版呢?

我们给出的建议是如果您要合成一个不算复杂的动态图片影集。仅仅是由多张图片或者视频的淡入、飞行、缩放动画组成, 无需很酷的转场动画。
因为`FFCreatorLite`安装异常简单几乎不需要其他依赖, 同时`FFCreatorLite`合成速度极快甚至是`FFCreator`的 2-3 倍。
如果您追求极致的性能同时又没有很定制的动画需求完全可以使用`FFCreatorLite`来制作, 它可以更快的完成你的任务。

##### 举例说明

- [案例一](https://h5.weishi.qq.com/weishi/feed/747vExjcQ1JuzGKpE) 图片动画+文字动画，适合`FFCreator`开发。
- [案例二](https://h5.weishi.qq.com/weishi/feed/747vExjcQ1JuSxWyE) 视频+文字排版，适合`FFCreatorLite`开发。

## 如何使用

### 安装 npm package

```shell
npm i ffcreatorlite --save
```

### 安装 FFmpeg

安装教程

- `centos`[https://www.myfreax.com/how-to-install-ffmpeg-on-centos-7/](https://www.myfreax.com/how-to-install-ffmpeg-on-centos-7/)
- `windows`[https://windowsloop.com/install-ffmpeg-windows-10/](https://windowsloop.com/install-ffmpeg-windows-10/)

### 使用

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

const text = new FFText({text: '这是第一屏', font, x: 100, y: 100});
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
