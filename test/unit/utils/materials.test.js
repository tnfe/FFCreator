const Material = require('@/material/material');
const material = new Material({ type: 'image', src: 'path', ss: '10', to: '20' });

describe('material/material', () => {
  test('type and path ', () => {
    expect(material.path).toEqual('path');
    expect(material.type).toEqual('image');
  });
  test('getSourceRect: Get the width and height of the material ', () => {
    material.info = null;
    expect(material.getSourceRect(10, 20).toString()).toEqual('Rect:: 0_0_10_20');
    material.info = { width: 200, height: 100 }; // 等比例截取
    expect(material.getSourceRect(10, 20).toString()).toEqual('Rect:: 75_0_50_100');
  });
  test('parse time numer', () => {
    expect(material.parseTimeNumber('')).toBe(0);
    expect(material.parseTimeNumber('n')).toBe(-1);
    expect(material.parseTimeNumber('1')).toBe(1);
    expect(material.parseTimeNumber('01:01')).toBe(61);
    expect(material.parseTimeNumber('01:01:05.5')).toBe(3665.5);
  });
  test('get Offset ', () => {
    // container duration (15s) greater than material len (10s)
    material.duration = 15;
    expect(material.getStartOffset()).toBe(10);
    expect(material.getEndOffset()).toBe(20);
    // container duration (8s) less than material len (10s)
    material.duration = 8;
    expect(material.getEndOffset()).toBe(18);
  });
  test('getDuration: Obtain duration based on movie information ', () => {
    material.length = 100; // material len
    material.duration = 8; // container duration
    expect(material.getDuration()).toBe(8);
    material.duration = 15;
    expect(material.getDuration()).toBe(10);
    material.length = 5;
    expect(material.getDuration()).toBe(5);
  });
  test('destroy', () => {
    material.destroy();
    expect(material.info).toBeNull();
    expect(material.path).toBe('');
    expect(material.length).toBe(0);
  });
  test('toString', () => {
    const result = material.toString();
    expect(result).toStrictEqual(expect.stringContaining('image:-length:0'));
  });
});
