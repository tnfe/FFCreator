# Technical solutions Compared

> This article does not involve the technology of the `app` (ios, Android) short video SDK

Now when you open an app market, you will find that there are already a lot of short video apps. But short video production technology solutions are still not simple for most developers.
There are very few professional articles on related technologies on the Internet, and most companies will not open source their core SDK code.

We will compare the differences between several common technical solutions and `FFCreator`, But it should be noted that there are more than these other solutions, and there may be more excellent ideas among them.

## Solution

- #### `aerender.exe` - Automated rendering scheme based on `AE` template

Everyone should be familiar with the small program that uploads pictures from templates and puts together a video album. Many of these products are developed based on the `aerender` scheme.

![img](../../_media/imgs/01.jpg)

`After Effects` This professional video editing software provides developers with a tool for automated batch processing `aerender.exe` (see [article](https://helpx.adobe.com/after-effects/user-guide.html/cn/after-effects/using/automated-rendering-network-rendering.ug.html)).

Use the combination of `aerender.exe` or `aerender.exe`, `ffmpeg`, `opengl` and other technologies to develop popular photo album applications.
(Related technical articles [Article 1](http://www.360doc.com/content/20/0506/03/36367108_910463236.shtml), [Article 2](https://www.jianshu.com/p/dc7ba3c78180))

##### ✔ Advantages

Because `After Effects` is a very professional video software, designers can create cool templates based on `AE`, and then use these templates to replace placeholders to generate the videos that users need.
It is a very good solution with strong customization, rich commercial templates, and a large number of cool special effects plug-ins.

![img](../../_media/imgs/ae.jpg)

##### ✘ Disadvantages

At present, the automation tool only has the `windows` version (`aerender.exe`), which means that you can only use `windows server` instead of the powerful operation and maintenance tools under the `linux` server.
At the same time, the video rendering speed of `aerender.exe` on a single machine is not fast, and it takes more than 3-5 times of `FFCreator`. There is also this method based on a fixed template, which cannot support non-customized requirements similar to visually building videos.

---

- #### MLT(`MLT Multimedia Framework`)

MLT is an open source multimedia framework, born for broadcasting video. It provides a low-level tool for many applications such as broadcasting, video editors, media players, transcoders, and network streaming. The function of the system is realized by providing various tool sets, XML editing components and a set of APIs based on extensible plug-ins.
[https://www.mltframework.org/](https://www.mltframework.org/)

![img](../../_media/imgs/mlt.jpg)

##### ✔ Advantages

Supports `command` command line call, and at the same time it encapsulates libraries such as `FFmpeg, JACK, Movit, SOX, libvorbis`, etc., with rich functions and can make cool video animations. Designers can also create default templates and replace placeholders to generate videos that users need.

##### ✘ Disadvantages

The template production is more complicated, and the AE template file cannot be used directly (it is necessary to convert the AE special effects into the MLT XML format). At the same time, the processing speed is not very fast (faster than the AE solution), and high-speed production requires many optimization methods.
In addition, the software is not very popular, so there are not many related learning materials, and it may be more difficult for novices to get started. The construction and installation process is not simple, and it is also heavier for small and medium-sized projects.

---

- #### `FFCreator`

`FFCreator` uses `opengl` to process graphics rendering and uses `shader` post-processing to generate transition effects, and finally uses `FFmpeg` to synthesize the video. Based on `opengl`, it is very efficient and can support various rich graphics animations.
For simpler requirements, you can also use the simpler version of `FFCreatorLite`, which has almost no dependencies and faster processing speed.

##### ✔ Advantages

Cross-platform solution, can be used under `linux` and `windows`. `FFCreator` video synthesis speed machine is fast, generally 5-7 minutes video can be synthesized in about 1.5 minutes.
The cost of getting started based on `node.js` development is very low, and it is a very suitable solution for front-end engineers. You can create a default video template, and you can freely combine animations based on instant data.

##### ✘ Disadvantages

There is no professional video software like `After Effects` that has more special effects and dynamic plug-ins, and there is no visual interface like ʻAE` and `PR` so that developers can easily create video templates (but coding development is also fast) .
