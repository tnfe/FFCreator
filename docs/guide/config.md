# 基本配置


| 属性               | 别名        | 类型       | 含义                      |
| ----------------- | ----------- | ------ | ------------------------ |
| width          | w               |  number         | 视频宽度                              |
| height         | h                |    number        | 视频高度                            |
| fps          | rfps                  |  number (默认30)         | 视频帧频    |
| outputDir      | dir                 | string            | 视频输出路径          |
| cacheDir          | 无              |     string    | 缓存目录                        |
| output          | out           | string       | 输出文件名(非必须, 在FFCenter模式下不需要填写)                     |
| parallel          | frames    | number （默认5）      | 并行渲染                     |
| highWaterMark          | size     | string (默认1mb)               | node.js [highWaterMark](http://nodejs.cn/api/stream/buffering.html)                          |
| clarity          | renderClarity   | string (模式medium)                  | `medium high low` 画面渲染质量                          |
| cover          | 无           | string         | 封面图                         |
| pool          | 无            |  boolean (默认false)      |  是否启用对象池技术缓存(节省内存模式)                     |
| debug          | 无           |  boolean (默认false)    | boolean Debug模式                    |
| preload          | 无         |     boolean (默认true)      | 是否启用预加载                    |
| antialias  | 无  | boolean | 是否开启平滑 |
| audioLoop  | 无  | boolean （默认true） | 背景音乐是否循环 |
| render  | 无  | string (默认gl) | 使用gl/canvas内核渲染 - 内核cairo/mesa3d |
| ffmpeglog  | 无  | boolean (默认false) | 开启ffmpeg的log |
| vb  | 无  | string | ffmpeg vb |
| crf  | 无  | number (默认crf) | ffmpeg crf |
| preset  | 无  | string | ffmpeg preset |
| cacheFormat  | 无  | string (默认raw) | 缓存图片格式 |
| cacheQuality  | 无  | number (默认80) | 缓存图片质量（非raw格式） |
| defaultOutputOptions  | 无  | boolean | 是否使用默认配置 |

## Useage


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
