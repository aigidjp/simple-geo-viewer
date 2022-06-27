import { Data } from '@/components/LayerFilter/menu';

/**
 * サイドバーのチェックボックスがonになっているレイヤだけ収集する
 * @param dataList
 * @param selectedResourceNameList
 */
export const filterLayerName = (dataList: Data[], selectedResourceNameList: string[]) =>
  dataList.filter((resource) => {
    const resourceName = resource.title;
    return selectedResourceNameList.includes(resourceName);
  });
