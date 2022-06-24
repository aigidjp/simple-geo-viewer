import menuJson from '../../assets/menu.json';

type DataType = 'raster' | 'vector' | 'polygon' | 'line' | 'point' | 'building' | 'icon';
type Data = {
  title: string;
  type: DataType;
  lng: number;
  lat: number;
  zoom: number;
  id: string[];
  checked: boolean;
  color: string;
  icon?: string;
  download_url?: string;
};

type Category = {
  category: string;
  url?: string;
  open?: boolean;
  data: Data[];
};

export type Menu = Category[];

/**
 * menu.jsonを返す
 */
export const getMenu = () => menuJson as Menu;

/**
 * 表示可能なidの配列を返す
 */
export const getFilteredIdList = (menu: Menu) =>
  menu
    .map((menu) => menu.data)
    .flat()
    .map((data) => data.id)
    .flat();

/**
 * 表示可能なidによってidをフィルタリング
 * @param idList
 */
export const filterIds = (menu: Menu, idList: string[]) =>
  idList.filter((id) => {
    return getFilteredIdList(menu).includes(id);
  });

/**
 * menu.jsonからdataを抜き出して配列として取得
 */
export const getDataList = (menu: Menu) => menu.map((dataset) => dataset.data).flat();

/**
 * idからdataのtitleを取得
 * @param id
 */
export const getDataTitleById = (menu: Menu, id: string) =>
  getDataList(menu).filter((data) => data.id.includes(id))[0].title;
/**
 * dataのtitleからidを取得
 * @param title
 */
export const getIdByDataTitle = (menu: Menu, title: string) =>
  getDataList(menu).filter((data) => data.title === title)[0].id;

/**
 * 指定したidのresourceを取得
 * @param targetResourceIds
 */
export const getDataById = (menu: Menu, targetResourceIds: string[]) => {
  //複数になる場合は全て同じリソースが入っているはずなので最初のリソースを取得
  //findだと型アサーションが必要
  return getDataList(menu).filter((data) => data.id[0] === targetResourceIds[0])[0];
};

/**
 * 絞り込み入力で絞り込まれたレイヤだけ収集する
 * （カテゴリーに関しては絞り込まない）
 * @param inputFilterKeyword //入力されたキーワード
 */
export const getFilterdLayer = (menu: Menu, inputFilterKeyword: String) => {
  if (inputFilterKeyword === '') return menu;

  // 正規表現にて絞り込み
  const regExp = new RegExp(`.*(${inputFilterKeyword.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&')}).*`);

  let menuArray: Array<object> = [];
  menu.forEach((category) => {
    // @ts-ignore
    const filteredData = category.data.filter((layerData) => {
      return layerData.title.match(regExp);
    });

    if (filteredData.length > 0) {
      const filterMenuData = { ...category }; // DeepCopy
      filterMenuData.data = filteredData;
      menuArray.push(filterMenuData);
    }
  });
  return menuArray;
};
