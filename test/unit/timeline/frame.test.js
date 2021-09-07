const Frame = require('@/timeline/frame');

describe('timeline/frame', () => {
  let frame = null;

  test('instantiation: Component needs to succeed', () => {
    frame = new Frame();
    frame.scenesIndex = [0, 1, 2, 3];
    expect(frame.getLastSceneIndex()).toEqual(3);
  });

  test('add: Add a single picture frame', () => {
    expect(frame.getFirstSceneIndex()).toEqual(0);
  });
});
