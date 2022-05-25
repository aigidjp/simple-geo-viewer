import maplibregl from 'maplibre-gl';
import { IconLayer } from '@deck.gl/layers';

export function makeGtfsTimeLineLayers(
  map: maplibregl.Map,
  layerConfig,
  init: boolean,
  timestamp: number
) {
  const layer = new GtfsTimelineLayerCreator(layerConfig, map);
  return layer.makeDeckGlLayers(init, timestamp);
}

class GtfsTimelineLayerCreator {
  private readonly map: maplibregl.Map;
  private readonly layerConfig: any[];
  private readonly layersType: string = 'bus_trip';

  constructor(layerConfig: any[], map: maplibregl.Map) {
    this.layerConfig = layerConfig;
    this.map = map;
  }

  makeDeckGlLayers(init, timestamp) {
    const targetLayerConfigs = this.extractTargetConfig();
    const result: IconLayer<any>[] = [];

    for (const layerConfig of targetLayerConfigs) {
        const iconUrl = layerConfig.iconUrl? layerConfig.iconUrl : 'images/bus_yellow.png';

        const TrackingL = new IconLayer({
            id: layerConfig.id,
            data: layerConfig.source,
            visible: init,
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

  /**
   * layersTypeに適合するレイヤーコンフィグを取り出し
   * @private
   */
  private extractTargetConfig() {
    return this.layerConfig.filter((layer) => {
      return layer.type === this.layersType;
    });
  }
}
