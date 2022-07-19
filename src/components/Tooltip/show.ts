import { Map, Marker } from 'maplibre-gl';
import { Dispatch, SetStateAction } from 'react';
import { getPropertiesObj } from '@/components/Tooltip/util';

let pointMarker: Marker | null = null;

export const removeExistingTooltip = (setTooltip) => {
  if (pointMarker) pointMarker.remove();
  setTooltip({
    tooltip: null,
  });
};

const makeMarker = (lng: number, lat: number, map: Map) => {
  //marker追加
  pointMarker = new Marker().setLngLat([lng, lat]).addTo(map);
};

export const show = (
  object: any,
  lng: number,
  lat: number,
  map: any,
  setTooltipData: Dispatch<SetStateAction<any>>
) => {
  //すでに表示されているマーカーとポップアップを削除
  removeExistingTooltip(setTooltipData);
  //データが渡されていなければ何もしない
  if (!object) return;
  makeMarker(lng, lat, map);
  setTooltipData((prevState) => {
    return {
      ...prevState,
      tooltip: getPropertiesObj(object),
    };
  });
};
