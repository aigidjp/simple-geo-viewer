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

export function makeTemporalLineLayers(
  map: maplibregl.Map,
  layerConfig,
  init: boolean,
  timestamp: number
) {
  const layer = new TemporalLineLayerCreator(layerConfig, map);
  return layer.makeDeckGlLayers(init, timestamp);
}

class TemporalLineLayerCreator {
  private readonly map: maplibregl.Map;
  private readonly layerConfig: any[];
  private readonly layersType: string = 'temporal_line';

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
        extruded: true,
        getLineColor: (d: any) => {
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
        getLineWidth: (d: any) => {
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
          const widths = layerConfig.widths || [5, 5];
          const width = widths[0] * (1 - normalizedValue) + widths[1] * normalizedValue;
          return width;
        },
        updateTriggers: {
          getLineColor: [timestamp],
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
