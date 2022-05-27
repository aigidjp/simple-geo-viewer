import { filterIds, getDataList } from '@/components/LayerFilter/menu';
import { filterLayerName } from '@/components/LayerFilter/layer';

/**
 * サイドバーのチェックボックスがonになっているリソースのidを収集する
 * @param selectedResourceNameList
 */
const getVisiblyLayerIdList = (selectedResourceNameList: string[]) => {
  return filterLayerName(getDataList(), selectedResourceNameList)
    .map((resource) => resource.id)
    .flat();
};

/**
 * リソースの表示/非表示を切り替える
 * @param originalLayers
 * @param targetLayerIdList
 */
export function toggleVisibly(originalLayers: any[], targetLayerIdList: string[]) {
  // チェックボックスがオンになっている確認可能なidのリストを作成
  const visibleLayerIdList = filterIds(getVisiblyLayerIdList(targetLayerIdList));
  //上記リストでdeck.glの可視状態を変更したレイヤーの配列を返す
  return originalLayers.map((layer: any) => {
    if (!layer) return;

    if (visibleLayerIdList.includes(layer.id)) {
      return layer.clone({
        visible: true,
      });
    } else {
      return layer.clone({
        visible: false,
      });
    }
  });
}
