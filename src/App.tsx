import React from 'react';
import { Router, Link } from '@reach/router';
import { Helmet } from 'react-helmet';
import { IconHouseThreeD } from '@cpmech/react-icons';
import { TopMenu, Button, Popup } from 'rcomps';
import { GateStore, gateLocale, t, LocalGateStore } from 'lib';
import {
  useGateObserver,
  GateSignUpForm,
  LocalGateSignUpForm,
  // GateSignUpFormAws,
} from './lib/components';
import { Dashboard, Home, NotFound } from './pages';
import { typography } from './typoStyle';

gateLocale.setLocale('pt');

const isLocal = false;

const gate = isLocal
  ? new LocalGateStore('@cpmech/gate', window.localStorage)
  : new GateStore(
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

export const App: React.FC = () => {
  const { ready, hasAccess } = useGateObserver(gate, '@cpmech/gate/App');

  const renderSignUpForm = () => {
    if (isLocal) {
      return <LocalGateSignUpForm gate={gate as LocalGateStore} />;
    }
    return <GateSignUpForm gate={gate as GateStore} />;
  };

  return (
    <React.Fragment>
      <Helmet>
        <style>{typography.toString()}</style>
      </Helmet>
      {/* {!ready && <PageLoading message={t('initializing')} />} */}
      {!ready && <Popup title={t('initializing')} fontSizeTitle="0.8em" isLoading={true} />}
      {!hasAccess && renderSignUpForm()}
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
