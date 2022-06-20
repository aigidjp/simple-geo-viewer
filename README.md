# simple-geo-viewer

![gif1](./docs/images/1.gif)

※This is an experimental library.

- これはデータを用意して、設定ファイルを修正するだけですぐにデータをブラウザ上に可視化できるシンプルなビューワーです。
- データの表示、初期表示位置などの変更、データのグルーピング、凡例の表示、表示データの色変更、クリック時の属性情報表示などが簡単に行えます。
- 以下のデータ形式に対応しています。（カッコがついているデータは特に実験的な形式になります。ソースコードに大きく変更を加える可能性があります。）
  - GeoJSON
  - ラスタータイル
  - ベクタータイル
  - （3dtiles）
  - （icon）
  - （GLTF）

## 動作環境

本ライブラリは以下の環境でのみ動作確認が行われています。その他の環境での動作は保証できません。

- Node.js: v16.6.0
- yarn: 1.22.11
- OS: macOS 11.1
```
% sw_vers
ProductName:    macOS
ProductVersion: 11.1
BuildVersion:   20C69
```
- ブラウザ: Google Chrome
  - バージョン: 96.0.4664.55（Official Build） （x86_64）

### Node.js

## インストール

- yarn（もしくはnpm）が必須のため、インストールされていない方は別途インストールをお願いします。
- その後、リポジトリのルートディレクトリで以下のコマンドを入力してパッケージをインストールします。

```shell
yarn install
```

## 起動

### サンプルデータのダウンロード

- 設定項目のサンプルとして、東京都の指定緊急避難場所データ及び行政区域データを設定していますが、元データはリポジトリに格納しておらず、ダウンロードする必要があります。
- 以下のリンクよりデータをダウンロードしてください
- 指定緊急避難場所データ
  - https://www.geospatial.jp/ckan/dataset/hinanbasho-13/resource/54b500b8-ef85-47fc-83d7-895b5488810e
- 行政区域データ
  - https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-N03-v3_0.html#prefecture13
- 行政区域データは東京都の「令和3年」のものをダウンロードし、zipファイルの中にgeojsonが入っているので、そちらを格納してください。
  - `N03-20210101_13_GML\N03-21_13_210101.geojson`というgeojsonが入っているので、`N03-21_13_210101.geojson`にリネームしてください。
  
### データの格納

- ファイル名が以下のようになっているか確認してください。
- 指定緊急避難場所データ
  - 13.geojson
- 行政区域データ
  - N03-21_13_210101.geojson
- `mkdir -p public/data`のようなコマンドでリポジトリのルートに`public`ディレクトリと`data`ディレクトリを作成してください
- 上記ファイルを`public/data`に格納してください

### ローカルサーバーを起動

