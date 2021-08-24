# 基本配置


| 属性               | 别名                                | 含义                      |
| ----------------- | -------------------------------------------- | ------------------------------------- |
| width          | w                            | 视频宽度                              |
| height         | h                            | 视频高度                            |
| fps          | 无                             | 视频帧频    |
| rfps          | renderFps                     | ffcreator渲染频率 (频率越高视频质量越好) |
| outputDir      | dir                             | 视频输出路径          |
| cacheDir          | 无                       | 缓存目录                        |
| output          | out                   | 输出文件名(非必须, 在FFCenter模式下不需要填写)                     |
| parallel          | frames             | 并行渲染                     |
| highWaterMark          | size                     | node.js [highWaterMark](http://nodejs.cn/api/stream/buffering.html)                          |
| clarity          | renderClarity                     | `medium high low` 画面渲染质量                          |
| cover          | 无                    | 封面图                         |
| pool          | 无                    | boolean 是否启用对象池技术缓存(节省内存模式)                     |
| debug          | 无                    | boolean Debug模式                    |
| preload          | 无                   | 默认true 是否启用预加载                    |
