const Timeline = require('@/timeline/timeline');
const FFScene = require('@/node/scene');

describe('timeline/timeline', () => {
  const fps = 60;
  const rootConf = () => fps;
  const createScenes = () => {
    const scene1 = new FFScene();
    scene1.setDuration(8);
    scene1.rootConf = rootConf;
    scene1.setTransition('InvertedPageCurl', 1.5);

    const scene2 = new FFScene();
    scene2.rootConf = rootConf;
    scene2.setDuration(10);

    return [scene1, scene2];
  };

  let delta = 0;
  let time = 0;
  const mockCreator = {
    conf: { getVal: rootConf },
    timeUpdate: (_delta, _time) => {
      time = _time;
      delta = _delta;
    }
  };
  const timeline = new Timeline(mockCreator);
  timeline.annotate(createScenes());

  test('update: Timeline update function ', () => {
    expect(timeline.duration).toBe(16.5);
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
    expect(timeline.framesNum).toBe(990);
    expect(timeline.frame).toBe(61);
    expect(time).toBe(undefined);
    expect(delta).toBe(20);
  });
});
