import { Map } from 'maplibre-gl';
import { TileLayer } from '@deck.gl/geo-layers';
import { BitmapLayer } from '@deck.gl/layers';
import { Dispatch, SetStateAction } from 'react';

type tileLayerConfig = {
  id: string;
  type: string;
  source: string;
  visible: boolean;
  minZoom: number;
  maxZoom: number;
};

/**
 * TileLayerの作成
 * @param map mapインスタンス
 * @param layerConfig 作成したいlayerのコンフィグ
 * @param init 初期表示レイヤー生成かどうか
 * @param setTooltipData  Click時に表示するsetTooltipData関数
 */
export function makeTileLayers(map: Map, layerConfig, init: boolean, setTooltipData) {
  const tileCreator = new tileLayerCreator(layerConfig, map, setTooltipData);
  return tileCreator.makeDeckGlLayers(init);
}

class tileLayerCreator {
  private readonly map: Map;
  private readonly layerConfig: any[];
  private readonly layersType: string = 'raster';
  private readonly setTooltipData: Dispatch<SetStateAction<any>>;

  constructor(layerConfig: any[], map: Map, setTooltipData) {
    this.layerConfig = layerConfig;
    this.map = map;
    this.setTooltipData = setTooltipData;
  }

  makeDeckGlLayers(init) {
    const targetLayerConfigs = this.extractTargetConfig();

    const result: TileLayer<any>[] = targetLayerConfigs.map((layerConfig) => {
      const config = this.extractLayerConfig(layerConfig);

      return new TileLayer({
        data: layerConfig.source,
        visible: init,
        tileSize: 256,

        renderSubLayers: (props) => {
          const {
            bbox: { west, south, east, north },
          } = props.tile;

          return new BitmapLayer(props, {
            data: null,
            image: props.data,
            bounds: [west, south, east, north],
          });
        },

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
    return this.layerConfig.filter((layer: tileLayerConfig) => {
      return layer.type === this.layersType;
    });
  }
}
