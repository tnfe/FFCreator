'use strict';

/**
 * Timeline - A timeline class to manage scenes and animations
 *
 * ####Example:
 *
 *     const timeline = new Timeline(60);
 *     timeline.annotate(scenes);
 *     timeline.nextFrame();
 *
 * @class
 */

const forEach = require('lodash/forEach');
const FFSpine = require('../node/spine');

class Timeline {
  constructor(creator) {
    this.creator = creator;
    this.fps = creator.conf.getVal('fps');
    this.frame = 0;
    this.frameInFloat = 0.0;
    this.duration = 0;
    this.framesNum = 0;
    this.segments = [];
    this.scenes = [];
  }

  annotate() {
    const spine = this.creator.children.filter(x => x.type === 'spine')[0];
    this.duration = spine.duration;
    this.framesNum = Math.round(this.duration * this.fps);
    this.creator.conf.duration = this.duration;

    console.log('timeline.annotate creator duration:', this.duration);
    // 有了creator的duration之后, 可能有child依赖于此, 需要再annotate一下
    this.creator.allNodes.map(node => {
      // console.log('timeline.annotate', node.id, {start:node.absStartTime, end:node.absEndTime});
      node.annotate();
    });
  }

  /**
   * Marking the frameData of the scenes.
   * Split scene into sub-frameData, new timeline frameData stitching method
   *  |--------|===|  (s1)
   *           |---|-----|===|  (s2)
   *                     |---|-------|  (s3)
   *
   * @param {array} ffscenes - An array of scenes
   * @public
   */
  // annotate(ffscenes) {
  //   const { segments, scenes } = this;
  //   let point = 0;
  //   let preTrans = 0;

  //   forEach(ffscenes, (scene, index) => {
  //     const isFirst = index === 0;
  //     const isLast = index === ffscenes.length - 1;
  //     const total = scene.getFramesNum();
  //     const trans = isLast ? 0 : scene.getTransFramesNum();

  //     // normal single scene
  //     const norNum = total - trans - preTrans;
  //     const segment1 = {
  //       type: 'normal',
  //       start: point,
  //       end: point + norNum,
  //       total: norNum,
  //       scenesIndex: [index],
  //     };
  //     segments.push(segment1);
  //     point = segment1.end;

  //     // scene of transition animation
  //     if (trans) {
  //       const segment2 = {
  //         type: 'transition',
  //         start: point,
  //         end: point + trans,
  //         total: trans,
  //         scenesIndex: [index, index + 1],
  //       };
  //       segments.push(segment2);
  //       point = segment2.end;
  //     }

  //     // calculate the start and end time of the scene
  //     let sceneStart, sceneEnd;
  //     if (preTrans) {
  //       sceneStart = isFirst ? segment1.start - preTrans : segment1.start - preTrans + 1;
  //     } else {
  //       sceneStart = isFirst ? segment1.start : segment1.start + 1;
  //     }

  //     sceneEnd = point;
  //     scenes.push({ sceneStart, sceneEnd });

  //     // add calculated startTime/endTime to scene
  //     scene.startTime = sceneStart / this.fps;
  //     scene.endTime = sceneEnd / this.fps;

  //     // set this cache variable
  //     preTrans = trans;
  //     this.framesNum = point;

  //     // set total duration
  //     const realDuration =
  //       index === ffscenes.length - 1
  //         ? ffscenes[index].duration
  //         : ffscenes[index].getRealDuration();
  //     this.duration += realDuration;
  //   });

  //   this.creator.duration = this.duration;
  // }

  /**
   * Determine if it is the first frame
   * @public
   */
  isFirst() {
    const { frame } = this;
    return frame === 0;
  }

  /**
   * Determine if the last frameData is reached
   * @public
   */
  isLast() {
    const { frame } = this;
    return frame === this.framesNum - 1;
  }

  isOver() {
    const { frame } = this;
    return frame > this.framesNum - 1;
  }

  /**
   * update the next frameData
   * @param {Number} deltaTimeMs
   * @public
   */
  nextFrame(deltaTimeMs) {
    if (deltaTimeMs === undefined) deltaTimeMs = 1000 / this.fps;
    if (deltaTimeMs <= 0) return this.pause();
    const { fps } = this;
    if (!this.isOver()) {
      const deltaFrame = deltaTimeMs * fps / 1000;
      this.frameInFloat += deltaFrame;
      this.frame = this.frameInFloat >> 0;
      return this.creator.timeUpdate(deltaTimeMs);
    }
  }

  pause() {
    return this.creator.timeUpdate(0);
  }

  async jumpTo(timeInMs) {
    const { fps } = this;
    this.frameInFloat = timeInMs * fps / 1000;
    this.frame = this.frameInFloat >> 0;
    return await this.creator.timeUpdate(0, timeInMs);
  }

  setFps(fps) {
    this.fps = fps;
  }

  getFramesNum() {
    return this.framesNum;
  }

  destroy() {
    this.scenes.length = 0;
    this.segments.length = 0;
  }
}

module.exports = Timeline;
