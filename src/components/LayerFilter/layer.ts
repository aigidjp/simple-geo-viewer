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

/**
 * 絞り込み入力で絞り込まれたレイヤだけ収集する
 * @param dataList
 * @param selectedRefinementWord
 */
 export const filterLayerNameInputText = (dataList: resource[], selectedRefinementWord: string) =>
 dataList.filter((resource) => {
   const regExp = new RegExp(`.*(${selectedRefinementWord}).*`);
   return resource.title.match(regExp);
 });