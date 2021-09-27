const path = require('path');
const fs = require('fs-extra');
const colors = require('colors');
const startAndListen = require('./listen');
const {
  FFCreatorCenter,
  echarts,
  FFText,
  FFChart,
  FFScene,
  FFImage,
  FFGifImage,
  FFCreator,
} = require('../');

const createFFTask = async () => {
  const bg1 = path.join(__dirname, './assets/imgs/bg/07.jpg');
  const bg2 = path.join(__dirname, './assets/imgs/bg/01.jpeg');
  const logo2 = path.join(__dirname, './assets/imgs/logo/logo2.png');
  const cart = path.join(__dirname, './assets/imgs/gif/cart.gif');
  const hert = path.join(__dirname, './assets/imgs/gif/hert.gif');
  const rock = path.join(__dirname, './assets/imgs/rock.png');
  const data1 = path.join(__dirname, './assets/data/country.json');
  const data2 = path.join(__dirname, './assets/data/life-expectancy-table.json');
  const audio = path.join(__dirname, './assets/audio/05.wav');
  const font2 = path.join(__dirname, './assets/font/font2.ttf');
  const outputDir = path.join(__dirname, './output/');
  const cacheDir = path.join(__dirname, './cache/');

  // create creator instance
  const width = 576;
  const height = 1024;
  const creator = new FFCreator({
    cacheDir,
    outputDir,
    width,
    height,
    highWaterMark: '3mb',
    parallel: 8,
    audio,
  });

  // create FFScene
  const scene1 = new FFScene();
  const scene2 = new FFScene();
  scene1.setBgColor('#0b0be6');
  scene2.setBgColor('#b33771');

  // add scene1 background
  const fbg1 = new FFImage({ path: bg1, x: width / 2, y: height / 2 });
  scene1.addChild(fbg1);

  ///////////////////////////////////////////////////////////////////////////////////
  //
  //    FFChart Demo
  //    文档: https://tnfe.github.io/FFCreator/#/guide/chart
  //    配置: https://echarts.apache.org/examples/zh/editor.html?c=bar-race-country
  //
  ///////////////////////////////////////////////////////////////////////////////////
  const updateFrequency = 1000;
  const dimension = 0;
  const countries = await fs.readJson(data1);
  const data = await fs.readJson(data2);
  const years = [];
  for (let i = 0; i < data.length; ++i) {
    if (years.length === 0 || years[years.length - 1] !== data[i][4]) {
      years.push(data[i][4]);
    }
  }

  let startIndex = 18;
  let startYear = years[startIndex];
  const option = {
    grid: {
      top: 10,
      bottom: 30,
      left: 50,
      right: 50,
    },
    xAxis: {
      max: 'dataMax',
      axisLabel: {
        formatter: function(n) {
          return Math.round(n) + '';
        },
      },
    },
    dataset: {
      source: data.slice(1).filter(function(d) {
        return d[4] === startYear;
      }),
    },
    yAxis: {
      type: 'category',
      inverse: true,
      max: 10,
      axisLabel: {
        show: true,
        fontSize: 14,
        formatter: value => {
          const count = countries[value];
          return count ? count.name : value.substr(0, 3);
        },
        rich: {
          flag: {
            fontSize: 25,
            padding: 5,
          },
        },
      },
      animationDuration: 300,
      animationDurationUpdate: 300,
    },
    series: [
      {
        realtimeSort: true,
        seriesLayoutBy: 'column',
        type: 'bar',
        itemStyle: {
          color: function(param) {
            const count = countries[param.value[3]];
            return count ? count.color : '#5470c6';
          },
        },
        encode: {
          x: dimension,
          y: 3,
        },
        label: {
          show: true,
          precision: 1,
          position: 'right',
          valueAnimation: true,
          fontFamily: 'monospace',
        },
      },
    ],
    // Disable init animation.
    animationDuration: 0,
    animationDurationUpdate: updateFrequency,
    animationEasing: 'linear',
    animationEasingUpdate: 'linear',
    graphic: {
      elements: [
        {
          type: 'text',
          right: 20,
          bottom: 30,
          style: {
            text: startYear,
            font: 'bolder 80px monospace',
            fill: 'rgba(100, 100, 100, 0.25)',
          },
          z: 100,
        },
      ],
    },
  };

  const fchart = new FFChart({
    theme: 'dark',
    option: option,
    x: width / 2,
    y: height / 2 + 50,
    width: width,
    height: 600,
  });
  //fchart.addEffect(['rotateIn', 'zoomIn'], 1.2, 0);

  fchart.update(chart => {
    startIndex += 2;
    updateYear(years[startIndex]);

    function updateYear(year) {
      let source = data.slice(1).filter(d => d[4] === year);
      option.series[0].data = source;
      option.graphic.elements[0].style.text = year;
      chart.setOption(option);
    }
  }, 1000);
  fchart.updateNow();
  scene1.addChild(fchart);

  // add logo
  const flogo1 = new FFImage({ path: logo2, x: width / 2, y: 60 });
  flogo1.setScale(0.65);
  scene1.addChild(flogo1);

  // add FFText Component
  const text1 = new FFText({ text: '图表组件 Demo', x: width / 2, y: 160, fontSize: 40 });
  text1.setColor('#ffffff');
  text1.setBackgroundColor('#0030cd');
  text1.addEffect('fadeInUp', 1, 0.5);
  text1.alignCenter();
  text1.setFont(font2);
  text1.setStyle({ padding: 10 });
  scene1.addChild(text1);

  // add gif image
  const fcart = new FFGifImage({ path: cart, x: width / 2, y: height - 100 });
  fcart.addEffect('zoomIn', 2, 1);
  fcart.setScale(0.3);
  scene1.addChild(fcart);

  const fhert = new FFGifImage({ path: hert, x: width / 2, y: height / 2 });
  fhert.addEffect('fadeIn', 1.5, 0.5);
  fhert.addEffect('fadeOut', 1.5, 3.5);
  scene1.addChild(fhert);

  const frock = new FFImage({
    path: rock,
    x: width / 2,
    y: height / 2,
    scale: 0.75,
    rotate: 3.1415 / 2,
  });
  frock.addAnimate({
    from: { x: -200 },
    to: { x: width + 200 },
    time: 1.5,
    delay: 6.5,
  });
  scene1.addChild(frock);

  scene1.setDuration(15);
  scene1.setTransition('WaterWave', 1.5);
  creator.addChild(scene1);

  // add scene2 background
  const fbg2 = new FFImage({ path: bg2, x: width / 2, y: height / 2 });
  scene2.addChild(fbg2);
  // add logo
  const flogo2 = new FFImage({ path: logo2, x: width / 2, y: height / 2 - 80 });
  flogo2.setScale(0.9);
  flogo2.addEffect('fadeInDown', 1, 1.2);
  scene2.addChild(flogo2);

  scene2.setDuration(3);
  creator.addChild(scene2);

  creator.start();

  creator.on('start', () => {
    console.log(`FFCreator start`);
  });

  creator.on('error', e => {
    console.log(colors.red(`FFCreator error: ${e.error}`));
  });

  creator.on('progress', e => {
    console.log(colors.yellow(`FFCreator progress: ${(e.percent * 100) >> 0}%`));
  });

  creator.on('complete', e => {
    console.log(
      colors.magenta(`FFCreator completed: \n USEAGE: ${e.useage} \n PATH: ${e.output} `),
    );

    console.log(colors.green(`\n --- You can press the s key or the w key to restart! --- \n`));
  });

  return creator;
};

module.exports = () => startAndListen(() => FFCreatorCenter.addTask(createFFTask));
