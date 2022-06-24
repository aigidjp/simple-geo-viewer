import { getDataTitleById, getMenu } from '@/components/LayerFilter/menu';

type props = {
  id: string;
};

export const Title = (props: props) => {
  const { id } = props;
  const title = getDataTitleById(getMenu(), id);
  return <p className="text-center font-bold">{title}</p>;
};
