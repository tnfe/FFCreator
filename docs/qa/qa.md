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

3. #### Npm 安装报错 `ERR! command sh -c node-pre-gyp install --fallback-to-build`

#### 解决

这可能是由您的node版本引起的。如果是node`v15`，会出现此问题 [https://github.com/Automattic/node-canvas/issues/1645](https://github.com/Automattic/node-canvas/issues/1645)。请把node版本降低到`v14`。

4. #### FFCreator在3个以上视频片段合成时速度不如图片快

`FFCreator`在3个以上视频片段合成时速度不如图片快, 此时`FFCreatorLite`是更好的选择.

#### 解决

这种情况请使用`FFCreatorLite`, `FFCreatorLite`并不是`FFCreator`的简化版。在视频加工方面`FFCreatorLite`的效率超高。

5. #### 为什么合成一分钟以上的视频的时候会生成几个G的缓存

#### 解决

FFCreator默认使用的是raw格式缓存，使用raw可以确保处理速度极快并且视频质量也非常好。
如果你的服务器并没有大的存储空间, 那么您可以通过设置缓存格式来节省磁盘空间。

- 使用`jpg`(or `png`) 格式的缓存，设置`cacheQuality`选项以修改质量。
> 注：使用jpg格式对比原始将会极大的节省缓存空间，大多时候是十分之一甚至几十分之一。png质量会更好一些但是占用空间也会变大。

```javascript
cacheType: 'jpg', // (or png)
cacheQuality: 70, // default 80
```
