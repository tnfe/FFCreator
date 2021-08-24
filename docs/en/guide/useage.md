# Tutorial

> `FFCreator` is very simple to use, you can use it as a graphic animation library.

`FFCreator` is composed of `creator` (entry), scene (`FFScene`), elements (including pictures, videos, subtitles, etc.), and music.

- A **movie** can add multiple **scenes**, and transition special effects animation and stay time can be set between scenes.
- A **scene** can add multiple different **elements**, and add their own animations to the elements (support `animate.css` by default).
- Both background **music** can be added to the entire movie, and **sound** can be added to a single scene (suitable for voice tts).

- ### Create `creator` (entry)

```javascript
const creator = new FFCreator({
  cacheDir, // cache directory
  outputDir, // output directory
  output, // output file name (can not be set in FFCreatorCenter)
  width: 500, // width of the video
  height: 680, // video height
  cover: 'a.jpg', // Set cover
  audioLoop: true, // Music loop
  fps: 24, // fps
  threads: 4, // Multi-threaded (fake) parallel rendering
  debug: false, // enable test mode
  defaultOutputOptions: null, // ffmpeg output option configuration
});
```

- ### Create scene (`FFScene`)

```javascript
const scene = new FFScene();
scene.setBgColor('#30336b'); // Set the background color
scene.setDuration(8.5); // Set the duration of stay
scene.setTransition('Fat', 1.5); // Set transition animation (type, time)
creator.addChild(scene);
```

- ### Create picture elements

```javascript
const img = new FFImage({ path: imgpath });
img.setXY(250, 340); // set position
img.setScale(2); // set zoom
img.setRotate(45); // set rotation
img.setOpacity(0.3); // set transparency
img.setWH(100, 200); // set width and height
img.addEffect('fadeInDown', 1, 1); // set animation effect
scene.addChild(img);
// You can also put the parameters in the constructor conf, where resetXY is to recalculate the position
const img = new FFImage({ path, width, height, x, y, resetXY: false });
```

- ### Create album elements

```javascript
const album = new FFAlbum({
  list: [img1, img2, img3, img4], // Picture collection of album
  x: 250,
  y: 300,
  width: 500,
  height: 300,
});
album.setTransition('zoomIn'); // Set the album switching animation
album.setDuration(2.5); // Set the duration of a single album
album.setTransTime(1.5); // Set the duration of a single animation
scene.addChild(album);
```

- ### Create GIF Image

```javascript
const fgirl = new FFGifImage({ path: 'a.gif', x: 300 });
fgirl.addEffect('backInUp', 1.2, 1.5);
fgirl.setAnchor(0.5, 1);
scene1.addChild(fgirl);
```

- ### Create text elements

```javascript
const text = new FFText(((text: 'This is a text'), (x: 250), (y: 80)));
text.setColor('#ffffff'); // text color
text.setBackgroundColor('#b33771'); // background color
text.addEffect('fadeInDown', 1, 1); // Animation
text.alignCenter(); // text is centered
text.setStyle({ padding: [4, 12, 6, 12] }); // Set the style object
scene.addChild(text);
```

- ### Create subtitle elements

```javascript
const content =
  "The cool thing about working with computers is here, they won't be angry, they can remember everything";
const subtitle = new FFSubtitle({
  comma: true, // Whether to separate by comma
  backgroundColor: '#00219C', // background color
  color: '#fff', // text color
  fontSize: 24, // font size
});
subtitle.setText(content); // Set copy can also be placed in conf
subtitle.frameBuffer = 24; // Buffer frame
subtitle.setDuration(12); // Set the total duration of subtitles
scene.addChild(subtitle);
subtitle.setSpeech(dub); // Set voice dubbing -tts
```

- ### Create video elements

```javascript
const video = new FFVideo({
  path: videopath,
  x: 100,
  y: 150,
  width: 500,
  height: 350,
});
video.setAudio(true); // Is there music
video.setTimes('00:00:43', '00:00:50'); // intercept the playback time
scene.addChild(video);
```

- ### Add music

```javascript
// 1. Add global background sound
creator.addAudio('../audio/bg.mp3'); // Two configuration methods
creator.addAudio({ loop: false, path: ... });
// 2. Add separate music for each scene
scene.addAudio('../audio/bg.mp3'); // Two configuration methods
scene.addAudio({ loop: false,path: ..., start: 20});
```

- ### Create a virtual host

Note: `FFVtuber` is a simple cartoon animation based on sequence frames, based on which you can realize your own more delicate anchor image

```javascript
const vtuber = new FFVtuber({ x: 100, y: 400 });
// Set the animation time cycle
vtuber.setPeriod([
  [0, 3],
  [0, 3],
]);
// The path is set here baby/[d].png and baby/%d.png can be two ways
const vpath = path.join(__dirname, './avator/baby/[d].png');
vtuber.setPath(vpath, 1, 7); // From 1-7.png
vtuber.setSpeed(6); // playback speed
creator.addVtuber(vtuber);
```

- ### Add event listener

```javascript
creator.start(); // start processing
creator.closeLog(); // Close log (including perf)
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

- ### Multitasking

If you have to deal with multiple production tasks (usual scenes will not just make one video), then it is recommended to use `FFCreatorCenter` for task queue management.
Of course, you can also implement a task queue management yourself, which is actually very simple.

```javascript
const taskId = FFCreatorCenter.addTask(() => {
    const creator = new FFCreator({...});
    ... // Add various scenes and elements

    return creator; // must return creator
});

FFCreatorCenter.onTaskComplete(taskId, result => {
    console.log(result.file);
});

// error
FFCreatorCenter.onTaskError(taskId, error => {
    console.error(error);
})
```
