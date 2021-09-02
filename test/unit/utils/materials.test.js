const Materials = require('@/utils/materials');

const materials = new Materials();

describe('utils/materials', () => {
  test('getSourceRect: Get the width and height of the material ', () => {
    const result = materials.getSourceRect(10, 20).toString();
    expect(result).toEqual('Rect:: 0_0_10_20');
  });
  test('getDuration: Obtain duration based on movie information ', () => {
    const result = materials.getDuration();
    expect(result).toBe(0);
  });
  test('getFrame: et the path of a certain frame in the Materials ', () => {
    const result = materials.getFrame();
    expect(result).toBe('');
  });
  test('clone: Return a cloned Materials object ', () => {
    const result = materials.clone();
    expect(result).toBeInstanceOf(Materials);
  });
  test('destroy', () => {
    materials.destroy();
    expect(materials.info).toBeNull();
    expect(materials.path).toBe('');
    expect(materials.length).toBe(0);
  });
  test('toString', () => {
    const result = materials.toString();
    expect(result).toStrictEqual(expect.stringContaining('images:0-'));
  });
});
