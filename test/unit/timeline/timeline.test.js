const Timeline = require('@/timeline/timeline');
const FFCreator = require('@/creator');
const FFScene = require('@/node/scene');
const FFTransition = require('@/animate/transition');

describe('timeline/timeline', () => {
  const fps = 60;
  const mockCreator = new FFCreator({fps});
  mockCreator.addChild(new FFScene({ duration: 5 }));
  mockCreator.addChild(new FFTransition({ duration: 1.5 }));
  mockCreator.addChild(new FFScene({ duration: 5 }));
  const timeline = new Timeline(mockCreator);
  mockCreator.initSpine();
  mockCreator.allNodes.map(x => x.annotate());

  let delta = 0, time = 0;
  mockCreator.timeUpdate = (_delta, _time) => {
    time = _time;
    delta = _delta;
  }

  test('annotate: duration', () => {
    timeline.annotate();
    expect(timeline.duration).toBe(8.5);
    expect(mockCreator.duration).toBe(8.5);
  });

  test('nextFrame: Next Frame run ', () => {
    timeline.nextFrame();
    expect(timeline.frame).toBe(1);
    expect(timeline.frameInFloat.toFixed(3)).toBe('1.000');
    expect(time).toBe(undefined);
    expect(delta.toFixed(3)).toBe((1000 / fps).toFixed(3));
  });

  test('pause and seek', () => {
    timeline.pause();
    expect(time).toBe(undefined);
    expect(delta).toBe(0);

    timeline.jumpTo(1000);
    expect(time).toBe(1000);
    expect(delta).toBe(0);
    expect(timeline.frameInFloat.toFixed(3)).toBe(fps.toFixed(3));
    expect(timeline.frame).toBe(fps);
  });

  test('framesNum: remove callback hook ', () => {
    timeline.nextFrame(20);
    expect(timeline.framesNum).toBe(fps*8.5);
    expect(timeline.frame).toBe(61);
    expect(time).toBe(undefined);
    expect(delta).toBe(20);
  });
});
