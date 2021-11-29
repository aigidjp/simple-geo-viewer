import maplibregl from 'maplibre-gl';
import { PickInfo, RGBAColor } from 'deck.gl';
import { GeoJsonLayer } from '@deck.gl/layers';
import { show } from '@/components/Tooltip/show';
import { Dispatch, SetStateAction } from 'react';

type geoJsonLayerConfig = {
  id: string;
  type: string;
  source: string;
  visible: boolean;
  fillColor?: RGBAColor;
  lineColor?: RGBAColor;
  opacity?: number;
};

/**
 * GeoJsonLayerの作成
 * @param map mapインスタンス
 * @param layerConfig 作成したいlayerのコンフィグ
 * @param init 初期表示レイヤー生成かどうか
 * @param setTooltipData Click時に表示するsetTooltipData関数
 */
export function makeGeoJsonLayers(map: maplibregl.Map, layerConfig, init: boolean, setTooltipData) {
  const geoJsonCreator = new GeoJsonLayerCreator(layerConfig, map, setTooltipData);
  return geoJsonCreator.makeDeckGlLayers(init);
}

class GeoJsonLayerCreator {
  private readonly map: maplibregl.Map;
  private readonly layerConfig: any[];
  private readonly layersType: string = 'geojson';
  private readonly setTooltipData: Dispatch<SetStateAction<any>>;

  constructor(layerConfig: any[], map: maplibregl.Map, setTooltipData) {
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
        ...config,
      });
    });

    return result;
  }

  private extractLayerConfig = (layerConfig) => {
    const { type, source, ...otherConfig } = layerConfig;
    return otherConfig;
  };

  private extractTargetConfig() {
    return this.layerConfig.filter((layer: geoJsonLayerConfig) => {
      return layer.type === this.layersType;
    });
  }

  private showToolTip = (info: PickInfo<any>) => {
    // @ts-ignore
    const { coordinate, object } = info;
    if (!coordinate) return;
    if (!object) return;
    show(object, coordinate[0], coordinate[1], this.map, this.setTooltipData);
  };
}
