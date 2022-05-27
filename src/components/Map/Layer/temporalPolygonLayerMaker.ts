import maplibregl from 'maplibre-gl';
import { GeoJsonLayer } from '@deck.gl/layers';
import { PickInfo, RGBAColor } from 'deck.gl';
import { getDataList } from '@/components/LayerFilter/menu';

type geoJsonLayerConfig = {
  id: string;
  type: string;
  source: string;
  visible: boolean;
  fillColor?: RGBAColor;
  lineColor?: RGBAColor;
  opacity?: number;
};

export function makeTemporalPolygonLayers(
  map: maplibregl.Map,
  layerConfig,
  init: boolean,
  timestamp: number,
  checkedLayerTitleList: string[] = []
) {
  const layer = new TemporalPolygonLayerCreator(layerConfig, map, checkedLayerTitleList);
  return layer.makeDeckGlLayers(init, timestamp);
}

class TemporalPolygonLayerCreator {
  private readonly map: maplibregl.Map;
  private readonly layerConfig: any[];
  private readonly layersType: string = 'temporal_polygon';
  private readonly checkedLayerTitleList: string[];

  constructor(layerConfig: any[], map: maplibregl.Map, checkedLayerTitleList: string[] = []) {
    this.layerConfig = layerConfig;
    this.map = map;
    this.checkedLayerTitleList = checkedLayerTitleList;
  }

  isChecked(layerConfig) {
    // レイヤーがチェックされているか判定
    const dataList = getDataList();
    let flag = false;
    for (const data of dataList) {
      if (data.id.includes(layerConfig.id)) {
        if (this.checkedLayerTitleList.includes(data.title)) flag = true;
      }
    }
    return flag;
  }

  makeDeckGlLayers(init, timestamp: number) {
    const targetLayerConfigs = this.extractTargetConfig();
    const result: GeoJsonLayer<any>[] = targetLayerConfigs.map((layerConfig) => {
      const gLayer = new GeoJsonLayer({
        id: layerConfig.id,
        data: layerConfig.source,
        visible: init && this.isChecked(layerConfig),
        extruded: true,
        getLineColor: () => [0, 0, 0, 0],
        getFillColor: (d: any) => {
          const normalizedTimestamp = timestamp - (timestamp % d.properties.step);
          const temporalValue: number =
            d.properties[String(normalizedTimestamp).padStart(2, '0')] || 0;
          const normalizedValue = Math.max(
            0,
            Math.min(
              1,
              (temporalValue - layerConfig.values[0]) /
                (layerConfig.values[1] - layerConfig.values[0])
            )
          );
          const [r1, g1, b1, a1] = layerConfig.colors[0];
          const [r2, g2, b2, a2] = layerConfig.colors[1];
          const color: RGBAColor = [
            r1 * (1 - normalizedValue) + r2 * normalizedValue,
            g1 * (1 - normalizedValue) + g2 * normalizedValue,
            b1 * (1 - normalizedValue) + b2 * normalizedValue,
            a1 * (1 - normalizedValue) + a2 * normalizedValue,
          ];
          return color;
        },
        getElevation: (d: any) => {
          const normalizedTimestamp = timestamp - (timestamp % d.properties.step);
          const temporalValue: number =
            d.properties[String(normalizedTimestamp).padStart(2, '0')] || 0;
          const normalizedValue = Math.max(
            0,
            Math.min(
              1,
              (temporalValue - layerConfig.values[0]) /
                (layerConfig.values[1] - layerConfig.values[0])
            )
          );
          const heights = layerConfig.heights || [0, 0];
          const height = heights[0] * (1 - normalizedValue) + heights[1] * normalizedValue;
          return height;
        },
        updateTriggers: {
          getFillColor: [timestamp],
          getElevation: [timestamp],
        },
      });
      return gLayer;
    });

    return result;
  }

  private extractTargetConfig() {
    return this.layerConfig.filter((layer: geoJsonLayerConfig) => {
      return layer.type === this.layersType;
    });
  }
}
