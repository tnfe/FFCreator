![img](https://tnfe.github.io/FFCreator/_media/logo/logo.png)


# FFCreator introduction

> FFCreator is a lightweight and flexible short video processing library based on Node.js.

FFCreator is a lightweight and flexible short video processing library based on Node.js. You only need to add some pictures, music or video clips, you can use it to quickly create a very exciting video album.


Nowadays, short video is an increasingly popular form of media communication. Like [_weishi_](https://weishi.qq.com/) and _tiktok_ is full of all kinds of wonderful short videos. So how to make users visually create video clips on the web easily and quickly. Or based on pictures Text content, dynamic batch generation of short videos is a technical problem.

`FFCreator` is a lightweight and flexible solution that requires few dependencies and low machine configuration to start working quickly. And it simulates 90% animation effects of [`animate.css`](https://animate.style/). You can easily convert the animation effects on the web page side into videos.


##### github: [https://github.com/tnfe/FFCreator](https://github.com/tnfe/FFCreator)

## Features

- Based on `node.js` development, it is very simple to use and easy to expand and develop.
- Very few dependencies, easy to install, cross platform, just a common configuration linux server.
- The video processing speed is very fast, a 5 minute video only needs 1-2 minutes.
- Nearly a hundred kinds of scene transition animation effects.
- Support picture, sound, video clips, text and other elements.
- Contains most animation effects of [`animate.css`](https://animate.style/), css animation is converted to video.
- Support subtitle components, can combine subtitles to speech to produce audio news.
- Support simple (expandable) `VTuber`, you can add `YouTuber` based on sequence frames.
- `FFCreatorLite` has faster speed, sometimes it is more suitable for you than `FFCreator`.

## Where to use

#### What can `FFCreator` do?

- Automated batch synthesis of videos

Batch generation of short videos based on graphic and content is a very common requirement for video information streaming platforms（For example, Baidu’s graphic and text generation video service [vidpress](https://ai.baidu.com/creation/main/createlab)）, But for development, it is not easy to build the entire process.
`FFCreator` can help you complete the next step of synthesizing animation video after the algorithm automatically configures images, generates summary, and voice tts.
Compared with the `aerender.exe` (AE template) solution, it is faster and more flexible and convenient.

- Visualization platform

Some people may have used the short video production function of some visualization platforms. Users only need to upload pictures and drag the position, adjust the style and add some css animations, and the production platform can synthesize a beautiful short video.

![img](https://tnfe.github.io/FFCreator/_media/imgs/el.jpg)

- Video Album APP

Many people have an idea to make a photo album app, so don't search for solutions aimlessly on the Internet.
Use `FFCreator` as the backend of the project, and the rest of the work is to make all kinds of beautiful template files.

## Mechanism

Usually video processing usually relies on [`FFmpeg`](https://ffmpeg.org/) library，Although `FFmpeg` has very powerful functions in video processing.
However, `FFmpeg` seems to be inadequate in handling fine animation effects, and its use is also very inconvenient. It is necessary to develop a large number of command line parameters to splice.

To deal with more cool animation effects, there is a popular solution based on `After Effects` (`aerender.exe`) template. However, this scheme also has many problems (detailed comparison will be explained later).

`FFCreator` uses `opengl` to process graphics rendering and uses `shader` post-processing to generate transition effects, and finally uses `FFmpeg` to synthesize the video. Based on ʻopengl`, it is very efficient and can support various rich graphics animations.

![img](https://tnfe.github.io/FFCreator/_media/imgs/logotwo.jpg)

## About Lite version

I hope you spend three minutes to learn [`FFCreatorLite`](guide/lite.md), in many cases it may be your more suitable choice.
`FFCreatorLite` and `FFCreator` are not the same implementation principle, `FFCreatorLite` not only has 70% of the animation effect of `FFCreator` (in fact, it took more time to write it), and its efficiency and performance are far superior in many aspects. `FFCreator`.
