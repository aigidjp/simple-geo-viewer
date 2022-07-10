import React, { Dispatch, SetStateAction, useState } from 'react';
import { getVisiblyContent } from '@/components/LayerFilter/sideBar';
import { Content } from '@/components/SideBar/Content';
import { Layers } from '@/components/SideBar/Content/Layers';
import { FilterLayerInput } from '@/components/SideBar/Content/FilterLayerInput';
import { getMenu, getFilteredMenu } from '@/components/LayerFilter/menu';

type Props = {
  setLayerTextTooltipData: Dispatch<SetStateAction<any>>;
};

const Sidebar: React.VFC<Props> = ( {setLayerTextTooltipData} ) => {
  const [InputFilterKeyword, setInputFilterKeyword] = useState('');
  const filteredMenu = getFilteredMenu(getMenu(), InputFilterKeyword);
  const visiblyContentList = getVisiblyContent(filteredMenu);

  return (
    <>
      <FilterLayerInput setFilterKeyword={setInputFilterKeyword} />
      {visiblyContentList.map((content) => (
        <Content
          title={content.title}
          layers={<Layers layers={content.layers} setLayerTextTooltipData={setLayerTextTooltipData} />}
          key={content.title}
        />
      ))}
    </>
  );
};

export default Sidebar;
