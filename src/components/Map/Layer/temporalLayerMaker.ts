type TemporalLayerType = 'bus_trip' | 'temporal_polygon' | 'temporal_line' | 'trips_json' | 'trips_drm';
export const TEMPORAL_LAYER_TYPES: Array<TemporalLayerType | string> = [
  'bus_trip',
  'temporal_polygon',
  'temporal_line',
  'trips_json',
  'trips_drm'
];

import { IconLayer, GeoJsonLayer } from '@deck.gl/layers';
import { RGBAColor, TripsLayer } from 'deck.gl';
import { MVTLayer } from '@deck.gl/geo-layers';
import { getDataList } from '@/components/LayerFilter/menu';

/**
 * 時系列アニメーションDeckGLレイヤーを作成する
 * @param layerConfig
 * @param init
 * @param timestamp
 * @param checkedLayerTitleList
 * @returns
 */
export function makeTemporalLayers(
  layerConfig,
  init: boolean,
  timestamp: number,
  checkedLayerTitleList: string[] = []
) {
  const bustripCreator = new BusTripLayerCreator(layerConfig, checkedLayerTitleList);
  const temporalPolygonCreator = new TemporalPolygonLayerCreator(
    layerConfig,
    checkedLayerTitleList
  );
  const temporalLineCreator = new TemporalLineLayerCreator(layerConfig, checkedLayerTitleList);
  const tripsJsonCreator = new TripsJsonLayerCreator(layerConfig, checkedLayerTitleList);
  const tripsDRMLayerCreator = new TripsDRMLayerCreator(layerConfig, checkedLayerTitleList);
  const layers = [
    ...bustripCreator.makeDeckGlLayers(init, timestamp),
    ...temporalPolygonCreator.makeDeckGlLayers(init, timestamp),
    ...temporalLineCreator.makeDeckGlLayers(init, timestamp),
    ...tripsJsonCreator.makeDeckGlLayers(init, timestamp),
    ...tripsDRMLayerCreator.makeDeckGlLayers(init, timestamp),
  ];
  return layers;
}

abstract class TemporalLayerCreator {
  layerType: TemporalLayerType = 'bus_trip';
  layerConfig: any[];
  checkedLayerTitleList: string[];

  constructor(layerConfig: any[], checkedLayerTitleList: string[] = []) {
    this.layerConfig = layerConfig;
    this.checkedLayerTitleList = checkedLayerTitleList;
  }
  abstract makeDeckGlLayers(init, timestamp): any[];

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

  /**
   * layersTypeに適合するレイヤーコンフィグを取り出し
   */
  extractTargetConfig() {
    return this.layerConfig.filter((layer) => layer.type === this.layerType);
  }
}

class BusTripLayerCreator extends TemporalLayerCreator {
  layerType: TemporalLayerType = 'bus_trip';

  makeDeckGlLayers(init, timestamp) {
    const targetLayerConfigs = this.extractTargetConfig();
    const result: IconLayer<any>[] = [];

    for (const layerConfig of targetLayerConfigs) {
      const iconUrl = layerConfig.iconUrl ? layerConfig.iconUrl : 'images/bus_yellow.png';
      const TrackingL = new IconLayer({
        id: layerConfig.id,
        data: layerConfig.source,
        visible: init && this.isChecked(layerConfig),
        lastPositions: {},
        getIcon: () => {
          return {
            url: iconUrl,
            width: 64,
            height: 64,
            anchorY: 64,
          };
        },
        getSize: () => {
          return layerConfig.getSize ? layerConfig.getSize : 50;
        },
        sizeScale: layerConfig.sizeScale || 1,
        getPosition: (d: any) => {
          const p = d.segments.filter((pos) => pos[2] == timestamp);
          if (p.length == 0) {
            // 時刻内かつ timestamp が一致しない場合は最後に描画した位置を使用する
            if (timestamp > d.segments[0][2] && timestamp < d.segments.slice(-1)[0][2]) {
              return TrackingL.props.lastPositions[d.properties.id];
            }
            return null;
          }
          const pos = [p.slice(-1)[0][0], p.slice(-1)[0][1]];
          TrackingL.props.lastPositions[d.properties.id] = pos;
          return pos;
        },
        pickable: true,
        //onClick: (info) => this.showTooltip(info, d.type),
        updateTriggers: {
          getPosition: [timestamp],
        },
      });
      result.push(TrackingL);
    }
    return result;
  }
}

class TemporalPolygonLayerCreator extends TemporalLayerCreator {
  layerType: TemporalLayerType = 'temporal_polygon';

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
}

class TemporalLineLayerCreator extends TemporalLayerCreator {
  layerType: TemporalLayerType = 'temporal_line';

  makeDeckGlLayers(init, timestamp: number) {
    const targetLayerConfigs = this.extractTargetConfig();
    const result: GeoJsonLayer<any>[] = targetLayerConfigs.map((layerConfig) => {
      const gLayer = new GeoJsonLayer({
        id: layerConfig.id,
        data: layerConfig.source,
        visible: init && this.isChecked(layerConfig),
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
}

class TripsJsonLayerCreator extends TemporalLayerCreator {
  layerType: TemporalLayerType = 'trips_json';

  makeDeckGlLayers(init, timestamp: number) {
    const targetLayerConfigs = this.extractTargetConfig();
    const result: TripsLayer<any>[] = targetLayerConfigs.map((layerConfig) => {
      const gLayer = new TripsLayer({
        id: layerConfig.id,
        data: layerConfig.source,
        visible: init && this.isChecked(layerConfig),
        getTimestamps: (d) => d.timestamps,
        getColor: layerConfig.color || [255, 0, 0],
        currentTime: timestamp,
        trailLength: layerConfig.trailLength || 15,
        widthMinPixels: layerConfig.width || 3,
        updateTriggers: {
          currentTime: [timestamp],
        },
      });
      return gLayer;
    });
    return result;
  }
}


class TripsDRMLayerCreator extends TemporalLayerCreator {
  layerType: TemporalLayerType = 'trips_drm';

  makeDeckGlLayers(init, timestamp: number) {

    const targetLayerConfigs = this.extractTargetConfig();
    const result: MVTLayer<any>[] = targetLayerConfigs.map((layerConfig) => {
      const mLayer = new MVTLayer({
        id: layerConfig.id,
        data: layerConfig.source,
        // @ts-ignore
        getLineColor: (d: any) => {

          // TODO:インターバルが1時間固定なので、パラメーターから取得した値で計算する必要がある
          // timestampとの整合性を取る
          const hourIndex: number = Math.trunc(timestamp / 60) - 1;
          const temporalValue: number = JSON.parse(d.properties.traffic_volume)[hourIndex];

          // TODO:この辺の処理はまとめる必要あり
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
          const hourIndex: number = Math.trunc(timestamp / 60) - 1;
          const temporalValue: number = JSON.parse(d.properties.traffic_volume)[hourIndex];
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
        lineWidthMinPixels: 5,
        visible: init && this.isChecked(layerConfig),
        stroked: false,
        filled: true,
        updateTriggers: {
          getLineColor: [timestamp],
          getLineWidth: [timestamp],
          currentTime: [timestamp],
        },
      });
      return mLayer;
    });
    return result;

  }
}
