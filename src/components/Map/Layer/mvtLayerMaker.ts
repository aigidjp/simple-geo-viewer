import maplibregl from 'maplibre-gl';
import { PickInfo } from 'deck.gl';
import { MVTLayer } from '@deck.gl/geo-layers';
import { show } from '@/components/Tooltip/show';
import { Dispatch, SetStateAction } from 'react';

type mvtLayerConfig = {
  id: string;
  type: string;
  source: string;
  visible: boolean;
  opacity?: number;
  minZoom: number;
  maxZoom: number;
  color: number[];
  highlightColor: number[];
};

/**
 * mvtLayerの作成
 * @param map mapインスタンス
 * @param layerConfig 作成したいlayerのコンフィグ
 * @param init 初期表示レイヤー生成かどうか
 * @param setTooltipData Click時に表示するsetTooltipData関数
 */
export function makeMvtLayers(map: maplibregl.Map, layerConfig, init: boolean, setTooltipData) {
  const mvtCreator = new MvtLayerCreator(layerConfig, map, setTooltipData);
  return mvtCreator.makeDeckGlLayers(init);
}

class MvtLayerCreator {
  private readonly map: maplibregl.Map;
  private readonly layerConfig: any[];
  private readonly layersType: string = 'mvt';
  private readonly setTooltipData: Dispatch<SetStateAction<any>>;

  constructor(layerConfig: any[], map: maplibregl.Map, setTooltipData) {
    this.layerConfig = layerConfig;
    this.map = map;
    this.setTooltipData = setTooltipData;
  }

  makeDeckGlLayers(init) {
    const targetLayerConfigs = this.extractTargetConfig();

    const result: MVTLayer<any>[] = [];

    for (const layerConfig of targetLayerConfigs) {
      const config = this.extractLayerConfig(layerConfig);

      result.push(
        new MVTLayer({
          data: layerConfig.source,
          visible: init,
          pickable: true,
          autoHighlight: true,
          onClick: this.showToolTip,
          ...config,
        })
      );
    }

    return result;
  }

  private extractLayerConfig = (layerConfig) => {
    const { type, source, ...otherConfig } = layerConfig;
    return otherConfig;
  };

  /**
   * layersTypeに適合するレイヤーコンフィグを取り出し
   * @private
   */
  private extractTargetConfig() {
    return this.layerConfig.filter((layer: mvtLayerConfig) => {
      return layer.type === this.layersType;
    });
  }

  private showToolTip = (info: PickInfo<any>) => {
    const { coordinate, object } = info;
    if (!coordinate) return;
    if (!object) return;
    show(object, coordinate[0], coordinate[1], this.map, this.setTooltipData);
  };
}
