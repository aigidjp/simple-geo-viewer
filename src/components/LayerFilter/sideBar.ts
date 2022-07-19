import { getIdByDataTitle } from '@/components/LayerFilter/menu';
import { havingLegendIdList } from '@/components/Map/Legend/layerIds';
import { getDataList } from '@/components/LayerFilter/menu';

import { Menu } from '@/components/LayerFilter/menu';

export const getVisiblyContent = (visiblyItemList: Menu) => {
  return visiblyItemList.map((item) => {
    return {
      title: item.category,
      layers: item.data,
    };
  });
};

/**
 * サイドバーのチェックボックスがonになっている凡例を持つレイヤのidを取得
 * - 最後にチェックされた順に走査
 * - 該当するものがない場合は空文字を返す
 * @param layerTitleList
 */
export const getCheckedLayerIdByDataTitleList = (layerTitleList: string[],menu:Menu) => {
  if (layerTitleList.length !== 0) {
    // 最後にチェックされたレイヤのidを取得するため反転
    const reverseLayerTitleList = [...layerTitleList];
    for (const layerTitle of reverseLayerTitleList.reverse()) {
      const idList = getIdByDataTitle(menu, layerTitle);
      if (havingLegendIdList.includes(idList[0])) {
        return idList[0];
      }
    }
  }
  return '';
};

/**
 * menu.jsonの中でchecked=trueのdataのみ返す
 */
export const filterCheckedData = (menu:Menu) =>
  getDataList(menu).filter((data) => {
    return data.checked === true;
  });
