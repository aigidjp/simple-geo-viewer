import React, {useContext, useEffect} from 'react';
import { getVisiblyContent } from '@/components/LayerFilter/sideBar';
import { Content } from '@/components/SideBar/Content';
import { Layers } from '@/components/SideBar/Content/Layers';
import { VisibleContent } from '@/components/SideBar/types';
import { RefinementInput } from '@/components/SideBar/Content/RefinementInput';
import { RefinementKeywordContext } from '@/components/SideBar/Content/RefinementKeywordProvider'
import { filterLayerNameInputText } from "@/components/LayerFilter/menu"

const Sidebar: React.FC = () => {
  const visiblyContentList = getVisiblyContent();

  const refinementKeyword = useContext(RefinementKeywordContext);

  useEffect(() => {
    console.log("test");
    console.log(refinementKeyword);
  }, [refinementKeyword]);

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
