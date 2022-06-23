import React, { ReactNode, VFC } from 'react';

type BaseTooltipProps = { children: ReactNode };

const BaseTooltip: VFC<BaseTooltipProps> = ({ children }) => {
  return (
    <div className="visible">
      <div id="tooltip_content" className="bg-white overscroll-auto">
        <table className="tooltip_table">{children}</table>
      </div>
    </div>
  );
};

type TooltipProps = {
  properties: any;
  labels: string[];
};

export const Tooltip: VFC<TooltipProps> = ({ properties, labels }) => {
  return (
    <BaseTooltip>
      <tbody>
        {labels.map((key) => {
          const value = String(properties[key]);

          // "画像"というkeyでかつURLを持っている場合は画像を表示する・それ以外は文字列として表示する
          let content: JSX.Element | string;
          if (key === '画像') {
            content = 'N/A';
            if (value.startsWith('http')) content = <img src={value} />; // 値がURLではない場合があるのでチェック
          } else {
            content = value;
          }

          return (
            <tr key={key}>
              <th className="tooltip_th">{key}</th>
              <td className="tooltip_td">{content}</td>
            </tr>
          );
        })}
      </tbody>
    </BaseTooltip>
  );
};
