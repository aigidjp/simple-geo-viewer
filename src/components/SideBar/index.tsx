import { context } from '@/pages';
import React, { useState, useContext } from 'react';
import { getVisiblyContent } from '@/components/LayerFilter/sideBar';
import { Content } from '@/components/SideBar/Content';
import { Layers } from '@/components/SideBar/Content/Layers';
import { FilterLayerInput } from '@/components/SideBar/Content/FilterLayerInput';
import { getFilteredMenu } from '@/components/LayerFilter/menu';

const Sidebar: React.FC = () => {
  const { preferences } = useContext(context);
  const [InputFilterKeyword, setInputFilterKeyword] = useState('');
  const filteredMenu = getFilteredMenu(preferences.menu, InputFilterKeyword);
  const visiblyContentList = getVisiblyContent(filteredMenu);

  return (
    <>
      <FilterLayerInput setFilterKeyword={setInputFilterKeyword} />
      {visiblyContentList.map((content) => (
        <Content
          title={content.title}
          layers={<Layers layers={content.layers} />}
          key={content.title}
        />
      ))}
    </>
  );
};

export default Sidebar;
