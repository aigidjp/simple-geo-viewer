import type { Map } from 'maplibre-gl';
import { PickInfo } from 'deck.gl';
import { GeoJsonLayer } from '@deck.gl/layers';

import { show } from '@/components/Tooltip/show';
import { Dispatch, SetStateAction } from 'react';

import {
  GeojsonIconLayerConfig,
  GeojsonLayerConfig,
  LayerConfig,
} from '@/components/LayerFilter/config';

/**
 * GeoJsonLayerの作成
 * @param map mapインスタンス
 * @param layerConfig 作成したいlayerのコンフィグ
 * @param init 初期表示レイヤー生成かどうか
 * @param setTooltipData Click時に表示するsetTooltipData関数
 */
export function makeGeoJsonLayers(
  map: Map,
  layerConfig: LayerConfig[],
  init: boolean,
  setTooltipData
) {
  const geoJsonLinePolygonCreator = new GeoJsonLinePolygonCreator(layerConfig, map, setTooltipData);
  const geoJsonIconCreator = new GeoJsonIconLayerCreator(layerConfig, map, setTooltipData);
  const layers = [
    ...geoJsonLinePolygonCreator.makeDeckGlLayers(init),
    ...geoJsonIconCreator.makeDeckGlLayers(init),
  ];
  return layers;
}

class GeoJsonLinePolygonCreator {
  layersType: string = 'geojson';
  private readonly layerConfig: LayerConfig[];
  private readonly map: Map;
  private readonly setTooltipData: Dispatch<SetStateAction<any>>;

  constructor(layerConfig: LayerConfig[], map: Map, setTooltipData) {
    this.layerConfig = layerConfig;
    this.map = map;
    this.setTooltipData = setTooltipData;
  }

  makeDeckGlLayers(init) {
    const targetLayerConfigs = this.extractTargetConfig();

    const result: GeoJsonLayer<any>[] = targetLayerConfigs.map((layerConfig) => {
      const config = this.extractLayerConfig(layerConfig);

      return new GeoJsonLayer({
        data: layerConfig.source,
        visible: init,
        pickable: true,
        autoHighlight: true,
        onClick: this.showToolTip,
        getFillColor: (d: any) => d.properties?.fillColor || [0, 0, 0, 255],
        ...config,
      });
    });

    return result;
  }

  extractLayerConfig = (layerConfig: GeojsonLayerConfig) => {
    const { type, source, ...otherConfig } = layerConfig;
    return otherConfig;
  };

  extractTargetConfig() {
    return this.layerConfig.filter((layerConfig: LayerConfig) => {
      return layerConfig.type === this.layersType;
    }) as GeojsonLayerConfig[];
  }

  showToolTip = (info: PickInfo<any>) => {
    const { coordinate, object } = info;
    if (!coordinate) return;
    if (!object) return;
    show(object, coordinate[0], coordinate[1], this.map, this.setTooltipData);
  };
}

class GeoJsonIconLayerCreator {
  layersType: string = 'geojsonicon';
  private readonly layerConfig: LayerConfig[];
  private readonly map: Map;
  private readonly setTooltipData: Dispatch<SetStateAction<any>>;

  constructor(layerConfig: LayerConfig[], map: Map, setTooltipData) {
    this.layerConfig = layerConfig;
    this.map = map;
    this.setTooltipData = setTooltipData;
  }

  makeDeckGlLayers(init) {
    const targetLayerConfigs = this.extractTargetConfig();

    const result: GeoJsonLayer<any>[] = targetLayerConfigs.map((layerConfig) => {
      const config = this.extractLayerConfig(layerConfig);

      return new GeoJsonLayer({
        data: layerConfig.source,
        visible: init,
        pickable: true,
        autoHighlight: true,
        onClick: this.showToolTip,
        pointType: 'icon',
        getIcon: (_) => ({
          url: layerConfig.icon.url,
          width: layerConfig.icon.width,
          height: layerConfig.icon.height,
          anchorY: layerConfig.icon.anchorY,
          mask: false,
        }),
        ...config,
      });
    });

    return result;
  }

  extractLayerConfig = (layerConfig: GeojsonIconLayerConfig) => {
    const { type, source, ...otherConfig } = layerConfig;
    return otherConfig;
  };

  extractTargetConfig() {
    return this.layerConfig.filter((layerConfig: LayerConfig) => {
      return layerConfig.type === this.layersType;
    }) as GeojsonIconLayerConfig[];
  }

  showToolTip = (info: PickInfo<any>) => {
    const { coordinate, object } = info;
    if (!coordinate) return;
    if (!object) return;
    show(object, coordinate[0], coordinate[1], this.map, this.setTooltipData);
  };
}
