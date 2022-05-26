import maplibregl from 'maplibre-gl';

import backgrounds from '@/assets/backgrounds.json';

type Props = {
  map: maplibregl.Map;
};

// JSONを型キャストして保持
type BackgroundData = { name: string; source: maplibregl.RasterSource };
export const BACKGROUNDS = backgrounds as { [key: string]: BackgroundData };

const BackgroundSelector: React.FunctionComponent<Props> = ({ map }) => {
  const updateBackground = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (map === undefined) return;

    // プルダウンで選択されたレイヤーのsourceを取得
    const selectedBackgroundId = e.target.value;
    const { source } = BACKGROUNDS[selectedBackgroundId];

    // styleのsources.backgroundを上書きしstyleを更新
    const style = map.getStyle();
    style.sources!.background = source;
    map.setStyle(style);
  };

  const entries = Object.entries(BACKGROUNDS);
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
