import React from 'react';
import { Router, Link } from '@reach/router';
import { Helmet } from 'react-helmet';
import { IconHouseThreeD } from '@cpmech/react-icons';
import {
  useObserver,
  GateSignUpForm,
  // GateSignUpFormAws,
} from './components';
import { Dashboard, Home, NotFound } from './pages';
import { GateStore } from './service';
import { locale, t } from './locale';
import { typography } from './typoStyle';
import { TopMenu, Button, Popup } from 'rcomps';

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
  // ['testers'],
);

const entries = [
  <Link key="0" to="/">
    <IconHouseThreeD size={50} />
  </Link>,

  <Link key="1" to="/dashboard">
    <span>DASHBOARD</span>
  </Link>,

  <div key="2">
    <Button onClick={async () => await gate.signOut()}>{t('signOut')}</Button>
  </div>,
];

const renderTopMenu = () => <TopMenu entries={entries} />;

console.log('here');

export const App: React.FC = () => {
  const { ready, hasAccess } = useObserver(gate, '@cpmech/gate/App');

  return (
    <React.Fragment>
      <Helmet>
        <style>{typography.toString()}</style>
      </Helmet>
      {/* {!ready && <PageLoading message={t('initializing')} />} */}
      {!ready && <Popup title={t('initializing')} fontSizeTitle="1em" isLoading={true} />}
      {!hasAccess && <GateSignUpForm gate={gate} />}
      {/* {!hasAccess && <GateSignUpFormAws gate={gate} />} */}
      {ready && hasAccess && (
        <React.Fragment>
          {renderTopMenu()}
          <Router>
            <Home path="/" />
            <Dashboard path="/dashboard" />
            <NotFound default />
          </Router>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};
