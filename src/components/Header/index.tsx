import React from 'react';
import { jsons } from '@/pages';

const getTitle = () => {
  return jsons.settings.title;
};

function Header() {
  const headerStyle = {
    backgroundColor: jsons.settings.background_color,
  };

  return (
    <header style={headerStyle} className="h-full flex justify-left items-center">
      <div className="text-left text-white font-semibold text-3xl w-7/12 p-3">{getTitle()}</div>
      <div className="text-right text-white font-semibold text-3l w-7/12 p-3">Powerd By AIGID</div>
    </header>
  );
}

export default Header;