- 以下のコマンドを入力すると、ローカルサーバーが立ち上がり、[http://localhost:3000/](http://localhost:3000/)をブラウザで開けます。

```shell
yarn dev
```

## ビルド

- 以下のコマンドを入力するとルートにoutフォルダが作成されます。
- このフォルダの中身をホスティングすることで、即座にWeb上で公開できます。

```shell
yarn build
```

## 詳細設定

- ほとんどの設定は`src/assets`の中のJSONを変更するだけで良いですが、直接ソースコードを修正し、複雑な設定を行うこともできます。

### ヘッダーの調整

- `src/assets/settings.json`を変更し、タイトルとヘッダーの色を変更することができます。

###　初期表示位置

- `src/assets/initial_view.json`を変更し、地図上の初期表示位置などを変更することができます。

#### 設定項目

- center: 位置
- zoom: ズームレベル
- bearing: 向き
- pitch: 傾き

### 背景地図

- `src/assets/backgrounds.json`を修正することで背景地図を変更・追加することができます。ここで1番目に定義された背景地図が初期状態で表示される背景となります。

#### 設定項目

- `Mapbox Style Specification`に準拠しています。
- 詳しくは[こちら](https://docs.mapbox.com/help/glossary/style/)

### 表示レイヤー設定

- 表示レイヤーの設定は以下の2ファイルに分かれています。
  - `src/assets/menu.json`: サイドバーに表示する内容を記述します。
  - `src/assets/config.json`: menu.jsonから参照される実際のレイヤーを記述します。

#### 設定項目

##### menu

- category: レイヤー群のカテゴリー名を入力します。
- url: もし、データが公開されている場合はここにURLを入力することでダウンロードリンクを付与することができます。
- data.title: 表示レイヤー名を入力します。**（※別カテゴリーであっても、重複する名称は利用できません。）**
- data.type: レイヤー名の横に表示されるアイコンを決定します。（対応typeは別途記載）
- data.lng: クリック時に画面移動する対象の経度を入力します。
- data.lat: クリック時に画面移動する対象の緯度を入力します。
- data.zoom: クリック時に画面移動する対象のズームレベルを入力します。
- data.id: クリック時に表示・非表示を切り替えるレイヤーを指定します。
- data.checked: 初期表示時に可視状態にするレイヤーはtrueを設定します。
- data.color: アイコンの表示色を設定します。

###### 設定可能なタイプ

- data.typeには以下の項目が指定可能です
  - raster
  - icon
  - point
  - line
  - polygon
  - building

##### config

- id: 任意のidを指定します
- type: 表示するレイヤーのタイプを記述します。記述したタイプと、実データのフォーマットが一致している必要があります。（対応typeは別途記載）
- source: 実データを`public`ディレクトリ以下に格納したローカルファイルか、ホスティング先のURLを指定します。
- download_url(optional): ダウンロードリンクとしてURLを指定できます。指定されている場合、クリックすると指定したURLへジャンプすることができるボタンがレイヤー一覧に追加されます。
- others: その他、各タイプ毎にDeck.glのレンダーオプションに準拠したオプションを設定可能です。

###### 設定可能なタイプ

- geojson: [https://deck.gl/docs/api-reference/layers/geojson-layer](https://deck.gl/docs/api-reference/layers/geojson-layer)
- raster: [https://deck.gl/docs/api-reference/geo-layers/tile-layer](https://deck.gl/docs/api-reference/geo-layers/tile-layer)
- mvt: [https://deck.gl/docs/api-reference/geo-layers/mvt-layer](https://deck.gl/docs/api-reference/geo-layers/mvt-layer)
- 3dtiles: [https://deck.gl/docs/api-reference/geo-layers/tile-3d-layer](https://deck.gl/docs/api-reference/geo-layers/tile-3d-layer)
- gltf: [https://deck.gl/docs/api-reference/mesh-layers/scenegraph-layer](https://deck.gl/docs/api-reference/mesh-layers/scenegraph-layer)
- icon: [https://deck.gl/docs/api-reference/layers/icon-layer](https://deck.gl/docs/api-reference/layers/icon-layer)
- bus_trip: GTFSのトラッキングデータを読み込んで時系列アニメーション表示ができます。形式はこの[GeoJSON](https://data.digitalsmartcity.jp/susono/GTFS_FUJIKYU_CITYBUS/trips_fujikyu_202012_wd.json)に準拠します。
- temporal_polygon: GeoJSONポリゴンを、属性に応じて時系列アニメーション表示ができます。形式はこの[GeoJSON](https://data.digitalsmartcity.jp/susono/persontrip/boundaryvolume.geojson)に準拠します。
- temporal_line: GeoJSONポリゴンを、属性に応じて時系列アニメーション表示ができます。形式はこの[GeoJSON](https://data.digitalsmartcity.jp/susono/persontrip/linkvolume.geojson)に準拠します。
- trips_json: [https://deck.gl/docs/api-reference/geo-layers/trips-layer](https://deck.gl/docs/api-reference/geo-layers/trips-layer)
- trips_drm: [https://deck.gl/docs/api-reference/geo-layers/mvt-layer](https://deck.gl/docs/api-reference/geo-layers/mvt-layer)

#### 各種表示レイヤー設定のサンプル

##### geojson

```json
{
  "layers": [
    {
      "id": "sample-point-geojson",
      "type": "geojson",
      "source": "./data/sample.geojson",
      "download_url": "https://www.google.co.jp/",
      "getPointRadius": 50
    }
  ]
}
```

##### raster

```json
{
  "layers": [
    {
      "id": "sample-raster",
      "type": "raster",
      "source": "./data/sample/{z}/{x}/{y}.png",
      "minZoom": 10,
      "maxZoom": 18
    }
  ]
}
```

##### vector

```json
{
  "layers": [
    {
      "id": "sample-vector",
      "type": "mvt",
      "source": "./data/sample/{z}/{x}/{y}.pbf",
      "download_url": "https://nlftp.mlit.go.jp/ksj/",
      "getFillColor": [255, 255, 0, 100],
      "getLineColor": [0, 0, 0, 255],
      "getLineWidth": 10,
      "minZoom": 10,
      "maxZoom": 18
    }
  ]
}
```

##### 3dtiles

```json
{
  "layers": [
    {
      "id": "sample-3dtiles",
      "type": "3dtiles",
      "source": "./data/sample/tileset.json"
    }
  ]
}
```

##### gltf

```json
{
  "layers": [
    {
      "id": "sample-gltf",
      "type": "gltf",
      "source": "./data/sample/sample.glb",
      "coords": [139.77, 35.67, 0],
      "color": [200, 150, 80, 180],
      "orientation": [0, 0, 0]
    }
  ]
}
```

##### icon

```json
{
  "layers": [
    {
      "id": "sample-icon",
      "type": "icon",
      "source": "./data/sample/icon.svg",
      "coords": [139.77, 35.67, 0],
      "color": [5, 5, 190, 255]
    }
  ]
}
```

##### bus_trip

```json
{
  "layers": [
    {
      "id": "sample-bus-trip",
      "source": "GTFSのトラッキングデータURL",
      "iconUrl": "images/bus_yellow.png"
    }
  ]
}
```

#### temporal_polygon

```json
    {
      "id": "jinryu_2d",
      "type": "temporal_polygon",
      "source": "時系列geojsonデータ",
      "values": [0, 2000],
      "colors": [
        [255, 255, 255, 0],
        [255, 0, 0, 200]
      ]
    }
```

高さを示す値の範囲を設定することで3D表示もできます。

```json
{
  "id": "jinryu_3d",
  "type": "temporal_polygon",
  "source": "時系列geojsonデータ",
  "values": [0, 2000],
  "colors": [
    [255, 255, 255, 0],
    [255, 0, 0, 200]
  ],
  "heights": [0, 2000]
}
```

#### temporal_line

```json
    {
      "id": "jinryu_line",
      "type": "temporal_line",
      "source": "時系列geojsonデータ",
      "values": [0, 100],
      "colors": [
        [255, 255, 255, 100],
        [255, 0, 0, 200]
      ],
      "widths": [5, 20]
    }
```

#### trips_json

```json
    {
      "id": "trips_json_weekday",
      "type": "trips_json",
      "source": "時系列geojsonデータ",
      "width": 5,
      "color": [0, 0, 255],
      "trailLength": 30
    }
```

#### trips_drm

```json
    {
      "id": "trips_drm",
      "type": "trips_drm",
      "source": "DRMの時系列ベクトルデータ",
      "values": [0, 5],
      "colors": [
        [255, 255, 255, 100],
        [255, 0, 0, 200]
      ],
      "step": 60
    }
```
### 高度なレイヤー設定

- ソースコードに簡単な修正を加えることで、凡例を表示したり、属性値に合わせて表示色を切り替えることができます。

#### 凡例の表示

##### 凡例の表示色を設定

- geojson/mvt/rasterのタイプでは凡例が表示できます。
- まず、`src/components/Map/Legend/layerIds.ts`を修正します。
  - ベクターレイヤー（geojson/mvt）の場合には以下を指定します
    - `havingLegendIdList`: 凡例を表示させたいレイヤーのidを格納します。
    - `defaultLegendId`: 初期表示時に凡例を表示させたいレイヤーのidを入力します。
  - ラスターレイヤー（raster）の場合には以下を指定します。
    - `rasterLegendObjList`
      - id: レイヤーのidを指定します。
      - src: ご自分でSVGを作成し、そのURLもしくはローカルのファイルを指定します。
```typescript
// 表示させたい凡例が存在しない場合は空にするのではなく、空文字を配列に格納する
export const havingLegendIdList = ['gyosei-tokyo'];

// 表示させたい凡例が存在しない場合は空にするのではなく、空文字を登録する
export const defaultLegendId = '';

// 表示させたい凡例が存在しない場合は空にするのではなく、idとsrcを持つオブジェクトを登録する
export const rasterLegendObjList = [
  {
    id: '',
    src: '',
  },
];
```
- 次に`src/components/Map/Legend/colorParamList.ts`を編集します。
- `getColorParamList`関数にレイヤーidを指定した条件分岐を増やします。
- 条件には分岐の中では任意の関数名を指定し、それに対応する関数を`src/components/Map/Legend/colorParamList.ts`の内部に作成します。
- 作成された関数は以下のような`param`・`name`・`color`をキーに持つオブジェクトの配列を戻り値に設定します。役割は以下の通りです。
  - param: 指定された属性値を判別する条件式
  - name: 凡例に表示させる項目名
  - color: 凡例に表示させる色
```typescript
[
    {
      param: param === '千代田区',
      name: '千代田区',
      color: [255, 0, 0, 150],
    },
    {
      param: param !== '千代田区',
      name: 'その他',
      color: [100, 200, 255, 150],
    },
  ];
```

##### 地物の表示色を個別に変更

- 凡例に合わせて、表示色を変更することが可能です。
- `src/components/Map/Layer/renderOption.ts`を編集します。
- `addRenderOption`関数のforブロックの内部でレイヤーのidを指定した条件式を作成します。
- 条件には分岐の中では任意の関数名を指定し、それに対応する関数を`src/components/Map/Layer/renderOption.ts`の内部に作成します。
- 作成した関数内部ではレイヤーの表示オプションを設定し、`src/assets/config.json`に記載の項目を上書きできます。
- `getColorParam`関数を利用し、`d.properties['N03_004']`のように色変更に利用する属性値を渡すことで、凡例に応じた配色で地物が表示されます。

## GitHub Actions

- `.github/workflows/deploy.yml`にAWS CloudFrontへの自動デプロイ用workflowを用意しています。
  - 事前にAWS上でアカウント作成・S3 バケットの作成・CloudFrontとの連携を行い、静的ホスティングされている状態にしておく必要があります。
- リポジトリのルートに`.secrets`を作成し、中身を以下のように編集します。
```text
AWS_ACCESS_KEY_ID=Your AWS access key
AWS_SECRET_ACCESS_KEY=Your AWS secret access key
AWS_REGION=AWS region
AWS_S3_BUCKET=deploy s3 bucket name
DISTRIBUTION=cloudfront distribution id
```
- 上記ファイル作成後に、mainブランチでpushが行われると自動でデプロイされます。