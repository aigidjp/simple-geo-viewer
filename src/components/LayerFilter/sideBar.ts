import { getIdByDataTitle } from '@/components/LayerFilter/menu';
import { havingLegendIdList } from '@/components/Map/Legend/layerIds';
import { getDataList, getMenu } from '@/components/LayerFilter/menu';

export const getVisiblyContent = (visiblyItemList) => {
  //const visiblyItemList = getMenu();
  return visiblyItemList.map((item) => {
    return {
      dataset: item.category,
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
export const getCheckedLayerIdByDataTitleList = (layerTitleList: string[]) => {
  if (layerTitleList.length !== 0) {
    // 最後にチェックされたレイヤのidを取得するため反転
    const reverseLayerTitleList = [...layerTitleList];
    for (const layerTitle of reverseLayerTitleList.reverse()) {
      const idList = getIdByDataTitle(layerTitle);
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
export const filterCheckedData = () =>
  getDataList().filter((data) => {
    return data.checked === true;
  });
