import React, { useState, useEffect } from 'react';
/** @jsx jsx */ import { jsx, css } from '@emotion/core';
import { Auth } from 'aws-amplify';
import { CognitoHostedUIIdentityProvider } from '@aws-amplify/auth/lib-esm/types';
import { IconFacebookCircle, IconGoogle } from '@cpmech/react-icons';
import { Pair, InputTypeA } from 'rcomps';
import { GateStore } from 'service';
import { PageLoading } from './PageLoading';
import { PageNoAccess } from './PageNoAccess';
import { theme3 as theme } from './themes';
import { stylesGateKeeper as styles } from './styles';
import { ISignInValues, signInValues2errors } from 'helpers';
import { t } from 'locale';

interface IGateKeeperProps {
  gate: GateStore;
  buttonBackgroundColor?: string;
}

export const GateKeeper: React.FC<IGateKeeperProps> = ({ gate, buttonBackgroundColor }) => {
  const [loading, setLoading] = useState(true);
  const [signedIn, setLoggedIn] = useState(false);
  const [belongsToGroup, setOkGroup] = useState(false);
  const [touchedButtons, setTouchedButtons] = useState(false);
  const [values, setValues] = useState<ISignInValues>({ email: '', password: '' });

  useEffect(() => {
    setLoading(gate.loading);
    setLoggedIn(gate.signedIn);
    setOkGroup(gate.belongsToGroup);
    return gate.subscribe(() => {
      setLoading(gate.loading);
      setLoggedIn(gate.signedIn);
      setOkGroup(gate.belongsToGroup);
    }, '@cpmech/gate/CustomGateKeeper');
  }, [gate]);

  if (buttonBackgroundColor) {
    theme.button.backgroundColor = buttonBackgroundColor;
  }

  const handleFacebookLogin = async () => {
    await Auth.federatedSignIn({
      provider: CognitoHostedUIIdentityProvider.Facebook,
    });
  };

  const handleGoogleLogin = async () => {
    await Auth.federatedSignIn({
      provider: CognitoHostedUIIdentityProvider.Google,
    });
  };

  const setValue = <K extends keyof ISignInValues>(key: K, value: string) => {
    const newValues = { ...values, [key]: value };
    if (touchedButtons) {
      const errors = signInValues2errors(newValues);
      setValues({ ...newValues, errors });
    } else {
      setValues(newValues);
    }
  };

  const renderButtons = () => (
    <div css={styles.firstContainer}>
      <button css={styles.facebook} onClick={handleFacebookLogin}>
        <Pair left={<IconFacebookCircle />} right={t('facebook')} />
      </button>
      <button css={styles.google} onClick={handleGoogleLogin}>
        <Pair left={<IconGoogle />} right={t('google')} />
      </button>
      <div css={styles.orLineContainer}>
        <span css={styles.orLine}>{t('or')}</span>
      </div>
    </div>
  );

  const renderInputs = () => (
    <div css={styles.container}>
      <InputTypeA
        label="Email"
        value={values.email}
        onChange={e => setValue('email', e.target.value)}
      />
    </div>
  );

  return (
    <React.Fragment>
      {loading && <PageLoading message={t('loading')} />}
      {!loading && signedIn && !belongsToGroup && (
        <PageNoAccess gate={gate} message={t('noAccess')} btnText={t('signOut')} />
      )}
      <div
        css={css`
          ${!loading && !signedIn ? 'display: flex;' : 'display:none;'}
          flex-direction: column;
          justify-content: center;
          align-items: center;
        `}
      >
        {renderButtons()}
        {renderInputs()}
      </div>
    </React.Fragment>
  );
};
