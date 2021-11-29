import { getColorParamList } from '@/components/Map/Legend/colorParamList';

const getColorParam = (id: string, param: number | string) => {
  const colorParamList = getColorParamList(id, param);
  const colorParam = colorParamList.find((colorParam) => colorParam.param);
  return colorParam?.color;
};

const gyoseiTokyo = (layer: any) => {
  const getFillColor = (d: any) => getColorParam(layer.id, d.properties['N03_004']);

  return layer.clone({
    getFillColor,
  });
};

export const addRenderOption = (layers: any[]) => {
  const addedPropsLayers: any[] = [];

  for (const layer of layers) {
    if (layer.id === 'gyosei-tokyo') {
      const newLayer: any = gyoseiTokyo(layer);
      addedPropsLayers.push(newLayer);
      continue;
    }

    //条件に一致しなければlayerに変更を加えずに配列に追加
    addedPropsLayers.push(layer);
  }

  return addedPropsLayers;
};
