import React from 'react';
import { Link } from 'react-router-dom';

import PageTitle from 'assets/svgr/PageTitle';
import { ROOT } from 'constants/routes';

const Navbar: React.FC = () => {
  return (
    <nav className="w-full h-12 pt-8 flex items-center justify-between">
      <Link to={ROOT}>
        <PageTitle className="h-8" />
      </Link>
    </nav>
  );
};

export default Navbar;
