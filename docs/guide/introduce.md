![img](/_media/logo/logo.png)


# FFCreator 介绍

> `FFCreator`是一个基于`node.js`的轻量、灵活的视频制作库。人人都能视频制作。

您只需要添加几张图片或视频片段再加一段背景音乐，就可以快速生成一个很酷的视频短片。

今天，短视频已成为一种越来越流行的媒体传播形式。像[微视](https://weishi.qq.com/)和抖音这种 app，每天都会生产成千上万个精彩短视频，而这些视频也为产品带来了巨大的流量。
随之而来，如何让用户可以快速生产一个短视频；或者产品平台如何利用已有的图片、视频、音乐素材批量合成大量视频就成为一个技术难点。

`FFCreator`是一种轻量又简单的解决方案，只需要很少的依赖和较低的机器配置就可以快速开始工作。它基于`node.js`开发, 普通前端工程师既可以轻松上手。
并且它模拟实现了[`animate.css`](https://animate.style/)90%的动画效果，您可以轻松地把 web 页面端的动画效果转为视频。FFCreator的图形渲染部分使用的是渲染引擎 _inkpaint_ [https://github.com/drawcall/inkpaint](https://github.com/drawcall/inkpaint)。

##### github: [https://github.com/tnfe/FFCreator](https://github.com/tnfe/FFCreator)

## 特性

- 完全基于`node.js`开发，非常易于使用，并且易于扩展和开发。
- 依赖很少、易于安装，对机器配置要求较低。
- 视频制作速度极快，一个 5 分钟的视频只需要 1-2 分钟。
- 支持近百种场景炫酷过渡动画效果。
- 支持图片、声音、视频剪辑、文本等元素。
- 支持字幕组件、可以将字幕与语音 tts 结合合成音频新闻。
- 支持简单（可扩展）的虚拟主播，您可以制作自己的虚拟主播。
- 包含`animate.css`90%的动画效果，可以将 css 动画转换为视频。
- `FFCreatorLite`版具有更快的合成速度，它也是一种不错的选择。

## 使用场景

#### `FFCreator`到底能干嘛呢?

- 自动化批量合成视频

根据图文内容批量生成短视频是视频信息流类平台的一个很常见的需求（比如百度推出的智能图文生成视频服务[vidpress](https://ai.baidu.com/creation/main/createlab)）, 但是对于开发来说要搭建整套流程却并不简单。
`FFCreator`可以帮您完成算法自动配图、生成摘要、语音 tts 之后的合成动画视频的关键一步。对比`aerender.exe`(AE 模版)方案, 它更快和更加灵活方便。

- 可视化搭建视频影片

也许有人用过类似[MAKA](https://www.maka.im/muban/t2152-sp320.html)平台的制作短视频功能, 用户只要上传图片拖拽位置、调整样式并添加一些 css 动画, 制作平台就可以合成一个精美的短视频。
对于可视化搭建类网站来说这是个很吸引人的功能, 使用`FFCreator`配合前端界面的一些操作就可以轻松的把 h5 动画转换为小视频。

![img](/_media/imgs/el.jpg)

- 制作相册影集小程序

很多人都有想法想做一个影集相册小程序（该类产品太多不一一列举了）, 那么不要在网上漫无目的的搜索解决方案了。
使用`FFCreator`作为项目后台, 剩下的工作就是你去做各种好看的模版文件而已。

## 原理简介

大多数视频处理通常离不开[`FFmpeg`](https://ffmpeg.org/)这个库，虽然`FFmpeg`在视频处理方面具有十分强大的功能。
但是在处理精细的动画效果方面`FFmpeg`就显得力不从心，并且它的使用也很不方便，需要开发去拼接大段的命令行参数。

对于处理更强的动画效果，业内有一种比价流行的方案就是基于`After Effects`（`aerender.exe`）的模板方案。但是这种方案也有不少问题(后续会有详细的比较说明)
`FFCreator`使用`opengl`来处理图形渲染并使用`shader`后处理来生成转场效果，最后使用`FFmpeg`合成视频，基于`opengl`既十分高效又可以支持各种丰富的图形动画。

![img](/_media/imgs/logotwo.jpg)

## 关于 Lite 版

希望您花三分钟时间了解下[`FFCreatorLite`](guide/lite.md), 很多时候也许它才是您更适合的选择。
`FFCreatorLite`和`FFCreator`并非相同的实现原理, `FFCreatorLite`不但具有`FFCreator`70%的动画效果(事实上编写它花了更多的时间), 同时在很多方面它的效率和性能远超`FFCreator`。
