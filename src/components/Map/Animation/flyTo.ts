import { useContext, useEffect } from 'react';
import { context } from '@/pages';
import { Deck, FlyToInterpolator } from 'deck.gl';
import { clickedLayerViewState, ViewState } from '@/components/Map/types';
import { getStatusForUpdate } from '@/components/Map/Animation/option';
import { InitialView } from '@/components/LayerFilter/loader';
import centroid from '@turf/centroid';

const easeOutQuart = (t: number) => {
  return 1 - Math.pow(1 - t, 4);
};

const replaceViewState = (layerId: string, viewState: ViewState) => {
  const stateForUpdate = getStatusForUpdate(layerId);
  return { ...viewState, ...stateForUpdate };
};

const getViewStateByLayerId = (
  layerId: string,
  clickedLayerViewState: clickedLayerViewState,
  initialView: InitialView
) => {
  const viewState = {
    longitude: clickedLayerViewState.longitude,
    latitude: clickedLayerViewState.latitude,
    zoom: clickedLayerViewState.zoom,
    bearing: initialView.map.bearing,
    pitch: initialView.map.pitch,
    transitionDuration: 2000,
    transitionEasing: easeOutQuart,
    transitionInterpolator: new FlyToInterpolator(),
  };
  return replaceViewState(layerId, viewState);
};

type centroidCoord = {
  lat: number;
  lon: number;
}

const autoZoom = (autoZoomLayer: any): centroidCoord => {
  const centoridPoint = centroid(autoZoomLayer.props.data);
  return { lat:centoridPoint.geometry.coordinates[1],
           lon:centoridPoint.geometry.coordinates[0] };
}

export const useFlyTo = (deck?: Deck) => {
  const { clickedLayerViewState, preferences } = useContext(context);
  useEffect(() => {
    if (!clickedLayerViewState || !deck) return;

    const layerId = clickedLayerViewState.id;
    let viewState = {};

    if (clickedLayerViewState.zoom === -9999) {
      // const autoZoomLayer = deck.props.layers.filter((layer)=>layer.id == layerId);
      // todo:信頼できるフィーチャーの取得方法を探す
      const autoZoomLayer = deck.layerManager.lastRenderedLayers.filter((layer)=>layer.id == layerId);
      const zoomCoord = autoZoom(autoZoomLayer[0]);
      let _clickedLayerViewState = clickedLayerViewState;
      _clickedLayerViewState.longitude = zoomCoord.lon;
      _clickedLayerViewState.latitude = zoomCoord.lat;
      _clickedLayerViewState.zoom = 15;
      viewState = getViewStateByLayerId(
        layerId,
        _clickedLayerViewState,
        preferences.initialView
      );
    }else{
      viewState = getViewStateByLayerId(
        layerId,
        clickedLayerViewState,
        preferences.initialView
      );
    }
    

    deck.setProps({ initialViewState: viewState });
  }, [clickedLayerViewState]);
};
