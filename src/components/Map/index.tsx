import React, { Dispatch, SetStateAction, useContext, useEffect, useRef } from 'react';

import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

import { Deck } from 'deck.gl';

import { context } from '@/pages';
import { useFlyTo } from '@/components/Map/Animation/flyTo';
import { makeDeckGlLayers } from '@/components/Map/Layer/deckGlLayerFactory';
import { toggleVisibly } from '@/components/Map/Layer/visibly';
import Legend, { useGetClickedLayerId } from '@/components/Map/Legend';
import { initialViewState } from '@/components/Map/initialViewState';

import BackgroundSelector, { BACKGROUNDS } from './Controller/BackgroundSelector';
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

/**
 * MapLibre GL JSの初期スタイルを取得する
 * 初期スタイル=./src/assets/backgrounds.jsonで定義された背景が表示されている状態
 */
const getInitialStyle = (): maplibregl.Style => {
  const defaultBackgroundData = BACKGROUNDS[Object.keys(BACKGROUNDS)[0]];
  const style: maplibregl.Style = {
    version: 8,
    sources: {
      background: defaultBackgroundData.source,
    },
    layers: [
      {
        id: 'background',
        type: 'raster',
        source: 'background',
        minzoom: 0,
        maxzoom: 22,
      },
    ],
  };
  return style;
};

const useInitializeMap = (mapContainer: React.MutableRefObject<HTMLDivElement | null>) => {
  useEffect(() => {
    if (!map) {
      if (!mapContainer.current) return;

      map = new maplibregl.Map({
        container: mapContainer.current,
        style: getInitialStyle(),
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
        <div className="z-10 absolute top-0 right-12 w-40 bg-white">
          <BackgroundSelector map={map} />
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
