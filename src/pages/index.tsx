import React, { createContext, useState } from 'react';
import { NextPage } from 'next';
import Sidebar from '@/components/SideBar';
import Header from '@/components/Header';
import Map from '@/components/Map';
import { clickedLayerViewState } from '@/components/Map/types';
import { defaultLegendId } from '@/components/Map/Legend/layerIds';
import { Tooltip } from '@/components/Tooltip/content';
import { removeExistingTooltip } from '@/components/Tooltip/show';
import { RefinementKeywordContext } from '@/components/SideBar/Content/RefinementKeywordProvider'

type TContext = {
  checkedLayerTitleList: string[];
  setCheckedLayerTitleList: React.Dispatch<React.SetStateAction<string[]>>;
  displayedLegendLayerId: string;
  setDisplayedLegendLayerId: React.Dispatch<React.SetStateAction<string>>;
  clickedLayerViewState: clickedLayerViewState | null;
  setClickedLayerViewState: React.Dispatch<React.SetStateAction<clickedLayerViewState | null>>;
  isDefault: boolean;
  setIsDefault: React.Dispatch<React.SetStateAction<boolean>>;
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

  const value = {
    checkedLayerTitleList,
    setCheckedLayerTitleList,
    displayedLegendLayerId,
    setDisplayedLegendLayerId,
    clickedLayerViewState,
    setClickedLayerViewState,
    isDefault,
    setIsDefault,
  };

  return (
    <div className="h-screen">
      <context.Provider value={value}>
        <div className="h-12">
          <Header />
        </div>
        <div className="flex content">
          <div className="w-1/3 flex flex-col h-5/6 m-8">
            <div id="sideBar" className="overflow-auto relative flex-1">
              <RefinementKeywordContext.Provider value=''>
                <Sidebar />
              </RefinementKeywordContext.Provider>
            </div>
            {tooltipData.tooltip ? (
              <div className="relative h-1/3">
                <div className={'relative overflow-y-scroll pl-2 pr-14 h-full'}>
                  {tooltipData.tooltip ? <Tooltip {...tooltipData.tooltip} /> : undefined}
                </div>
                <div className="text-right bg-white absolute top-0 right-6">
                  <button
                    className="text-2xl"
                    onClick={() => removeExistingTooltip(setTooltipData)}
                  >
                    x
                  </button>
                </div>
              </div>
            ) : undefined}
          </div>
          <div className="w-2/3">
            <Map setTooltipData={setTooltipData} />
          </div>
        </div>
      </context.Provider>
    </div>
  );
};

export default App;
