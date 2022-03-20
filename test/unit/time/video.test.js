const FFVideo = require('@/node/video');
const FFClip = require('@/core/clip');

describe('time/video', () => {
  test('video: default start/duration/end with loop default false', () => {
    const video = new FFVideo({});
    video.material = { length: 3 };
    video.parent = { start: 0, duration: 10 }
    expect(video.start).toBe(0);
    expect(video.duration).toBe(3);
    expect(video.end).toBe(3);

    video.material.length = 13;
    expect(video.duration).toBe(13);
    expect(video.end).toBe(13);

    video.prevSibling = { end: 5 };
    expect(video.start).toBe(5);
    expect(video.duration).toBe(13);
    expect(video.end).toBe(18);

    video.conf.start = 6;
    expect(video.start).toBe(6);
    expect(video.duration).toBe(13);
    expect(video.end).toBe(19);

    video.conf.duration = 5;
    expect(video.start).toBe(6);
    expect(video.duration).toBe(5);
    expect(video.end).toBe(11);
  });

  test('video: default start/duration/end with loop set true', () => {
    const video = new FFVideo({ loop: true });
    video.material = { length: 3 };
    video.parent = { start: 0, duration: 10 }
    expect(video.start).toBe(0);
    expect(video.duration).toBe(10);
    expect(video.end).toBe(10);

    video.material.length = 13;
    expect(video.duration).toBe(10);
    expect(video.end).toBe(10);

    video.prevSibling = { end: 6 };
    expect(video.start).toBe(6);
    expect(video.duration).toBe(4);
    expect(video.end).toBe(10);

    video.conf.start = 3;
    expect(video.start).toBe(3);
    expect(video.duration).toBe(7);
    expect(video.end).toBe(10);

    video.conf.duration = 5;
    expect(video.start).toBe(3);
    expect(video.duration).toBe(5);
    expect(video.end).toBe(8);
  });

  test('video: set duration over material length', () => {
    const video = new FFVideo({ duration: 10 });
    video.material = { length: 6 };
    video.parent = { start: 0, duration: NaN };
    expect(video.duration).toBe(10);

    const clip = new FFClip({ start: -4 });
    video.addChild(clip);
    expect(clip.start).toBe(6);
    expect(clip.duration).toBe(4);
    expect(clip.end).toBe(10);
  });
});