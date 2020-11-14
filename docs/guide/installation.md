# 如何安装

> `FFCreator`安装比较简单, 请仔细查看安装教程。

- ### 安装`node.js`环境

因为`FFCreator`是基于`node.js`开发的, 所有你首先要安装 [https://nodejs.org/](https://nodejs.org/)。
对于前端开发来说这简直太熟悉不过了。

- ### 安装相关依赖

1. #### 安装`FFmpeg`

`FFCreator`依赖`FFmpeg`做视频合成处理。安装`FFmpeg`非常简单, 下面是不同系统的安装教程。

`windows` - [http://blog.gregzaal.com/how-to-install-ffmpeg-on-windows/](http://blog.gregzaal.com/how-to-install-ffmpeg-on-windows/)  
`Mac OS` - [https://superuser.com/questions/624561/install-ffmpeg-on-os-x](https://superuser.com/questions/624561/install-ffmpeg-on-os-x)  
`centOS` - [https://blog.csdn.net/guo_qiangqiang/article/details/106475191](https://blog.csdn.net/guo_qiangqiang/article/details/106475191)  
`debian` - [https://linuxize.com/post/how-to-install-ffmpeg-on-debian-9/](https://linuxize.com/post/how-to-install-ffmpeg-on-debian-9/)

##### 注: 请设置`FFmpeg`为全局变量, 否则需要使用`setFFmpegPath`添加`FFmpeg`本机路径

```javascript
FFCreator.setFFmpegPath('...');
```

---

2. #### 安装`node-canvas`及`headless-gl`依赖

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

更多信息可以查询 [headless-gl](https://github.com/stackgl/headless-gl)、[node-canvas](https://github.com/Automattic/node-canvas)

- ### 安装`npm package`

```shell
npm i ffcreator --save
```

> `FFCreatorLite`版安装更加简单, 请参看[教程](guide/lite.md)。

- ### 启动项目

  - 若是有显示设备的电脑, 比如个人`pc`电脑或者有显卡或显示设备的`server`服务器, 正常启动。
```shell
npm start
```
  - 无显示设备的服务器请使用`xvfb-run`命令启动程序, 关于`xvfb-run`命令更多的参数可以点击[这里](http://manpages.ubuntu.com/manpages/trusty/man1/xvfb-run.1.html)查看。
```shell
xvfb-run -s "-ac -screen 0 1280x1024x24" npm start
```
