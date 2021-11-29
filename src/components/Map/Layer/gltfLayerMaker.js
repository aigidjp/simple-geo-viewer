import { ScenegraphLayer } from '@deck.gl/mesh-layers';
import { GLTFLoader } from '@loaders.gl/gltf';
import { fetchFile, parse } from '@loaders.gl/core';
import { show } from '@/components/Tooltip/show';

/**
 * GLTF Layerの作成
 * @param map {maplibregl.Map}
 * @param layerConfig {any}
 * @param init {boolean}
 * @param setTooltipData {Dispatch<SetStateAction<any>>}
 * @returns {ScenegraphLayer[]}
 */
export function makeGltfLayers(map, layerConfig, init, setTooltipData) {
  const gltfCreator = new gltfLayerCreator(layerConfig, map, setTooltipData);
  return gltfCreator.makeDeckGlLayers(init);
}

class gltfLayerCreator {
  map;
  layerConfig;
  layersType = 'gltf';
  setTooltipData;

  /**
   *
   * @param layerConfig {any}
   * @param map {maplibregl.Map}
   * @param setTooltipData {Dispatch<SetStateAction<any>>}
   */
  constructor(layerConfig, map, setTooltipData) {
    this.layerConfig = layerConfig;
    this.map = map;
    this.setTooltipData = setTooltipData;
  }

  /**
   * DeckGLLayerの作成
   * @param init {boolean} 初期表示レイヤーかどうか
   * @returns {ScenegraphLayer[]}
   */
  makeDeckGlLayers(init) {
    const targetLayerConfigs = this.extractTargetConfig();
    return targetLayerConfigs.map((layerConfig) => {
      const config = this.extractLayerConfig(layerConfig);

      const content = fetchFile(layerConfig.source);

      const scenegraph = parse(content, GLTFLoader);

      return new ScenegraphLayer({
        data: layerConfig.source,
        visible: init,
        pickable: true,
        scenegraph: scenegraph,
        _lighting: 'flat',
        autoHighlight: true,
        onClick: this.showToolTip,
        ...config,
      });
    });
  }

  extractLayerConfig = (layerConfig) => {
    const { type, source, ...otherConfig } = layerConfig;
    return otherConfig;
  };

  /**
   * layersTypeに適合するレイヤーコンフィグを取り出し
   * @private
   */
  extractTargetConfig() {
    return this.layerConfig.filter((layer) => {
      return layer.type === this.layersType;
    });
  }

  showToolTip = (info) => {
    const { coordinate, object } = info;
    if (!coordinate) return;
    if (!object) return;
    show(object, coordinate[0], coordinate[1], this.map, this.setTooltipData);
  };
}
