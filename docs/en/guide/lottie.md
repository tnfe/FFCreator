# After Effects Lottie Animation

> `FFCreator v6.6.1` added the FFLottie class and added support for rendering AE lottie files. You can use AE to make very complex animations, it can make animations like those cool video albums in Douyin.

<video controls="controls" width="350" height="500" >
  <source type="video/mp4" src="./_media/video/wonder/lottie.mp4"></source>
</video>

- ## About Lottie

Lottie is a complete set of cross-platform animation effect solutions open sourced by Airbnb. After designers can use Adobe After Effects to design beautiful animations, they can use the Bodymovin plug-in provided by Lottic to export the designed animations into JSON format. Works on iOS, Android, Web and React Native.
At present, FFCreator has implemented the rendering support for Lottie animation with the help of [https://github.com/drawcall/lottie-node](https://github.com/drawcall/lottie-node).

![img](../../_media/imgs/gif/lottie.gif)

> Note: lottie-node supports most APIs of lottie-web, in order to maintain version stability, lottie-node version is fixed to `v5.5.9`

### how to use

Using FFLottie is very simple and only requires a few lines of code.

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

You can also pass data directly

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

### replace element

> The video album function in Douyin and Weishi must have been experienced by many people. The general solution is to dynamically modify the placeholder elements in the video template.

Before reading the tutorial, you can read these articles:

- [https://zhuanlan.zhihu.com/p/102334701](https://zhuanlan.zhihu.com/p/102334701)
- [https://zhuanlan.zhihu.com/p/161728284](https://zhuanlan.zhihu.com/p/161728284)

#### Modify image elements in lottie data.

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

#### Modify text elements in lottie data.

```javascript
/**
 * @param {string} target - the target value
 * @param {string} path - new txt value
 */
flottie.replaceText('__x__', 'world');
```

#### Find elements by layer key and replace.

```javascript
const elements = flottie.findElements('comp1,textnode');
elements[0].setText('hahahahah!');
```

#### Get lottie-api

[https://github.com/bodymovin/lottie-api](https://github.com/bodymovin/lottie-api) is a library for dynamically editing lottie-node animations. With the help of lottie-api, more in-depth customization can be done.

```javascript
const api = flottie.geApi();
let mousePosition = [0, 0];
const positionProperty = api.getKeyPath('red_solid,Transform,Position');
api.addValueCallback(positionProperty, currentValue => {
  return mousePosition;
});
```
