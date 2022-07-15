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
import jsonLoad from '@/components/LayerFilter/jsonLoad';
import { initialViewState } from '@/components/Map/initialViewState';
import { toBACKGROUNDS } from '@/components/Map/Controller/BackgroundSelector';


type TContext = {
  checkedLayerTitleList: string[];
  setCheckedLayerTitleList: React.Dispatch<React.SetStateAction<string[]>>;
  displayedLegendLayerId: string;
  setDisplayedLegendLayerId: React.Dispatch<React.SetStateAction<string>>;
  clickedLayerViewState: clickedLayerViewState | null;
  setClickedLayerViewState: React.Dispatch<React.SetStateAction<clickedLayerViewState | null>>;
  isDefault: boolean;
  setIsDefault: React.Dispatch<React.SetStateAction<boolean>>;
  settings: any;
  setSettings: React.Dispatch<React.SetStateAction<any>>;
  menu: any;
  setMenu: React.Dispatch<React.SetStateAction<any>>;
  config: any;
  setConfig: React.Dispatch<React.SetStateAction<any>>;
  backgrounds: any;
  setBackgrounds: React.Dispatch<React.SetStateAction<any>>;
  initialView: any;
  setInitialView: React.Dispatch<React.SetStateAction<any>>;
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
  const [settings,setSettings] = useState<any>({});
  const [menu,setMenu] = useState<any>({});
  const [config,setConfig] = useState<any>({});
  const [backgrounds,setBackgrounds] = useState<any>({});
  const [initialView,setInitialView] = useState<any>({});
  const router = useRouter();
  const query = router.query;
  let settingsjson :any = {};
  let menujson :any = {};
  let configjson :any = {};
  let backgroundsjson :any = {};
  let initialViewjson :any = {};

  useEffect(() => {  
    if (!router.isReady) return;
    (async () => {
      const dirpath = query.config;
      settingsjson = await jsonLoad(dirpath,"settings.json");
      menujson = await jsonLoad(dirpath,"menu.json");
      configjson = await jsonLoad(dirpath,"config.json");
      backgroundsjson = await jsonLoad(dirpath,"backgrounds.json");
      backgroundsjson = toBACKGROUNDS(backgroundsjson);
      initialViewjson = await jsonLoad(dirpath,"initial_view.json");
      initialViewjson = initialViewState(initialViewjson);
      setSettings(settingsjson);
      setMenu(menujson);
      setConfig(configjson);
      setBackgrounds(backgroundsjson);
      setInitialView(initialViewjson);
    })();
  },[query,router]);

  if ( Object.keys(initialView).length === 0) {
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
    settings,
    setSettings,
    menu,
    setMenu,
    config,
    setConfig,
    backgrounds,
    setBackgrounds,
    initialView,
    setInitialView
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
