import mapSetting from '@/assets/initial_view.json';

const { center, zoom, bearing, pitch } = mapSetting.map;

export const initialViewState = {
  longitude: center[0],
  latitude: center[1],
  zoom: zoom,
  bearing: bearing,
  pitch: pitch,
};
