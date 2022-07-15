import React, { useContext } from 'react';
import { context } from '@/pages';
import Content from '@/components/Map/Legend/Content';
import { clickedLayerViewState } from '@/components/Map/types';
import { havingLegendIdList } from '@/components/Map/Legend/layerIds';
import { getDataTitleById } from '@/components/LayerFilter/menu';
import { getCheckedLayerIdByDataTitleList } from '@/components/LayerFilter/sideBar';
import { defaultLegendId } from '@/components/Map/Legend/layerIds';

const getClickedLayerId = (clickedLayerViewState: clickedLayerViewState | null) => {
  return clickedLayerViewState ? clickedLayerViewState.id : '';
};

/**
 * 凡例を表示するレイヤのidを取得
 * - 凡例を持つレイヤをチェックしたらその凡例を表示
 * - チェックを外したら、他にチェックされているレイヤを最後にチェックされた順に走査して凡例を持つものがあれば表示
 */
export const useGetClickedLayerId = () => {
  const {
    clickedLayerViewState,
    checkedLayerTitleList,
    displayedLegendLayerId,
    setDisplayedLegendLayerId,
    isDefault,
    setIsDefault,
    preferences,
  } = useContext(context);

  const clickedId = getClickedLayerId(clickedLayerViewState);

  // 現在凡例が表示されている場合、そのタイトルを取得
  let displayedLegendLayerTitle = '';
  if (displayedLegendLayerId !== '') {
    displayedLegendLayerTitle = getDataTitleById(preferences.menu, displayedLegendLayerId);
  }
  // 初回にこの関数が呼ばれた際は何も返さない
  if (isDefault) {
    setIsDefault(false);
    return '';
  }

  // 凡例を持つレイヤがチェックされた時
  if (clickedId && havingLegendIdList.includes(clickedId)) {
    setDisplayedLegendLayerId(clickedId);
    return clickedId;

    // 凡例を持たないレイヤがチェックされた時
  } else if (clickedId && !havingLegendIdList.includes(clickedId)) {
    // すでに表示されている凡例があればそのまま表示
    if (displayedLegendLayerTitle) {
      return displayedLegendLayerId;
    }
    // 現在凡例が表示されておらず、かつ凡例を持つレイヤがチェックされていたら、その凡例を表示
    const id = getCheckedLayerIdByDataTitleList(checkedLayerTitleList, preferences.menu);
    setDisplayedLegendLayerId(id);
    return id;

    // すでに表示されている凡例のレイヤ以外のチェックが外された場合、そのまま表示
  } else if (!clickedId && checkedLayerTitleList.includes(displayedLegendLayerTitle)) {
    return displayedLegendLayerId;

    // デフォルト時の処理
  } else if (
    !clickedId &&
    checkedLayerTitleList.includes(displayedLegendLayerTitle) &&
    displayedLegendLayerId === defaultLegendId
  ) {
    return defaultLegendId;

    // すでに表示されている凡例のレイヤのチェックが外された場合
  } else if (!clickedId && !checkedLayerTitleList.includes(displayedLegendLayerTitle)) {
    // 凡例を持つレイヤがチェックされていたら、その凡例を表示
    const id = getCheckedLayerIdByDataTitleList(checkedLayerTitleList, preferences.menu);
    setDisplayedLegendLayerId(id);
    return id;
  }
  // getCheckedLayerIdByDataTitleListですべて拾えている想定だが一応追加
  setDisplayedLegendLayerId('');
  return '';
};

const Legend: React.FC<{ id: string }> = ({ id }) => {
  return id ? <>{id ? <Content id={id} /> : ''}</> : <></>;
};
export default Legend;
