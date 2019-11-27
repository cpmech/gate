import React, { useState, useEffect } from 'react';
/** @jsx jsx */ import { jsx, css } from '@emotion/core';
import { Auth, I18n } from 'aws-amplify';
import { Authenticator, Greetings } from 'aws-amplify-react';
import { CognitoHostedUIIdentityProvider } from '@aws-amplify/auth/lib-esm/types';
import { UsernameAttributes } from 'aws-amplify-react/lib-esm/Auth/common/types';
import { IconFacebookCircle, IconGoogle } from '@cpmech/react-icons';
import { Pair } from 'rcomps';
import { PageLoading } from './PageLoading';
import { PageNoAccess } from './PageNoAccess';
import { GateStore } from './GateStore';
import { theme3 as theme } from './themes';
import { stylesGateKeeper as styles } from './styles';
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

const txtLoadingEn = 'Loading';
const txtLoadingPt = 'Carregando';
const txtNoAccessEn = 'Cannot complete request';
const txtNoAccessPt = 'Não foi possível completar a requisição';
const txtSignOutEn = 'Sign Out';
const txtSignOutPt = 'Sair';

interface IGateKeeperProps {
  gate: GateStore;
  lang?: 'en' | 'pt';
}

export const GateKeeper: React.FC<IGateKeeperProps> = ({ gate, lang = 'en' }) => {
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [okGroup, setOkGroup] = useState(false);

  useEffect(() => {
    setLoading(gate.loading);
    setLoggedIn(gate.loggedIn);
    setOkGroup(gate.okGroup);
    return gate.subscribe(() => {
      setLoading(gate.loading);
      setLoggedIn(gate.loggedIn);
      setOkGroup(gate.okGroup);
    }, '@cpmech/gate/GateKeeper');
  }, [gate]);

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
      {loading && <PageLoading message={lang === 'pt' ? txtLoadingPt : txtLoadingEn} />}
      {!loading && loggedIn && !okGroup && (
        <PageNoAccess
          gate={gate}
          message={lang === 'pt' ? txtNoAccessPt : txtNoAccessEn}
          btnText={lang === 'pt' ? txtSignOutPt : txtSignOutEn}
        />
      )}
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
