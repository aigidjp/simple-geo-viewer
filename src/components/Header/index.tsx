import React from 'react';
import settings from '@/assets/settings.json';

const getTitle = () => {
  return settings.title;
};

function Header() {
  const headerStyle = {
    backgroundColor: settings.background_color,
  };

  return (
    <header style={headerStyle} className="h-full flex justify-center items-center">
      <div className="text-center text-white font-semibold text-3xl w-7/12">{getTitle()}</div>
    </header>
  );
}

export default Header;
