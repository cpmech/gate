import React, { useState, useEffect } from 'react';
/** @jsx jsx */ import { jsx, css } from '@emotion/core';
import { Auth, I18n } from 'aws-amplify';
import { Authenticator, Greetings } from 'aws-amplify-react';
import { CognitoHostedUIIdentityProvider } from '@aws-amplify/auth/lib-esm/types';
import { UsernameAttributes } from 'aws-amplify-react/lib-esm/Auth/common/types';
import { IconFacebookCircle, IconGoogle } from '@cpmech/react-icons';
import { Pair, SpinnerAndMessage } from 'rcomps';
import { theme3 as theme } from './themes';
import { stylesGateKeeper as styles } from './styles';
import { gate } from './GateStore';
import './translations';

const signUpConfigEn = {
  hiddenDefaults: ['phone_number'],
  header: 'Create account',
  signUpFields: [
    {
      label: 'Email',
      key: 'email',
      required: true,
      placeholder: 'Enter your email',
      type: 'email',
      displayOrder: 1,
    },
    {
      label: 'Senha',
      key: 'password',
      required: true,
      placeholder: 'Enter your password',
      type: 'password',
      displayOrder: 2,
    },
  ],
};

const signUpConfigPt = {
  hiddenDefaults: ['phone_number'],
  header: 'Criar nova conta',
  signUpFields: [
    {
      label: 'Email',
      key: 'email',
      required: true,
      placeholder: 'Entre com seu email',
      type: 'email',
      displayOrder: 1,
    },
    {
      label: 'Senha',
      key: 'password',
      required: true,
      placeholder: 'Entre com sua senha',
      type: 'password',
      displayOrder: 2,
    },
  ],
};

const txtFacebookEn = 'Continue with Facebook';
const txtFacebookPt = 'Continuar com Facebook';
const txtGoogleEn = 'Continue with Google';
const txtGooglePt = 'Continuar com Google';

interface IGateKeeperProps {
  lang?: string; // 'en' or 'pt'
}

export const GateKeeper: React.FC<IGateKeeperProps> = ({ lang = 'pt' }) => {
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoading(gate.state.loading);
    setLoggedIn(gate.state.loggedIn);
    return gate.subscribe(() => {
      setLoading(gate.state.loading);
      setLoggedIn(gate.state.loggedIn);
    }, '@cpmech/gate/GateKeeper');
  }, []);

  I18n.setLanguage(lang);

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

  const txt = (str: string) => <div css={styles.txt}>{str}</div>;

  const renderButtons = () => (
    <div css={styles.container}>
      <button css={styles.facebook} onClick={handleFacebookLogin}>
        <Pair
          left={<IconFacebookCircle />}
          right={lang === 'pt' ? txt(txtFacebookPt) : txt(txtFacebookEn)}
        />
      </button>
      <button css={styles.google} onClick={handleGoogleLogin}>
        <Pair left={<IconGoogle />} right={lang === 'pt' ? txt(txtGooglePt) : txt(txtGoogleEn)} />
      </button>
      <div css={styles.orLineContainer}>
        <span css={styles.orLine}>{lang === 'pt' ? 'ou' : 'or'}</span>
      </div>
    </div>
  );

  return (
    <React.Fragment>
      <div
        css={css`
          margin-top: 80px;
          ${loading ? '' : 'display:none;'}
        `}
      >
        <SpinnerAndMessage
          color="#343434"
          message={lang === 'pt' ? 'Carregando...' : 'Loading...'}
        />
      </div>
      <div
        css={css`
          ${!loading && !loggedIn ? 'display: flex;' : 'display:none;'}
          flex-direction: column;
          justify-content: center;
          align-items: center;
        `}
      >
        {renderButtons()}
        <Authenticator
          hide={[Greetings]}
          theme={theme}
          signUpConfig={lang === 'pt' ? signUpConfigPt : signUpConfigEn}
          usernameAttributes={UsernameAttributes.EMAIL}
        />
      </div>
    </React.Fragment>
  );
};
