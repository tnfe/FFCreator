# Koa.js中使用FFCreator

> 通常的一个使用场景是使用`FFCreator`来做视频相册类小程序或者app后端接口，下面教程将详细讲解。我们以`koa`框架为例子，当然[`express`](http://expressjs.com/)或者其他框架类似。

#### 一个视频相册合成接口通常的步骤如下：

* 制作预设视频动画模版
* 用户选择预设动画模版+上传的图片（一张或多张）
* 接口接受数据并开始制作，返回任务id
* 通过任务id轮训查询制作进度并显示（这一步非必需）
* 返回制作好的视频，前端展示（前端逻辑部分）

注: 因为`FFCreatorCenter`本身已经实现队列排队制作，所以不管同时访问多少次接口都会保障任务有序且稳定的执行。

1. ### 制作预设视频动画模版

```javascript
// 可以在service中实现并执行一次
FFCreatorCenter.createTemplate(tempid, ({ image })=>{
    const creator = new FFCreator({...});
    const scene = new FFScene();
    scene.setBgColor('#b33771');
    creator.addChild(scene);

    const fimg = new FFImage({ path: image, x: 100, y: 200 });
    fimg.addEffect('fadeInLeft', 1, 1); 
    scene.addChild(fimg);
    // 添加更多元素以及动画
    ...
    
    creator.start();
    return creator;
});
```

2. ### 添加上传中间件`koa-body`

```javascript
const koaBody = require('koa-body');
...

app.use(koaBody({
    multipart: true,
    formidable: {
        uploadDir: path.join(__dirname, 'upload/'),  // 上传目录
        keepExtensions: true,                        // 保持文件的后缀
        maxFieldsSize: siz('10mb')                   // npm siz package
    }
}));
```

3. ### 基于`koa.js`实现`post`接口

```javascript
const Router = require('koa-router');
...

const router = new Router();
router.post('/making', async (ctx, next) => {
    const tempid = ctx.request.query.tempid;        // 选择模版id
    const file = ctx.request.files.file;           // 上传的图片
    // `addTaskByTemplate`通过模版添加一个制作任务
    const id = FFCreatorCenter.addTaskByTemplate(tempid, { image: file.path });                                     
    ctx.body = {msg:'发送成功，视频加工中...', data:{ id }};
});
```

4. ### 获取视频制作实时进度（非必需）

可以通过接口轮询或者长轮询、`websocket`等方式来获取制作进度，当然这会增加服务器负担。下面是接口轮询的示例。

```javascript
router.get('/progress', async (ctx, next) => {
    const taskid = ctx.request.query.taskid;       // 任务id
    const progress = FFCreatorCenter.getProgress(taskid);
    // 也可以获取制作状态 complete 
    // const state = FFCreatorCenter.getTaskState(taskid);
    ctx.body = {msg:`${taskid}进度为${progress}`, data:{ progress, taskid }};
});
```

5. ### 生成最终视频并返回

当视频制作完毕后，可以有多种方式通知用户下载（或者可以再上传到cdn服务器）

- ##### 方法一. 通过`creator complete`事件
```javascript
creator.on('complete', e => {
    console.log(colors.magenta(`FFCreator completed: \n USEAGE: ${e.useage} \n PATH: ${e.output} `));
    const file = e.output;
    // 通过websocket等方式将结果推送给用户
    // io.sockets.emit("complete",{ file, id });
});
```

- ##### 方法二. 在轮询接口中查询结果
在上一步的获取进度接口中可以实现查询结果
```javascript
const state = FFCreatorCenter.getTaskState(taskid);
if(state==='complete'){
    const file = FFCreatorCenter.getResultFile(taskid);
    ...
}
```

- ##### 方法三. 五分钟后查询
为了更大程度的节省服务器资源，还推荐您一种方法就是5(或7)分钟后再去服务器查询结果。
因为通常`FFCreator`制作速度不会超过5分钟，所以此时去查询一般会有返回结果。
