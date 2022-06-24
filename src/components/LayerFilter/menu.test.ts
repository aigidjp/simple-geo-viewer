import { Menu, getFilteredIdList } from './menu';

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
        id: ['susono-arial'],
        checked: false,
        color: '#44a196',
        download_url: 'https://www.geospatial.jp/ckan/dataset/susono-photo-1',
      },
      {
        title: '裾野市航空写真（令和元年度）',
        type: 'raster',
        lng: 138.903424,
        lat: 35.203515,
        zoom: 12,
        id: ['susono-arial-2020'],
        checked: true,
        color: '#44a196',
        download_url: 'https://www.geospatial.jp/ckan/dataset/susono-photo-1',
      },
    ],
  },
  {
    category: '建物',
    data: [
      {
        title: 'ゼンリン三次元建物形状データ',
        type: 'vector',
        lng: 138.914248,
        lat: 35.047566,
        zoom: 14,
        id: ['shizuoka-building'],
        checked: true,
        color: '#FFFFFF',
      },
    ],
  },
  {
    category: '都市計画',
    data: [
      {
        title: '居住誘導区域 (平成31年3月時点）',
        type: 'polygon',
        lng: 138.9067,
        lat: 35.174,
        zoom: 12,
        id: ['susono-kyojyu-yudo'],
        checked: false,
        color: '#dca050',
        download_url: 'https://www.geospatial.jp/ckan/dataset/yuudoukuiiki',
      },
      {
        title: '都市機能誘導区域-岩波 (平成31年3月時点）',
        type: 'polygon',
        lng: 138.9185,
        lat: 35.2164,
        zoom: 14,
        id: ['susono-toshi-kinou-yudo-iwanami'],
        checked: false,
        color: '#a050dc',
        download_url: 'https://www.geospatial.jp/ckan/dataset/yuudoukuiiki',
      },
    ],
  },
];

describe('test menu.ts', () => {
  test('getFilterdLayer', () => {
    expect(getFilteredIdList(menuJsonMock)).toHaveLength(90);
  });
});
