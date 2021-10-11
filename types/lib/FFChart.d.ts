
/// <reference path="./EchartsUtil.d.ts" />

declare namespace FFCreatorSpace {
  export interface FFChartConf {
    /**
     * echart theme
     * @see  https://echarts.apache.org/zh/download-theme.html
     */
    theme: 'light' | 'dark' | string;
    option?: echartsSpace.EChartsOption;
    /**
     * @default false
     */
    updateNow?: boolean;
    x: number;
    y: number;
    width: number;
    height: number;
  }

  /**
   * FFChart - A Chart video component, using the echarts.js library.
   *
   * @example
   *
   *    const fchart = new FFChart({ theme: 'dark', option, width: 600, height: 450 });
   *    fchart.addEffect(['rotateIn', 'zoomIn'], 1.2, 1);
   *    fchart.update(chart => {
   *        ....
   *        chart.setOption(data);
   *    }, 1000);
   *
   *
   * @see https://echarts.apache.org/examples/zh/index.html
   *
   * @since v6.0
   *
   */
   class FFChart extends FFImage {
    constructor(conf: FFChartConf);
    /**
     * Set echarts instance option value
     */
    setOption(option: any): void;

    /**
     * Set text font file path
     * @param font text font file path
     */
    setFont(font: string): void;

    /**
     * Timer to update option value
     * @param func Timer hook call function
     * @param time Time interval @default 0.3
     */
    update(func: (e: any) => void, time: number): void;

    /**
     * Now run the update function immediately
     */
    updateNow(): void;

    /**
     * Start rendering
     */
    start(): void;
  }
}
