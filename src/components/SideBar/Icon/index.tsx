import React from 'react';

import { Data } from '@/components/LayerFilter/menu';

const getIconSize = () => {
  return {
    width: '16',
    height: '16',
    viewBox: '0 0 32 32',
  };
};

const IconViewBox = '0 0 100 150';

const RasterIcon = (color: string) => {
  return (
    <div className="index-icon">
      <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        width={getIconSize().width}
        height={getIconSize().height}
        viewBox={getIconSize().viewBox}
      >
        <g id="symbol_raster">
          <path d="m25.609103,25.876536l0,0.937318c0,1.553019 -1.034146,2.811955 -2.309866,2.811955l-18.478925,0c-1.27572,0 -2.309866,-1.258935 -2.309866,-2.811955l0,-14.997091c0,-1.553019 1.034146,-2.811955 2.309866,-2.811955l0.769955,0l0,2.811955l-0.481222,0a0.288733,0.351494 0 0 0 -0.288733,0.351494l0,14.294102a0.288733,0.351494 0 0 0 0.288733,0.351494l17.901459,0a0.288733,0.351494 0 0 0 0.288733,-0.351494l0,-0.585824l2.309866,0zm2.021132,-19.683682l-17.901459,0a0.288733,0.351494 0 0 0 -0.288733,0.351494l0,14.294102a0.288733,0.351494 0 0 0 0.288733,0.351494l17.901459,0a0.288733,0.351494 0 0 0 0.288733,-0.351494l0,-14.294102a0.288733,0.351494 0 0 0 -0.288733,-0.351494zm0.288733,-2.811955c1.27572,0 2.309866,1.258935 2.309866,2.811955l0,14.997091c0,1.553019 -1.034146,2.811955 -2.309866,2.811955l-18.478925,0c-1.27572,0 -2.309866,-1.258935 -2.309866,-2.811955l0,-14.997091c0,-1.553019 1.034146,-2.811955 2.309866,-2.811955l18.478925,0zm-12.704261,6.561227c0,1.294144 -0.86182,2.343295 -1.924888,2.343295s-1.924888,-1.049152 -1.924888,-2.343295s0.86182,-2.343295 1.924888,-2.343295s1.924888,1.049152 1.924888,2.343295zm1.154933,5.623909l4.98137,-6.064156c0.225501,-0.274517 0.591133,-0.274517 0.816682,0l3.441411,4.189519l0,4.686591l-13.859194,0l0,-2.811955l4.619731,0z" />
        </g>
        <use xlinkHref="#symbol_raster" opacity="1" fill={color} fillOpacity="1" />
      </svg>
    </div>
  );
};

const SimpleIcon = (color: string) => {
  return (
    <div className="index-icon">
      <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        width={getIconSize().width}
        height={getIconSize().height}
        viewBox={IconViewBox}
      >
        <g id="icon_raster">
          <path d="M50 150L6.69873 75L93.3013 75L50 150Z" fill={color} />
          <circle cx="50" cy="50" r="50" fill={color} />
          <path
            d="M45.496 71.6829C39.7859 70.4387 34.7894 66.9367 31.5971 61.9412C28.4048 56.9457 27.276 50.8626 28.4572 45.0196C29.6384 39.1767 33.0336 34.0486 37.9016 30.7547C42.7696 27.4608 48.7151 26.2687 54.4402 27.4386C60.1653 28.6085 65.205 32.0454 68.4591 36.999C71.7133 41.9526 72.9176 48.0206 71.8092 53.8784C70.7008 59.7362 67.3696 64.908 62.543 68.2648C57.7163 71.6217 51.7861 72.8909 46.0469 71.7954"
            fill="white"
          />
        </g>
      </svg>
    </div>
  );
};

