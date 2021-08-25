# 使用教程

> `FFCreator`使用非常简单, 你可以把它当作一个图形动画库即可。

`FFCreator`由`creator`(入口)、场景(`FFScene`)、元素(包括图片、视频、字幕等)以及音乐等组成。

- 一个**影片**可以添加多个**场景**, 场景之间可以设置过渡特效动画和停留时长。
- 一个**场景**可以添加多个不同**元素**, 对元素可以添加各自的动画(默认支持`animate.css`)。
- 既可以在整个影片上添加背景**音乐**, 又可以在单个场景上添加**声音**(适合语音 tts)。

- ### 创建`creator`(入口)

```javascript
const creator = new FFCreator({
  cacheDir,                 // 缓存目录
  outputDir,                // 输出目录
  output,                   // 输出文件名(FFCreatorCenter中可以不设)
  width: 500,               // 影片宽
  height: 680,              // 影片高
  cover: 'a.jpg',           // 设置封面
  audioLoop: true,          // 音乐循环
  fps: 24,                  // fps
  threads: 4,               // 多线程(伪造)并行渲染
  debug: false,             // 开启测试模式
  defaultOutputOptions: null,// ffmpeg输出选项配置
});
```

- ### 创建场景(`FFScene`)

```javascript
const scene = new FFScene();
scene.setBgColor('#30336b');        // 设置背景色
scene.setDuration(8.5);             // 设置停留时长
scene.setTransition('Fat', 1.5);    // 设置过渡动画(类型, 时间)
creator.addChild(scene);
```

- ### 创建图片元素

```javascript
const img = new FFImage({path: imgpath});
img.setXY(250, 340);                // 设置位置
img.setScale(2);                    // 设置缩放
img.setRotate(45);                  // 设置旋转
img.setOpacity(0.3);                // 设置透明度
img.setWH(100, 200);                // 设置宽高
img.addEffect('fadeInDown', 1, 1);  // 设置动画效果
scene.addChild(img);
// 也可以把参数放到构造函数conf中 ,这里的resetXY是重新计算位置
const img = new FFImage({path, width, height, x, y, resetXY: false});
```

- ### 创建相册元素

```javascript
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
```

- ### 创建GIF图

```javascript
const fgirl = new FFGifImage({ path: 'a.gif', x: 300 });
fgirl.addEffect('backInUp', 1.2, 1.5);
fgirl.setAnchor(0.5, 1);
scene1.addChild(fgirl);
```

- ### 创建文字元素

```javascript
const text = new FFText({text: '这是一个文字', x: 250, y: 80});
text.setColor('#ffffff');                   // 文字颜色
text.setBackgroundColor('#b33771');         // 背景色
text.addEffect('fadeInDown', 1, 1);         // 动画
text.alignCenter();                         // 文字居中
text.setStyle({padding: [4, 12, 6, 12]});   // 设置样式object
scene.addChild(text);
```

- ### 创建字幕元素

```javascript
const content = '跟计算机工作酷就酷在这里，它们不会生气，能记住所有东西...省略';
const subtitle = new FFSubtitle({
    comma: true,                  // 是否逗号分割
    backgroundColor: '#00219C',   // 背景色
    color: '#fff',                // 文字颜色
    fontSize: 24                  // 字号
});
subtitle.setText(content);      // 设置文案也可以放到conf里
subtitle.frameBuffer = 24;      // 缓存帧
subtitle.setDuration(12);       // 设置字幕总时长
scene.addChild(subtitle);
subtitle.setSpeech(dub);        // 设置语音配音-tts
```

- ### 创建视频元素

```javascript
const video = new FFVideo({
    path: videopath,
    x: 100,
    y: 150,
    width: 500,
    height: 350
});
video.setAudio(true);                   // 是否有音乐
video.setTimes('00:00:43', '00:00:50'); // 截取播放时长
scene.addChild(video);
```

- ### 添加音乐

```javascript
// 1. 添加全局背景音
creator.addAudio('../audio/bg.mp3');  // 俩种配置方式
creator.addAudio({ loop: false, path: ... , volume:1.5});
// 2. 为每个场景添加单独音乐
scene.addAudio('../audio/bg.mp3');  // 俩种配置方式
scene.addAudio({ loop: false,path: ... , start: 20, volume:"20dB"});

// volume 音量调整参数
// 0.5:音量减半  1.5:音量为原来的150% 20dB:增加10分贝 -20dB:减小20分贝
// https://trac.ffmpeg.org/wiki/AudioVolume
```

- ### 创建虚拟主播

注: `FFVtuber`是基于序列帧的简单版卡通动画, 基于它你可以实现自己更细腻的主播形象

```javascript
const vtuber = new FFVtuber({ x: 100, y: 400 });
// 设置动画时间循环周期
vtuber.setPeriod([
    [0, 3],
    [0, 3]
]);
// 路径设置这里 baby/[d].png 和 baby/%d.png 两种方式均可以
const vpath = path.join(__dirname, "./avator/baby/[d].png");
vtuber.setPath(vpath, 1, 7);    // 从第1-7.png
vtuber.setSpeed(6);             // 播放速度
creator.addVtuber(vtuber);
```

- ### 添加事件侦听

```javascript
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

- ### 处理多任务

如果您要处理多个制作任务(通常的场景不会只做一个视频), 那么推荐使用`FFCreatorCenter`进行任务队列管理。
当然您也可以自己实现一个任务队列管理, 其实很简单。

```javascript
const taskId = FFCreatorCenter.addTask(() => {
    const creator = new FFCreator({...});
    ... // 添加各种场景和元素

    return creator;  // 一定要return creator
});

FFCreatorCenter.onTaskComplete(taskId, result => {
    console.log(result.file);
});

// 错误
FFCreatorCenter.onTaskError(taskId, error => {
    console.error(error);
})
```
