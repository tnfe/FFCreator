# 常见问题

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

3. #### `FFCreator`在3个以上视频片段合成时速度不如图片快

`FFCreator`在3个以上视频片段合成时速度不如图片快, 此时`FFCreatorLite`是更好的选择.

#### 解决

这种情况请使用`FFCreatorLite`, `FFCreatorLite`并不是`FFCreator`的简化版。
在视频加工方面`FFCreatorLite`的效率超高。