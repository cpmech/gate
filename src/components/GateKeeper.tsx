import React from 'react';
/** @jsx jsx */ import { jsx } from '@emotion/core';
import { Auth, I18n } from 'aws-amplify';
import { Authenticator, Greetings } from 'aws-amplify-react';
import { CognitoHostedUIIdentityProvider } from '@aws-amplify/auth/lib-esm/types';
import { UsernameAttributes } from 'aws-amplify-react/lib-esm/Auth/common/types';
import { IconFacebookCircle, IconGoogle } from '@cpmech/react-icons';
import { Pair } from 'rcomps';
import { theme3 as theme } from './themes';
import { stylesGateKeeper as styles } from './styles';
import './translations';

const signUpConfigEn = {
  hiddenDefaults: ['phone_number'],
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
  I18n.setLanguage(lang);

  const handleFacebookLogin = async () => {
    const res = await Auth.federatedSignIn({
      provider: CognitoHostedUIIdentityProvider.Facebook,
    });
    console.log(res);
  };

  const handleGoogleLogin = async () => {
    const res = await Auth.federatedSignIn({
      provider: CognitoHostedUIIdentityProvider.Google,
    });
    console.log(res);
  };

  const txt = (str: string) => <div css={styles.txt}>{str}</div>;

  return (
    <div css={styles.root}>
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
      <Authenticator
        hide={[Greetings]}
        theme={theme}
        signUpConfig={lang === 'pt' ? signUpConfigPt : signUpConfigEn}
        usernameAttributes={UsernameAttributes.EMAIL}
      />
    </div>
  );
};
