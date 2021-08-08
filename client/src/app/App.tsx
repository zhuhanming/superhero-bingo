import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { EDIT, ROOT, START } from 'constants/routes';
import Edit from 'routes/edit';
import Home from 'routes/home';
import Start from 'routes/start';

const App: React.FC = () => {
  return (
    <div className="min-h-screen min-w-full font-regular bg-yellow px-8 lg:px-24 pb-12 text-black">
      <Router>
        <Switch>
          <Route path={START}>
            <Start />
          </Route>
          <Route path={EDIT}>
            <Edit />
          </Route>
          <Route path={ROOT}>
            <Home />
          </Route>
        </Switch>
      </Router>
    </div>
  );
};

export default App;
