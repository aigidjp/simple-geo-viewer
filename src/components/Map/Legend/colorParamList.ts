const gyoseiTokyo = (param?: string) => {
  return [
    {
      param: param === '千代田区',
      name: '千代田区',
      color: [255, 0, 0, 150],
    },
    {
      param: param !== '千代田区',
      name: 'その他',
      color: [100, 200, 255, 150],
    },
  ];
};

export const getColorParamList = (id: string, param?: number | string) => {
  if (id === 'gyosei-tokyo' && (typeof param === 'string' || typeof param === 'undefined')) {
    return gyoseiTokyo(param);
  } else return [];
};
