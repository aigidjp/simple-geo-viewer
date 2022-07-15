import { Menu } from '@/components/LayerFilter/menu';
import { context } from '@/pages';
import React, { useEffect, useState, useContext } from 'react';
import { DownloadIcon } from '../Icon';

type LayerListProps = {
  title: string;
  layers: React.ReactNode;
};

type TitleProps = {
  datasetName: string;
};

const Title = (props: TitleProps) => {
  const { datasetName } = props;

  return <span className="pl-1">{datasetName}</span>;
};

type LayersProps = {
  height: number;
  elementLength: number;
  content: React.ReactNode;
};

const LayerList = (props: LayersProps) => {
  const { height, elementLength, content } = props;
  const [maxHeight, setMaxHeight] = useState<number>(0);

  useEffect(() => {
    setMaxHeight(height * elementLength);
  }, [elementLength, height]);

  return (
    <div
      style={{ maxHeight: `${maxHeight}px` }}
      className="overflow-auto transition-max-height duration-500 ease border-l-2  border-r-2"
    >
      <div className="p-1">{content}</div>
    </div>
  );
};

const getLayerLength = (menu: Menu, title: string) => {
  const targetDataset = menu.filter((item) => item.category === title);
  return targetDataset[0].data.length;
};

const FolderIcon = (
  <svg viewBox="0 0 576 512" width="0.75rem" height="0.75rem">
    <path d="M572.694 292.093L500.27 416.248A63.997 63.997 0 0 1 444.989 448H45.025c-18.523 0-30.064-20.093-20.731-36.093l72.424-124.155A64 64 0 0 1 152 256h399.964c18.523 0 30.064 20.093 20.73 36.093zM152 224h328v-48c0-26.51-21.49-48-48-48H272l-64-64H48C21.49 64 0 85.49 0 112v278.046l69.077-118.418C86.214 242.25 117.989 224 152 224z" />
  </svg>
);

/**
 * menuをカテゴリー名で探してダウンロードリンクを取得する
 * menuに存在しないカテゴリー名、もしくはダウンロードリンクが未定義の場合はnullを返す
 * @param categoryName
 * @returns {string | null} - ダウンロードリンク文字列。存在しなければnull
 */
const getDownloadLink = (menu: Menu, categoryName: string): string | null => {
  // menuをカテゴリー名で探して配列のインデックスを取得
  const categoryIdx = menu.map((m) => m.category).indexOf(categoryName);
  if (categoryIdx === -1) return null;

  const categoryData = menu[categoryIdx];
  return categoryData.url || null;
};

export const Content: React.FC<LayerListProps> = ({ title, layers }) => {
  const [active, setActive] = useState<boolean>(true);
  const [height, setHeight] = useState<number>(44);

  const { preferences } = useContext(context);

  const toggleAccordion = () => {
    setActive(!active);
    //リソースのdiv要素:36px(20+8+8) + リソース表示領域のpadding:8px(4+4) = 44px
    setHeight(active ? 0 : 44);
  };

  const datasetStyle = {
    borderTopLeftRadius: '3px',
    borderBottom: 'solid 1px #17a2b8',
    borderLeft: 'solid 10px #17a2b8',
    borderTop: 'solid 1px #e2e8f0',
    borderRight: 'solid 1px #e2e8f0',
    fontSize: '0.75rem',
  };

  const downloadLink = getDownloadLink(preferences.menu, title);

  return (
    <div className="pb-px">
      <div
        className="h-10 text-left transition-hover duration-500 ease bg-white hover:bg-gray-200 shadow-md flex p-3"
        style={datasetStyle}
        onClick={toggleAccordion}
      >
        <div className="text-left flex w-11/12">
          {FolderIcon}
          <Title datasetName={title} />
        </div>
        <div className="w-1/12">
          {downloadLink === null ? undefined : DownloadIcon(downloadLink)}
        </div>
      </div>
      <LayerList
        height={height}
        elementLength={getLayerLength(preferences.menu, title)}
        content={layers}
      />
    </div>
  );
};