const PointIcon = (color: string) => {
  return (
    <div className="index-icon">
      <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        width={getIconSize().width}
        height={getIconSize().height}
        viewBox={getIconSize().viewBox}
      >
        <g id="symbol2">
          <path d="M22 16C22 19.31 19.31 22 16 22C12.69 22 10 19.31 10 16C10 12.69 12.69 10 16 10C19.31 10 22 12.69 22 16Z" />
        </g>
        <use xlinkHref="#symbol2" opacity="1" fill={color} fillOpacity="1" />
      </svg>
    </div>
  );
};

const LineIcon = (color: string) => {
  return (
    <div className="index-icon">
      <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        width={getIconSize().width}
        height={getIconSize().height}
        viewBox={getIconSize().viewBox}
      >
        <g>
          <line
            id="svg_line"
            y2="5"
            x2="26"
            y1="26"
            x1="5"
            strokeWidth="1.5"
            stroke={color}
            fill="none"
          />
        </g>
      </svg>
    </div>
  );
};

const PolygonIcon = (color: string) => {
  return (
    <div className="index-icon">
      <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        width={getIconSize().width}
        height={getIconSize().height}
        viewBox={getIconSize().viewBox}
      >
        <g>
          <path
            id="svg_polygon"
            d="m5.926816,16.972813l4.436182,-8.716707l11.829817,0l4.43618,8.716707l-4.43618,8.716707l-11.829817,0l-4.436182,-8.716707z"
            fillOpacity="null"
            strokeOpacity="null"
            strokeWidth="1.5"
            fill={color}
          />
        </g>
      </svg>
    </div>
  );
};

const BuildingIcon = (color: string) => {
  return (
    <div className="index-icon">
      <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox={getIconSize().viewBox}
        width={getIconSize().width}
        height={getIconSize().height}
      >
        <g id="symbol3">
          <path d="M6 12C6 14.71 6 20.12 6 28.24" />
          <path d="M16 6.14C16 6.14 16 6.14 16 6.14L16 28" />
          <path d="M26 28C26 24.67 26 18 26 8" />
          <path d="M16 6.72C16 6.72 16 6.72 16 6.72L6 12.35" />
          <path d="M26 28C22.67 28 16 28 6 28" />
          <path d="M26 8C24.33 7.67 21 7 16 6" />
        </g>
        <use
          xlinkHref="#symbol3"
          opacity="1"
          fillOpacity="0"
          stroke={color}
          strokeWidth="1"
          strokeOpacity="1"
        />
      </svg>
    </div>
  );
};

export const getResourceIcon = (resource: Data) => {
  const color = resource.color;

  const type = resource.type;

  if (!color) return;

  if (type === 'raster') {
    return RasterIcon(color);
  }
  if (type === 'icon') {
    return SimpleIcon(color);
  }
  if (type === 'point') {
    return PointIcon(color);
  }
  if (type === 'line') {
    return LineIcon(color);
  }
  if (type === 'polygon') {
    return PolygonIcon(color);
  }
  if (type === 'building') {
    return BuildingIcon(color);
  }
  return;
};

export const DownloadIcon = (downloadUrl: string) => {
  return (
    <a
      href={downloadUrl}
      onClick={(e) => {
        // アコーディオンメニューへのイベントの伝播を抑制
        e.stopPropagation();
      }}
      rel="noreferrer noopener"
      target="_blank"
    >
      <svg
        aria-hidden="true"
        focusable="false"
        data-prefix="fas"
        data-icon="download"
        className="svg-inline--fa fa-download fa-w-16"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="12"
        viewBox="0 0 512 512"
      >
        <path
          fill="currentColor"
          d="M216 0h80c13.3 0 24 10.7 24 24v168h87.7c17.8 0 26.7 21.5 14.1 34.1L269.7 378.3c-7.5 7.5-19.8 7.5-27.3 0L90.1 226.1c-12.6-12.6-3.7-34.1 14.1-34.1H192V24c0-13.3 10.7-24 24-24zm296 376v112c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24V376c0-13.3 10.7-24 24-24h146.7l49 49c20.1 20.1 52.5 20.1 72.6 0l49-49H488c13.3 0 24 10.7 24 24zm-124 88c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20zm64 0c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20z"
        />
      </svg>
    </a>
  );
};
