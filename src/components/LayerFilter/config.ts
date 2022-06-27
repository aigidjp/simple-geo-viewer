import configJson from '@/assets/config.json';
import { getMenu, getFilteredIdList } from '@/components/LayerFilter/menu';
import { RGBAColor } from 'deck.gl';

type LayerGenericProps = {
  id: string;
  source: string;
  minzoom?: number;
  maxzoom?: number;
  opacity?: number;
  visible: boolean;
};

type RasterLayer = LayerGenericProps & {
  type: 'raster';
};

type MvtLayer = LayerGenericProps & {
  type: 'mvt';
  getFillColor: RGBAColor;
};

type GeojsonLayer = LayerGenericProps & {
  type: 'geojson';
  getLineColor: RGBAColor;
  lineWidthMinPixels: number;
  getFillColor: RGBAColor;
};

type GeojsonIconLayer = LayerGenericProps & {
  type: 'geojsonicon';
  stroked: boolean;
  filled: boolean;
  icon: {
    url: string;
    width: number;
    height: number;
    anchorY: number;
  };
  iconSizeScale: number;
};

type BustripLayer = LayerGenericProps & {
  type: 'bus_trip';
  iconUrl: string;
};

type Tile3dLayer = LayerGenericProps & {
  type: '3dtiles';
  pointsize: number;
};

type ScatterprotLayer = {
  type: 'Scatterplot';
  id: string;
  data: string;
  getLineColor: RGBAColor;
  getFillColor: RGBAColor;
  minzoom: number;
  maxzoom: number;
  visible: boolean;
};

type ArcLayer = {
  type: 'Arc';
  id: string;
  data: string;
  width: number;
  sourceColor: RGBAColor;
  targetColor: RGBAColor;
  minzoom: number;
  maxzoom: number;
  visible: boolean;
};

type TemporalPolygonLayer = LayerGenericProps & {
  type: 'temporal_polygon';
  values: [number, number];
  colors: [RGBAColor, RGBAColor];
  heights: [number, number];
  colorScale: number;
};

type TripsJsonLayer = LayerGenericProps & {
  type: 'trips_json';
  color: RGBAColor;
  trailLength: number;
};

type TripsDrmLayer = LayerGenericProps & {
  type: 'trips_drm';
  values: [number, number];
  colors: [RGBAColor, RGBAColor];
  step: number;
};

type Layer =
  | RasterLayer
  | MvtLayer
  | GeojsonLayer
  | GeojsonIconLayer
  | BustripLayer
  | Tile3dLayer
  | ScatterprotLayer
  | ArcLayer
  | TemporalPolygonLayer
  | TripsJsonLayer
  | TripsDrmLayer;

type Config = {
  layers: Layer[];
};

const loadConfigJson = () => configJson as Config;

/**
 * 表示可能なレイヤのconfigだけ収集する
 */
export const getFilteredLayerConfig = () => {
  const config = loadConfigJson();
  return config.layers.filter((layer) => getFilteredIdList(getMenu()).includes(layer.id));
};

/**
 * 指定したidのconfigを取得する
 */
export const getLayerConfigById = (id: string) => {
  const config = loadConfigJson();
  return config.layers.find((layer) => layer.id === id);
};
