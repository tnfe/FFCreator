# Basic config


| Attribute | Alias ​​| Type | Meaning |
| ----------------- | ----------- | ------ | ------------ ------------ |
| width | w | number | video width |
| height | h | number | video height |
| fps | None | number (default 30) | Video frame rate |
| outputDir | dir | string | Video output path |
| cacheDir | None | string | Cache directory |
| output | out | string | Output file name (not required, no need to fill in in FFCenter mode) |
| parallel | frames | number (default 5) | parallel rendering |
| highWaterMark | size | string (default 1mb) | node.js [highWaterMark](http://nodejs.cn/api/stream/buffering.html) |
| clarity | renderClarity | string (mode medium) | `medium high low` image rendering quality |
| cover | none | string | cover image |
| pool | None | boolean (default false) | Whether to enable object pool technology caching (memory saving mode) |
| debug | None | boolean (default false) | boolean Debug mode |
| preload | None | boolean (default true) | Whether to enable preload |
| antialias | None | boolean | Whether to enable smoothing |
| audioLoop | None | boolean (default true) | Whether the background music loops |
| render | none | string (default gl) | use gl/canvas kernel rendering-kernel cairo/mesa3d |
| ffmpeglog | None | boolean (default false) | Enable ffmpeg log |
| vb | None | string | ffmpeg vb |
| crf | None | number (default crf) | ffmpeg crf |
| preset | none | string | ffmpeg preset |
| cacheFormat | None | string (default raw) | Cached image format |
| cacheQuality | None | number (default 80) | Cached image quality (non-raw format) |
| defaultOutputOptions | None | boolean | Whether to use the default configuration |
