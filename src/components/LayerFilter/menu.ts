import menuJson from '../../assets/menu.json';

type DataType = 'raster' | 'vector' | 'polygon' | 'line' | 'point' | 'building' | 'icon';

/**
 * menu.json直下のFolderがもつレイヤー定義
 * menu.json内ではdata:Data[]として配列で保持されている
 */
export type Data = {
  title: string;
  type: DataType;
  lng: number;
  lat: number;
  zoom: number;
  id: string[];
  checked: boolean;
  color?: string;
  icon?: string;
  download_url?: string;
};

/**
 * menu.json直下の各要素
 * Folderはメタデータのほかdata: Data[]として子要素の配列を持つ
 */
type Folder = {
  category: string;
  url?: string;
  open?: boolean;
  data: Data[];
};

/**
 * menu.jsonの構造と一致する型
 */
export type Menu = Folder[];

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
 * 絞り込み入力で絞り込まれたMenuを取得する
 * （カテゴリーに関しては絞り込まない）
 * @param inputFilterKeyword //入力されたキーワード
 */
export const getFilteredMenu = (menu: Menu, inputFilterKeyword: String): Menu => {
  if (inputFilterKeyword === '') return menu;

  // 正規表現にて絞り込み
  const regExp = new RegExp(`.*(${inputFilterKeyword.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&')}).*`);

  const filteredMenu: Menu = [];
  menu.forEach((category) => {
    // カテゴリ名で判定し、マッチしたらそのカテゴリおよび子Dataすべてをヒット扱いとする
    if (category.category.match(regExp)) {
      filteredMenu.push(category);
      return;
    }

    // カテゴリ名ではヒットしなかったが、Data.titleがヒットした場合、親カテゴリおよびそのDataをヒット扱いとする
    const filteredData = category.data.filter((layerData) => {
      return layerData.title.match(regExp);
    });

    if (filteredData.length > 0) {
      const filteredCategory: Folder = { ...category }; // DeepCopy
      filteredCategory.data = filteredData;
      filteredMenu.push(filteredCategory);
    }
  });
  return filteredMenu;
};
