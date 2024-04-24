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

const FrameData = require('./frame');
const forEach = require('lodash/forEach');
const TimelineUpdate = require('./update');

/**
 * @typedef { import("../node/scene") } FFScene
 * @typedef { {
 *   type: "normal" | "transition";
 *   start: number;
 *   end: number;
 *   total: number;
 *   scenesIndex: number[];
 * } } Segment
 */

class Timeline {
  constructor(fps) {
    /** @type { number } */
    this.fps = fps;
    /** @type { number } */
    this.frame = 0;
    /** @type { number } */
    this.duration = 0;
    /** @type { number } */
    this.framesNum = 0;
    this.frameData = new FrameData();
    /**
     * @type { Segment[] }
     */
    this.segments = [];
    /** @type { { sceneStart: number; sceneEnd: number; }[] } */
    this.scenes = [];
  }

  /**
   * Marking the frameData of the scenes.
   * Split scene into sub-frameData, new timeline frameData stitching method
   *  |--------|===|  (s1)
   *           |---|-----|===|  (s2)
   *                     |---|-------|  (s3)
   *
   * @param { FFScene[] } ffscenes - An array of scenes
   * @public
   */
  annotate(ffscenes) {
    const { segments, scenes } = this;
    let point = 0;
    let preTrans = 0;

    forEach(ffscenes, (scene, index) => {
      const isFirst = index === 0;
      const isLast = index === ffscenes.length - 1;
      const total = scene.getFramesNum();
      const trans = isLast ? 0 : scene.getTransFramesNum();

      // normal single scene
      const norNum = total - trans - preTrans;
      const segment1 = {
        type: 'normal',
        start: point,
        end: point + norNum,
        total: norNum,
        scenesIndex: [index],
      };
      segments.push(segment1);
      point = segment1.end;

      // scene of transition animation
      if (trans) {
        const segment2 = {
          type: 'transition',
          start: point,
          end: point + trans,
          total: trans,
          scenesIndex: [index, index + 1],
        };
        segments.push(segment2);
        point = segment2.end;
      }

      // calculate the start and end time of the scene
      let sceneStart, sceneEnd;
      if (preTrans) {
        sceneStart = isFirst ? segment1.start - preTrans : segment1.start - preTrans + 1;
      } else {
        sceneStart = isFirst ? segment1.start : segment1.start + 1;
      }

      sceneEnd = point;
      scenes.push({ sceneStart, sceneEnd });

      // set this cache variable
      preTrans = trans;
      this.framesNum = point;

      // set total duration
      const realDuration =
        index === ffscenes.length - 1
          ? ffscenes[index].duration
          : ffscenes[index].getRealDuration();
      this.duration += realDuration;
    });
  }

  /**
   * Get the data of the current frame.
   * @return { FrameData & { frame: number; } } the data of the current frame
   * @public
   */
  getFrameData() {
    const { scenes, segments, frame, frameData } = this;
    const isFirst = this.isFirst();
    const isLast = this.isLast();

    frameData.frame = frame;
    frameData.isFirst = isFirst;
    frameData.isLast = isLast;
    frameData.isSceneStart = false;
    frameData.isSceneEnd = false;
    frameData.isSceneOver = false;
    frameData.startFrame = 0;
    frameData.endFrame = 0;

    // set the scene to start and end
    for (let i = 0; i < scenes.length; i++) {
      const { sceneStart, sceneEnd } = scenes[i];

      if (sceneStart === frame) {
        frameData.isSceneStart = true;
        // break;
      }

      if (sceneEnd === frame) {
        frameData.isSceneEnd = true;
        // break;
      }

      if (sceneEnd + 1 === frame) {
        frameData.isSceneOver = true;
        // break;
      }
    }

    // set the current scenesIndex and type
    for (let i = 0; i < segments.length; i++) {
      const { start, end, total, type, scenesIndex } = segments[i];

      if ((frame > start && frame <= end) || isFirst) {
        frameData.type = type;
        frameData.scenesIndex = scenesIndex;
        frameData.progress = type === 'transition' ? (frame - start) / total : 0;
        frameData.startFrame = start;
        frameData.endFrame = end;
        return frameData;
      }
    }

    return null;
  }

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
   * @public
   */
  nextFrame() {
    const { fps } = this;
    if (!this.isOver()) {
      this.frame++;
      TimelineUpdate.update(fps);
    }
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
    this.frameData = null;
  }
}

module.exports = Timeline;
