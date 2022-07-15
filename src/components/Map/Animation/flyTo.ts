import { useContext, useEffect } from 'react';
import { context } from '@/pages';
import { Deck, FlyToInterpolator } from 'deck.gl';
import { InitialViewState } from '@/components/Map/initialViewState';
import { clickedLayerViewState, ViewState } from '@/components/Map/types';
import { getStatusForUpdate } from '@/components/Map/Animation/option';

const easeOutQuart = (t: number) => {
  return 1 - Math.pow(1 - t, 4);
};

const replaceViewState = (layerId: string, viewState: ViewState) => {
  const stateForUpdate = getStatusForUpdate(layerId);
  return { ...viewState, ...stateForUpdate };
};

const getViewStateByLayerId = (layerId: string, clickedLayerViewState: clickedLayerViewState, initialViewState: InitialViewState ) => {
  const viewState = {
    longitude: clickedLayerViewState.longitude,
    latitude: clickedLayerViewState.latitude,
    zoom: clickedLayerViewState.zoom,
    bearing: initialViewState.bearing,
    pitch: initialViewState.pitch,
    transitionDuration: 2000,
    transitionEasing: easeOutQuart,
    transitionInterpolator: new FlyToInterpolator(),
  };
  return replaceViewState(layerId, viewState);
};

export const useFlyTo = (deck?: Deck) => {
  const { clickedLayerViewState, initialView } = useContext(context);
  useEffect(() => {
    if (!clickedLayerViewState || !deck) return;

    const layerId = clickedLayerViewState.id;
    const viewState = getViewStateByLayerId(layerId, clickedLayerViewState, initialView);

    deck.setProps({ initialViewState: viewState });
  }, [clickedLayerViewState]);
};
