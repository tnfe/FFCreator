# FFCreatorLite

> `FFCreatorLite`是`FFCreator`套装中的 lite 版本。当您要大量处理视频同时又追求更快的速度时, `FFCreatorLite`也许是更好的选择。

![img](../_media/logo/logo2.png)

FFCreatorLite [https://github.com/drawcall/FFCreatorLite](https://github.com/drawcall/FFCreatorLite)

## 介绍

不要把`FFCreatorLite`简单理解为`FFCreator`的精简版或者功能阉割版，事实上这两者的实现原理完全不同。`FFCreatorLite`具备`FFCreator`80%的功能，但是处理速度却更快(快到你无法想象)并且安装异常简单。并且`FFCreatorLite`支持对直播流加入背景音乐和装饰动画以及标题文字再推出。所以请您根据实际的使用情况，来选择具体使用哪个版本的库。

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
| 转场特效          | 支持近百种转场动画特效                       | 支持30多种转场动画                        |
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

## 转场动画

最新版本的ffcreatorlite已经支持场景过渡动画, 这意味着您可以像ffcreator一样用它制作炫酷效果。

当然您需要安装[4.3.0](https://stackoverflow.com/questions/60704545/xfade-filter-not-available-with-ffmpeg)以上版本的ffmpeg. 因为这里使用的是[Xfade](https://trac.ffmpeg.org/wiki/Xfade)滤镜来实现的动画。

#### 使用
```javascript
// https://trac.ffmpeg.org/wiki/Xfade
scene.setTransition('diagtl', 1.5);
```

<table class="wiki">
  <tr>
    <td style="text-align: center">
      <a href="https://github.com/drawcall/FFCreatorLite/blob/master/examples/assets/gif/fade.gif?raw=true" style="padding:0; border:none"
        ><img src="https://github.com/drawcall/FFCreatorLite/blob/master/examples/assets/gif/fade.gif?raw=true"
      /></a>
    </td>
    <td style="text-align: center">
      <a href="https://github.com/drawcall/FFCreatorLite/blob/master/examples/assets/gif/fadeblack.gif?raw=true" style="padding:0; border:none"
        ><img src="https://github.com/drawcall/FFCreatorLite/blob/master/examples/assets/gif/fadeblack.gif?raw=true"
      /></a>
    </td>
    <td style="text-align: center">
      <a href="https://github.com/drawcall/FFCreatorLite/blob/master/examples/assets/gif/fadewhite.gif?raw=true" style="padding:0; border:none"
        ><img src="https://github.com/drawcall/FFCreatorLite/blob/master/examples/assets/gif/fadewhite.gif?raw=true"
      /></a>
    </td>
    <td style="text-align: center">
      <a href="https://github.com/drawcall/FFCreatorLite/blob/master/examples/assets/gif/distance.gif?raw=true" style="padding:0; border:none"
        ><img src="https://github.com/drawcall/FFCreatorLite/blob/master/examples/assets/gif/distance.gif?raw=true"
      /></a>
    </td>
  </tr>
  <tr>
    <td style="text-align: center"><strong>fade</strong> (default)</td>
    <td style="text-align: center">fadeblack</td>
    <td style="text-align: center">fadewhite</td>
    <td style="text-align: center">distance</td>
  </tr>
  <tr>
    <td style="text-align: center">
      <a href="https://github.com/drawcall/FFCreatorLite/blob/master/examples/assets/gif/wipeleft.gif?raw=true" style="padding:0; border:none"
        ><img src="https://github.com/drawcall/FFCreatorLite/blob/master/examples/assets/gif/wipeleft.gif?raw=true"
      /></a>
    </td>
    <td style="text-align: center">
      <a href="https://github.com/drawcall/FFCreatorLite/blob/master/examples/assets/gif/wiperight.gif?raw=true" style="padding:0; border:none"
        ><img src="https://github.com/drawcall/FFCreatorLite/blob/master/examples/assets/gif/wiperight.gif?raw=true"
      /></a>
    </td>
    <td style="text-align: center">
      <a href="https://github.com/drawcall/FFCreatorLite/blob/master/examples/assets/gif/wipeup.gif?raw=true" style="padding:0; border:none"
        ><img src="https://github.com/drawcall/FFCreatorLite/blob/master/examples/assets/gif/wipeup.gif?raw=true"
      /></a>
    </td>
    <td style="text-align: center">
      <a href="https://github.com/drawcall/FFCreatorLite/blob/master/examples/assets/gif/wipedown.gif?raw=true" style="padding:0; border:none"
        ><img src="https://github.com/drawcall/FFCreatorLite/blob/master/examples/assets/gif/wipedown.gif?raw=true"
      /></a>
    </td>
  </tr>
  <tr>
    <td style="text-align: center"><strong>wipeleft</strong></td>
    <td style="text-align: center"><strong>wiperight</strong></td>
    <td style="text-align: center"><strong>wipeup</strong></td>
    <td style="text-align: center"><strong>wipedown</strong></td>
  </tr>
  <tr>
    <td style="text-align: center">
      <a href="https://github.com/drawcall/FFCreatorLite/blob/master/examples/assets/gif/slideleft.gif?raw=true" style="padding:0; border:none"
        ><img src="https://github.com/drawcall/FFCreatorLite/blob/master/examples/assets/gif/slideleft.gif?raw=true"
      /></a>
    </td>
    <td style="text-align: center">
      <a href="https://github.com/drawcall/FFCreatorLite/blob/master/examples/assets/gif/slideright.gif?raw=true" style="padding:0; border:none"
        ><img src="https://github.com/drawcall/FFCreatorLite/blob/master/examples/assets/gif/slideright.gif?raw=true"
      /></a>
    </td>
    <td style="text-align: center">
      <a href="https://github.com/drawcall/FFCreatorLite/blob/master/examples/assets/gif/slideup.gif?raw=true" style="padding:0; border:none"
        ><img src="https://github.com/drawcall/FFCreatorLite/blob/master/examples/assets/gif/slideup.gif?raw=true"
      /></a>
    </td>
    <td style="text-align: center">
      <a href="https://github.com/drawcall/FFCreatorLite/blob/master/examples/assets/gif/slidedown.gif?raw=true" style="padding:0; border:none"
        ><img src="https://github.com/drawcall/FFCreatorLite/blob/master/examples/assets/gif/slidedown.gif?raw=true"
      /></a>
    </td>
  </tr>
  <tr>
    <td style="text-align: center"><strong>slideleft</strong></td>
    <td style="text-align: center"><strong>slideright</strong></td>
    <td style="text-align: center"><strong>slideup</strong></td>
    <td style="text-align: center"><strong>slidedown</strong></td>
  </tr>
  <tr>
    <td style="text-align: center">
      <a href="https://github.com/drawcall/FFCreatorLite/blob/master/examples/assets/gif/smoothleft.gif?raw=true" style="padding:0; border:none"
        ><img src="https://github.com/drawcall/FFCreatorLite/blob/master/examples/assets/gif/smoothleft.gif?raw=true"
      /></a>
    </td>
    <td style="text-align: center">
      <a href="https://github.com/drawcall/FFCreatorLite/blob/master/examples/assets/gif/smoothright.gif?raw=true" style="padding:0; border:none"
        ><img src="https://github.com/drawcall/FFCreatorLite/blob/master/examples/assets/gif/smoothright.gif?raw=true"
      /></a>
    </td>
    <td style="text-align: center">
      <a href="https://github.com/drawcall/FFCreatorLite/blob/master/examples/assets/gif/smoothup.gif?raw=true" style="padding:0; border:none"
        ><img src="https://github.com/drawcall/FFCreatorLite/blob/master/examples/assets/gif/smoothup.gif?raw=true"
      /></a>
    </td>
    <td style="text-align: center">
      <a href="https://github.com/drawcall/FFCreatorLite/blob/master/examples/assets/gif/smoothdown.gif?raw=true" style="padding:0; border:none"
        ><img src="https://github.com/drawcall/FFCreatorLite/blob/master/examples/assets/gif/smoothdown.gif?raw=true"
      /></a>
    </td>
  </tr>
  <tr>
    <td style="text-align: center">smoothleft</td>
    <td style="text-align: center">smoothright</td>
    <td style="text-align: center">smoothup</td>
    <td style="text-align: center">smoothdown</td>
  </tr>
  <tr>
    <td style="text-align: center">
      <a href="https://github.com/drawcall/FFCreatorLite/blob/master/examples/assets/gif/circlecrop.gif?raw=true" style="padding:0; border:none"
        ><img src="https://github.com/drawcall/FFCreatorLite/blob/master/examples/assets/gif/circlecrop.gif?raw=true"
      /></a>
    </td>
    <td style="text-align: center">
      <a href="https://github.com/drawcall/FFCreatorLite/blob/master/examples/assets/gif/rectcrop.gif?raw=true" style="padding:0; border:none"
        ><img src="https://github.com/drawcall/FFCreatorLite/blob/master/examples/assets/gif/rectcrop.gif?raw=true"
      /></a>
    </td>
    <td style="text-align: center">
      <a href="https://github.com/drawcall/FFCreatorLite/blob/master/examples/assets/gif/circleclose.gif?raw=true" style="padding:0; border:none"
        ><img src="https://github.com/drawcall/FFCreatorLite/blob/master/examples/assets/gif/circleclose.gif?raw=true"
      /></a>
    </td>
    <td style="text-align: center">
      <a href="https://github.com/drawcall/FFCreatorLite/blob/master/examples/assets/gif/circleopen.gif?raw=true" style="padding:0; border:none"
        ><img src="https://github.com/drawcall/FFCreatorLite/blob/master/examples/assets/gif/circleopen.gif?raw=true"
      /></a>
    </td>
  </tr>
  <tr>
    <td style="text-align: center">rectcrop</td>
    <td style="text-align: center">circlecrop</td>
    <td style="text-align: center">circleclose</td>
    <td style="text-align: center">circleopen</td>
  </tr>
  <tr>
    <td style="text-align: center">
      <a href="https://github.com/drawcall/FFCreatorLite/blob/master/examples/assets/gif/horzclose.gif?raw=true" style="padding:0; border:none"
        ><img src="https://github.com/drawcall/FFCreatorLite/blob/master/examples/assets/gif/horzclose.gif?raw=true"
      /></a>
    </td>
    <td style="text-align: center">
      <a href="https://github.com/drawcall/FFCreatorLite/blob/master/examples/assets/gif/horzopen.gif?raw=true" style="padding:0; border:none"
        ><img src="https://github.com/drawcall/FFCreatorLite/blob/master/examples/assets/gif/horzopen.gif?raw=true"
      /></a>
    </td>
    <td style="text-align: center">
      <a href="https://github.com/drawcall/FFCreatorLite/blob/master/examples/assets/gif/vertclose.gif?raw=true" style="padding:0; border:none"
        ><img src="https://github.com/drawcall/FFCreatorLite/blob/master/examples/assets/gif/vertclose.gif?raw=true"
      /></a>
    </td>
    <td style="text-align: center">
      <a href="https://github.com/drawcall/FFCreatorLite/blob/master/examples/assets/gif/vertopen.gif?raw=true" style="padding:0; border:none"
        ><img src="https://github.com/drawcall/FFCreatorLite/blob/master/examples/assets/gif/vertopen.gif?raw=true"
      /></a>
    </td>
  </tr>
  <tr>
    <td style="text-align: center">horzclose</td>
    <td style="text-align: center">horzopen</td>
    <td style="text-align: center">vertclose</td>
    <td style="text-align: center">vertopen</td>
  </tr>
  <tr>
    <td style="text-align: center">
      <a href="https://github.com/drawcall/FFCreatorLite/blob/master/examples/assets/gif/diagbl.gif?raw=true" style="padding:0; border:none"
        ><img src="https://github.com/drawcall/FFCreatorLite/blob/master/examples/assets/gif/diagbl.gif?raw=true"
      /></a>
    </td>
    <td style="text-align: center">
      <a href="https://github.com/drawcall/FFCreatorLite/blob/master/examples/assets/gif/diagbr.gif?raw=true" style="padding:0; border:none"
        ><img src="https://github.com/drawcall/FFCreatorLite/blob/master/examples/assets/gif/diagbr.gif?raw=true"
      /></a>
    </td>
    <td style="text-align: center">
      <a href="https://github.com/drawcall/FFCreatorLite/blob/master/examples/assets/gif/diagtl.gif?raw=true" style="padding:0; border:none"
        ><img src="https://github.com/drawcall/FFCreatorLite/blob/master/examples/assets/gif/diagtl.gif?raw=true"
      /></a>
    </td>
    <td style="text-align: center">
      <a href="https://github.com/drawcall/FFCreatorLite/blob/master/examples/assets/gif/diagtr.gif?raw=true" style="padding:0; border:none"
        ><img src="https://github.com/drawcall/FFCreatorLite/blob/master/examples/assets/gif/diagtr.gif?raw=true"
      /></a>
    </td>
  </tr>
  <tr>
    <td style="text-align: center">diagbl</td>
    <td style="text-align: center">diagbr</td>
    <td style="text-align: center">diagtl</td>
    <td style="text-align: center">diagtr</td>
  </tr>
  <tr>
    <td style="text-align: center">
      <a href="https://github.com/drawcall/FFCreatorLite/blob/master/examples/assets/gif/hlslice.gif?raw=true" style="padding:0; border:none"
        ><img src="https://github.com/drawcall/FFCreatorLite/blob/master/examples/assets/gif/hlslice.gif?raw=true"
      /></a>
    </td>
    <td style="text-align: center">
      <a href="https://github.com/drawcall/FFCreatorLite/blob/master/examples/assets/gif/hrslice.gif?raw=true" style="padding:0; border:none"
        ><img src="https://github.com/drawcall/FFCreatorLite/blob/master/examples/assets/gif/hrslice.gif?raw=true"
      /></a>
    </td>
    <td style="text-align: center">
      <a href="https://github.com/drawcall/FFCreatorLite/blob/master/examples/assets/gif/vuslice.gif?raw=true" style="padding:0; border:none"
        ><img src="https://github.com/drawcall/FFCreatorLite/blob/master/examples/assets/gif/vuslice.gif?raw=true"
      /></a>
    </td>
    <td style="text-align: center">
      <a href="https://github.com/drawcall/FFCreatorLite/blob/master/examples/assets/gif/vdslice.gif?raw=true" style="padding:0; border:none"
        ><img src="https://github.com/drawcall/FFCreatorLite/blob/master/examples/assets/gif/vdslice.gif?raw=true"
      /></a>
    </td>
  </tr>
  <tr>
    <td style="text-align: center">hlslice</td>
    <td style="text-align: center">hrslice</td>
    <td style="text-align: center">vuslice</td>
    <td style="text-align: center">vdslice</td>
  </tr>
  <tr>
    <td style="text-align: center">
      <a href="https://github.com/drawcall/FFCreatorLite/blob/master/examples/assets/gif/dissolve.gif?raw=true" style="padding:0; border:none"
        ><img src="https://github.com/drawcall/FFCreatorLite/blob/master/examples/assets/gif/dissolve.gif?raw=true"
      /></a>
    </td>
    <td style="text-align: center">
      <a href="https://github.com/drawcall/FFCreatorLite/blob/master/examples/assets/gif/pixelize.gif?raw=true" style="padding:0; border:none"
        ><img src="https://github.com/drawcall/FFCreatorLite/blob/master/examples/assets/gif/pixelize.gif?raw=true"
      /></a>
    </td>
    <td style="text-align: center">
      <a href="https://github.com/drawcall/FFCreatorLite/blob/master/examples/assets/gif/radial.gif?raw=true" style="padding:0; border:none"
        ><img src="https://github.com/drawcall/FFCreatorLite/blob/master/examples/assets/gif/radial.gif?raw=true"
      /></a>
    </td>
    <td style="text-align: center">
      <a href="https://github.com/drawcall/FFCreatorLite/blob/master/examples/assets/gif/hblur.gif?raw=true" style="padding:0; border:none"
        ><img src="https://github.com/drawcall/FFCreatorLite/blob/master/examples/assets/gif/hblur.gif?raw=true"
      /></a>
    </td>
  </tr>
  <tr>
    <td style="text-align: center">dissolve</td>
    <td style="text-align: center">pixelize</td>
    <td style="text-align: center">radial</td>
    <td style="text-align: center">hblur</td>
  </tr>
  <tr>
    <td style="text-align: center">
      <a href="https://github.com/drawcall/FFCreatorLite/blob/master/examples/assets/gif/wipetl.gif?raw=true" style="padding:0; border:none"
        ><img src="https://github.com/drawcall/FFCreatorLite/blob/master/examples/assets/gif/wipetl.gif?raw=true"
      /></a>
    </td>
    <td style="text-align: center">
      <a href="https://github.com/drawcall/FFCreatorLite/blob/master/examples/assets/gif/wipetr.gif?raw=true" style="padding:0; border:none"
        ><img src="https://github.com/drawcall/FFCreatorLite/blob/master/examples/assets/gif/wipetr.gif?raw=true"
      /></a>
    </td>
    <td style="text-align: center">
      <a href="https://github.com/drawcall/FFCreatorLite/blob/master/examples/assets/gif/wipebl.gif?raw=true" style="padding:0; border:none"
        ><img src="https://github.com/drawcall/FFCreatorLite/blob/master/examples/assets/gif/wipebl.gif?raw=true"
      /></a>
    </td>
    <td>
      <a href="https://github.com/drawcall/FFCreatorLite/blob/master/examples/assets/gif/wipebr.gif?raw=true" style="padding:0; border:none"
        ><img src="https://github.com/drawcall/FFCreatorLite/blob/master/examples/assets/gif/wipebr.gif?raw=true"
      /></a>
    </td>
  </tr>
  <tr>
    <td style="text-align: center">wipetl</td>
    <td style="text-align: center">wipetr</td>
    <td style="text-align: center">wipebl</td>
    <td style="text-align: center">wipebr</td>
  </tr>
  <tr>
    <td style="text-align: center">
      <a href="https://github.com/drawcall/FFCreatorLite/blob/master/examples/assets/gif/fadegrays.gif?raw=true" style="padding:0; border:none"
        ><img src="https://github.com/drawcall/FFCreatorLite/blob/master/examples/assets/gif/fadegrays.gif?raw=true"
      /></a>
    </td>
    <td style="text-align: center">
      <a href="https://github.com/drawcall/FFCreatorLite/blob/master/examples/assets/gif/squeezev.gif?raw=true" style="padding:0; border:none"
        ><img src="https://github.com/drawcall/FFCreatorLite/blob/master/examples/assets/gif/squeezev.gif?raw=true"
      /></a>
    </td>
    <td style="text-align: center">
      <a href="https://github.com/drawcall/FFCreatorLite/blob/master/examples/assets/gif/squeezeh.gif?raw=true" style="padding:0; border:none"
        ><img src="https://github.com/drawcall/FFCreatorLite/blob/master/examples/assets/gif/squeezeh.gif?raw=true"
      /></a>
    </td>
    <td></td>
  </tr>
  <tr>
    <td style="text-align: center">fadegrays</td>
    <td style="text-align: center">squeezev</td>
    <td style="text-align: center">squeezeh</td>
    <td></td>
  </tr>
</table>

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
