import React, {useContext, useState, useEffect, useCallback} from 'react';
import { getVisiblyContent } from '@/components/LayerFilter/sideBar';
import { Content } from '@/components/SideBar/Content';
import { Layers } from '@/components/SideBar/Content/Layers';
import { VisibleContent } from '@/components/SideBar/types';
import { RefinementInput } from '@/components/SideBar/Content/RefinementInput';
import { getMenu, filterLayerNameInputText } from "@/components/LayerFilter/menu"

const Sidebar: React.FC = () => {
  const [visiblyContentList, setVisiblyContentList] = useState(getVisiblyContent(getMenu()));
  const [InputRefinementKeyword, setInputRefinementKeyword] = useState('');

  useEffect(() => {
    // 絞り込みキーワードの変更通知
    if (InputRefinementKeyword !== '') {
      const refinementContents = filterLayerNameInputText(InputRefinementKeyword);
      setVisiblyContentList(getVisiblyContent(refinementContents));
    } else {
      setVisiblyContentList(getVisiblyContent(getMenu()));
    }
  }, [InputRefinementKeyword]);

  return (
    <>
      <RefinementInput setRefinementKeyword={setInputRefinementKeyword} />
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
