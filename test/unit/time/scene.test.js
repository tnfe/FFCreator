const FFScene = require('@/node/scene');
const FFClip = require('@/core/clip');
const FFVideo = require('@/node/video');

describe('time/scene', () => {
  test('scene: default start/duration/end ', () => {
    const scene = new FFScene({});
    scene.parent = { startTime: 0, absStartTime: 0, duration: NaN };

    const clip = new FFClip({});
    scene.addChild(clip);

    expect(clip.startTime).toBe(0);
    expect(clip.duration).toBe(1);
    expect(clip.endTime).toBe(1);

    expect(scene.startTime).toBe(0);
    expect(scene.duration).toBe(1);
    expect(scene.endTime).toBe(1);

    clip.conf.duration = 5;
    scene.annotate();
    expect(scene.defaultDuration).toBe(5);
    expect(scene.duration).toBe(5);

    const clip2 = new FFClip({ start: 2, duration: 8 });
    const clip3 = new FFClip({ end: "200%" });
    scene.addChild([clip2, clip3]);
    scene.annotate();
    expect(scene.duration).toBe(10);
  });

  test('scene: default start/duration/end with video', () => {
    const scene = new FFScene({});
    scene.parent = { startTime: 0, absStartTime: 0, duration: NaN };

    const video = new FFVideo({ start: 1 });
    video.material = { getDuration: () => 3 };
    scene.addChild(video);

    const video2 = new FFVideo({});
    video2.material = { getDuration: () => 5 };
    scene.addChild(video2);

    const video3 = new FFVideo({ loop: true });
    video3.material = { getDuration: () => 8 }; // 循环的video，不能撑开parent
    scene.addChild(video3);

    scene.annotate();
    expect(scene.duration).toBe(5);
    expect(video.duration).toBe(3);
    expect(video2.duration).toBe(5);
    expect(video3.duration).toBe(5);

    const clip = new FFClip({ start: "50%", duration: "200%"});
    video.addChild(clip);
    expect(clip.duration).toBe(6);
    scene.annotate();
    expect(scene.duration).toBe(8.5);
    expect(video.duration).toBe(3);
    expect(video2.duration).toBe(5);
    expect(video3.duration).toBe(8.5);
  });

  test('scene: duration change', () => {
    const scene = new FFScene({ duration: 10 });
    scene.parent = { startTime: 0, absStartTime: 0, duration: NaN };

    const video = new FFVideo({});
    video.material = { getDuration: () => 3 };
    scene.addChild(video);

    const video2 = new FFVideo({});
    video2.material = { getDuration: () => 5 };
    scene.addChild(video2);

    const video3 = new FFVideo({ loop: true });
    video3.material = { getDuration: () => 8 }; // 循环的video，不能撑开parent
    scene.addChild(video3);

    scene.annotate();
    expect(scene.duration).toBe(10);
    expect(video.duration).toBe(3);
    expect(video2.duration).toBe(5);
    expect(video3.duration).toBe(10);
  });
});