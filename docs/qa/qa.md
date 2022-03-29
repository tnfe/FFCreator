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

#### ✿2. 可以正常启动程序但是报错 `doesn't support WebGL....`

#### 解决

The node app should be started as follows.

```shell
xvfb-run -s "-ac -screen 0 1280x1024x24" npm start
```

#### ✿3. Npm 安装报错 `ERR! command sh -c node-pre-gyp install --fallback-to-build`

#### 解决

这可能是由您的node版本引起的。如果是node`v15`，会出现此问题 [https://github.com/Automattic/node-canvas/issues/1645](https://github.com/Automattic/node-canvas/issues/1645)。请把node版本降低到`v14`。

#### ✿4. FFCreator在3个以上视频片段合成时速度不如图片快

`FFCreator`在3个以上视频片段合成时速度不如图片快, 此时`FFCreatorLite`是更好的选择.

#### 解决

这种情况请使用`FFCreatorLite`, `FFCreatorLite`并不是`FFCreator`的简化版。在视频加工方面`FFCreatorLite`的效率超高。

#### ✿5. Error: /lib64/libstdc++.so.6: version `CXXABI_1.3.9' not found

#### 解决

I think this is a possible problem? If you find it, you can refer to this issue. [https://github.com/Automattic/node-canvas/issues/1796](https://github.com/Automattic/node-canvas/issues/1796)

Maybe this can be solved

```shell
npx node-pre-gyp rebuild -C ./node_modules/canvas
```

- 设置`highWaterMark`, 关于 highWaterMark 水位线您可以通过[这里](http://nodejs.cn/api/stream/buffering.html)了解。

```javascript
highWaterMark: '6mb',
```

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
