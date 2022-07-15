import React, { useContext } from 'react';
import { context } from '@/pages';

function Header() {
  const { preferences } = useContext(context);
  const headerStyle = {
    backgroundColor: preferences.settings.background_color,
  };

  return (
    <header style={headerStyle} className="h-full flex justify-left items-center">
      <div className="text-left text-white font-semibold text-3xl w-7/12 p-3">
        {preferences.settings.title}
      </div>
      <div className="text-right text-white font-semibold text-3l w-7/12 p-3">Powerd By AIGID</div>
    </header>
  );
}

export default Header;
