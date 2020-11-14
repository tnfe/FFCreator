# Common problem

1. #### When installing, it prompts an error missing package'xi'

```shell
No package 'xi'

foundgyp: Call to 'pkg-config --libs-only-l x11 xi xext' returned exit status 1 while in angle/src/angle.gyp. while loading dependencies of binding.gyp while trying to load binding.gyp
```

#### Solve

```shell
yum install libXi-devel libXinerama-devel libX11-devel
```

2. #### The program can be started normally but an error is reported `doesn't support WebGL...`

#### Solve

The node app should be started as follows.

```shell
xvfb-run -s "-ac -screen 0 1280x1024x24" npm start
```

3. #### Npm installation error `ERR! command sh -c node-pre-gyp install --fallback-to-build`

#### Solve

This may be caused by your node version. If it is node`v15`, this issue will occur [https://github.com/Automattic/node-canvas/issues/1645](https://github.com/Automattic/node-canvas/issues/1645). Please reduce the node version to `v14`.

4. #### `FFCreator` is not as fast as pictures when synthesizing more than 3 video clips

`FFCreator` is not as fast as pictures when synthesizing more than 3 video clips, so `FFCreatorLite` is a better choice.

#### Solve

In this case, please use `FFCreatorLite`, `FFCreatorLite` is not a simplified version of `FFCreator`. In terms of video processing, FFCreatorLite is extremely efficient.