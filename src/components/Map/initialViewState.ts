
export type InitialViewState = {
  longitude: number;
  latitude: number;
  zoom: number;
  bearing: number;
  pitch: number;
}

export const initialViewState = (mapSetting) => {
  const { center, zoom, bearing, pitch } = mapSetting.map;
  return {
    longitude: center[0],
    latitude: center[1],
    zoom: zoom,
    bearing: bearing,
    pitch: pitch,
  };
}
