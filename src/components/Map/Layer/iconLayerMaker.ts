import { Map } from 'maplibre-gl';
import { PickInfo } from 'deck.gl';
import { IconLayer } from '@deck.gl/layers';
import { show } from '@/components/Tooltip/show';
import { Dispatch, SetStateAction } from 'react';

type iconLayerConfig = {
  id: string;
  type: string;
  source: string;
  visible: boolean;
};

/**
 * IconLayerの作成
 * @param map mapインスタンス
 * @param layerConfig 作成したいlayerのコンフィグ
 * @param init 初期表示レイヤー生成かどうか
 * @param setTooltipData Click時に表示するsetTooltipData関数
 */
export function makeIconLayers(map: Map, layerConfig, init: boolean, setTooltipData) {
  const iconLayerCreator = new IconLayerCreator(layerConfig, map, setTooltipData);
  return iconLayerCreator.makeDeckGlLayers(init);
}

class IconLayerCreator {
  private readonly map: Map;
  private readonly layerConfig: any[];
  private readonly layersType: string = 'icon';
  private readonly setTooltipData: Dispatch<SetStateAction<any>>;

  constructor(layerConfig: any[], map: Map, setTooltipData) {
    this.layerConfig = layerConfig;
    this.map = map;
    this.setTooltipData = setTooltipData;
  }

  /**
   * makeDeckGlLayers
   * DeckGLのレイヤー作成
   * 初期表示レイヤーの場合visibilityをtrueの状態で返す
   * @param init 初期表示レイヤーの生成であるか
   */
  makeDeckGlLayers(init) {
    const targetLayerConfigs = this.extractTargetConfig();

    const result: IconLayer<any>[] = targetLayerConfigs.map((layerConfig) => {
      const config = this.extractLayerConfig(layerConfig);

      return new IconLayer({
        id: layerConfig.id,
        data: [layerConfig],
        visible: init,
        pickable: true,
        getIcon: (_) => ({
          url: layerConfig.source,
          width: 100,
          height: 150,
          anchorY: 128,
          mask: false,
        }),
        sizeScale: 8,
        getSize: 5,
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

  /**
   * layersTypeに適合するレイヤーコンフィグを取り出し
   * @private
   */
  private extractTargetConfig() {
    return this.layerConfig.filter((layer: iconLayerConfig) => {
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
