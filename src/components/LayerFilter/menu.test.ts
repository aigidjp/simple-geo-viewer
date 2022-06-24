import {
  Menu,
  getFilteredIdList,
  filterIds,
  getDataList,
  getDataById,
  getFilteredMenu,
} from './menu';

const menuJsonMock: Menu = [
  {
    category: '裾野市航空写真',
    data: [
      {
        title: '裾野市航空写真（平成28年度）',
        type: 'raster',
        lng: 138.903424,
        lat: 35.203515,
        zoom: 14,
        id: ['susono-arial', 'sample'],
        checked: false,
        color: '#44a196',
        download_url: 'https://www.geospatial.jp/ckan/dataset/susono-photo-1',
      },
      {
        title: 'テストデータ(国土数値情報（警察署）ー沖縄県ーIcon)',
        type: 'icon',
        lng: 127.255761,
        lat: 26.047428,
        zoom: 14,
        id: ['susono-arial'],
        checked: true,
        icon: 'images/shelter_yellow.png',
        download_url: 'https://www.geospatial.jp/ckan/dataset/okinawa',
      },
    ],
  },
  {
    category: '建物',
    open: false,
    data: [
      {
        title: 'ゼンリン三次元建物形状データ',
        type: 'vector',
        lng: 138.914248,
        lat: 35.047566,
        zoom: 14,
        id: ['shizuoka-building', 'sample'],
        checked: true,
        color: '#FFFFFF',
      },
    ],
  },
  {
    category: 'DRMテスト',
    url: 'https://www.geospatial.jp/ckan/dataset/okinawa',
    open: true,
    data: [
      {
        title: 'DRMリンク交通量',
        type: 'line',
        lng: 139.87948,
        lat: 42.66909,
        zoom: 14,
        id: ['drm_test'],
        checked: false,
        color: '#333333',
      },
    ],
  },
];

describe('test menu.ts', () => {
  test('getFilterdIdList', () => {
    expect(getFilteredIdList(menuJsonMock)).toHaveLength(6);
  });

  test('filterIds', () => {
    // 引数で渡した文字列群のうち、menu -> data[] -> data.idに含まれる文字列群だけが返る
    expect(filterIds(menuJsonMock, ['drm_test', 'noexist', 'shizuoka-building'])).toHaveLength(2);
    expect(filterIds(menuJsonMock, ['noexist1', 'noexist2'])).toHaveLength(0); // 存在しなければ空配列
    expect(filterIds(menuJsonMock, [])).toHaveLength(0);
  });

  test('getDataList', () => {
    expect(getDataList(menuJsonMock)).toHaveLength(4);
  });

  test('getDataById', () => {
    // 戻り値の型はData
    expect(getDataById(menuJsonMock, ['drm_test']) instanceof Object).toBeTruthy();
    expect(getDataById(menuJsonMock, ['drm_test']).title).toBe('DRMリンク交通量');

    // 該当しなければ・空配列ならundefined
    expect(getDataById(menuJsonMock, ['noexist'])).toBeUndefined();
    expect(getDataById(menuJsonMock, [])).toBeUndefined();

    // 複数該当する場合Menuにおける手前が優先される
    expect(getDataById(menuJsonMock, ['susono-arial']).title).toBe('裾野市航空写真（平成28年度）');

    // 引数は配列だが先頭しか考慮されない
    expect(getDataById(menuJsonMock, ['drm_test', 'shizuoka-building']).title).toBe('DRMリンク交通量'); // prettier-ignore
    expect(getDataById(menuJsonMock, ['noexist', 'drm_test'])).toBeUndefined();

    // 検索対象であるdata.idは配列だがその先頭しか考慮されない
    expect(getDataById(menuJsonMock, ['sample'])).toBeUndefined(); // id=[somestr, 'sample1']
  });

  test('getFilteredMenu', () => {
    expect(getFilteredMenu(menuJsonMock, 'データ')).toHaveLength(2);
    expect(getFilteredMenu(menuJsonMock, '')).toHaveLength(3); // 空白なら全件返る
    expect(getFilteredMenu(menuJsonMock, '(')).toHaveLength(1); // 要エスケープ文字
  });
});
