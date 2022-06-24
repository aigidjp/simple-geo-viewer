import React, { useState } from 'react';
import { getVisiblyContent } from '@/components/LayerFilter/sideBar';
import { Content } from '@/components/SideBar/Content';
import { Layers } from '@/components/SideBar/Content/Layers';
import { VisibleContent } from '@/components/SideBar/types';
import { FilterLayerInput } from '@/components/SideBar/Content/FilterLayerInput';
import { getMenu, getFilteredMenu } from '@/components/LayerFilter/menu';

const Sidebar: React.FC = () => {
  const [InputFilterKeyword, setInputFilterKeyword] = useState('');
  const filterContents = getFilteredMenu(getMenu(), InputFilterKeyword);
  const visiblyContentList = getVisiblyContent(filterContents);

  return (
    <>
      <FilterLayerInput setFilterKeyword={setInputFilterKeyword} />
      {visiblyContentList.map((content: VisibleContent) => (
        <Content
          title={content.dataset}
          layers={<Layers layers={content.layers} />}
          key={content.dataset}
        />
      ))}
    </>
  );
};

export default Sidebar;
