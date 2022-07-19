import { Map } from 'maplibre-gl';
import { PickInfo, RGBAColor } from 'deck.gl';
import { ArcLayer } from '@deck.gl/layers';

import { show } from '@/components/Tooltip/show';
import { Dispatch, SetStateAction } from 'react';

type ArcLayerConfig = {
  id: string;
  type: string;
  source: string;
  visible: boolean;
  fillColor?: RGBAColor;
  lineColor?: RGBAColor;
  opacity?: number;
};

/**
 * makeArcLayersの作成
 * @param map mapインスタンス
 * @param layerConfig 作成したいlayerのコンフィグ
 * @param init 初期表示レイヤー生成かどうか
 * @param setTooltipData Click時に表示するsetTooltipData関数
 */
export function makeArcLayers(map: Map, layerConfig, init: boolean, setTooltipData) {
  const ArcCreator = new ArcLayerCreator(layerConfig, map, setTooltipData);
  return ArcCreator.makeDeckGlLayers(init);
}

class ArcLayerCreator {
  private layersType: string = 'Arc';
  private readonly layerConfig: any[];
  private readonly map: Map;
  private readonly setTooltipData: Dispatch<SetStateAction<any>>;

  constructor(layerConfig: any[], map: Map, setTooltipData) {
    this.layerConfig = layerConfig;
    this.map = map;
    this.setTooltipData = setTooltipData;
  }

  makeDeckGlLayers(init) {
    const targetLayerConfigs = this.extractTargetConfig();

    const result: ArcLayer<any>[] = targetLayerConfigs.map((layerConfig) => {
      const config = this.extractLayerConfig(layerConfig);
      return new ArcLayer({
        id: layerConfig.id,
        visible: init,
        pickable: true,
        data: layerConfig.data,
        getWidth: layerConfig.width,
        getSourcePosition: (d) => d.from.coordinates,
        getTargetPosition: (d) => d.to.coordinates,
        getSourceColor: layerConfig.sourceColor,
        getTargetColor: layerConfig.targetColor,
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
    return this.layerConfig.filter((layer: ArcLayerConfig) => {
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
