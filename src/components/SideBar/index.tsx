import React, {useContext, useState, useEffect} from 'react';
import { getVisiblyContent } from '@/components/LayerFilter/sideBar';
import { Content } from '@/components/SideBar/Content';
import { Layers } from '@/components/SideBar/Content/Layers';
import { VisibleContent } from '@/components/SideBar/types';
import { RefinementInput } from '@/components/SideBar/Content/RefinementInput';
import { refinementKeywordContext, useRefinementKeyword } from '@/components/SideBar/Content/RefinementKeywordProvider'
import { getMenu, filterLayerNameInputText } from "@/components/LayerFilter/menu"

const Sidebar: React.FC = () => {
  const [visiblyContentList, setVisiblyContentList] = useState(getVisiblyContent(getMenu()));
  const context = useRefinementKeyword();

  useEffect(() => {
    // 絞り込みキーワードの変更通知
    if (context.refinementKeyword !== '') {
      const refinementContents = filterLayerNameInputText(context.refinementKeyword);
      setVisiblyContentList(getVisiblyContent(refinementContents));
    } else {
      setVisiblyContentList(getVisiblyContent(getMenu()));
    }
  }, [context.refinementKeyword]);

  return (
    <>
      <refinementKeywordContext.Provider value={context}>
        <RefinementInput />
        {visiblyContentList.map((content: VisibleContent) => (
          <Content
            title={content.dataset}
            layers={<Layers layers={content.layers} />}
            key={content.dataset}
          />
        ))}
      </refinementKeywordContext.Provider>
    </>
  );
};

export default Sidebar;
