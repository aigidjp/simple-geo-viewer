import { Map, RasterSource } from 'maplibre-gl';

import React, { useContext } from 'react';
import { context } from '@/pages';

type Props = {
  map: Map;
};

const BackgroundSelector: React.FunctionComponent<Props> = ({ map }) => {
  const { preferences } = useContext(context);
  const updateBackground = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (map === undefined) return;

    // プルダウンで選択されたレイヤーのsourceを取得
    const selectedBackgroundId = e.target.value;
    const { source } = preferences.backgrounds[selectedBackgroundId];

    // styleのsources.backgroundを上書きしstyleを更新
    const style = map.getStyle();
    style.sources!.background = source;
    map.setStyle(style);
  };

  const entries: [string, any][] = Object.entries(preferences.backgrounds);
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
