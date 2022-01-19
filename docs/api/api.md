## FFNode
**Kind**: global class  

* [FFNode](#FFNode)
    * [new FFNode(conf)](#new_FFNode_new)
    * [.setAnchor(anchor)](#FFNode+setAnchor)
    * [.setScale(scale)](#FFNode+setScale)
    * [.setRotate(rotate)](#FFNode+setRotate)
    * [.setDuration(duration)](#FFNode+setDuration)
    * [.setXY(x, y)](#FFNode+setXY)
    * [.setOpacity(opacity)](#FFNode+setOpacity)
    * [.setWH(width, height)](#FFNode+setWH)
    * [.setSize(width, height)](#FFNode+setSize)
    * [.getXY()](#FFNode+getXY) ⇒ <code>array</code>
    * [.getX()](#FFNode+getX) ⇒ <code>number</code>
    * [.getY()](#FFNode+getY) ⇒ <code>number</code>
    * [.getWH()](#FFNode+getWH) ⇒ <code>array</code>
    * [.setAnimations()](#FFNode+setAnimations)
    * [.addEffect(type, time, delay)](#FFNode+addEffect)
    * [.isReady()](#FFNode+isReady) ⇒ <code>Promise</code>
    * [.preProcessing()](#FFNode+preProcessing) ⇒ <code>Promise</code>
    * [.start()](#FFNode+start)
    * [.destroy()](#FFNode+destroy)

<a name="new_FFNode_new"></a>

### new FFNode(conf)
FFNode constructor


| Param | Type | Description |
| --- | --- | --- |
| conf | <code>object</code> | FFNode related configuration items |
| conf.x | <code>number</code> | x coordinate of FFNode |
| conf.y | <code>number</code> | y coordinate of FFNode |
| conf.scale | <code>number</code> | scale of FFNode |
| conf.rotate | <code>number</code> | rotation of FFNode |
| conf.opacity | <code>number</code> | opacity of FFNode |

<a name="FFNode+setAnchor"></a>

### ffNode.setAnchor(anchor)
Set display object registration center

**Kind**: instance method of [<code>FFNode</code>](#FFNode)  
**Access**: public  

| Param | Type |
| --- | --- |
| anchor | <code>number</code> | 

<a name="FFNode+setScale"></a>

### ffNode.setScale(scale)
Set display object scale

**Kind**: instance method of [<code>FFNode</code>](#FFNode)  
**Access**: public  

| Param | Type | Default |
| --- | --- | --- |
| scale | <code>number</code> | <code>1</code> | 

<a name="FFNode+setRotate"></a>

### ffNode.setRotate(rotate)
Set display object rotate

**Kind**: instance method of [<code>FFNode</code>](#FFNode)  
**Access**: public  

| Param | Type | Default |
| --- | --- | --- |
| rotate | <code>number</code> | <code>0</code> | 

<a name="FFNode+setDuration"></a>

### ffNode.setDuration(duration)
Set the duration of node in the scene

**Kind**: instance method of [<code>FFNode</code>](#FFNode)  
**Access**: public  

| Param | Type |
| --- | --- |
| duration | <code>number</code> | 

<a name="FFNode+setXY"></a>

### ffNode.setXY(x, y)
Set display object x,y position

**Kind**: instance method of [<code>FFNode</code>](#FFNode)  
**Access**: public  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| x | <code>number</code> | <code>0</code> | x position |
| y | <code>number</code> | <code>0</code> | y position |

<a name="FFNode+setOpacity"></a>

### ffNode.setOpacity(opacity)
Set display object opacity

**Kind**: instance method of [<code>FFNode</code>](#FFNode)  
**Access**: public  

| Param | Type |
| --- | --- |
| opacity | <code>number</code> | 

<a name="FFNode+setWH"></a>

### ffNode.setWH(width, height)
Set display object width and height

**Kind**: instance method of [<code>FFNode</code>](#FFNode)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| width | <code>number</code> | object width |
| height | <code>number</code> | object height |

<a name="FFNode+setSize"></a>

### ffNode.setSize(width, height)
Set display object width and height

**Kind**: instance method of [<code>FFNode</code>](#FFNode)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| width | <code>number</code> | object width |
| height | <code>number</code> | object height |

<a name="FFNode+getXY"></a>

### ffNode.getXY() ⇒ <code>array</code>
Get display object x,y position

**Kind**: instance method of [<code>FFNode</code>](#FFNode)  
**Returns**: <code>array</code> - [x, y]  
**Access**: public  
<a name="FFNode+getX"></a>

### ffNode.getX() ⇒ <code>number</code>
Get display object x position

**Kind**: instance method of [<code>FFNode</code>](#FFNode)  
**Returns**: <code>number</code> - x  
**Access**: public  
<a name="FFNode+getY"></a>

### ffNode.getY() ⇒ <code>number</code>
Get display object y position

**Kind**: instance method of [<code>FFNode</code>](#FFNode)  
**Returns**: <code>number</code> - y  
**Access**: public  
<a name="FFNode+getWH"></a>

### ffNode.getWH() ⇒ <code>array</code>
Get display object width and height

**Kind**: instance method of [<code>FFNode</code>](#FFNode)  
**Returns**: <code>array</code> - [width, height]  
**Access**: public  
<a name="FFNode+setAnimations"></a>

### ffNode.setAnimations()
Add one/multiple animations or effects

**Kind**: instance method of [<code>FFNode</code>](#FFNode)  
**Access**: public  
<a name="FFNode+addEffect"></a>

### ffNode.addEffect(type, time, delay)
Add special animation effects

**Kind**: instance method of [<code>FFNode</code>](#FFNode)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| type | <code>string</code> | animation effects name |
| time | <code>number</code> | time of animation |
| delay | <code>number</code> | delay of animation |

<a name="FFNode+isReady"></a>

### ffNode.isReady() ⇒ <code>Promise</code>
All resources materials and actions are ready

**Kind**: instance method of [<code>FFNode</code>](#FFNode)  
**Access**: public  
<a name="FFNode+preProcessing"></a>

### ffNode.preProcessing() ⇒ <code>Promise</code>
Material preprocessing

**Kind**: instance method of [<code>FFNode</code>](#FFNode)  
**Access**: public  
<a name="FFNode+start"></a>

### ffNode.start()
Start rendering

**Kind**: instance method of [<code>FFNode</code>](#FFNode)  
**Access**: public  
<a name="FFNode+destroy"></a>

### ffNode.destroy()
Destroy the component

**Kind**: instance method of [<code>FFNode</code>](#FFNode)  
**Access**: public  

---

## FFImage
**Kind**: global class  
<a name="new_FFImage_new"></a>

### new FFImage()
FFImage - Image component-based display component

#### Example:

    const img = new FFImage({ path, x: 94, y: 271, width: 375, height: 200, resetXY: true });
    img.addEffect("slideInDown", 1.2, 0);
    scene.addChild(img);

<a name="FFImage"></a>

## FFImage
**Kind**: global class  

* [FFImage](#FFImage)
    * [new FFImage(conf)](#new_FFImage_new)
    * [.getPath()](#FFImage+getPath) ⇒ <code>string</code>

<a name="new_FFImage_new"></a>

### new FFImage(conf)
FFImage constructor


| Param | Type | Description |
| --- | --- | --- |
| conf | <code>object</code> | FFNode related configuration items |
| conf.x | <code>number</code> | x coordinate of FFNode |
| conf.y | <code>number</code> | y coordinate of FFNode |
| conf.scale | <code>number</code> | scale of FFNode |
| conf.rotate | <code>number</code> | rotation of FFNode |
| conf.opacity | <code>number</code> | opacity of FFNode |

<a name="FFImage+getPath"></a>

### ffImage.getPath() ⇒ <code>string</code>
Get the path to get the Image

**Kind**: instance method of [<code>FFImage</code>](#FFImage)  
**Returns**: <code>string</code> - img path  
**Access**: public  

---

## FFText
**Kind**: global class  
<a name="new_FFText_new"></a>

### new FFText()
FFText - Text component-based display component

#### Example:

    const text = new FFText({ text: "hello world", x: 400, y: 300 });
    text.setColor("#ffffff");
    text.setBackgroundColor("#000000");
    text.addEffect("fadeIn", 1, 1);
    scene.addChild(text);

<a name="FFText"></a>

## FFText
**Kind**: global class  

* [FFText](#FFText)
    * [new FFText(conf)](#new_FFText_new)
    * [.setText(text)](#FFText+setText)
    * [.setBackgroundColor(backgroundColor)](#FFText+setBackgroundColor)
    * [.setColor(color)](#FFText+setColor)
    * [.setFont(file)](#FFText+setFont)
    * [.setStyle(style)](#FFText+setStyle)
    * [.alignCenter()](#FFText+alignCenter)

<a name="new_FFText_new"></a>

### new FFText(conf)
FFText constructor


| Param | Type | Description |
| --- | --- | --- |
| conf | <code>object</code> | FFNode related configuration items |
| conf.text | <code>string</code> | the text of this instance |
| conf.style | <code>object</code> | this text instance's style |
| conf.scale | <code>number</code> | scale of FFNode |
| conf.rotate | <code>number</code> | rotation of FFNode |
| conf.opacity | <code>number</code> | opacity of FFNode |

<a name="FFText+setText"></a>

### ffText.setText(text)
Set text value

**Kind**: instance method of [<code>FFText</code>](#FFText)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| text | <code>string</code> | text value |

<a name="FFText+setBackgroundColor"></a>

### ffText.setBackgroundColor(backgroundColor)
Set background color

**Kind**: instance method of [<code>FFText</code>](#FFText)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| backgroundColor | <code>string</code> | the background color value |

<a name="FFText+setColor"></a>

### ffText.setColor(color)
Set text color value

**Kind**: instance method of [<code>FFText</code>](#FFText)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| color | <code>string</code> | the text color value |

<a name="FFText+setFont"></a>

### ffText.setFont(file)
Set text font file path

**Kind**: instance method of [<code>FFText</code>](#FFText)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| file | <code>string</code> | text font file path |

<a name="FFText+setStyle"></a>

### ffText.setStyle(style)
Set text style by object

**Kind**: instance method of [<code>FFText</code>](#FFText)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| style | <code>object</code> | style by object |

<a name="FFText+alignCenter"></a>

### ffText.alignCenter()
Set Text horizontal center function

**Kind**: instance method of [<code>FFText</code>](#FFText)  
**Access**: public  

---

## FFVideo
**Kind**: global class  
<a name="new_FFVideo_new"></a>

### new FFVideo()
FFVideo - Video component-based display component

#### Example:

    const video = new FFVideo({ path, width: 500, height: 350 });
    video.setAudio(true);
    video.setTimes("00:00:43", "00:00:50");
    scene.addChild(video);

<a name="FFVideo"></a>

## FFVideo
**Kind**: global class  

* [FFVideo](#FFVideo)
    * [new FFVideo(conf)](#new_FFVideo_new)
    * [.getWH()](#FFVideo+getWH) ⇒ <code>array</code>
    * [.setAudio(audio)](#FFVideo+setAudio)
    * [.setLoop(audio)](#FFVideo+setLoop)
    * [.setTimes(startTime, endTime)](#FFVideo+setTimes)
    * [.setStartTime(startTime)](#FFVideo+setStartTime)
    * [.setEndTime(endTime)](#FFVideo+setEndTime)

<a name="new_FFVideo_new"></a>

### new FFVideo(conf)
FFVideo constructor


| Param | Type | Description |
| --- | --- | --- |
| conf | <code>object</code> | FFNode related configuration items |
| conf.path | <code>string</code> | the path of this video |
| conf.width | <code>number</code> | the width of this video |
| conf.height | <code>number</code> | this width of this video |
| conf.scale | <code>number</code> | scale of FFNode |
| conf.rotate | <code>number</code> | rotation of FFNode |
| conf.opacity | <code>number</code> | opacity of FFNode |

<a name="FFVideo+getWH"></a>

### ffVideo.getWH() ⇒ <code>array</code>
Get display object width and height

**Kind**: instance method of [<code>FFVideo</code>](#FFVideo)  
**Returns**: <code>array</code> - [width, height]  
**Access**: public  
<a name="FFVideo+setAudio"></a>

### ffVideo.setAudio(audio)
Whether to play sound

**Kind**: instance method of [<code>FFVideo</code>](#FFVideo)  
**Access**: public  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| audio | <code>boolean</code> | <code>true</code> | Whether to play sound |

<a name="FFVideo+setLoop"></a>

### ffVideo.setLoop(audio)
Whether to loop the video

**Kind**: instance method of [<code>FFVideo</code>](#FFVideo)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| audio | <code>boolean</code> | Whether to loop the video |

<a name="FFVideo+setTimes"></a>

### ffVideo.setTimes(startTime, endTime)
Set start/end time

**Kind**: instance method of [<code>FFVideo</code>](#FFVideo)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| startTime | <code>string</code> \| <code>number</code> | start time |
| endTime | <code>string</code> \| <code>number</code> | end time |

<a name="FFVideo+setStartTime"></a>

### ffVideo.setStartTime(startTime)
Set start time

**Kind**: instance method of [<code>FFVideo</code>](#FFVideo)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| startTime | <code>string</code> \| <code>number</code> | start time |

<a name="FFVideo+setEndTime"></a>

### ffVideo.setEndTime(endTime)
Set end time

**Kind**: instance method of [<code>FFVideo</code>](#FFVideo)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| endTime | <code>string</code> \| <code>number</code> | end time |

---

## FFAlbum
**Kind**: global class  
<a name="new_FFAlbum_new"></a>

### new FFAlbum()
FFAlbum - A picture album component that supports multiple switching animation effects

#### Example:

    const album = new FFAlbum({
       list: [a01, a02, a03, a04],
       x: 100,
       y: 100,
       width: 500,
       height: 300 });

<a name="FFAlbum"></a>

## FFAlbum
**Kind**: global class  

* [FFAlbum](#FFAlbum)
    * [new FFAlbum(conf)](#new_FFAlbum_new)
    * [.setDuration(duration)](#FFAlbum+setDuration)
    * [.setTransition(transition)](#FFAlbum+setTransition)
    * [.setTransTime(time)](#FFAlbum+setTransTime)
    * [.getWH()](#FFAlbum+getWH) ⇒ <code>array</code>
    * [.isReady()](#FFAlbum+isReady) ⇒ <code>Promise</code>
    * [.start()](#FFAlbum+start)

<a name="new_FFAlbum_new"></a>

### new FFAlbum(conf)
FFAlbum constructor


| Param | Type | Description |
| --- | --- | --- |
| conf | <code>object</code> | FFNode related configuration items |
| conf.list | <code>array</code> | Photo album picture list |
| conf.width | <code>number</code> | the width of this album |
| conf.height | <code>number</code> | this width of this album |
| conf.scale | <code>number</code> | scale of FFNode |
| conf.rotate | <code>number</code> | rotation of FFNode |
| conf.opacity | <code>number</code> | opacity of FFNode |

<a name="FFAlbum+setDuration"></a>

### ffAlbum.setDuration(duration)
Set total album animation duration

**Kind**: instance method of [<code>FFAlbum</code>](#FFAlbum)  
**Access**: public  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| duration | <code>number</code> | <code>2</code> | album animation duration |

<a name="FFAlbum+setTransition"></a>

### ffAlbum.setTransition(transition)
Set the way to switch the album animation

**Kind**: instance method of [<code>FFAlbum</code>](#FFAlbum)  
**Access**: public  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| transition | <code>string</code> | <code>&quot;random&quot;</code> | transition type |

<a name="FFAlbum+setTransTime"></a>

### ffAlbum.setTransTime(time)
Set the transition time of each image

**Kind**: instance method of [<code>FFAlbum</code>](#FFAlbum)  
**Access**: public  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| time | <code>number</code> | <code>1</code> | transition time |

<a name="FFAlbum+getWH"></a>

### ffAlbum.getWH() ⇒ <code>array</code>
Get the width and height of the album component

**Kind**: instance method of [<code>FFAlbum</code>](#FFAlbum)  
**Returns**: <code>array</code> - [width, height] array  
**Access**: public  
<a name="FFAlbum+isReady"></a>

### ffAlbum.isReady() ⇒ <code>Promise</code>
All resources materials and actions are ready

**Kind**: instance method of [<code>FFAlbum</code>](#FFAlbum)  
**Access**: public  
<a name="FFAlbum+start"></a>

### ffAlbum.start()
Start rendering

**Kind**: instance method of [<code>FFAlbum</code>](#FFAlbum)  
**Access**: public  

---

## FFSubtitle
**Kind**: global class  
<a name="new_FFNode_new"></a>

### new FFSubtitle()
FFSubtitle - Subtitle component, can be used in conjunction with voice-to-subtitle tts

#### Example:

    const text = "《街头霸王5》是卡普空使用虚幻引擎开发的3D格斗游戏.";
    const subtitle = new FFSubtitle({ x: 320, y: 520 });
    subtitle.setText(text);

<a name="FFSubtitle"></a>

## FFSubtitle
**Kind**: global class  

* [FFSubtitle](#FFSubtitle)
    * [new FFSubtitle(conf)](#new_FFSubtitle_new)
    * [.setFrameBuffer(frameBuffer)](#FFSubtitle+setFrameBuffer)
    * [.setSpeech(speech)](#FFSubtitle+setSpeech)
    * [.setAudio(speech)](#FFSubtitle+setAudio)
    * [.setText(text)](#FFSubtitle+setText)
    * [.setRegexp(regexp)](#FFSubtitle+setRegexp)
    * [.setFontSize(fontSize)](#FFSubtitle+setFontSize)
    * [.setDuration(duration)](#FFSubtitle+setDuration)
    * [.setBackgroundColor(backgroundColor)](#FFSubtitle+setBackgroundColor)
    * [.setBackground(backgroundColor)](#FFSubtitle+setBackground)
    * [.setColor(color)](#FFSubtitle+setColor)
    * [.setFont(file)](#FFSubtitle+setFont)
    * [.setStyle(style)](#FFSubtitle+setStyle)

<a name="new_FFSubtitle_new"></a>

### new FFSubtitle(conf)
FFSubtitle constructor


| Param | Type | Description |
| --- | --- | --- |
| conf | <code>object</code> | FFNode related configuration items |
| conf.text | <code>string</code> | the text of this instance |
| conf.style | <code>object</code> | this text instance's style |
| conf.scale | <code>number</code> | scale of FFNode |
| conf.rotate | <code>number</code> | rotation of FFNode |
| conf.opacity | <code>number</code> | opacity of FFNode |

<a name="FFSubtitle+setFrameBuffer"></a>

### ffSubtitle.setFrameBuffer(frameBuffer)
Set frame buffer

**Kind**: instance method of [<code>FFSubtitle</code>](#FFSubtitle)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| frameBuffer | <code>buffer</code> | frame buffer |

<a name="FFSubtitle+setSpeech"></a>

### ffSubtitle.setSpeech(speech)
Set up voice narration

**Kind**: instance method of [<code>FFSubtitle</code>](#FFSubtitle)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| speech | <code>string</code> | voice narration |

<a name="FFSubtitle+setAudio"></a>

### ffSubtitle.setAudio(speech)
Set up voice dialogue

**Kind**: instance method of [<code>FFSubtitle</code>](#FFSubtitle)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| speech | <code>string</code> | voice narration |

<a name="FFSubtitle+setText"></a>

### ffSubtitle.setText(text)
Set Subtitle text

**Kind**: instance method of [<code>FFSubtitle</code>](#FFSubtitle)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| text | <code>string</code> | Subtitle text |

<a name="FFSubtitle+setRegexp"></a>

### ffSubtitle.setRegexp(regexp)
Set segmentation regular

**Kind**: instance method of [<code>FFSubtitle</code>](#FFSubtitle)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| regexp | <code>regexp</code> | segmentation regular |

<a name="FFSubtitle+setFontSize"></a>

### ffSubtitle.setFontSize(fontSize)
Set text font size

**Kind**: instance method of [<code>FFSubtitle</code>](#FFSubtitle)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| fontSize | <code>number</code> | text font size |

<a name="FFSubtitle+setDuration"></a>

### ffSubtitle.setDuration(duration)
Set total animation duration

**Kind**: instance method of [<code>FFSubtitle</code>](#FFSubtitle)  
**Access**: public  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| duration | <code>number</code> | <code>5</code> | album animation duration |

<a name="FFSubtitle+setBackgroundColor"></a>

### ffSubtitle.setBackgroundColor(backgroundColor)
Set background color

**Kind**: instance method of [<code>FFSubtitle</code>](#FFSubtitle)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| backgroundColor | <code>string</code> | the background color value |

<a name="FFSubtitle+setBackground"></a>

### ffSubtitle.setBackground(backgroundColor)
Set background color

**Kind**: instance method of [<code>FFSubtitle</code>](#FFSubtitle)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| backgroundColor | <code>string</code> | the background color value |

<a name="FFSubtitle+setColor"></a>

### ffSubtitle.setColor(color)
Set text color value

**Kind**: instance method of [<code>FFSubtitle</code>](#FFSubtitle)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| color | <code>string</code> | the text color value |

<a name="FFSubtitle+setFont"></a>

### ffSubtitle.setFont(file)
Set text font file path

**Kind**: instance method of [<code>FFSubtitle</code>](#FFSubtitle)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| file | <code>string</code> | text font file path |

<a name="FFSubtitle+setStyle"></a>

### ffSubtitle.setStyle(style)
Set text style by object

**Kind**: instance method of [<code>FFSubtitle</code>](#FFSubtitle)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| style | <code>object</code> | style by object |

---

## FFVtuber
**Kind**: global class  
<a name="new_FFVtuber_new"></a>

### new FFVtuber()
FFVtuber - A simple virtual anchor component

#### Example:

    const vtuber = new FFVtuber({ x: 320, y: 520 });
    subtitle.setText(text);

<a name="FFVtuber"></a>

## FFVtuber
**Kind**: global class  

* [FFVtuber](#FFVtuber)
    * [new FFVtuber(conf)](#new_FFVtuber_new)
    * [.clone()](#FFVtuber+clone) ⇒ [<code>FFVtuber</code>](#FFVtuber)
    * [.setTexturePacker(texture, json)](#FFVtuber+setTexturePacker)
    * [.setTexture(texture, json)](#FFVtuber+setTexture)
    * [.setSpeed(speed)](#FFVtuber+setSpeed)
    * [.setPeriod(period)](#FFVtuber+setPeriod)
    * [.getPeriod()](#FFVtuber+getPeriod) ⇒ <code>array</code>
    * [.start()](#FFVtuber+start)

<a name="new_FFVtuber_new"></a>

### new FFVtuber(conf)
FFVtuber constructor


| Param | Type | Description |
| --- | --- | --- |
| conf | <code>object</code> | FFNode related configuration items |
| conf.path | <code>string</code> | the path of this video |
| conf.width | <code>number</code> | the width of this video |
| conf.height | <code>number</code> | this width of this video |
| conf.scale | <code>number</code> | scale of FFNode |
| conf.rotate | <code>number</code> | rotation of FFNode |
| conf.opacity | <code>number</code> | opacity of FFNode |

<a name="FFVtuber+clone"></a>

### ffVtuber.clone() ⇒ [<code>FFVtuber</code>](#FFVtuber)
Get a cloned object

**Kind**: instance method of [<code>FFVtuber</code>](#FFVtuber)  
**Returns**: [<code>FFVtuber</code>](#FFVtuber) - cloned object  
**Access**: public  
<a name="FFVtuber+setTexturePacker"></a>

### ffVtuber.setTexturePacker(texture, json)
Set up an animated sprite texture

**Kind**: instance method of [<code>FFVtuber</code>](#FFVtuber)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| texture | <code>string</code> | animated sprite texture |
| json | <code>string</code> | sprite texture data map |

<a name="FFVtuber+setTexture"></a>

### ffVtuber.setTexture(texture, json)
Set up an animated sprite texture

**Kind**: instance method of [<code>FFVtuber</code>](#FFVtuber)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| texture | <code>string</code> | animated sprite texture |
| json | <code>string</code> | sprite texture data map |

<a name="FFVtuber+setSpeed"></a>

### ffVtuber.setSpeed(speed)
Set component playback speed

**Kind**: instance method of [<code>FFVtuber</code>](#FFVtuber)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| speed | <code>number</code> | Play speed |

<a name="FFVtuber+setPeriod"></a>

### ffVtuber.setPeriod(period)
Set animation schedule cycle
[[0, 3.2], [0, 5]]

**Kind**: instance method of [<code>FFVtuber</code>](#FFVtuber)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| period | <code>array</code> | [0, 3.2] |

<a name="FFVtuber+getPeriod"></a>

### ffVtuber.getPeriod() ⇒ <code>array</code>
Get animation schedule cycle

**Kind**: instance method of [<code>FFVtuber</code>](#FFVtuber)  
**Returns**: <code>array</code> - period - [0, 3.2]  
**Access**: public  
<a name="FFVtuber+start"></a>

### ffVtuber.start()
Start rendering

**Kind**: instance method of [<code>FFVtuber</code>](#FFVtuber)  
**Access**: public  

---

## FFScene
**Kind**: global class  
<a name="new_FFScene_new"></a>

### new FFScene()
FFScene - Scene component, a container used to load display object components.

#### Example:

    const scene = new FFScene();
    scene.setBgColor("#ffcc00");
    scene.setDuration(6);
    creator.addChild(scene);

<a name="FFScene"></a>

## FFScene
**Kind**: global class  

* [FFScene](#FFScene)
    * [new FFScene(conf)](#new_FFScene_new)
    * [.setTransition(name, duration, params)](#FFScene+setTransition)
    * [.addAudio(args)](#FFScene+addAudio)
    * [.setDuration(duration)](#FFScene+setDuration)
    * [.setBgColor(bgcolor)](#FFScene+setBgColor)
    * [.getRealDuration()](#FFScene+getRealDuration) ⇒ <code>number</code>
    * [.start()](#FFScene+start)
    * [.pushFrame(index, buffer)](#FFScene+pushFrame)
    * [.nextFrame()](#FFScene+nextFrame)
    * [.frameIsEnd()](#FFScene+frameIsEnd)
    * [.frameIsOver()](#FFScene+frameIsOver)

<a name="new_FFScene_new"></a>

### new FFScene(conf)
FFScene constructor


| Param | Type | Description |
| --- | --- | --- |
| conf | <code>object</code> | FFNode related configuration items |
| conf.color | <code>string</code> | the path of this instance |
| conf.bgcolor | <code>string</code> |  |

<a name="FFScene+setTransition"></a>

### ffScene.setTransition(name, duration, params)
Set scene transition animation

**Kind**: instance method of [<code>FFScene</code>](#FFScene)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> \| <code>object</code> | transition animation name or animation conf object |
| duration | <code>number</code> | transition animation duration |
| params | <code>object</code> | transition animation params |

<a name="FFScene+addAudio"></a>

### ffScene.addAudio(args)
Add the background music of the scene

**Kind**: instance method of [<code>FFScene</code>](#FFScene)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| args | <code>object</code> | music conf object |

<a name="FFScene+setDuration"></a>

### ffScene.setDuration(duration)
Set the time the scene stays in the scree

**Kind**: instance method of [<code>FFScene</code>](#FFScene)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| duration | <code>number</code> | the time the scene |

<a name="FFScene+setBgColor"></a>

### ffScene.setBgColor(bgcolor)
Set background color

**Kind**: instance method of [<code>FFScene</code>](#FFScene)  
**Access**: public  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| bgcolor | <code>string</code> | <code>&quot;#000000&quot;</code> | background color |

<a name="FFScene+getRealDuration"></a>

### ffScene.getRealDuration() ⇒ <code>number</code>
Get the real stay time of the scene

**Kind**: instance method of [<code>FFScene</code>](#FFScene)  
**Returns**: <code>number</code> - stay time of the scene  
**Access**: public  
<a name="FFScene+start"></a>

### ffScene.start()
Start rendering

**Kind**: instance method of [<code>FFScene</code>](#FFScene)  
**Access**: public  
<a name="FFScene+pushFrame"></a>

### ffScene.pushFrame(index, buffer)
Add frames to the scene

**Kind**: instance method of [<code>FFScene</code>](#FFScene)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| index | <code>number</code> | frame index |
| buffer | <code>buffer</code> | frame buffer value |

<a name="FFScene+nextFrame"></a>

### ffScene.nextFrame()
Run to the next frame

**Kind**: instance method of [<code>FFScene</code>](#FFScene)  
**Access**: public  
<a name="FFScene+frameIsEnd"></a>

### ffScene.frameIsEnd()
Determine if the last frame is reached

**Kind**: instance method of [<code>FFScene</code>](#FFScene)  
**Access**: public  
<a name="FFScene+frameIsOver"></a>

### ffScene.frameIsOver()
Determine if the last frame is over

**Kind**: instance method of [<code>FFScene</code>](#FFScene)  
**Access**: public  

---

## FFCreator
**Kind**: global class  

* [FFCreator](#FFCreator)
    * [new FFCreator(conf)](#new_FFCreator_new)
    * _instance_
        * [.generateOutput()](#FFCreator+generateOutput)
        * [.getFFmpeg()](#FFCreator+getFFmpeg) ⇒ <code>function</code>
        * [.setFps(fps)](#FFCreator+setFps)
        * [.setDuration(duration)](#FFCreator+setDuration)
        * [.setConf(key, val)](#FFCreator+setConf)
        * [.getConf(key)](#FFCreator+getConf) ⇒ <code>any</code>
        * [.addAudio(args)](#FFCreator+addAudio)
        * [.addVtuber(vtuber)](#FFCreator+addVtuber)
        * [.setSize(width, height)](#FFCreator+setSize)
        * [.setOutput(output)](#FFCreator+setOutput)
        * [.getFile()](#FFCreator+getFile) ⇒ <code>string</code>
        * [.output(output)](#FFCreator+output)
        * [.openLog()](#FFCreator+openLog)
        * [.closeLog()](#FFCreator+closeLog)
        * [.setInputOptions()](#FFCreator+setInputOptions)
        * [.start()](#FFCreator+start)
    * _static_
        * [.setFFmpegPath(path)](#FFCreator.setFFmpegPath)
        * [.setFFprobePath(path)](#FFCreator.setFFprobePath)

<a name="new_FFCreator_new"></a>

### new FFCreator(conf)
FFCreator constructor


| Param | Type | Description |
| --- | --- | --- |
| conf | <code>object</code> | FFCreator related configuration items |

<a name="FFCreator+generateOutput"></a>

### ffCreator.generateOutput()
Create output path, only used when using FFCreatorCenter.

**Kind**: instance method of [<code>FFCreator</code>](#FFCreator)  
**Access**: public  
<a name="FFCreator+getFFmpeg"></a>

### ffCreator.getFFmpeg() ⇒ <code>function</code>
Get FFmpeg command line.

**Kind**: instance method of [<code>FFCreator</code>](#FFCreator)  
**Returns**: <code>function</code> - FFmpeg command line  
**Access**: public  
<a name="FFCreator+setFps"></a>

### ffCreator.setFps(fps)
Set the fps of the composite video.

**Kind**: instance method of [<code>FFCreator</code>](#FFCreator)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| fps | <code>number</code> | the fps of the composite video |

<a name="FFCreator+setDuration"></a>

### ffCreator.setDuration(duration)
Set the total duration of the composite video.

**Kind**: instance method of [<code>FFCreator</code>](#FFCreator)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| duration | <code>number</code> | the total duration |

<a name="FFCreator+setConf"></a>

### ffCreator.setConf(key, val)
Set configuration.

**Kind**: instance method of [<code>FFCreator</code>](#FFCreator)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | the config key |
| val | <code>any</code> | the config val |

<a name="FFCreator+getConf"></a>

### ffCreator.getConf(key) ⇒ <code>any</code>
Get configuration.

**Kind**: instance method of [<code>FFCreator</code>](#FFCreator)  
**Returns**: <code>any</code> - the config val  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | the config key |

<a name="FFCreator+addAudio"></a>

### ffCreator.addAudio(args)
Add background sound.

**Kind**: instance method of [<code>FFCreator</code>](#FFCreator)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| args | <code>string</code> \| <code>objecg</code> | the audio config |

<a name="FFCreator+addVtuber"></a>

### ffCreator.addVtuber(vtuber)
Add a virtual host.

**Kind**: instance method of [<code>FFCreator</code>](#FFCreator)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| vtuber | <code>FFVtuber</code> | YouTuber |

<a name="FFCreator+setSize"></a>

### ffCreator.setSize(width, height)
Set the stage size of the scene

**Kind**: instance method of [<code>FFCreator</code>](#FFCreator)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| width | <code>number</code> | stage width |
| height | <code>number</code> | stage height |

<a name="FFCreator+setOutput"></a>

### ffCreator.setOutput(output)
Set the video output path

**Kind**: instance method of [<code>FFCreator</code>](#FFCreator)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| output | <code>string</code> | the video output path |

<a name="FFCreator+getFile"></a>

### ffCreator.getFile() ⇒ <code>string</code>
Get the video output path

**Kind**: instance method of [<code>FFCreator</code>](#FFCreator)  
**Returns**: <code>string</code> - output - the video output path  
**Access**: public  
<a name="FFCreator+output"></a>

### ffCreator.output(output)
Set the video output path

**Kind**: instance method of [<code>FFCreator</code>](#FFCreator)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| output | <code>string</code> | the video output path |

<a name="FFCreator+openLog"></a>

### ffCreator.openLog()
Open logger switch

**Kind**: instance method of [<code>FFCreator</code>](#FFCreator)  
**Access**: public  
<a name="FFCreator+closeLog"></a>

### ffCreator.closeLog()
Close logger switch

**Kind**: instance method of [<code>FFCreator</code>](#FFCreator)  
**Access**: public  
<a name="FFCreator+setInputOptions"></a>

### ffCreator.setInputOptions()
Hook handler function

**Kind**: instance method of [<code>FFCreator</code>](#FFCreator)  
**Access**: public  
<a name="FFCreator+start"></a>

### ffCreator.start()
Start video processing

**Kind**: instance method of [<code>FFCreator</code>](#FFCreator)  
**Access**: public  
<a name="FFCreator.setFFmpegPath"></a>

### FFCreator.setFFmpegPath(path)
Set the installation path of the current server ffmpeg.

**Kind**: static method of [<code>FFCreator</code>](#FFCreator)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | installation path of the current server ffmpeg |

<a name="FFCreator.setFFprobePath"></a>

### FFCreator.setFFprobePath(path)
Set the installation path of the current server ffprobe.

**Kind**: static method of [<code>FFCreator</code>](#FFCreator)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | installation path of the current server ffprobe |

---

## FFAudio
**Kind**: global class  
<a name="new_FFAudio_new"></a>

### new FFAudio(conf)
FFAudio - audio component-can be used to play sound

#### Example:

    const audio = new FFAudio(args);

#### Note:
    Adding multiple audio inputs to video with ffmpeg not working?
    https://superuser.com/questions/1191642/adding-multiple-audio-inputs-to-video-with-ffmpeg-not-working


| Param | Type | Description |
| --- | --- | --- |
| conf | <code>object</code> | FFAudio component related configuration |

<a name="FFAudio"></a>

## FFAudio
**Kind**: global class  
<a name="new_FFAudio_new"></a>

### new FFAudio(conf)
FFAudio constructor


| Param | Type | Description |
| --- | --- | --- |
| conf | <code>object</code> | FFAudio related configuration items |
| conf.src | <code>string</code> | audio url |
| conf.path | <code>string</code> | audio url |
| conf.loop | <code>boolean</code> | Is the sound circulating |
| conf.start | <code>number</code> | The time the sound starts playing |

---

## FFCreatorCenter
#### Example:

    FFCreatorCenter.addTask(()=>{
      const creator = new FFCreator;
      return creator;
    });


#### Note:
    On the server side, you only need to start FFCreatorCenter,
    remember to add error logs to the events in it

**Kind**: global constant  
**Object**:   
<a name="FFCreatorCenter"></a>

## FFCreatorCenter
FFCreatorCenter - A global FFCreator task scheduling center.

**Kind**: global constant  
**Object**:   

* [FFCreatorCenter](#FFCreatorCenter)
    * [.closeLog()](#FFCreatorCenter.closeLog)
    * [.openLog()](#FFCreatorCenter.openLog)
    * [.addTask(task)](#FFCreatorCenter.addTask)
    * [.addTaskByTemplate(tempid)](#FFCreatorCenter.addTaskByTemplate)
    * [.onTask(id, eventName, func)](#FFCreatorCenter.onTask)
    * [.onTaskError(id, func)](#FFCreatorCenter.onTaskError)
    * [.onTaskComplete(id, func)](#FFCreatorCenter.onTaskComplete)
    * [.start()](#FFCreatorCenter.start)
    * [.getTaskState()](#FFCreatorCenter.getTaskState)
    * [.addTemplate(id, taskFunc)](#FFCreatorCenter.addTemplate)
    * [.setFFmpegPath(path)](#FFCreatorCenter.setFFmpegPath)
    * [.setFFprobePath(path)](#FFCreatorCenter.setFFprobePath)

<a name="FFCreatorCenter.closeLog"></a>

### FFCreatorCenter.closeLog()
Close logger switch

**Kind**: static method of [<code>FFCreatorCenter</code>](#FFCreatorCenter)  
**Access**: public  
<a name="FFCreatorCenter.openLog"></a>

### FFCreatorCenter.openLog()
Open logger switch

**Kind**: static method of [<code>FFCreatorCenter</code>](#FFCreatorCenter)  
**Access**: public  
<a name="FFCreatorCenter.addTask"></a>

### FFCreatorCenter.addTask(task)
Add a production task

**Kind**: static method of [<code>FFCreatorCenter</code>](#FFCreatorCenter)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| task | <code>function</code> | a production task |

<a name="FFCreatorCenter.addTaskByTemplate"></a>

### FFCreatorCenter.addTaskByTemplate(tempid)
Add a production task by template

**Kind**: static method of [<code>FFCreatorCenter</code>](#FFCreatorCenter)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| tempid | <code>string</code> | a template id |

<a name="FFCreatorCenter.onTask"></a>

### FFCreatorCenter.onTask(id, eventName, func)
Listen to production task events

**Kind**: static method of [<code>FFCreatorCenter</code>](#FFCreatorCenter)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | a task id |
| eventName | <code>strint</code> | task name |
| func | <code>function</code> | task event handler |

<a name="FFCreatorCenter.onTaskError"></a>

### FFCreatorCenter.onTaskError(id, func)
Listen to production task Error events

**Kind**: static method of [<code>FFCreatorCenter</code>](#FFCreatorCenter)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | a task id |
| func | <code>function</code> | task event handler |

<a name="FFCreatorCenter.onTaskComplete"></a>

### FFCreatorCenter.onTaskComplete(id, func)
Listen to production task Complete events

**Kind**: static method of [<code>FFCreatorCenter</code>](#FFCreatorCenter)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | a task id |
| func | <code>function</code> | task event handler |

<a name="FFCreatorCenter.start"></a>

### FFCreatorCenter.start()
Start a task

**Kind**: static method of [<code>FFCreatorCenter</code>](#FFCreatorCenter)  
**Access**: public  
<a name="FFCreatorCenter.getTaskState"></a>

### FFCreatorCenter.getTaskState()
Get the status of a task by id

**Kind**: static method of [<code>FFCreatorCenter</code>](#FFCreatorCenter)  
**Access**: public  
<a name="FFCreatorCenter.addTemplate"></a>

### FFCreatorCenter.addTemplate(id, taskFunc)
add a creator task template

**Kind**: static method of [<code>FFCreatorCenter</code>](#FFCreatorCenter)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | task template id name |
| taskFunc | <code>function</code> | task template |

<a name="FFCreatorCenter.setFFmpegPath"></a>

### FFCreatorCenter.setFFmpegPath(path)
Set the installation path of the current server ffmpeg.
If not set, the ffmpeg command of command will be found by default.

**Kind**: static method of [<code>FFCreatorCenter</code>](#FFCreatorCenter)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | installation path of the current server ffmpeg |

<a name="FFCreatorCenter.setFFprobePath"></a>

### FFCreatorCenter.setFFprobePath(path)
Set the installation path of the current server ffprobe.
If not set, the ffprobe command of command will be found by default.

**Kind**: static method of [<code>FFCreatorCenter</code>](#FFCreatorCenter)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | installation path of the current server ffprobe |

