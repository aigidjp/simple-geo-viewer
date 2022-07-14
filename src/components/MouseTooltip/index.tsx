export type MouseTooltipData = {
  text: string;
  top: number;
  left: number;
};

type Props = {
  mouseTooltipData: MouseTooltipData;
};
const MouseTooltip: React.FC<Props> = ({ mouseTooltipData }) => {
  const { text, top, left } = mouseTooltipData;
  return (
    <div
      className={
        'absolute text-xs whitespace-nowrap bg-black text-white rounded-md h-6 px-2 py-1 z-10'
      }
      style={{ top: `${top}px`, left: `${left}px` }}
    >
      {text}
    </div>
  );
};
export default MouseTooltip;
