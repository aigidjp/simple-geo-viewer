import React, { createContext, useState } from 'react';
import { NextPage } from 'next';
import Sidebar from '@/components/SideBar';
import Header from '@/components/Header';
import Map from '@/components/Map';
import { clickedLayerViewState } from '@/components/Map/types';
import { defaultLegendId } from '@/components/Map/Legend/layerIds';
import { Tooltip } from '@/components/Tooltip/content';
import { removeExistingTooltip } from '@/components/Tooltip/show';
import MouseTooltip, { MouseTooltipData } from '@/components/MouseTooltip';
import { useRouter } from 'next/router';
import { usePreferences, Preferences } from '@/components/LayerFilter/loader';

type TContext = {
  checkedLayerTitleList: string[];
  setCheckedLayerTitleList: React.Dispatch<React.SetStateAction<string[]>>;
  displayedLegendLayerId: string;
  setDisplayedLegendLayerId: React.Dispatch<React.SetStateAction<string>>;
  clickedLayerViewState: clickedLayerViewState | null;
  setClickedLayerViewState: React.Dispatch<React.SetStateAction<clickedLayerViewState | null>>;
  isDefault: boolean;
  setIsDefault: React.Dispatch<React.SetStateAction<boolean>>;
  mouseTooltipData: MouseTooltipData | null;
  setMouseTooltipData: React.Dispatch<React.SetStateAction<MouseTooltipData | null>>;
  preferences: Preferences;
};

const useContextValues = (): Omit<TContext, 'preferences'> => {
  const [checkedLayerTitleList, setCheckedLayerTitleList] = useState<string[]>([]);
  const [displayedLegendLayerId, setDisplayedLegendLayerId] = useState<string>(defaultLegendId);
  const [clickedLayerViewState, setClickedLayerViewState] = useState<clickedLayerViewState | null>(
    null
  );
  const [isDefault, setIsDefault] = useState<boolean>(true);
  const [mouseTooltipData, setMouseTooltipData] = useState<MouseTooltipData | null>(null);

  return {
    checkedLayerTitleList,
    setCheckedLayerTitleList,
    displayedLegendLayerId,
    setDisplayedLegendLayerId,
    clickedLayerViewState,
    setClickedLayerViewState,
    isDefault,
    setIsDefault,
    mouseTooltipData,
    setMouseTooltipData,
  };
};

export const context = createContext({} as TContext);

const App: NextPage = () => {
  const [tooltipData, setTooltipData] = useState<any>({
    tooltip: null,
  });

  const contextValues = useContextValues();
  const { preferences } = usePreferences();
  if (preferences === null) {
    return <div>loading</div>;
  }

  return (
    <div className="h-screen">
      <context.Provider value={{ ...contextValues, preferences }}>
        <div className="h-12">
          <Header />
        </div>
        <div className="flex content" style={{ overflow: 'hidden' }}>
          <div className="w-1/5 flex flex-col h-full ml-4 mr-2 mt-4 pb-10">
            <div id="sideBar" className="overflow-auto relative flex-1">
              <Sidebar />
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
            ) : undefined}
            {contextValues.mouseTooltipData !== null ? (
              <div className="relative">
                <MouseTooltip mouseTooltipData={contextValues.mouseTooltipData} />
              </div>
            ) : undefined}
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
