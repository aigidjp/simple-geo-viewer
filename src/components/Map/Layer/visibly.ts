import { Menu, filterIds, getDataList } from '@/components/LayerFilter/menu';
import { filterLayerName } from '@/components/LayerFilter/layer';
import { filterCheckedData } from '@/components/LayerFilter/sideBar';

/**
 * サイドバーのチェックボックスがonになっているリソースのidを収集する
 * @param selectedResourceNameList
 */
const getVisiblyLayerIdList = (selectedResourceNameList: string[], menu: Menu) => {
  return filterLayerName(getDataList(menu), selectedResourceNameList)
    .map((resource) => resource.id)
    .flat();
};

/**
 * リソースの表示/非表示を切り替える
 * @param originalLayers
 * @param targetLayerIdList
 */
export function toggleVisibly(originalLayers: any[], targetLayerIdList: string[], menu: Menu) {
  // チェックボックスがオンになっている確認可能なidのリストを作成
  const visibleLayerIdList = filterIds(menu, getVisiblyLayerIdList(targetLayerIdList, menu));

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
  private zoomLevel: number;
  private _menu: Menu;
  constructor(menu: Menu, zoom: number) {
    this._menu = menu;
    this.zoomLevel = zoom;
    this.layerList = filterCheckedData(this._menu).map((layer) => layer.title);
  }
  setlayerList(targetLayerIdList: string[]) {
    this.layerList = filterIds(this._menu, getVisiblyLayerIdList(targetLayerIdList, this._menu));
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
