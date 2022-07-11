# 关于动画

> `FFCreator`的动画实现方式有多种, 还可以添加场景过渡特效动画。FFCreator的图形渲染部分使用的是渲染引擎 _inkpaint_ [https://github.com/drawcall/inkpaint](https://github.com/drawcall/inkpaint)。

- ## 添加`effect`动画

可以往元素(node)上添加`effect`动画效果。
`FFCreator`effect 实现了著名 css 动画库[`animate.css`_4.1.0_](https://animate.style/) 版本的绝大多数功能, 也就是说您可以轻松把 html 的动画效果转换为视频影片。

### 使用

动画类型可以在[`animate.css`](https://animate.style/)这里查询。

```javascript
// 参数 - type, time, delay
image.addEffect('fadeInDown', 1, 1);

// 另一种方式
image.addEffect({
  type: 'fadeInDown',
  time: 1,
  delay: 1,
});
```

当然也可以组合多个动画

```javascript
text.addEffect(['fadeInUp', 'rotateIn', 'blurIn', 'zoomIn'], 1, 0.5);
```

### 创建自定义 effect

```javascript
// add custom effect
creator.createEffect('customEffect', {
  from: { opacity: 0, y: 350, rotate: 190, scale: 0.3 },
  to: { opacity: 1, y: 200, rotate: 0, scale: 1 },
  ease: 'Back.Out',
});
```

### 未实现的效果

下面是`FFCreator`未实现[`animate.css`](https://animate.style/)的一些效果, 有的不太适合放视频中、有的是实现成本比较高。

```javascript
- Attention seekers
    - bounce flash pulse rubberBand shakeX shakeY headShake swing tada wobble jello heartBeat
- Fading
    - fadeInTopLeft fadeInTopRight fadeInBottomLeft fadeInBottomRight
    - fadeOutTopLeft fadeOutTopRight fadeOutBottomRight fadeOutBottomLeft
- Flippers
    - flip flipInX flipInY flipOutX flipOutY
- Lightspeed
    - lightSpeedInRight lightSpeedInLeft lightSpeedOutRight lightSpeedOutLeft
- Specials
    - hinge jackInTheBox
```

---

- ## 添加自定义动画

如果您觉得 effect 还不能满足您的需求, 那么`FFCreator`也支持任意自定义动画。
使用`addAnimate`方法就可以添加您的自定义动画。

### 使用

`addAnimate`支持从 A 到 B 的缓动动画, 您可以设置`from`、`to`属性。

```javascript
image.addAnimate({
    from: { x:200, scale: .1, opacity: 0 },
    to: { x:100, scale: 1, opacity:1 },
    time = 1,
    delay = 1.2,
    ease = 'Quadratic.In'
});
```

---

- ## 设置场景切换特效

支持近百种炫酷的场景切换特效是`FFCreator`的一大特色, 所有特效均为`glsl`编写处理速度极快。

![img](../_media/imgs/ani.gif)

### 使用

使用`setTransition`来设置场景切换动画, 还可以设置过度时间。

```javascript
scene.setDuration(5);
// 两种使用方式
scene.setTransition('TricolorCircle', 1.5); // type, duration, params
// 或者
scene.setTransition({
  name: 'TricolorCircle',
  duration: 1.5,
  params: {},
});
```

### 特效动画

所有特效名称如下:

`Magnifier` `Colorful` `WaterWave` `Stretch` `BackOff` `HangAround` `Windows4` `Fat` `MoveLeft` `Oblique` `Shake` `Slice` `Tetrapod` `ZoomRight` `FastSwitch` `Fluidly` `Lens` `Radiation` `TricolorCircle` `WindowShades` `Bounce` `BowTieHorizontal` `BowTieVertical` `ButterflyWaveScrawler` `CircleCrop` `ColourDistance` `CrazyParametricFun` `CrossZoom` `Directional` `DoomScreenTransition` `Dreamy` `DreamyZoom` `FilmBurn` `GlitchDisplace` `GlitchMemories` `GridFlip` `InvertedPageCurl` `LinearBlur` `Mosaic` `PolkaDotsCurtain` `Radial` `SimpleZoom` `StereoViewer` `Swirl` `ZoomInCircles` `angular` `burn` `cannabisleaf` `circle` `circleopen` `colorphase` `crosshatch` `crosswarp` `cube` `directionalwarp` `directionalwipe` `displacement` `doorway` `fade` `fadecolor` `fadegrayscale` `flyeye` `heart` `hexagonalize` `kaleidoscope` `luma` `luminance_melt` `morph` `multiply_blend` `perlin` `pinwheel` `pixelize` `polar_function` `randomsquares` `ripple` `rotate_scale_fade` `squareswire` `squeeze` `swap` `undulatingBurnOut` `wind` `windowblinds` `windowslice` `wipeDown` `wipeLeft` `wipeRight` `wipeUp` `Sunflower`
