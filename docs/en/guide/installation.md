# how to install

> `FFCreator` is easy to install, please check the installation tutorial.

- ### Install `node.js`

Because `FFCreator` is developed based on `node.js`, so you must first install [https://nodejs.org/](https://nodejs.org/).
This is too simple for front-end development.

- ### Installation dependencies

1. #### Install`FFmpeg`

`FFCreator` relies on `FFmpeg` for video processing. Installing `FFmpeg` is very simple, the following are installation tutorials for different systems.

`windows` - [http://blog.gregzaal.com/how-to-install-ffmpeg-on-windows/](http://blog.gregzaal.com/how-to-install-ffmpeg-on-windows/)  
`Mac OS` - [https://superuser.com/questions/624561/install-ffmpeg-on-os-x](https://superuser.com/questions/624561/install-ffmpeg-on-os-x)  
`centOS` - [https://blog.csdn.net/guo_qiangqiang/article/details/106475191](https://blog.csdn.net/guo_qiangqiang/article/details/106475191)  
`debian` - [https://linuxize.com/post/how-to-install-ffmpeg-on-debian-9/](https://linuxize.com/post/how-to-install-ffmpeg-on-debian-9/)

##### Note: Please set `FFmpeg` as a global variable, otherwise you need to use `setFFmpegPath` to add `FFmpeg` native path

```javascript
FFCreator.setFFmpegPath('...');
```

---

2. #### Install `node-canvas` and `headless-gl` dependencies

> ##### If it is a computer with a display device, such as a personal `pc` computer with a `windows`, `Mac OSX` system or a `server` server with a graphics card or display device, you can skip this step without installing this dependency.

If you are using `Centos`, `Redhat`, `Fedora` system, you can use `yum` to install.

```shell
sudo yum install gcc-c++ cairo-devel pango-devel libjpeg-turbo-devel giflib-devel
```

Install[`Xvfb`](https://linux.die.net/man/1/xvfb)and[`Mesa`](http://www.sztemple.cc/articles/linux%E4%B8%8B%E7%9A%84opengl-mesa%E5%92%8Cglx%E7%AE%80%E4%BB%8B)

```shell
sudo yum install mesa-dri-drivers Xvfb libXi-devel libXinerama-devel libX11-devel
```

If you are using `Debian`, `ubuntu` system, you can use `apt` to install.

```shell
sudo apt-get install libcairo2-dev libjpeg-dev libpango1.0-dev libgif-dev build-essential g++
sudo apt-get install libgl1-mesa-dev xvfb libxi-dev libx11-dev
```

More information can be found [headless-gl](https://github.com/stackgl/headless-gl)、[node-canvas](https://github.com/Automattic/node-canvas)

- ### Install `npm package`

```shell
npm i ffcreator --save
```

>  The installation of `FFCreatorLite` version is easier, please refer to [Tutorial](guide/lite.md).

- ### Startup project

  - If it is a computer with a display device, such as a personal `pc` computer or a `server` server with a graphics card or display device, it will start normally.
```shell
npm start
```
  - For servers without display devices, please use the `xvfb-run` command to start the program. For more parameters of the `xvfb-run` command, click [here](http://manpages.ubuntu.com/manpages/trusty/man1/xvfb-run.1.html) view.
```shell
xvfb-run -s "-ac -screen 0 1280x1024x24" npm start
```
