import React from 'react';
import { Title } from '@/components/Map/Legend/Content/title';
import { Entry } from '@/components/Map/Legend/Content/entry';
import { getRasterLegendSrc } from '@/components/Map/Legend/Content/raster';
import { getColorParamList } from '@/components/Map/Legend/colorParamList';

const Content: React.FC<{ id: string }> = ({ id }) => {
  const entryList = getColorParamList(id);
  const rasterLegendSrc = getRasterLegendSrc(id);

  return entryList.length ? (
    <div className="bg-white">
      <Title id={id} />
      {entryList.map((entry) => (
        <Entry name={entry.name} color={entry.color} key={entry.name} />
      ))}
    </div>
  ) : rasterLegendSrc ? (
    <div className="bg-white shadow-none">
      <Title id={id} />
      <img src={rasterLegendSrc} alt="legend" width={'70%'} height={'100%'} />
    </div>
  ) : (
    <></>
  );
};
export default Content;
