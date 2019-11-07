import React, { useEffect, useState } from 'react';
import { Router, Link } from '@reach/router';
import Amplify from '@aws-amplify/core';
import { IconHouseThreeD } from '@cpmech/react-icons';
import { GateKeeper, MainMenu } from 'components';
import { store } from 'store';
import { Dashboard, Home, NotFound } from './pages';

Amplify.configure({
  Auth: {
    region: 'us-east-1',
    userPoolId: 'us-east-1_tl5SLxSyb',
    userPoolWebClientId: '3skmgvtqjbv8a3lf6qbjav4af6',
  },
});

const entries = [
  <Link key="link-to-dashboard" to="/dashboard">
    <span>DASHBOARD</span>
  </Link>,
];

export const App: React.FC = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    return store.subscribe(() => setLoggedIn(store.state.loggedIn), 'App');
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
