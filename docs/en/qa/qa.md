# Common problem

#### ✿1. When installing, it prompts an error missing package'xi'

```shell
No package 'xi'

foundgyp: Call to 'pkg-config --libs-only-l x11 xi xext' returned exit status 1 while in angle/src/angle.gyp. while loading dependencies of binding.gyp while trying to load binding.gyp
```

#### Solve

```shell
yum install libXi-devel libXinerama-devel libX11-devel
```

#### ✿2. The program can be started normally but an error is reported `doesn't support WebGL...`

#### Solve

The node app should be started as follows.

```shell
xvfb-run -s "-ac -screen 0 1280x1024x24" npm start
```

#### ✿3. Npm installation error `ERR! command sh -c node-pre-gyp install --fallback-to-build`

#### Solve

This may be caused by your node version. If it is node`v15`, this issue will occur [https://github.com/Automattic/node-canvas/issues/1645](https://github.com/Automattic/node-canvas/issues/1645). Please reduce the node version to `v14`.

#### ✿4. `FFCreator` is not as fast as pictures when synthesizing more than 3 video clips

`FFCreator` is not as fast as pictures when synthesizing more than 3 video clips, so `FFCreatorLite` is a better choice.

#### Solve

In this case, please use `FFCreatorLite`, `FFCreatorLite` is not a simplified version of `FFCreator`. In terms of video processing, FFCreatorLite is extremely efficient.


#### ✿5. Why is a 2G cache generated when synthesizing a video of more than one minute?

#### Solve

FFCreator uses raw format cache by default, raw can make the processing speed is fast and the video quality is also very good.
If your server does not have a large storage space, and you do not have a high demand for processing speed. Then you can set the cache format to save disk space.

- Use `jpg`(or `png`) format cache, Set the `cacheQuality` option to modify the quality.
> Note: The use of jpg format compared to raw will greatly save the cache space, most of the time it is about one-tenth. the processing speed will be a little bit slower.

```javascript
cacheType: 'jpg', // (or png)
cacheQuality: 70, // default 80
```

#### ✿6. How to combine PM2 and xvfb with linux server

Unable to use `xvfb-run -s "-ac -screen 0 1280x1024x24" pm2 start` start the service, an error is reported

```javascript
(node:4986) UnhandledPromiseRejectionWarning: TypeError: Cannot read property 'ARRAY_BUFFER' of null
at FFTransition.createBuffer (/var/www/html/juan_fundoo/public/APP/node_modules/ffcreator/lib/animate/transition.js:73:45)
at FFTransition.createTransition
```

#### Solve

configure `process.json`

```
{
  "apps" : [{
    "name"        : "<your_app_name>",
    "script"      : "<your_main.js>",
    "env": {
      "DISPLAY": ":99"
    }
  },
    {
      "name"        : "Xvfb",
      "interpreter" : "none",
      "script"      : "Xvfb",
      "args"        : ":99 -ac -screen 0 1280x1024x24"
    }]
}
```
start the service `pm2 start process.json`

> Remark: [Xvfb configure](https://www.x.org/releases/X11R7.6/doc/man/man1/Xvfb.1.xhtml) 、[xvfb-run configure](http://manpages.ubuntu.com/manpages/trusty/man1/xvfb-run.1.html)
