const FFVideo = require('@/node/video');
const FFClip = require('@/core/clip');

describe('time/video', () => {
  test('video: default start/duration/end with loop default false', () => {
    const video = new FFVideo({});
    video.material = { getDuration: () => 3 };
    video.parent = { startTime: 0, duration: 10 }
    expect(video.startTime).toBe(0);
    expect(video.duration).toBe(3);
    expect(video.endTime).toBe(3);

    video.material = { getDuration: () => 13 };
    expect(video.duration).toBe(13);
    expect(video.endTime).toBe(13);

    video.prevSibling = { endTime: 5 };
    expect(video.startTime).toBe(5);
    expect(video.duration).toBe(13);
    expect(video.endTime).toBe(18);

    video.conf.start = 6;
    expect(video.startTime).toBe(6);
    expect(video.duration).toBe(13);
    expect(video.endTime).toBe(19);

    video.conf.duration = 5;
    expect(video.startTime).toBe(6);
    expect(video.duration).toBe(5);
    expect(video.endTime).toBe(11);
  });

  test('video: default start/duration/end with loop set true', () => {
    const video = new FFVideo({ loop: true });
    video.material = { getDuration: () => 3 };
    video.parent = { startTime: 0, duration: 10 }
    expect(video.startTime).toBe(0);
    expect(video.duration).toBe(10);
    expect(video.endTime).toBe(10);

    video.material.length = 13;
    expect(video.duration).toBe(10);
    expect(video.endTime).toBe(10);

    video.prevSibling = { endTime: 6 };
    expect(video.startTime).toBe(6);
    expect(video.duration).toBe(4);
    expect(video.endTime).toBe(10);

    video.conf.start = 3;
    expect(video.startTime).toBe(3);
    expect(video.duration).toBe(7);
    expect(video.endTime).toBe(10);

    video.conf.duration = 5;
    expect(video.startTime).toBe(3);
    expect(video.duration).toBe(5);
    expect(video.endTime).toBe(8);
  });

  test('video: set duration over material length', () => {
    const video = new FFVideo({ duration: 10 });
    video.material = { getDuration: () => 6 };
    video.parent = { startTime: 0, duration: NaN };
    expect(video.duration).toBe(10);

    const clip = new FFClip({ start: -4 });
    video.addChild(clip);
    expect(clip.startTime).toBe(6);
    expect(clip.duration).toBe(4);
    expect(clip.endTime).toBe(10);
  });
});