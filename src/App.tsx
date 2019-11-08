import React, { useEffect, useState } from 'react';
import { Router, Link } from '@reach/router';
import { IconHouseThreeD } from '@cpmech/react-icons';
import { GateKeeper, MainMenu, init, gateStore } from 'components';
import { Dashboard, Home, NotFound } from './pages';

init(
  'us-east-1_dCZGZU74z',
  '5cdculovevq2kqdhj5forn2288',
  'azcdk.auth.us-east-1.amazoncognito.com',
  'https://localhost:3000/',
  'https://localhost:3000/',
);

const entries = [
  <Link key="link-to-dashboard" to="/dashboard">
    <span>DASHBOARD</span>
  </Link>,
];

export const App: React.FC = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    return gateStore.subscribe(() => setLoggedIn(gateStore.state.loggedIn), 'App');
  }, []);

  return (
    <React.Fragment>
      <MainMenu
        NarrowLogoIcon={IconHouseThreeD}
        WideLogoIcon={IconHouseThreeD}
        wideLogoWidth={60}
        narrowMiddleEntries={entries}
        wideMiddleEntries={entries}
      />
      <GateKeeper />
      {loggedIn && (
        <Router>
          <Home path="/" />
          <Dashboard path="/dashboard" />
          <NotFound default />
        </Router>
      )}
    </React.Fragment>
  );
};
