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

const susonoBuilding = (layer: any) => {
  const getFillColor = () => [200, 200, 200, 200];
  const getLineColor = () => [200, 200, 200, 200];
  const getElevation = (d: any) => {
    if ('bui_floor' in d.properties) {
      if (d.properties.bui_floor === 0) {
        return 2 * 3;
      } else {
        return d.properties.bui_floor * 3;
      }
    }
    return 2 * 3;
  };

  return layer.clone({
    extruded: true,
    getFillColor,
    getLineColor,
    getElevation,
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

    if (layer.id === 'shizuoka-building') {
      const newLayer: any = susonoBuilding(layer);
      addedPropsLayers.push(newLayer);
      continue;
    }
    //条件に一致しなければlayerに変更を加えずに配列に追加
    addedPropsLayers.push(layer);
  }

  return addedPropsLayers;
};
