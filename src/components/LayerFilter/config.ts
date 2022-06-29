import configJson from '@/assets/config.json';
import { getMenu, getFilteredIdList } from '@/components/LayerFilter/menu';
import { RGBAColor } from 'deck.gl';

type LayerConfigType =
  | 'raster'
  | 'mvt'
  | 'geojson'
  | 'geojsonicon'
  | 'icon'
  | 'bus_trip'
  | '3dtiles'
  | 'Scatterplot'
  | 'Arc'
  | 'temporal_polygon'
  | 'temporal_line'
  | 'gltf'
  | 'trips_json'
  | 'trips_drm';

type LayerConfigGenericProps = {
  id: string;
  source: string;
  type: LayerConfigType;
  minzoom?: number;
  maxzoom?: number;
  opacity?: number;
  visible?: boolean;
};

type RasterLayerConfig = LayerConfigGenericProps & {
  type: 'raster';
};

type MvtLayerConfig = LayerConfigGenericProps & {
  type: 'mvt';
  getFillColor: RGBAColor;
};

export type GeojsonLayerConfig = LayerConfigGenericProps & {
  type: 'geojson';
  getLineColor: RGBAColor;
  lineWidthMinPixels: number;
  getFillColor?: RGBAColor;
};

export type GeojsonIconLayerConfig = LayerConfigGenericProps & {
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

type IconLayerConfig = LayerConfigGenericProps & {
  type: 'icon';
  coords: [number, number, number];
  color: RGBAColor;
};

type BustripLayerConfig = LayerConfigGenericProps & {
  type: 'bus_trip';
  iconUrl: string;
};

type Tile3dLayerConfig = LayerConfigGenericProps & {
  type: '3dtiles';
  pointsize: number;
};

type ScatterprotLayerConfig = {
  type: 'Scatterplot';
  id: string;
  data: string;
  getLineColor: RGBAColor;
  getFillColor: RGBAColor;
  minzoom: number;
  maxzoom: number;
  visible: boolean;
};

type ArcLayerConfig = {
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

type TemporalPolygonLayerConfig = LayerConfigGenericProps & {
  type: 'temporal_polygon';
  values: [number, number];
  colors: [RGBAColor, RGBAColor];
  heights?: [number, number];
  colorScale: number;
};

type TemporalLineLayerConfig = LayerConfigGenericProps & {
  type: 'temporal_line';
  values: [number, number];
  colors: [RGBAColor, RGBAColor];
  widths: [number, number];
};

type GltfLayerConfig = LayerConfigGenericProps & {
  type: 'gltf';
  coords: [number, number, number];
  color: RGBAColor;
  orientation: [number, number, number];
};

type TripsJsonLayerConfig = LayerConfigGenericProps & {
  type: 'trips_json';
  color: RGBAColor;
  trailLength: number;
};

type TripsDrmLayerConfig = LayerConfigGenericProps & {
  type: 'trips_drm';
  values: [number, number];
  colors: [RGBAColor, RGBAColor];
  step: number;
};

export type LayerConfig =
  | RasterLayerConfig
  | MvtLayerConfig
  | GeojsonLayerConfig
  | GeojsonIconLayerConfig
  | IconLayerConfig
  | BustripLayerConfig
  | Tile3dLayerConfig
  | ScatterprotLayerConfig
  | ArcLayerConfig
  | TemporalPolygonLayerConfig
  | TemporalLineLayerConfig
  | GltfLayerConfig
  | TripsJsonLayerConfig
  | TripsDrmLayerConfig;

type Config = {
  layers: LayerConfig[];
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
