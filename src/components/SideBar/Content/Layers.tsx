import React, { useContext, useEffect } from 'react';
import { context } from '@/pages';
import { resource } from '@/components/Map/types';
import { getResourceIcon } from '@/components/SideBar/Icon';
import { getDataById } from '@/components/LayerFilter/menu';
import { filterCheckedData } from '@/components/LayerFilter/sideBar';

const isSelected = (resourceName: string, selectedResourceNameList: string[]): boolean => {
  return selectedResourceNameList.includes(resourceName);
};

const setResourceViewState = (resourceId: string[], setClickedLayerViewState: any) => {
  const targetResource = getDataById(resourceId);

  setClickedLayerViewState({
    longitude: targetResource.lng,
    latitude: targetResource.lat,
    zoom: targetResource.zoom,
    id: targetResource.id[0],
  });
};

const getDefaultVisiblyLayerTitles = () => {
  return filterCheckedData().map((layer) => layer.title);
};

type LayersProps = {
  layers: resource[];
};

export const Layers = (props: LayersProps) => {
  const { layers } = props;

  const { checkedLayerTitleList, setCheckedLayerTitleList, setClickedLayerViewState } =
    useContext(context);

  //最初の一度だけ、menuのcheckedを確認し、trueならcheckedLayerTitleListにset
  useEffect(() => {
    setCheckedLayerTitleList(getDefaultVisiblyLayerTitles());
  }, []);

  const toggleSelectedResourceList = (resourceName: string, resourceId: string[]) => {
    // 既存のリストに対象リソースが入っていなければ格納
    if (!isSelected(resourceName, checkedLayerTitleList)) {
      setCheckedLayerTitleList([...checkedLayerTitleList, resourceName]);
      // クリックされたリソースの位置情報を保存する
      setResourceViewState(resourceId, setClickedLayerViewState);
      return;
    }

    //リストから削除
    const newList = checkedLayerTitleList.filter((item) => {
      return item !== resourceName;
    });
    setCheckedLayerTitleList([...newList]);
    //チェックが外れた時はnullをセットしてflyToしない
    setClickedLayerViewState(null);
  };

  const resourceStyle = {
    fontSize: '0.75rem',
  };

  return (
    <>
      {layers.map((resource, index) => (
        <label key={resource.title}>
          <div
            className="transition-hover duration-500 ease bg-white hover:bg-gray-200 p-2 flex"
            style={resourceStyle}
            key={index}
          >
            <input
              type="checkbox"
              className="rounded-full mx-1 text-cyan-600 focus:outline-none"
              checked={isSelected(resource.title, checkedLayerTitleList)}
              onChange={() => {
                toggleSelectedResourceList(resource.title, resource.id);
              }}
            />
            {getResourceIcon(resource)}
            {resource.title}
          </div>
        </label>
      ))}
    </>
  );
};
