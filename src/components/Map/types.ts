export type resource = {
  title: string;
  lng: number;
  lat: number;
  zoom: number;
  id: string[];
  checked: boolean;
  type: string;
  color?: string;
  icon?: string;
  url?: string;
  download_url?: string;
};

export type clickedLayerViewState = {
  latitude: number;
  longitude: number;
  zoom: number;
  id: string;
};

export type ViewState = {
  longitude: number;
  latitude: number;
  zoom: number;
  bearing: number;
  pitch: number;
  transitionDuration: number;
  transitionEasing: (time: number) => number;
  transitionInterpolator: object;
};
