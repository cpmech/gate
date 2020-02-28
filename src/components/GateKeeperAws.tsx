import React, { useState, useEffect } from 'react';
/** @jsx jsx */ import { jsx, css } from '@emotion/core';
import { Auth, I18n } from 'aws-amplify';
import { Authenticator, Greetings } from 'aws-amplify-react';
import { CognitoHostedUIIdentityProvider } from '@aws-amplify/auth/lib-esm/types';
import { UsernameAttributes } from 'aws-amplify-react/lib-esm/Auth/common/types';
import { IconFacebookCircle, IconGoogle } from '@cpmech/react-icons';
import { Pair } from 'rcomps';
import { GateStore } from 'service';
import { PageLoading } from './PageLoading';
import { PageNoAccess } from './PageNoAccess';
import { theme3 as theme } from './themes';
import { stylesGateKeeper as styles } from './styles';
import { locale, t } from 'locale';
import {
  initAmplifyTranslations,
  signUpConfigEn,
  signUpConfigPt,
} from 'locale/amplifyTranslations';

initAmplifyTranslations();

interface IGateKeeperAwsProps {
  gate: GateStore;
  buttonBackgroundColor?: string;
}

export const GateKeeperAws: React.FC<IGateKeeperAwsProps> = ({ gate, buttonBackgroundColor }) => {
  const [loading, setLoading] = useState(true);
  const [signedIn, setLoggedIn] = useState(false);
  const [belongsToGroup, setOkGroup] = useState(false);

  useEffect(() => {
    setLoading(gate.loading);
    setLoggedIn(gate.signedIn);
    setOkGroup(gate.belongsToGroup);
    return gate.subscribe(() => {
      setLoading(gate.loading);
      setLoggedIn(gate.signedIn);
      setOkGroup(gate.belongsToGroup);
    }, '@cpmech/gate/GateKeeper');
  }, [gate]);

  I18n.setLanguage(locale.getLocale());

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
        <Authenticator
          hide={[Greetings]}
          theme={theme}
          signUpConfig={locale.getLocale() === 'pt' ? signUpConfigPt : signUpConfigEn}
          usernameAttributes={UsernameAttributes.EMAIL}
        />
      </div>
    </React.Fragment>
  );
};
