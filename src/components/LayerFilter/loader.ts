import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { Menu } from './menu';
import { Config } from './config';
import { RasterSource } from 'maplibre-gl';

/**
 * settings.json
 */
export type Settings = {
  title: string;
  background_color: string;
  tooltip_background_color: string;
};
/**
 * backgrounds.json
 */
export type Backgrounds = {
  [key: string]: {
    name: string;
    source: RasterSource;
  };
};
/**
 * initial_view.json
 */
export type InitialView = {
  map: {
    center: [number, number];
    zoom: number;
    bearing: number;
    pitch: number;
  };
};

/**
 * 複数の設定ファイルJSONを読み込んだ結果を格納するデータ型
 */
export type Preferences = {
  settings: Settings;
  menu: Menu;
  config: Config;
  backgrounds: Backgrounds;
  initialView: InitialView;
};

const fetchJson = async (url: string) => await (await fetch(url)).json();

/**
 * リモートにある設定ファイルJSON群を取得しstateを返す
 * @param router
 * @returns
 */
export const usePreferences = () => {
  const router = useRouter();
  const [preferences, setPreferences] = useState<Preferences | null>(null);
  useEffect(() => {
    // preferencesが指定されているがqueryとして読み込みが完了していない場合はJSONの取得処理の開始を保留する
    if (router.asPath.includes('preferences=') && typeof router.query.preferences === 'undefined')
      return;

    (async () => {
      // クエリパラメータでpreferencesが指定されていればそのURLを
      // 指定されていなければデフォルト設定を読み込む
      let preferencesPath = router.query.preferences as string | undefined;
      if (typeof preferencesPath === 'undefined') {
        preferencesPath = '/defaultPreferences';
      }

      const results = await Promise.all([
        fetchJson(`${preferencesPath}/settings.json`),
        fetchJson(`${preferencesPath}/menu.json`),
        fetchJson(`${preferencesPath}/config.json`),
        fetchJson(`${preferencesPath}/backgrounds.json`),
        fetchJson(`${preferencesPath}/initial_view.json`),
      ]);

      const loadedPreferences: Preferences = {
        settings: results[0] as Settings,
        menu: results[1] as Menu,
        config: results[2] as Config,
        backgrounds: results[3] as Backgrounds,
        initialView: results[4] as InitialView,
      };

      setPreferences(() => loadedPreferences);
    })();
  }, [router.query.preferences]);
  return { preferences };
};
