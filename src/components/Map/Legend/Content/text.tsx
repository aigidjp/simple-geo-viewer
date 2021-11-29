type props = {
  name: string;
};

export const Text = (props: props) => {
  const { name } = props;
  return <p className="text-center m-0 p-0">: {name}</p>;
};
