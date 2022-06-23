import maplibregl from 'maplibre-gl';
import { PickInfo } from 'deck.gl';

import { show } from '@/components/Tooltip/show';
import { Dispatch, SetStateAction } from 'react';

let Mapbox3DTiles = null;

if (typeof window !== 'undefined') {
  import('./Mapbox3DTiles').then((module) => {
    Mapbox3DTiles = module.default;
  });
}

type pointCloudLayerConfig = {
    id: string;
    type: string;
    source: string;
};

/**
 * makeArcLayersの作成
 * @param map mapインスタンス
 * @param layerConfig 作成したいlayerのコンフィグ
 * @param init 初期表示レイヤー生成かどうか
 * @param setTooltipData Click時に表示するsetTooltipData関数
 */
 export function makePointCloudLayers(
    map: maplibregl.Map,
    layerConfig,
    init: boolean,
    setTooltipData
  ) {
    const PointCloudCreator = new PointCloudLayerCreator(layerConfig, map, setTooltipData);
    return PointCloudCreator.makeDeckGlLayers(init);
}

class PointCloudLayerCreator {
    private layersType: string = '3dtiles';
    private zshift: number = 0;
    private readonly layerConfig: any[];
    private readonly map: maplibregl.Map;
    private readonly setTooltipData: Dispatch<SetStateAction<any>>;
    
    constructor(layerConfig: any[], map: maplibregl.Map, setTooltipData) {
      this.layerConfig = layerConfig;
      this.map = map;
      this.setTooltipData = setTooltipData;
    }
  
    makeDeckGlLayers(init) {
       const targetLayerConfigs = this.extractTargetConfig();
       
       const result: Mapbox3DTiles.Layer<any>[] = targetLayerConfigs.map((layerConfig) => {
          const config = this.extractLayerConfig(layerConfig);
            return new Mapbox3DTiles.Layer({
               id: layerConfig.id,
               url: layerConfig.source,
               pointsize: layerConfig.pointsize,
               zshift: this.zshift,
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
      return this.layerConfig.filter((layer: pointCloudLayerConfig) => {
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