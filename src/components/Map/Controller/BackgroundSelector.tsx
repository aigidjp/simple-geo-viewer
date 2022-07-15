import maplibregl from 'maplibre-gl';

import React, { useContext } from 'react';
import { context } from '@/pages';

type Props = {
  map: maplibregl.Map;
};

// JSONを型キャストして保持
export type BackgroundData = { name: string; source: maplibregl.RasterSource };
export function toBACKGROUNDS(backgrounds: any): any{
  return backgrounds as { [key: string]: BackgroundData };
};

const BackgroundSelector: React.FunctionComponent<Props> = ({ map }) => {
  const { backgrounds } = useContext(context);
  const updateBackground = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (map === undefined) return;

    // プルダウンで選択されたレイヤーのsourceを取得
    const selectedBackgroundId = e.target.value;
    const { source } = backgrounds[selectedBackgroundId];

    // styleのsources.backgroundを上書きしstyleを更新
    const style = map.getStyle();
    style.sources!.background = source;
    map.setStyle(style);
  };

  const entries = Object.entries(backgrounds);
  return (
    <select onChange={(e) => updateBackground(e)}>
      {entries.map(([id, data]) => (
        <option key={id} value={id}>
          {data.name}
        </option>
      ))}
    </select>
  );
};

export default BackgroundSelector;
