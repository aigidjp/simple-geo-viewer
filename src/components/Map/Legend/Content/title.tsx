import { getDataTitleById } from '@/components/LayerFilter/menu';

type props = {
  id: string;
};

export const Title = (props: props) => {
  const { id } = props;
  const title = getDataTitleById(id);
  return <p className="text-center font-bold">{title}</p>;
};
