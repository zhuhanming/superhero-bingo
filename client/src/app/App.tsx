import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useLocation,
} from 'react-router-dom';

import Navbar from 'components/navbar';
import { ROOT } from 'constants/routes';
import Home from 'routes/home';

const App: React.FC = () => {
  const { pathname } = useLocation();
  return (
    <div className="min-h-screen min-w-full font-regular bg-yellow px-8 lg:px-24 py-12 text-black">
      {pathname !== ROOT && <Navbar />}
      <Router>
        <Switch>
          <Route path={ROOT}>
            <Home />
          </Route>
        </Switch>
      </Router>
    </div>
  );
};

export default App;
