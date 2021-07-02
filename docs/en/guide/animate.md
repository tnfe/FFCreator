# About animation

> There are many types of animations of `FFCreator`, and scene transition effects can be added

- ## Add `effect` animation

You can add `effect` animation effects to the element (node).
`FFCreator`effect implements most of the functions of the famous css animation library [`animate.css`*4.1.0*](https://animate.style/), which means that you can easily add html animation effects Convert to video film.

### Useage

The animation type can be found here [`animate.css`](https://animate.style/).

```javascript
// parameter - type, time, delay
image.addEffect('fadeInDown', 1, 1);

// another way
image.addEffect({
  type: 'fadeInDown',
  time: 1,
  delay: 1,
});
```

### Unrealized effect

The following are some of the effects of [`animate.css`](https://animate.style/) not implemented by `FFCreator`, some are not suitable for putting in videos, and some are relatively expensive to implement.

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

- ## Add custom animation

If you feel that the effect cannot meet your needs, then `FFCreator` also supports any custom animation.
Use the `addAnimate` method to add your custom animation.

### Useage

`addAnimate` supports easing animation from A to B. You can set the `from` and `to` properties.

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

- ## Set scene switching effects

Supporting nearly a hundred kinds of cool scene switching effects is a feature of `FFCreator`, all effects are written by `glsl` and the processing speed is extremely fast.

![img](../../_media/imgs/ani.gif)

### Useage

```javascript
scene.setDuration(5);
// Two ways to use
scene.setTransition('TricolorCircle', 1.5); // type, duration, params
// or
scene.setTransition({
  name: 'TricolorCircle',
  duration: 1.5,
  params: {},
});
```

### effects animation

The names of all special effects are as follows:

[`Magnifier`](https://gl-transitions.surge.sh/transition/Magnifier) [`Colorful`](https://gl-transitions.surge.sh/transition/Colorful) [`WaterWave`](https://gl-transitions.surge.sh/transition/WaterWave) [`Stretch`](https://gl-transitions.surge.sh/transition/Stretch) [`BackOff`](https://gl-transitions.surge.sh/transition/BackOff) [`HangAround`](https://gl-transitions.surge.sh/transition/HangAround) [`Windows4`](https://gl-transitions.surge.sh/transition/Windows4) [`Fat`](https://gl-transitions.surge.sh/transition/Fat) [`MoveLeft`](https://gl-transitions.surge.sh/transition/MoveLeft) [`Oblique`](https://gl-transitions.surge.sh/transition/Oblique) [`Shake`](https://gl-transitions.surge.sh/transition/Shake) [`Slice`](https://gl-transitions.surge.sh/transition/Slice) [`Tetrapod`](https://gl-transitions.surge.sh/transition/Tetrapod) [`ZoomRight`](https://gl-transitions.surge.sh/transition/ZoomRight) [`FastSwitch`](https://gl-transitions.surge.sh/transition/FastSwitch) [`Fluidly`](https://gl-transitions.surge.sh/transition/Fluidly) [`Lens`](https://gl-transitions.surge.sh/transition/Lens) [`Radiation`](https://gl-transitions.surge.sh/transition/Radiation) [`TricolorCircle`](https://gl-transitions.surge.sh/transition/TricolorCircle) [`WindowShades`](https://gl-transitions.surge.sh/transition/WindowShades) [`Bounce`](https://gl-transitions.surge.sh/transition/Bounce) [`BowTieHorizontal`](https://gl-transitions.surge.sh/transition/BowTieHorizontal) [`BowTieVertical`](https://gl-transitions.surge.sh/transition/BowTieVertical) [`ButterflyWaveScrawler`](https://gl-transitions.surge.sh/transition/ButterflyWaveScrawler) [`CircleCrop`](https://gl-transitions.surge.sh/transition/CircleCrop) [`ColourDistance`](https://gl-transitions.surge.sh/transition/ColourDistance) [`CrazyParametricFun`](https://gl-transitions.surge.sh/transition/CrazyParametricFun) [`CrossZoom`](https://gl-transitions.surge.sh/transition/CrossZoom) [`Directional`](https://gl-transitions.surge.sh/transition/Directional) [`DoomScreenTransition`](https://gl-transitions.surge.sh/transition/DoomScreenTransition) [`Dreamy`](https://gl-transitions.surge.sh/transition/Dreamy) [`DreamyZoom`](https://gl-transitions.surge.sh/transition/DreamyZoom) [`FilmBurn`](https://gl-transitions.surge.sh/transition/FilmBurn) [`GlitchDisplace`](https://gl-transitions.surge.sh/transition/GlitchDisplace) [`GlitchMemories`](https://gl-transitions.surge.sh/transition/GlitchMemories) [`GridFlip`](https://gl-transitions.surge.sh/transition/GridFlip) [`InvertedPageCurl`](https://gl-transitions.surge.sh/transition/InvertedPageCurl) [`LinearBlur`](https://gl-transitions.surge.sh/transition/LinearBlur) [`Mosaic`](https://gl-transitions.surge.sh/transition/Mosaic) [`PolkaDotsCurtain`](https://gl-transitions.surge.sh/transition/PolkaDotsCurtain) [`Radial`](https://gl-transitions.surge.sh/transition/Radial) [`SimpleZoom`](https://gl-transitions.surge.sh/transition/SimpleZoom) [`StereoViewer`](https://gl-transitions.surge.sh/transition/StereoViewer) [`Swirl`](https://gl-transitions.surge.sh/transition/Swirl) [`ZoomInCircles`](https://gl-transitions.surge.sh/transition/ZoomInCircles) [`angular`](https://gl-transitions.surge.sh/transition/angular) [`burn`](https://gl-transitions.surge.sh/transition/burn) [`cannabisleaf`](https://gl-transitions.surge.sh/transition/cannabisleaf) [`circle`](https://gl-transitions.surge.sh/transition/circle) [`circleopen`](https://gl-transitions.surge.sh/transition/circleopen) [`colorphase`](https://gl-transitions.surge.sh/transition/colorphase) [`crosshatch`](https://gl-transitions.surge.sh/transition/crosshatch) [`crosswarp`](https://gl-transitions.surge.sh/transition/crosswarp) [`cube`](https://gl-transitions.surge.sh/transition/cube) [`directionalwarp`](https://gl-transitions.surge.sh/transition/directionalwarp) [`directionalwipe`](https://gl-transitions.surge.sh/transition/directionalwipe) [`displacement`](https://gl-transitions.surge.sh/transition/displacement) [`doorway`](https://gl-transitions.surge.sh/transition/doorway) [`fade`](https://gl-transitions.surge.sh/transition/fade) [`fadecolor`](https://gl-transitions.surge.sh/transition/fadecolor) [`fadegrayscale`](https://gl-transitions.surge.sh/transition/fadegrayscale) [`flyeye`](https://gl-transitions.surge.sh/transition/flyeye) [`heart`](https://gl-transitions.surge.sh/transition/heart) [`hexagonalize`](https://gl-transitions.surge.sh/transition/hexagonalize) [`kaleidoscope`](https://gl-transitions.surge.sh/transition/kaleidoscope) [`luma`](https://gl-transitions.surge.sh/transition/luma) [`luminance_melt`](https://gl-transitions.surge.sh/transition/luminance_melt) [`morph`](https://gl-transitions.surge.sh/transition/morph) [`multiply_blend`](https://gl-transitions.surge.sh/transition/multiply_blend) [`perlin`](https://gl-transitions.surge.sh/transition/perlin) [`pinwheel`](https://gl-transitions.surge.sh/transition/pinwheel) [`pixelize`](https://gl-transitions.surge.sh/transition/pixelize) [`polar_function`](https://gl-transitions.surge.sh/transition/polar_function) [`randomsquares`](https://gl-transitions.surge.sh/transition/randomsquares) [`ripple`](https://gl-transitions.surge.sh/transition/ripple) [`rotate_scale_fade`](https://gl-transitions.surge.sh/transition/rotate_scale_fade) [`squareswire`](https://gl-transitions.surge.sh/transition/squareswire) [`squeeze`](https://gl-transitions.surge.sh/transition/squeeze) [`swap`](https://gl-transitions.surge.sh/transition/swap) [`undulatingBurnOut`](https://gl-transitions.surge.sh/transition/undulatingBurnOut) [`wind`](https://gl-transitions.surge.sh/transition/wind) [`windowblinds`](https://gl-transitions.surge.sh/transition/windowblinds) [`windowslice`](https://gl-transitions.surge.sh/transition/windowslice) [`wipeDown`](https://gl-transitions.surge.sh/transition/wipeDown) [`wipeLeft`](https://gl-transitions.surge.sh/transition/wipeLeft) [`wipeRight`](https://gl-transitions.surge.sh/transition/wipeRight) [`wipeUp`](https://gl-transitions.surge.sh/transition/wipeUp) [`Sunflower`](https://gl-transitions.surge.sh/transition/Sunflower)
