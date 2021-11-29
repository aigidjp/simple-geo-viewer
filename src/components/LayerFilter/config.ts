import configJson from '@/assets/config.json';
import { getFilteredIdList } from '@/components/LayerFilter/menu';

/**
 * 表示可能なレイヤのconfigだけ収集する
 */
export const getFilteredLayerConfig = () => {
  return configJson['layers'].filter((layer) => getFilteredIdList().includes(layer.id));
};

/**
 * 指定したidのconfigを取得する
 */
export const getLayerConfigById = (id: string) => {
  return configJson['layers'].find((layer) => layer.id === id);
};
