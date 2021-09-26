# Data visualization video

> `FFCreator6.0` adds FFChart component, and supports most demos of [echarts.js](https://echarts.apache.org), you can make cool data visualization videos.

<video controls="controls" width="320" height="568" >
  <source type="video/mp4" src="./_media/video/wonder/chart.mp4"></source>
</video>

- ## Add chart component

`FFCreator6.0` adds FFChart component, and supports most demos of [echarts.js](https://echarts.apache.org). Of course, due to technical differences, there are still many charts that are not supported. If you find that you can't use it, please let me know.

> Note: In order to maintain the stability of the version, the current version of echarts.js used by FFCreator is fixed to [`v5.1.2`](https://www.npmjs.com/package/echarts/v/5.1.2).

### Copy configuration code

Go to echart.js website demo page https://echarts.apache.org/examples/zh/index.html to find the chart you want, and open [Edit](https://echarts.apache.org/examples/) Copy the config code in the page.

![img](../_media/imgs/chart.jpg)

```javascript
const option = {
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  ...
  series: [
    {
      data: [120, 200, 150, 80, 70, 110, 130],
      type: 'bar'
    }
  ]
};
```

### Add chart component

> Note: Because of the difference between video and web display, please reset the margin and font size options to achieve the best results

Initialize `FFChart` and set `option` and `theme` theme, here you can refer to https://echarts.apache.org/zh/api.html official document.

```javascript
const fchart = new FFChart({
  theme: 'dark',
  option: option,
  x: width / 2,
  y: height / 2 + 50,
  width: 700,
  height: 600,
});
```

You can also use the `setOption` method to set data

```javascript
fchart.setOption(option);
fchart.addEffect(['rotateIn', 'zoomIn'], 1.2, 1);
```

### Dynamic chart

How to add animation to `FFChart`? `FFChart` provides the `update` method, which is a regular update function and its function is similar to the `setInterval` function. You can pass in an update hook function, and the second parameter is the interval time.

> Note: Here also pay attention to adjust the values of options such as `animationDuration` and `animationDurationUpdate` to keep pace with `updateTime`.

```javascript
fchart.update(chart => {
  const newData = ...;
  ...
  chart.setOption(newData);
}, 1000);
```

### Animate now

Of course, you will also find a problem, that is, update is called but the animation is not executed immediately. This is because it is a timed interval function that does not call the hook immediately. But many times you may want this effect.

If you want to execute the animation immediately, please call `updateNow`

```javascript
fchart.update(() => {}, 1000);
fchart.updateNow();
```
