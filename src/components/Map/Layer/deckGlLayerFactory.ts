import maplibregl from 'maplibre-gl';
import { makeGeoJsonLayers } from '@/components/Map/Layer/geoJsonLayerMaker';
import { makeArcLayers } from '@/components/Map/Layer/arcLayerMaker';
import { makeMvtLayers } from '@/components/Map/Layer/mvtLayerMaker';
import { makeGltfLayers } from '@/components/Map/Layer/gltfLayerMaker';
import { makeTileLayers } from '@/components/Map/Layer/tileLayerMaker';
import { addRenderOption } from '@/components/Map/Layer/renderOption';
import { getFilteredLayerConfig, Config } from '@/components/LayerFilter/config';
import { makeIconLayers } from '@/components/Map/Layer/iconLayerMaker';
import { Dispatch, SetStateAction } from 'react';
import { Deck } from 'deck.gl';
import { getDataList, Menu } from '@/components/LayerFilter/menu';
import { makeTile3DLayers } from '@/components/Map/Layer/tile3DLayerMaker';

export const makeDeckGlLayers = (
  map: maplibregl.Map,
  deck: Deck,
  setTooltipData: Dispatch<SetStateAction<any>>,
  menu: Menu,
  config: Config
) => {
  if (!map || !deck) return;

  const LayerLoader = (layer) => {
    deck.setProps({
      layers: [...deck.props.layers, layer],
    });
  };
  const layerCreator = [
    makeGeoJsonLayers,
    makeArcLayers,
    makeMvtLayers,
    makeGltfLayers,
    makeTileLayers,
    makeIconLayers,
    makeTile3DLayers,
  ];
  // ここでフィルタリングのidを求める
  const layerConfig = getFilteredLayerConfig(menu,config).filter((layer) => {
    // check状態になっているものを取り出し
    return getDataList(menu).some((value) => value.checked && value.id.includes(layer.id));
  });
  layerCreator.forEach((func) => {
    addRenderOption(func(map, layerConfig, true, setTooltipData)).forEach(LayerLoader);
  });

  // 初期表示のレイヤーのロード完了を検知する方法がないため1sec初期表示以外のレイヤーのロードを遅らせる
  setTimeout(() => {
    const layerConfig = getFilteredLayerConfig(menu,config).filter((layer) => {
      return getDataList(menu).some((value) => !value.checked && value.id.includes(layer.id));
    });
    layerCreator.forEach((func) => {
      addRenderOption(func(map, layerConfig, false, setTooltipData)).forEach(LayerLoader);
    });
  }, 1000);
};
