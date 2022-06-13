## v6.7.1
* defaultOptions supports adding custom ffmpeg commands.
* Upgrade lottie version to remove initialization getapi.

## v6.6.6
* Modified highWaterMark from 1mb to 512kb.
* Update lottie-node version, support more text styles.

## v6.6.1
* Added FFLottie class to support rendering lottie animation files.
* Add FFLottie's example demo file. https://github.com/drawcall/lottie-node

## v6.5.1
* Added FFExtras class, you can freely expand the graphics.
* Upgrade update function.
* add setBlur method.

## v6.3.6
* Modify the stream rendering parallel to be reduced from 5 to 3 to improve performance.
* Fix the event problem of ffcreatorcenter.
* add FFLogger.error to creator.on('complete'.

## v6.2.1
* Add FFRect component, A solid color rectangle component.
* add FFVideo loop Options.
* Modify some configuration options.

## v6.1.2
* Add FFChart component, support most demos of echarts.js. Data visualization video can be made
* Support the synthesis of dynamic data change charts.
* Fix the problem of setScale initialization.
* Refactor the setFont and registerFont functions.

## v5.5.6
* FFVtuber supports dual types of sequence frame and video.
* Delete the addVtuber method of FFCreator.
* Fix the gap problem of scene switching.

## v5.5.2
* Upgrade FFVtuber, now it supports green screen video vtuber.
* remove DateUtil.toSeconds.
* change DateUtil.toMilliseconds method.

## v5.2.7
* Fix audio fadeIn time bug
* Modify some typescript type files

## v5.2.2
* Add a more complete TS type, and the corresponding detection command test-typings and test cases, and install the corresponding ts-node environment.
* Fix the problem that the animation type added by the addEffect method in example/text.js does not exist in the backInBottom in effects.js.
* In addition, some uncertain types are marked with todo.

## v5.0.3
* Remove the renderFps configuration option, unify rfps and fps.
* Rendering performance increased by 60%, time increased by 1/3.

## v4.5.3
* Fix the scale error when FFVideo uses animation.

## v4.5.1
* Fix the background problem of FFSubtitle when there is no text.
* Add the initScale property, fix the problem of animation reset size.

## v4.3.3
* FFAudio supports the interception and playback of long audio.
* When the ffmpeg command is abnormal, kill the process.

## v4.2.6
* Add FFVideoAlbum Component. Support multiple video stitching into one album.
* Optimize ffmpeg command performance.

## v4.1.6
* FFVideo adds precise startTime and endtime control.
* FFNode adds getDurationTime method.

## v4.1.1
* Optimize the FFGifImage component and increase the rendering speed by 30%.
* Upgrade inkpaint version.
* Refactor FFAudio class.

## v4.0.1
* No other reason, because of a user. Thank him https://github.com/tnfe/FFCreator/issues/87

## v3.6.2

* Upgrade [inkpaint](https://github.com/drawcall/inkpaint) rendering engine, double the rendering speed.
* Set the default rendering method of FFCreator to cairo lib.
* Fix the bug that the size of the FFVideo component is incorrect.
* Fix the issue of emit error bubbling in FFCreatorCenter.

## v3.5.1

* Replace the rendering kernel, https://github.com/drawcall/inkpaint. inkpaint has higher rendering speed and performance, and supports more features.
* Add FFGifImage component that supports gif, which can render gif flexibly.
* The text component supports features such as line wrapping, bolding, and stroke.
* Support sound volume, fade in, fade out and other effects.
* Add animation sisters such as blurIn blurOut.
* Support setting cover picture.

## v3.1.2

* Add ffaudio volume support
* Support codec config for FFVideo
* Fix eslint bug

## v3.0.2

* FFCreator3.0+ uses node Stream for data caching. The original version frees up disk space and further improves the speed.
* Refactor the center class, Split into 3 categories.


## v2.0.8

* Add multiple cache formats to save disk
* Clear garbage objects, save memory expenses
* Partial code refactoring, more cohesive
* Add cache format demo example
* Refactor the center class

## v1.4.5 release

* This is a relatively stable version, optimized for many bugs under windows.
* Add center test
* TaskQueue appends task id by default

## v1.3.10

* Add more config option
* Fix any video output bug
* Fix lodash.forEach bug
* Add setFontByFile method
