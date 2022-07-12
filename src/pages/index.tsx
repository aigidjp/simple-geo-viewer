import React, { createContext, useState } from 'react';
import { NextPage } from 'next';
import Sidebar from '@/components/SideBar';
import Header from '@/components/Header';
import Map from '@/components/Map';
import { clickedLayerViewState } from '@/components/Map/types';
import { defaultLegendId } from '@/components/Map/Legend/layerIds';
import { Tooltip } from '@/components/Tooltip/content';
import { removeExistingTooltip } from '@/components/Tooltip/show';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import jsonLoad, { assetJsons } from '@/components/LayerFilter/jsonLoad';


type TContext = {
  checkedLayerTitleList: string[];
  setCheckedLayerTitleList: React.Dispatch<React.SetStateAction<string[]>>;
  displayedLegendLayerId: string;
  setDisplayedLegendLayerId: React.Dispatch<React.SetStateAction<string>>;
  clickedLayerViewState: clickedLayerViewState | null;
  setClickedLayerViewState: React.Dispatch<React.SetStateAction<clickedLayerViewState | null>>;
  isDefault: boolean;
  setIsDefault: React.Dispatch<React.SetStateAction<boolean>>;
  jsonReady: boolean;
  setJsonReady: React.Dispatch<React.SetStateAction<boolean>>;
};

export const context = createContext({} as TContext);

export const jsons = new assetJsons();

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
  const [jsonReady, setJsonReady] = useState<boolean>(false);
  const router = useRouter();
  const query = router.query;
  let settingsjson :any = {};
  let menujson :any = {};
  let configjson :any = {};
  

  useEffect(() => {  
    if (!router.isReady) return;
    (async () => {
      const dirpath = query.config;
      settingsjson = await jsonLoad(dirpath,"settings.json");
      menujson = await jsonLoad(dirpath,"menu.json");
      configjson = await jsonLoad(dirpath,"config.json");
      jsons.setJsons(settingsjson,menujson,configjson);
      setJsonReady(true);
    })();
  },[query,router]);

  if (!jsonReady) {
    return (<div>loading</div>);
  };



  const value = {
    checkedLayerTitleList,
    setCheckedLayerTitleList,
    displayedLegendLayerId,
    setDisplayedLegendLayerId,
    clickedLayerViewState,
    setClickedLayerViewState,
    isDefault,
    setIsDefault,
    jsonReady,
    setJsonReady,
  };

  return (
    <div className="h-screen">
      <context.Provider value={value}>
        <div className="h-12">
          <Header />
        </div>
        <div className="flex content">
          <div className="w-1/5 flex flex-col h-5/6 m-8">
            <div id="sideBar" className="overflow-auto relative flex-1">
              <Sidebar />
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
          <div className="w-4/5">
            <Map setTooltipData={setTooltipData} />
          </div>
        </div>
      </context.Provider>
    </div>
  );
};

export default App;
