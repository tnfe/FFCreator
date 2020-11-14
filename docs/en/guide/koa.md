# Use FFCreator in Koa.js

> Use `FFCreator` to make video album class App back-end interface, the following tutorial will explain in detail. We take the `koa` framework as an example, of course [`express`](http://expressjs.com/) or other frameworks are similar.

#### The usual steps of a video album synthesis interface are as follows:

* Create preset video animation templates
* The user chooses a preset animation template + uploaded pictures (one or more)
* The interface accepts data and starts production, and returns the task id
* Query and display the production progress through the task id rotation training (this step is not necessary)
* Return to the produced video, front-end display (front-end logic part)

Note: Because `FFCreatorCenter` itself has implemented queue production, no matter how many times the interface is accessed at the same time, it will ensure the orderly and stable execution of tasks.

1. ### Create preset video animation templates

```javascript
// Can be implemented and executed once in service
FFCreatorCenter.createTemplate(tempid, ({ image })=>{
    const creator = new FFCreator({...});
    const scene = new FFScene();
    scene.setBgColor('#b33771');
    creator.addChild(scene);

    const fimg = new FFImage({ path: image, x: 100, y: 200 });
    fimg.addEffect('fadeInLeft', 1, 1); 
    scene.addChild(fimg);
    // Add more elements and animation
    ...
    
    creator.start();
    return creator;
});
```

2. ### Add upload middleware `koa-body`

```javascript
const koaBody = require('koa-body');
...

app.use(koaBody({
    multipart: true,
    formidable: {
        uploadDir: path.join(__dirname, 'upload/'),  
        keepExtensions: true,                        
        maxFieldsSize: siz('10mb')                  
    }
}));
```

3. ### Implement the `post` interface based on `koa.js`

```javascript
const Router = require('koa-router');
...

const router = new Router();
router.post('/making', async (ctx, next) => {
    const tempid = ctx.request.query.tempid;        // Select template id
    const file = ctx.request.files.file;            // Uploaded picture
    // `addTaskByTemplate` adds a production task through the template
    const id = FFCreatorCenter.addTaskByTemplate(tempid, { image: file.path });                                     
    ctx.body = {msg:'Sending successfully, video processing...', data:{ id }};
});
```

4. ### Get real-time progress of video production (not required)

The production progress can be obtained through interface polling or long polling, `websocket`, etc. Of course, this will increase the burden on the server. The following is an example of interface polling.

```javascript
router.get('/progress', async (ctx, next) => {
    const taskid = ctx.request.query.taskid;       // Task id
    const progress = FFCreatorCenter.getProgress(taskid);
    // You can also get the production status complete
    // const state = FFCreatorCenter.getTaskState(taskid);
    ctx.body = {msg:`${taskid}进度为${progress}`, data:{ progress, taskid }};
});
```

5. ### Generate the final video and return

When the video is finished, there are many ways to notify the user to download (or it can be uploaded to the cdn server)

- ##### Method 1. Through the `creator complete` event
```javascript
creator.on('complete', e => {
    console.log(colors.magenta(`FFCreator completed: \n USEAGE: ${e.useage} \n PATH: ${e.output} `));
    const file = e.output;
    // Push the results to users through websocket and other methods
    // io.sockets.emit("complete",{ file, id });
});
```

- ##### Method 2. Query results in the polling interface
The query result can be realized in the progress interface of the previous step
```javascript
const state = FFCreatorCenter.getTaskState(taskid);
if(state==='complete'){
    const file = FFCreatorCenter.getResultFile(taskid);
    ...
}
```

- ##### Method 3. Query after five minutes
In order to save server resources to a greater extent, it is also recommended that you go to the server to query the results after 5 (or 7) minutes.
Because the production speed of `FFCreator` usually does not exceed 5 minutes, so the query will usually return results at this time.
