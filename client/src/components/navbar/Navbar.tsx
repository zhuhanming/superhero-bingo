import React from 'react';

import PageTitle from 'assets/svgr/PageTitle';

const Navbar: React.FC = () => {
  return (
    <nav className="w-full h-20 flex items-center justify-between">
      <PageTitle />
    </nav>
  );
};

export default Navbar;
