# 常见问题

#### ✿1. 当安装时提示错误 missing package'xi'

```shell
No package 'xi'

foundgyp: Call to 'pkg-config --libs-only-l x11 xi xext' returned exit status 1 while in angle/src/angle.gyp. while loading dependencies of binding.gyp while trying to load binding.gyp
```

#### 解决

```shell
yum install libXi-devel libXinerama-devel libX11-devel
```

---

#### ✿2. Server下可以正常启动程序但是报错

Server报错 `Cannot read property 'getUniformLocation' of null` 或者 `TypeError: Cannot read property 'ARRAY_BUFFER' of null`

#### 解决

The node app should be started as follows.

```shell
xvfb-run -s "-ac -screen 0 1280x1024x24" npm start
```

---

#### ✿3. Npm 安装过程报错

报错 `ERR! command sh -c node-pre-gyp install --fallback-to-build`

#### 解决

这可能是由您的node版本引起的。如果是node`v15`，会出现此问题 [https://github.com/Automattic/node-canvas/issues/1645](https://github.com/Automattic/node-canvas/issues/1645)。请把node版本降低到`v14`。

---

#### ✿4. Linux下启无法启动程序

报错 `Error: /lib64/libstdc++.so.6: version 'CXXABI_1.3.9' not found`

#### 解决

I think this is a possible problem? If you find it, you can refer to this issue. [https://github.com/Automattic/node-canvas/issues/1796](https://github.com/Automattic/node-canvas/issues/1796)

Maybe this can be solved

```shell
npx node-pre-gyp rebuild -C ./node_modules/canvas
```

---

#### ✿5. CentOS下合成视频时阻塞http请求

在Centos上，会出现阻塞现象，一个任务开始后，这个进程就无法再接受新的请求了，直到任务渲染完成。

> 参考 [https://github.com/tnfe/FFCreator/issues/149](https://github.com/tnfe/FFCreator/issues/149) 、[https://github.com/tnfe/FFCreator/issues/127](https://github.com/tnfe/FFCreator/issues/127)

#### 解决

这个问题可能是由多种情况引起的。

1. `highWaterMark` 默认设置(`512kb`)过大，导致数据流背压。关于背压[https://nodejs.org/zh-cn/docs/guides/backpressuring-in-streams/](https://nodejs.org/zh-cn/docs/guides/backpressuring-in-streams/)。所以可以将`highWaterMark`设置为更小尝试，但是`highWaterMark`过小会影响合成速度自行注意。

2. 可以启动多个`cluster`，不同的`cluster`来单独处理http请求。参考[https://segmentfault.com/a/1190000019295113](https://segmentfault.com/a/1190000019295113)。

3. 机器配置较低, CPU高负荷计算阻塞了nodejs事件循环。参考[https://nodejs.org/zh-cn/docs/guides/dont-block-the-event-loop/](https://nodejs.org/zh-cn/docs/guides/dont-block-the-event-loop/)、[https://www.infoq.cn/article/nodejs-weakness-cpu-intensive-tasks](https://www.infoq.cn/article/nodejs-weakness-cpu-intensive-tasks)。

---

#### ✿6. linux服务器下如何结合PM2、xvfb一起使用

无法使用`xvfb-run -s "-ac -screen 0 1280x1024x24" pm2 start`方式启动服务, 报错

```javascript
(node:4986) UnhandledPromiseRejectionWarning: TypeError: Cannot read property 'ARRAY_BUFFER' of null
at FFTransition.createBuffer (/var/www/html/juan_fundoo/public/APP/node_modules/ffcreator/lib/animate/transition.js:73:45)
at FFTransition.createTransition
```

#### 解决

配置 `process.json`

```
{
  "apps" : [{
    "name"        : "<your_app_name>",
    "script"      : "<your_main.js>",
    "env": {
      "DISPLAY": ":99"
    }
  },
    {
      "name"        : "Xvfb",
      "interpreter" : "none",
      "script"      : "Xvfb",
      "args"        : ":99 -ac -screen 0 1280x1024x24"
    }]
}
```
启动服务 `pm2 start process.json`

> 备注: [Xvfb configure](https://www.x.org/releases/X11R7.6/doc/man/man1/Xvfb.1.xhtml) 、[xvfb-run configure](http://manpages.ubuntu.com/manpages/trusty/man1/xvfb-run.1.html)

---

#### ✿7. FFCreator在2个以上视频片段合成时速度不快

`FFCreator`在处理复杂的视频动画或者多个视频时加工速度并不很快。

#### 解决

这种情况请使用 FFCreatorLite。

`FFCreatorLite`并不是`FFCreator`的简化版，它是纯粹的ffmpeg实现。在视频加工方面`FFCreatorLite`的速度非常快，而且也能支持`FFCreator`大多数功能。
