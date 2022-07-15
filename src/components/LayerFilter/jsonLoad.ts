import path from 'path';

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