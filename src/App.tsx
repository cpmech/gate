import React, { useEffect, useState } from 'react';
import { Router, Link } from '@reach/router';
import { IconHouseThreeD } from '@cpmech/react-icons';
import { GateStore } from 'service';
import { GateKeeper, MainMenu } from 'components';
import { Dashboard, Home, NotFound } from './pages';

const gate = new GateStore(
  {
    userPoolId: 'us-east-1_dCZGZU74z',
    userPoolWebClientId: '5cdculovevq2kqdhj5forn2288',
    oauthDomain: 'azcdk.auth.us-east-1.amazoncognito.com',
    redirectSignIn: 'https://localhost:3000/',
    redirectSignOut: 'https://localhost:3000/',
    awsRegion: 'us-east-1',
  },
  ['testers'],
);

const entries = [
  <Link key="link-to-dashboard" to="/dashboard">
    <span>DASHBOARD</span>
  </Link>,
];

export const App: React.FC = () => {
  const [access, setAccess] = useState(false);

  useEffect(() => {
    setAccess(gate.hasAccess());
    return gate.subscribe(() => setAccess(gate.hasAccess()), '@cpmech/gate/App');
  }, []);

  return (
    <React.Fragment>
      <GateKeeper gate={gate} />
      {access && (
        <React.Fragment>
          <MainMenu
            gate={gate}
            NarrowLogoIcon={IconHouseThreeD}
            WideLogoIcon={IconHouseThreeD}
            wideLogoWidth={60}
            narrowMiddleEntries={entries}
            wideMiddleEntries={entries}
          />
          <Router>
            <Home path="/" gate={gate} />
            <Dashboard path="/dashboard" />
            <NotFound default />
          </Router>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};
