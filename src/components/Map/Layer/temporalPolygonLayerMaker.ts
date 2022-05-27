import maplibregl from 'maplibre-gl';
import { GeoJsonLayer } from '@deck.gl/layers';
import { PickInfo, RGBAColor } from 'deck.gl';

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
  timestamp: number
) {
  const layer = new TemporalPolygonLayerCreator(layerConfig, map);
  return layer.makeDeckGlLayers(init, timestamp);
}

class TemporalPolygonLayerCreator {
  private readonly map: maplibregl.Map;
  private readonly layerConfig: any[];
  private readonly layersType: string = 'temporal_polygon';

  constructor(layerConfig: any[], map: maplibregl.Map) {
    this.layerConfig = layerConfig;
    this.map = map;
  }

  makeDeckGlLayers(init, timestamp: number) {
    const targetLayerConfigs = this.extractTargetConfig();
    const result: GeoJsonLayer<any>[] = targetLayerConfigs.map((layerConfig) => {
      const gLayer = new GeoJsonLayer({
        id: layerConfig.id,
        data: layerConfig.source,
        visible: init,
        getFillColor: (d: any) => {
          const normalizedTimestamp = timestamp - (timestamp % d.properties.step);
          const temporalValue: number =
            d.properties[String(normalizedTimestamp).padStart(2, '0')] || 0;
          const normalizedValue = Math.max(
            0,
            Math.min(
              1,
              (temporalValue - layerConfig.range[0]) / (layerConfig.range[1] - layerConfig.range[0])
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
        updateTriggers: {
          getFillColor: [timestamp],
        },
      });
      return gLayer;
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
}
