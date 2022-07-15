import { context } from '@/pages';
import React, { useContext } from 'react';
import { getDataTitleById } from '@/components/LayerFilter/menu';

type props = {
  id: string;
};

export const Title = (props: props) => {
  const { menu } = useContext(context);
  const { id } = props;
  const title = getDataTitleById(menu, id);
  return <p className="text-center font-bold">{title}</p>;
};
