import React, { Dispatch, SetStateAction, useContext, useEffect, useRef } from 'react';

import { Map, Style, NavigationControl } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

import { Deck } from 'deck.gl';

import { context } from '@/pages';
import { useFlyTo } from '@/components/Map/Animation/flyTo';
import { makeDeckGlLayers } from '@/components/Map/Layer/deckGlLayerFactory';
import { toggleVisibly, zoomVisibly, visiblyLayers } from '@/components/Map/Layer/visibly';
import Legend, { useGetClickedLayerId } from '@/components/Map/Legend';

import BackgroundSelector from './Controller/BackgroundSelector';
import { TimeSlider } from '@/components/Map/Controller/TimeSlider';
import { getFilteredLayerConfig } from '@/components/LayerFilter/config';
import { Menu } from '@/components/LayerFilter/menu';
import { TEMPORAL_LAYER_TYPES } from '@/components/Map/Layer/temporalLayerMaker';
import { Preferences, Backgrounds } from '@/components/LayerFilter/loader';

let map: Map;
let deck: Deck;
let visLayers: visiblyLayers;

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
const getInitialStyle = (backgrounds: Backgrounds): Style => {
  const defaultBackgroundData = backgrounds[Object.keys(backgrounds)[0]];
  const style: Style = {
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

const checkZoomVisible = () => {
  const deckGlLayers = deck.props.layers;
  const zommVisibleLayers = zoomVisibly(deckGlLayers, visLayers);
  deck.setProps({ layers: zommVisibleLayers });
};

const useInitializeMap = (
  maplibreContainer: React.MutableRefObject<HTMLDivElement | null>,
  deckglContainer: React.MutableRefObject<HTMLCanvasElement | null>,
  preferences: Preferences
) => {
  const { backgrounds, initialView, menu } = preferences;
  useEffect(() => {
    if (!map) {
      if (!maplibreContainer.current) return;
      map = new Map({
        container: maplibreContainer.current,
        style: getInitialStyle(backgrounds),
        center: initialView.map.center,
        zoom: initialView.map.zoom,
        bearing: initialView.map.bearing,
        pitch: initialView.map.pitch,
        //deck.gl側にマップの操作を任せるためにfalseに設定
        interactive: false,
      });
    }

    visLayers = new visiblyLayers(menu, initialView.map.zoom);
    // @ts-ignore
    const gl = map.painter.context.gl;
    deck = new Deck({
      initialViewState: {
        latitude: initialView.map.center[1],
        longitude: initialView.map.center[0],
        bearing: initialView.map.bearing,
        pitch: initialView.map.pitch,
        zoom: initialView.map.zoom,
      },
      canvas: deckglContainer.current!,
      controller: true,
      onViewStateChange: ({ viewState }) => {
        map.jumpTo({
          center: [viewState.longitude, viewState.latitude],
          zoom: viewState.zoom,
          bearing: viewState.bearing,
          pitch: viewState.pitch,
        });
        visLayers.setzoomLevel(viewState.zoom);
      },
      onBeforeRender: () => {
        checkZoomVisible();
      },
      layers: [],
    });

    map.addControl(new NavigationControl());

    map.on('moveend', (_e) => {
      deck.setProps({ initialViewState: getViewStateFromMaplibre(map) });
    });
  }, []);
};

const useToggleVisibly = (menu: Menu) => {
  const { checkedLayerTitleList } = useContext(context);

  if (!deck) return;
  const deckGlLayers = deck.props.layers;
  const toggleVisibleLayers = toggleVisibly(deckGlLayers, checkedLayerTitleList, menu);
  const zommVisibleLayers = zoomVisibly(toggleVisibleLayers, visLayers);
  deck.setProps({ layers: zommVisibleLayers });
  visLayers.setlayerList(checkedLayerTitleList);
};

type Props = {
  setTooltipData: Dispatch<SetStateAction<any>>;
};

const MapComponent: React.VFC<Props> = ({ setTooltipData }) => {
  const maplibreContainer = useRef<HTMLDivElement | null>(null);
  const deckglContainer = useRef<HTMLCanvasElement | null>(null);
  const { preferences } = useContext(context);

  const visibleLayerTypes = getFilteredLayerConfig(preferences.menu, preferences.config).map(
    (item) => {
      return item.type;
    }
  );
  const hasTimeSeries = !!visibleLayerTypes.find((item) => TEMPORAL_LAYER_TYPES.includes(item));

  //map・deckインスタンスを初期化
  useInitializeMap(maplibreContainer, deckglContainer, preferences);

  //対象のレイヤを全て作成してdeckに登録
  useEffect(() => {
    map.on('load', () => {
      makeDeckGlLayers(map, deck, setTooltipData, preferences.menu, preferences.config);
      checkZoomVisible();
    });
  }, []);

  //layerの可視状態を変更
  useToggleVisibly(preferences.menu);

  //クリックされたレイヤに画面移動
  useFlyTo(deck);

  return (
    <>
      <div className="m-8 h-5/6" ref={maplibreContainer}>
        <canvas className="z-10 absolute h-full" ref={deckglContainer}></canvas>
        <div className="z-10 relative top-0 left-0 w-40">
          <Legend id={useGetClickedLayerId()} />
        </div>
        <div className="z-10 absolute top-2 right-12 bg-white p-1">
          <div className="text-center font-bold">背景</div>
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

export default MapComponent;
