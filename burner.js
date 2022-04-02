'use strict';

const path = require('path');
const { Factory } = require('./lib/index');
const CacheUtil = require('./lib/utils/cache');

const outputDir = path.join(__dirname, './output/');
const cacheDir = path.join(__dirname, './cache/');
CacheUtil.cacheDir = cacheDir;

const value = `
<miraml>
  <canvas width="800" height="600" render="webgl">
    <audio src="https://mira-1255830993.cos.ap-shanghai.myqcloud.com/jianshuo/beats.mp3"
      preload="true" loop="true" fadeIn="2" fadeOut="2" volume="1"/>
    <image id="i1" src="https://mira-1255830993.cos.ap-shanghai.myqcloud.com/lab/zhaojun/assets/imgs/gif/girl.gif"
      width="30rpx" x="130rpx" y="50rpx" start="0.5" zIndex="1" duration="10">
      <image id="i2" src="https://mira-1255830993.cos.ap-shanghai.myqcloud.com/lab/zhaojun/assets/imgs/mars.png"
        width="50rpx" height="20rpx" x="200rpx" y="50rpx" fit="none" opacity="0.6" effect="zoomIn,rollIn,fadeIn" effectTime="1" effectDelay="2" duration="12"/>
      <gif id="g1z2" src="https://mira-1255830993.cos.ap-shanghai.myqcloud.com/lab/zhaojun/assets/imgs/gif/girl.gif"
        width="30rpx" x="130rpx" y="100rpx" zIndex="2" blur="3"/>  
    </image>
    <richtext width="100rpx" x="10rpx" y="10rpx" zIndex="3" anchor="[0,0]">
      <animate time="10">
        <from y="10rpx" />
        <to y="-950rpx" />
      </animate>
      <font name="defont" src="https://mira-1255830993.cos.ap-shanghai.myqcloud.com/lab/data/font/OpenSans-Regular.ttf"/>
      <font name="庞门正道标题体" src="https://mira-1255830993.cos.ap-shanghai.myqcloud.com/lab/data/font/庞门正道标题体.ttf"/>
      <font name="思源宋体" src="https://mira-1255830993.cos.ap-shanghai.myqcloud.com/lab/data/font/%E6%80%9D%E6%BA%90%E5%AE%8B%E4%BD%93CN-Regular.otf"/>    
      <html style="color:white; width: 100px; font-family: 'defont'; font-size: 12px; background: rgba(255,0,0,0.3)">
        rich <span style="color:red">text</span> ~ <br />
        <span style="font-size: 18px; font-family: '庞门正道标题体'; ">庞门正道标题体</span>
        <span style="font-size: 13px; font-family: '思源宋体'; ">思源宋体</span><br />
        默认字体<br />
        is coool 0<br />
        is coool 1<br />
        is coool 2<br />
        is coool 3<br />
        is coool 4<br />
        is coool 5<br />
        is coool 6<br />
        is coool 7<br />
        is coool 8<br />
        is coool 9<br />
        is coool 10<br />
        is coool 11<br />
        is coool 12<br />
        is coool 13<br />
        is coool 14<br />
        is coool 15<br />
        is coool 16<br />
        is coool 17<br />
        is coool 18<br />
        is coool 19<br />
        is coool 20<br />
        is coool 21<br />
        is coool 22<br />
        is coool 23<br />
        is coool 24<br />
        is coool 25<br />
        is coool 26<br />
        is coool 27<br />
        is coool 28<br />
        is coool 29<br />
        is coool 30<br />
        is coool 31<br />
        is coool 32<br />
        is coool 33<br />
        is coool 34<br />
        is coool 35<br />
        is coool 36<br />
        is coool 37<br />
        is coool 38<br />
        is coool 39<br />
        is coool 40<br />
        is coool 41<br />
        is coool 42<br />
        is coool 43<br />
        is coool 44<br />
        is coool 45<br />
        is coool 46<br />
        is coool 47<br />
        is coool 48<br />
        is coool 49<br />
        is coool 50<br />
        who let the dogs out!!!
      </html>
    </richtext>
    <spine>
      <scene background="#096" duration="3">
        <video path="https://mira-1255830993.cos.ap-shanghai.myqcloud.com/public2/190204084208765161.mp4"
          x="50vw" y="50vh" width="100vw" loop="true" ss="2" to="5" end="4.5" volume="0.5"/>
        <image src="https://mira-1255830993.cos.ap-shanghai.myqcloud.com/lab/zhaojun/assets/imgs/gif/girl.gif"
          width="30rpx" x="100rpx" y="50rpx"/>
        <gif src="https://mira-1255830993.cos.ap-shanghai.myqcloud.com/lab/zhaojun/assets/imgs/gif/girl.gif"
          width="30rpx" x="200rpx" y="50rpx" speed="2" zIndex="2"/>
        <image src="https://mira-1255830993.cos.ap-shanghai.myqcloud.com/lab/zhaojun/assets/imgs/mars.png"
          width="50rpx" height="20rpx" x="200rpx" y="50rpx" fit="none" zIndex="1" opacity="0.6" effect="zoomIn,rollIn,fadeIn" effectTime="1" effectDelay="1"/>
        <gif src="https://mira-1255830993.cos.ap-shanghai.myqcloud.com/lab/zhaojun/assets/imgs/mars.png"
          width="50rpx" height="20rpx" x="200rpx" y="100rpx" fit="fill"/>
        <text text="环宇 " fontSize="100" fontFamily="https://mira-1255830993.cos.ap-shanghai.myqcloud.com/lab/data/font/庞门正道标题体.ttf"
          fontStyle="italic" x="100rpx" y="100rpx" color="#00ff99" stroke="#ff0000" strokeThickness="5" id="t1z3" zIndex="3"/>
      </scene>
      <transition name="InvertedPageCurl" duration="1.5"/>
      <scene background="#903" duration="3">
        <video path="https://mira-1255830993.cos.ap-shanghai.myqcloud.com/lab/aiqiyi/output_cuts/%E4%BA%91%E5%B7%85%E4%B9%8B%E4%B8%8A_%E7%AC%AC2%E5%AD%A3_%E7%AC%AC6%E9%9B%86-%E7%94%B5%E8%A7%86%E5%89%A7%E5%85%A8%E9%9B%86-%E5%AE%8C%E6%95%B4%E7%89%88%E8%A7%86%E9%A2%91%E5%9C%A8%E7%BA%BF%E8%A7%82%E7%9C%8B-%E7%88%B1%E5%A5%87%E8%89%BA_scenes/30.mp4"
          x="50vw" y="50vh" height="100vh" ss="2" volume="0.5"/>
      </scene>
    </spine>
  </canvas>
</miraml>
`;

const burn = async (opts) => {
  Factory.debug = true;
  Factory.cacheNode = CacheUtil.cacheNode;

  const creator = await Factory.from(opts.value, opts, (pp) => {
    console.log(pp);
  });

  creator.on('start', () => {
    console.log(`Burn start`);
  }).on('error', e => {
    console.error(e);
  }).on('progress', e => {
    console.log(`Burn progress: ${(e.percent * 100) >> 0}%`);
  }).on('preloading', (evt) => {
    console.log(`Burn preloading ${evt.id}: ${evt.loaded}/${evt.total}`);
  }).on('complete', e => {
    console.log(`Burn completed: \n USEAGE: ${e.useage} \n PATH: ${e.output} `);
  }).generateOutput().start();
}

burn({ value, cacheDir, outputDir });