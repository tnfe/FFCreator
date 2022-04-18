# After Effects Lottie 动画

> `FFCreator v6.6.1`新增 FFLottie 类, 增加对 AE lottie 文件渲染支持。您可以使用 AE 来制作非常复杂的动画了，它可以制作类似抖音中那些很炫的视频影集动画。

<video controls="controls" width="350" height="500" >
  <source type="video/mp4" src="./_media/video/wonder/lottie.mp4"></source>
</video>

- ## 关于 Lottie

Lottie 是 Airbnb 开源的一套跨平台的完整的动画效果解决方案，设计师可以使用 Adobe After Effects 设计出漂亮的动画之后，使用 Lottic 提供的 Bodymovin 插件将设计好的动画导出成 JSON 格式，就可以直接运用在 iOS、Android、Web 和 React Native 之上。
目前 FFCreator 借助于 [https://github.com/drawcall/lottie-node](https://github.com/drawcall/lottie-node) 已经实现了对 Lottie 动画的渲染支持。

![img](../_media/imgs/gif/lottie.gif)

> 注: lottie-node 支持绝大多数 lottie-web 的 API，为了保持版本的稳定性, lottie-node 版本固定为`v5.5.9`

### 如何使用

FFLottie 的使用非常简单，只需要几行代码即可。

```javascript
const file = path.join(__dirname, './assets/lottie/data.json');

const flottie = new FFLottie({
  x: width / 2,
  y: height / 2,
  width,
  height,
  file,
  loop: false,
});
scene.addChild(flottie);
```

也可以直接传递 data 数据

```javascript
const data = await axios.get(...);

const flottie = new FFLottie({
  x: 10,
  y: 10,
  width:100,
  height:100,
  data,
  loop: true,
});
```

### 替换元素

> 抖音、微视中的视频相册功能想必很多人都体验过，大体的解决思路就是动态修改视频模版中的占位元素来实现的。

阅读教程之前您可以先看下这几篇文章：

- [https://zhuanlan.zhihu.com/p/102334701](https://zhuanlan.zhihu.com/p/102334701)
- [https://zhuanlan.zhihu.com/p/161728284](https://zhuanlan.zhihu.com/p/161728284)

#### 修改 lottie 数据中的图片元素。

```javascript
/**
 * @param {number|string} id - id of the material
 * @param {string} path - new material path
 * @param {boolean} absolute - absolute path or relative path
 */
flottie.replaceAsset(17, path.join(__dirname, 'xx.jpg'));
// or
flottie.replaceAsset(17, 'xx.jpg', false);
```

#### 修改 lottie 数据中的文字元素。

```javascript
/**
 * @param {string} target - the target value
 * @param {string} path - new txt value
 */
flottie.replaceText('__x__', '世界的');
```

#### 根据图层 key 查找元素并替换。

```javascript
const elements = flottie.findElements('comp1,textnode');
elements[0].setText('hahahahah!');
```

#### 获取 lottie-api

[https://github.com/bodymovin/lottie-api](https://github.com/bodymovin/lottie-api) 是一个动态编辑 lottie-node 动画的库。借助于lottie-api可以做更深度的定制修改。

```javascript
const api = flottie.geApi();
let mousePosition = [0, 0];
const positionProperty = api.getKeyPath('red_solid,Transform,Position');
api.addValueCallback(positionProperty, currentValue => {
  return mousePosition;
});
```
