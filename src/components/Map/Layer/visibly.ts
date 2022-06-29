import { getMenu, filterIds, getDataList } from '@/components/LayerFilter/menu';
import { filterLayerName } from '@/components/LayerFilter/layer';
import { filterCheckedData } from '@/components/LayerFilter/sideBar';
import { initialViewState } from '@/components/Map/initialViewState';

/**
 * サイドバーのチェックボックスがonになっているリソースのidを収集する
 * @param selectedResourceNameList
 */
const getVisiblyLayerIdList = (selectedResourceNameList: string[]) => {
  return filterLayerName(getDataList(getMenu()), selectedResourceNameList)
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
  const visibleLayerIdList = filterIds(getMenu(), getVisiblyLayerIdList(targetLayerIdList));

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

/**
 * リソースの表示/非表示をズームレベルで切り替える
 * @param originalLayers
 * @param visLayers
 */
export function zoomVisibly(originalLayers: any[], visLayers: visiblyLayers) {
  const visibleLayerIdList = visLayers.getlayerList();

  return originalLayers.map((layer: any) => {
    if (!layer) return;

    if (checkzoom(layer, visLayers.getzoomLevel()) && visibleLayerIdList.includes(layer.id)) {
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

export class visiblyLayers {
  private layerList: any[];
  private zoomLevel: number = initialViewState.zoom;
  constructor() {
    this.layerList = filterCheckedData().map((layer) => layer.title);
  }
  setlayerList(targetLayerIdList: string[]) {
    this.layerList = filterIds(getMenu(), getVisiblyLayerIdList(targetLayerIdList));
  }
  getlayerList() {
    return this.layerList;
  }
  setzoomLevel(zoomlevel: number) {
    this.zoomLevel = zoomlevel;
  }
  getzoomLevel() {
    return this.zoomLevel;
  }
}

export function checkzoom(layer: any, zoomlevel: number) {
  if (layer.props.minzoom == undefined) {
    return true;
  }
  if (layer.props.minzoom <= zoomlevel) {
    return true;
  } else {
    return false;
  }
}
