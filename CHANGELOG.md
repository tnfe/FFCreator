## v3.5.1

* Replace the rendering kernel, https://github.com/tnfe/inkpaint. inkpaint has higher rendering speed and performance, and supports more features.
* Add FFGifImage component that supports gif, which can render gif flexibly.
* The text component supports features such as line wrapping, bolding, and stroke.
* Support sound volume, fade in, fade out and other effects.
* Add animation sisters such as blurIn blurOut.

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
