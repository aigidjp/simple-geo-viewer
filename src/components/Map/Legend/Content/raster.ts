import { rasterLegendObjList } from '@/components/Map/Legend/layerIds';

type RasterLegendObj = {
  id: string;
  src: string;
};

const getRasterLegendObj = (id: string): RasterLegendObj | undefined => {
  if (!rasterLegendObjList) {
    return;
  }
  return rasterLegendObjList.find((obj: RasterLegendObj) => id === obj.id);
};

export const getRasterLegendSrc = (id: string) => {
  const rasterLegendObj = getRasterLegendObj(id);
  if (rasterLegendObj) {
    return rasterLegendObj.src;
  }
};
