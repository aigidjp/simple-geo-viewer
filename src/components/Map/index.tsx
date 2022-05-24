import React, { Dispatch, SetStateAction, useContext, useEffect, useRef } from 'react';

import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

import { Deck } from 'deck.gl';

import initialStyle from '@/assets/initial_style.json';

import { context } from '@/pages';
import { useFlyTo } from '@/components/Map/Animation/flyTo';
import { makeDeckGlLayers } from '@/components/Map/Layer/deckGlLayerFactory';
import { toggleVisibly } from '@/components/Map/Layer/visibly';
import Legend, { useGetClickedLayerId } from '@/components/Map/Legend';
import { initialViewState } from '@/components/Map/initialViewState';

import { TimeSlider } from '@/components/Map/Controller/TimeSlider';
import { getFilteredLayerConfig } from '@/components/LayerFilter/config';

let map: maplibregl.Map;
let deck: Deck;

const getViewStateFromMaplibre = (map) => {
  const { lng, lat } = map.getCenter();
  return {
    longitude: lng,
    latitude: lat,
    zoom: map.getZoom(),
    bearing: map.getBearing(),
    pitch: map.getPitch(),
  };
};

const useInitializeMap = (mapContainer: React.MutableRefObject<HTMLDivElement | null>) => {
  useEffect(() => {
    if (!map) {
      if (!mapContainer.current) return;

      map = new maplibregl.Map({
        container: mapContainer.current,
        style: JSON.parse(JSON.stringify(initialStyle)),
        center: [initialViewState.longitude, initialViewState.latitude],
        zoom: initialViewState.zoom,
        bearing: initialViewState.bearing,
        pitch: initialViewState.pitch,
        //deck.gl側にマップの操作を任せるためにfalseに設定
        interactive: false,
      });
    }

    // @ts-ignore
    const gl = map.painter.context.gl;
    deck = new Deck({
      initialViewState: initialViewState,
      gl: gl,
      controller: true,
      onViewStateChange: ({ viewState }) => {
        map.jumpTo({
          center: [viewState.longitude, viewState.latitude],
          zoom: viewState.zoom,
          bearing: viewState.bearing,
          pitch: viewState.pitch,
        });
      },
      layers: [],
    });

    map.addControl(new maplibregl.NavigationControl());

    map.on('moveend', (_e) => {
      deck.setProps({ initialViewState: getViewStateFromMaplibre(map) });
    });
  }, []);
};

const useToggleVisibly = () => {
  const { checkedLayerTitleList } = useContext(context);

  if (!deck) return;
  const deckGlLayers = deck.props.layers;
  const toggleVisibleLayers = toggleVisibly(deckGlLayers, checkedLayerTitleList);

  deck.setProps({ layers: toggleVisibleLayers });
};

type Props = {
  setTooltipData: Dispatch<SetStateAction<any>>;
};

const Map: React.VFC<Props> = ({ setTooltipData }) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);

  const visibleLayerTypes = getFilteredLayerConfig().map((item) => {
    return item.type;
  });
  const hasTimeSeries = !!visibleLayerTypes.find((item) => ['bus_trip'].includes(item));

  //map・deckインスタンスを初期化
  useInitializeMap(mapContainer);

  //対象のレイヤを全て作成してdeckに登録
  useEffect(() => {
    map.on('load', () => {
      makeDeckGlLayers(map, deck, setTooltipData);
    });
  }, []);

  //layerの可視状態を変更
  useToggleVisibly();

  //クリックされたレイヤに画面移動
  useFlyTo(deck);

  return (
    <>
      <div className="m-8 h-5/6" ref={mapContainer}>
        <div className="z-10 relative top-0 left-0 w-40">
          <Legend id={useGetClickedLayerId()} />
        </div>
        <div className="z-10 absolute bottom-0 left-0 w-2/5 bg-white">
          {hasTimeSeries ? (
            <TimeSlider deck={deck} map={map} setTooltipData={setTooltipData} />
          ) : null}
        </div>
      </div>
    </>
  );
};

export default Map;
