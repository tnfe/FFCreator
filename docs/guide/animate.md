# 关于动画

> `FFCreator`的动画实现方式有多种, 还可以添加场景过渡特效动画

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

所有特效名称如下(点击查看效果):

[`Magnifier`](https://gl-transitions.surge.sh/transition/Magnifier) [`Colorful`](https://gl-transitions.surge.sh/transition/Colorful) [`WaterWave`](https://gl-transitions.surge.sh/transition/WaterWave) [`Stretch`](https://gl-transitions.surge.sh/transition/Stretch) [`BackOff`](https://gl-transitions.surge.sh/transition/BackOff) [`HangAround`](https://gl-transitions.surge.sh/transition/HangAround) [`Windows4`](https://gl-transitions.surge.sh/transition/Windows4) [`Fat`](https://gl-transitions.surge.sh/transition/Fat) [`MoveLeft`](https://gl-transitions.surge.sh/transition/MoveLeft) [`Oblique`](https://gl-transitions.surge.sh/transition/Oblique) [`Shake`](https://gl-transitions.surge.sh/transition/Shake) [`Slice`](https://gl-transitions.surge.sh/transition/Slice) [`Tetrapod`](https://gl-transitions.surge.sh/transition/Tetrapod) [`ZoomRight`](https://gl-transitions.surge.sh/transition/ZoomRight) [`FastSwitch`](https://gl-transitions.surge.sh/transition/FastSwitch) [`Fluidly`](https://gl-transitions.surge.sh/transition/Fluidly) [`Lens`](https://gl-transitions.surge.sh/transition/Lens) [`Radiation`](https://gl-transitions.surge.sh/transition/Radiation) [`TricolorCircle`](https://gl-transitions.surge.sh/transition/TricolorCircle) [`WindowShades`](https://gl-transitions.surge.sh/transition/WindowShades) [`Bounce`](https://gl-transitions.surge.sh/transition/Bounce) [`BowTieHorizontal`](https://gl-transitions.surge.sh/transition/BowTieHorizontal) [`BowTieVertical`](https://gl-transitions.surge.sh/transition/BowTieVertical) [`ButterflyWaveScrawler`](https://gl-transitions.surge.sh/transition/ButterflyWaveScrawler) [`CircleCrop`](https://gl-transitions.surge.sh/transition/CircleCrop) [`ColourDistance`](https://gl-transitions.surge.sh/transition/ColourDistance) [`CrazyParametricFun`](https://gl-transitions.surge.sh/transition/CrazyParametricFun) [`CrossZoom`](https://gl-transitions.surge.sh/transition/CrossZoom) [`Directional`](https://gl-transitions.surge.sh/transition/Directional) [`DoomScreenTransition`](https://gl-transitions.surge.sh/transition/DoomScreenTransition) [`Dreamy`](https://gl-transitions.surge.sh/transition/Dreamy) [`DreamyZoom`](https://gl-transitions.surge.sh/transition/DreamyZoom) [`FilmBurn`](https://gl-transitions.surge.sh/transition/FilmBurn) [`GlitchDisplace`](https://gl-transitions.surge.sh/transition/GlitchDisplace) [`GlitchMemories`](https://gl-transitions.surge.sh/transition/GlitchMemories) [`GridFlip`](https://gl-transitions.surge.sh/transition/GridFlip) [`InvertedPageCurl`](https://gl-transitions.surge.sh/transition/InvertedPageCurl) [`LinearBlur`](https://gl-transitions.surge.sh/transition/LinearBlur) [`Mosaic`](https://gl-transitions.surge.sh/transition/Mosaic) [`PolkaDotsCurtain`](https://gl-transitions.surge.sh/transition/PolkaDotsCurtain) [`Radial`](https://gl-transitions.surge.sh/transition/Radial) [`SimpleZoom`](https://gl-transitions.surge.sh/transition/SimpleZoom) [`StereoViewer`](https://gl-transitions.surge.sh/transition/StereoViewer) [`Swirl`](https://gl-transitions.surge.sh/transition/Swirl) [`ZoomInCircles`](https://gl-transitions.surge.sh/transition/ZoomInCircles) [`angular`](https://gl-transitions.surge.sh/transition/angular) [`burn`](https://gl-transitions.surge.sh/transition/burn) [`cannabisleaf`](https://gl-transitions.surge.sh/transition/cannabisleaf) [`circle`](https://gl-transitions.surge.sh/transition/circle) [`circleopen`](https://gl-transitions.surge.sh/transition/circleopen) [`colorphase`](https://gl-transitions.surge.sh/transition/colorphase) [`crosshatch`](https://gl-transitions.surge.sh/transition/crosshatch) [`crosswarp`](https://gl-transitions.surge.sh/transition/crosswarp) [`cube`](https://gl-transitions.surge.sh/transition/cube) [`directionalwarp`](https://gl-transitions.surge.sh/transition/directionalwarp) [`directionalwipe`](https://gl-transitions.surge.sh/transition/directionalwipe) [`displacement`](https://gl-transitions.surge.sh/transition/displacement) [`doorway`](https://gl-transitions.surge.sh/transition/doorway) [`fade`](https://gl-transitions.surge.sh/transition/fade) [`fadecolor`](https://gl-transitions.surge.sh/transition/fadecolor) [`fadegrayscale`](https://gl-transitions.surge.sh/transition/fadegrayscale) [`flyeye`](https://gl-transitions.surge.sh/transition/flyeye) [`heart`](https://gl-transitions.surge.sh/transition/heart) [`hexagonalize`](https://gl-transitions.surge.sh/transition/hexagonalize) [`kaleidoscope`](https://gl-transitions.surge.sh/transition/kaleidoscope) [`luma`](https://gl-transitions.surge.sh/transition/luma) [`luminance_melt`](https://gl-transitions.surge.sh/transition/luminance_melt) [`morph`](https://gl-transitions.surge.sh/transition/morph) [`multiply_blend`](https://gl-transitions.surge.sh/transition/multiply_blend) [`perlin`](https://gl-transitions.surge.sh/transition/perlin) [`pinwheel`](https://gl-transitions.surge.sh/transition/pinwheel) [`pixelize`](https://gl-transitions.surge.sh/transition/pixelize) [`polar_function`](https://gl-transitions.surge.sh/transition/polar_function) [`randomsquares`](https://gl-transitions.surge.sh/transition/randomsquares) [`ripple`](https://gl-transitions.surge.sh/transition/ripple) [`rotate_scale_fade`](https://gl-transitions.surge.sh/transition/rotate_scale_fade) [`squareswire`](https://gl-transitions.surge.sh/transition/squareswire) [`squeeze`](https://gl-transitions.surge.sh/transition/squeeze) [`swap`](https://gl-transitions.surge.sh/transition/swap) [`undulatingBurnOut`](https://gl-transitions.surge.sh/transition/undulatingBurnOut) [`wind`](https://gl-transitions.surge.sh/transition/wind) [`windowblinds`](https://gl-transitions.surge.sh/transition/windowblinds) [`windowslice`](https://gl-transitions.surge.sh/transition/windowslice) [`wipeDown`](https://gl-transitions.surge.sh/transition/wipeDown) [`wipeLeft`](https://gl-transitions.surge.sh/transition/wipeLeft) [`wipeRight`](https://gl-transitions.surge.sh/transition/wipeRight) [`wipeUp`](https://gl-transitions.surge.sh/transition/wipeUp) [`Sunflower`](https://gl-transitions.surge.sh/transition/Sunflower)
