import { resource } from '@/components/Map/types';

/**
 * サイドバーのチェックボックスがonになっているレイヤだけ収集する
 * @param dataList
 * @param selectedResourceNameList
 */
export const filterLayerName = (dataList: resource[], selectedResourceNameList: string[]) =>
  dataList.filter((resource) => {
    const resourceName = resource.title;
    return selectedResourceNameList.includes(resourceName);
  });
