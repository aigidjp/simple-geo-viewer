type props = {
  color: number[];
};

export const Symbol = (props: props) => {
  const { color } = props;
  const bgColorStyle = {
    backgroundColor: `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3]})`,
  };

  return <div className="h-3 w-3 mr-2" style={bgColorStyle}></div>;
};
