import menuJson from '../../assets/menu.json';

/**
 * menu.jsonを返す
 */
export const getMenu = () => menuJson;

/**
 * 表示可能なidの配列を返す
 */
export const getFilteredIdList = () =>
  getMenu()
    .map((menu) => menu.data)
    .flat()
    .map((data) => data.id)
    .flat();

/**
 * 表示可能なidによってidをフィルタリング
 * @param idList
 */
export const filterIds = (idList: string[]) =>
  idList.filter((id) => {
    return getFilteredIdList().includes(id);
  });

/**
 * menu.jsonからdataを抜き出して配列として取得
 */
export const getDataList = () =>
  getMenu()
    .map((dataset) => dataset.data)
    .flat();

/**
 * idからdataのtitleを取得
 * @param id
 */
export const getDataTitleById = (id: string) =>
  getDataList().filter((data) => data.id.includes(id))[0].title;
/**
 * dataのtitleからidを取得
 * @param title
 */
export const getIdByDataTitle = (title: string) =>
  getDataList().filter((data) => data.title === title)[0].id;

/**
 * 指定したidのresourceを取得
 * @param targetResourceIds
 */
export const getDataById = (targetResourceIds: string[]) => {
  //複数になる場合は全て同じリソースが入っているはずなので最初のリソースを取得
  //findだと型アサーションが必要
  return getDataList().filter((data) => data.id[0] === targetResourceIds[0])[0];
};

/**
 * 絞り込み入力で絞り込まれたレイヤだけ収集する
 * @param inputFilterKeyword
 */
export const filterLayerNameInputText = (inputFilterKeyword: String) => {
  if (inputFilterKeyword === '') return getMenu();

  const regExp = new RegExp(`.*(${inputFilterKeyword}).*`);

  let menuArray: Array<object> = [];
  getMenu().forEach((menuData) => {
    // @ts-ignore
    const filterLayer = menuData.data.filter((layerData) => {
      return layerData.title.match(regExp);
    });

    if (filterLayer.length > 0) {
      const filterMenuData = { ...menuData }; // DeepCopy
      filterMenuData.data = filterLayer;
      menuArray.push(filterMenuData);
    }
  });
  return menuArray;
};
