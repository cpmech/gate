/* eslint-disable */

import React from 'react';
import { Authenticator, Greetings } from 'aws-amplify-react';
import { UsernameAttributes } from 'aws-amplify-react/lib-esm/Auth/common/types';
import { I18n } from 'aws-amplify';
import { theme3 as theme } from './themes';
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

interface IGateKeeperProps {
  lang?: string; // 'en' or 'pt'
}

export const GateKeeper: React.FC<IGateKeeperProps> = ({ lang = 'pt' }) => {
  I18n.setLanguage(lang);
  return (
    <Authenticator
      hide={[Greetings]}
      theme={theme}
      signUpConfig={lang === 'pt' ? signUpConfigPt : signUpConfigEn}
      usernameAttributes={UsernameAttributes.EMAIL}
    />
  );
};
