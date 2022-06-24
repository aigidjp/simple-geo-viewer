import * as menu from './menu';

describe('test menu.ts', () => {
  // 今のところ何の意味もないテスト
  test('test functions', () => {
    expect(menu.getMenu()).toHaveLength(24);
  });

  test('getFilterdLayer', () => {
    expect(menu.getFilteredIdList()).toHaveLength(90);
  });
});
