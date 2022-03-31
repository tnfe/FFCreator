const FFClip = require('@/core/clip');
const FFSpine = require('@/node/spine');

describe('time/clip', () => {
  test('clip: default start/duration/end ', () => {
    const clip = new FFClip({});
    clip.parent = { startTime: 0, duration: 10 }
    expect(clip.startTime).toBe(0);
    expect(clip.duration).toBe(10);
    expect(clip.endTime).toBe(10);

    clip.prevSibling = { endTime: 3 };
    expect(clip.startTime).toBe(3);
    expect(clip.duration).toBe(7);
    expect(clip.endTime).toBe(10);
  });

  test('clip: absStartTime/absEndTime offset by parent ', () => {
    const clip = new FFClip({ start: 3, duration: 3 });
    const spine = new FFSpine({});
    spine.addChild(clip);

    const subClip = new FFClip({ duration: 5 });
    clip.addChild(subClip);

    const sub2Clip = new FFClip({ duration: 10 });
    subClip.addChild(sub2Clip);

    spine.annotate();
    expect(spine.duration).toBe(6);
    expect(clip.absStartTime).toBe(3);
    expect(subClip.absStartTime).toBe(3);
    expect(sub2Clip.absStartTime).toBe(3);
  });

  test('clip: start change', () => {
    let clip = new FFClip({ start: 1});
    clip.parent = { startTime: 0, duration: 10 }
    expect(clip.startTime).toBe(1);
    expect(clip.duration).toBe(9);
    expect(clip.endTime).toBe(10);

    clip.conf.start = -3;
    expect(clip.startTime).toBe(7);
    expect(clip.duration).toBe(3);
    expect(clip.endTime).toBe(10);

    clip.conf.start = 7;
    expect(clip.startTime).toBe(7);
    expect(clip.duration).toBe(3);
    expect(clip.endTime).toBe(10);

    clip.conf.start = 11;
    expect(clip.startTime).toBe(11);
    expect(clip.duration).toBe(1);
    expect(clip.endTime).toBe(12);

    clip.conf.start = "100%";
    expect(clip.startTime).toBe(10);
    expect(clip.duration).toBe(1);
    expect(clip.endTime).toBe(11);

    clip.conf.start = "45%";
    expect(clip.startTime).toBe(4.5);
    expect(clip.duration).toBe(5.5);
    expect(clip.endTime).toBe(10);

    clip.conf.start = "-45%";
    expect(clip.startTime).toBe(5.5);
    expect(clip.duration).toBe(4.5);
    expect(clip.endTime).toBe(10);
  });

  test('clip: duration change', () => {
    const clip = new FFClip({ duration: 3});
    clip.parent = { startTime: 0, duration: 10 }
    expect(clip.startTime).toBe(0);
    expect(clip.duration).toBe(3);
    expect(clip.endTime).toBe(3);

    clip.conf.duration = 13;
    expect(clip.duration).toBe(13);
    expect(clip.endTime).toBe(13);

    clip.conf.duration = "150%";
    expect(clip.duration).toBe(15);
    expect(clip.endTime).toBe(15);
  });

  test('clip: end change', () => {
    const clip = new FFClip({ end: 3});
    clip.parent = { startTime: 0, duration: 10 }
    expect(clip.startTime).toBe(0);
    expect(clip.duration).toBe(3);
    expect(clip.endTime).toBe(3);

    clip.conf.end = 13;
    expect(clip.duration).toBe(13);
    expect(clip.endTime).toBe(13);

    clip.conf.end = "150%";
    expect(clip.duration).toBe(15);
    expect(clip.endTime).toBe(15);

    clip.conf.end = "-3";
    expect(clip.duration).toBe(7);
    expect(clip.endTime).toBe(7);

    clip.conf.end = "-60%";
    expect(clip.duration).toBe(4);
    expect(clip.endTime).toBe(4);

    // use end only
    clip.conf.duration = "60%";
    clip.conf.end = "-60%";
    expect(clip.duration).toBe(4);
    expect(clip.endTime).toBe(4);
  });
});
