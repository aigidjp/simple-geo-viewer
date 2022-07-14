import React, { createContext, useState } from 'react';
import { NextPage } from 'next';
import Sidebar from '@/components/SideBar';
import Header from '@/components/Header';
import Map from '@/components/Map';
import { clickedLayerViewState } from '@/components/Map/types';
import { defaultLegendId } from '@/components/Map/Legend/layerIds';
import { Tooltip } from '@/components/Tooltip/content';
import { removeExistingTooltip } from '@/components/Tooltip/show';

type LayerPopupType = {
  title: string;
  show: boolean;
  top: number;
};

type TContext = {
  checkedLayerTitleList: string[];
  setCheckedLayerTitleList: React.Dispatch<React.SetStateAction<string[]>>;
  displayedLegendLayerId: string;
  setDisplayedLegendLayerId: React.Dispatch<React.SetStateAction<string>>;
  clickedLayerViewState: clickedLayerViewState | null;
  setClickedLayerViewState: React.Dispatch<React.SetStateAction<clickedLayerViewState | null>>;
  isDefault: boolean;
  setIsDefault: React.Dispatch<React.SetStateAction<boolean>>;
  layerPopupObject: LayerPopupType;
  setLayerPopupObject: React.Dispatch<React.SetStateAction<LayerPopupType>>;
};

export const context = createContext({} as TContext);

const App: NextPage = () => {
  const [checkedLayerTitleList, setCheckedLayerTitleList] = useState<string[]>([]);
  const [displayedLegendLayerId, setDisplayedLegendLayerId] = useState<string>(defaultLegendId);
  const [clickedLayerViewState, setClickedLayerViewState] = useState<clickedLayerViewState | null>(
    null
  );
  const [isDefault, setIsDefault] = useState<boolean>(true);
  const [tooltipData, setTooltipData] = useState<any>({
    tooltip: null,
  });
  const [layerPopupObject, setLayerPopupObject] = useState<LayerPopupType>({
    title: "",
    show: false,
    top: 0
  });

  const value = {
    checkedLayerTitleList,
    setCheckedLayerTitleList,
    displayedLegendLayerId,
    setDisplayedLegendLayerId,
    clickedLayerViewState,
    setClickedLayerViewState,
    isDefault,
    setIsDefault,
    layerPopupObject,
    setLayerPopupObject
  };

  return (
    <div className="h-screen">
      <context.Provider value={value}>
        <div className="h-12">
          <Header />
        </div>
        <div className="flex content" style={{overflow:'hidden'}}>
          <div className="w-1/5 flex flex-col h-full ml-4 mr-2 mt-4 pb-10">
            <div
              id="sideBar"
              className="overflow-auto relative flex-1"
            >
              <Sidebar/>
            </div>
            {tooltipData.tooltip ? (
              <div className="relative h-1/3 border-2 border-black">
                <div className={'relative overflow-auto pt-2 pl-2 pr-2 h-full'}>
                  {tooltipData.tooltip ? <Tooltip {...tooltipData.tooltip} /> : undefined}
                </div>
                <div className="text-right bg-white absolute top-0 right-2">
                  <button
                    className="text-2xl"
                    onClick={() => removeExistingTooltip(setTooltipData)}
                  >
                    x
                  </button>
                </div>
              </div>
            ) : undefined }
            {layerPopupObject ? (
              <div className="textTooltip_container w-11/12">
                {layerPopupObject.show && <div className={"textTooltip_float_top"} style={{top: layerPopupObject.top + "px"}}>{layerPopupObject.title}</div>}
              </div>
            ) : undefined }
          </div>
          <div className="w-4/5 m-2 pb-5 h-full">
            <Map setTooltipData={setTooltipData} />
          </div>
        </div>
      </context.Provider>
    </div>
  );
};

export default App;
