import maplibregl from 'maplibre-gl';
import { makeGeoJsonLayers } from '@/components/Map/Layer/geoJsonLayerMaker';
import { makeMvtLayers } from '@/components/Map/Layer/mvtLayerMaker';
import { makeGltfLayers } from '@/components/Map/Layer/gltfLayerMaker';
import { makeTileLayers } from '@/components/Map/Layer/tileLayerMaker';
import { addRenderOption } from '@/components/Map/Layer/renderOption';
import { getFilteredLayerConfig } from '@/components/LayerFilter/config';
import { makeIconLayers } from '@/components/Map/Layer/iconLayerMaker';
import { Dispatch, SetStateAction } from 'react';
import { MapboxLayer } from '@deck.gl/mapbox';
import { Deck } from 'deck.gl';
import { getDataList } from '@/components/LayerFilter/menu';

export const makeDeckGlLayers = (
  map: maplibregl.Map,
  deck: Deck,
  setTooltipData: Dispatch<SetStateAction<any>>
) => {
  if (!map || !deck) return;

  const LayerLoader = (layer) => {
    const mapboxLayer = new MapboxLayer({ id: layer.id, deck });
    map.addLayer(mapboxLayer);

    deck.setProps({
      layers: [...deck.props.layers, layer],
    });
  };
  const layerCreator = [
    makeGeoJsonLayers,
    makeMvtLayers,
    makeGltfLayers,
    makeTileLayers,
    makeIconLayers,
  ];
  // ここでフィルタリングのidを求める
  const layerConfig = getFilteredLayerConfig().filter((layer) => {
    // check状態になっているものを取り出し
    return getDataList().some((value) => value.checked && value.id.includes(layer.id));
  });
  layerCreator.forEach((func) => {
    addRenderOption(func(map, layerConfig, true, setTooltipData)).forEach(LayerLoader);
  });

  // 初期表示のレイヤーのロード完了を検知する方法がないため1sec初期表示以外のレイヤーのロードを遅らせる
  setTimeout(() => {
    const layerConfig = getFilteredLayerConfig().filter((layer) => {
      return getDataList().some((value) => !value.checked && value.id.includes(layer.id));
    });
    layerCreator.forEach((func) => {
      addRenderOption(func(map, layerConfig, false, setTooltipData)).forEach(LayerLoader);
    });
  }, 1000);
};
