const Timeline = require('@/timeline/timeline');
const FFScene = require('@/node/scene');

describe('timeline/timeline', () => {
  const createScenes = () => {
    const rootConf = () => 60;
    const scene1 = new FFScene();
    scene1.setDuration(8);
    scene1.rootConf = rootConf;
    scene1.setTransition('InvertedPageCurl', 1.5);

    const scene2 = new FFScene();
    scene2.rootConf = rootConf;
    scene2.setDuration(10);

    return [scene1, scene2];
  };

  const timeline = new Timeline(60);
  timeline.annotate(createScenes());

  test('update: Timeline update function ', () => {
    expect(timeline.duration).toBe(16.5);
  });

  test('nextFrame: Next Frame run ', () => {
    timeline.nextFrame();
    expect(timeline.frame).toBe(1);
  });

  test('framesNum: remove callback hook ', () => {
    timeline.nextFrame();
    expect(timeline.framesNum).toBe(990);
  });
});
