import React from 'react';
import { Router, Link } from '@reach/router';
import { IconHouseThreeD } from '@cpmech/react-icons';
import { GateStore } from 'service';
import { useObserver, GateTopMenu, PageLoading, GateSignUpForm } from 'components';
import { Dashboard, Home, NotFound } from './pages';
import { locale, t } from 'locale';

locale.setLocale('pt');

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
  const { configured, hasAccess } = useObserver(gate, '@cpmech/gate/App');

  if (!configured) {
    return <PageLoading message={t('initializing')} />;
  }

  if (!hasAccess) {
    return <GateSignUpForm gate={gate} />;
  }

  return (
    <React.Fragment>
      <GateTopMenu gate={gate} />
      {/* <MainMenu
        gate={gate}
        NarrowLogoIcon={IconHouseThreeD}
        WideLogoIcon={IconHouseThreeD}
        wideLogoWidth={60}
        narrowMiddleEntries={entries}
        wideMiddleEntries={entries}
      /> */}
      <Router>
        <Home path="/" gate={gate} />
        <Dashboard path="/dashboard" />
        <NotFound default />
      </Router>
    </React.Fragment>
  );
};
