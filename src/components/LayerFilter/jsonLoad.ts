import path from 'path';
import settings from '@/assets/settings.json';
import configJson from '@/assets/config.json';
import { getMenu } from '@/components/LayerFilter/menu';

async function fetchJson(url: string): Promise<any> {
  console.log(url);
  const respons  = await fetch(url);
  const jsonData = await respons.json();
  return jsonData;
}

export default async function jsonLoad(config:any,jsonPath:string):Promise<any> {
  const config_url: string = path.join(config,jsonPath);
  return await fetchJson(config_url);
}

export class assetJsons {
  private _settings: any = {};
  private _menu: any = {};
  private _config: any = {};
  
  constructor() {
  }

  setJsons(settingsJson,menuJson,configJson){
    this._settings = settingsJson;
    this._menu = menuJson;
    this._config = configJson;
  }

  get settings(){
    return this._settings;
  }

  get menu(){
    return this._menu;
  }

  get config(){
    return this._config;
  }

}