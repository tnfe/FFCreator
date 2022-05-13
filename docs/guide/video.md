## 视频影集小程序

《小年糕+》是近两年很火的视频影集类小程序，简单、轻量的特点让它得到了很多用户的喜爱。当然小年糕使用的是自研的视频合成技术方案，但是对于个人开发者或者小公司来说要快速搭建一个视频影集小程序就不是那么简单了。

目前在服务端视频合成方向的开源方案非常少，FFCreator的lottie渲染能力可以比较容易支持这方面的需求，即使是个人开发者也很容易开发和部署。

![img](../_media/imgs/minip.png)

### 步骤

1. 首先设计师使用AE制作一批影集相册，如果没有设计资源也可以去网上找一下"free AE templates download"（相关资源很多）。

2. 下载Bodymovin插件，按照教程[https://zhuanlan.zhihu.com/p/26304609](https://zhuanlan.zhihu.com/p/26304609)导出lottie数据文件。

3. 记录每个lottie文件要替换的图片（替换方法参考前文），把所有lottie文件编号并上传server服务器。

4. 搭建nodejs server服务，开发用户上传图片、选择模版、浏览作品列表等功能。

5. 参照[代码](https://github.com/tnfe/FFCreator/blob/master/examples/lottie.js)并替换图片占位进行视频合成，还可以添加背景音乐。视频合成完毕通知用户，FFCreator合成速度非常快。

<video controls="controls" width="560" height="360" >
  <source type="video/mp4" src="./_media/video/wonder/l2.mp4"></source>
</video>
