import React from 'react';
import { getVisiblyContent } from '@/components/LayerFilter/sideBar';
import { Content } from '@/components/SideBar/Content';
import { Layers } from '@/components/SideBar/Content/Layers';
import { VisibleContent } from '@/components/SideBar/types';
import { RefinementInput } from '@/components/SideBar/Content/RefinementInput';

const Sidebar: React.FC = () => {
  const visiblyContentList = getVisiblyContent();

  return (
    <>
      <RefinementInput />
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
