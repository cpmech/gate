import React from 'react';
/** @jsx jsx */ import { jsx, css } from '@emotion/core';
import { I18n } from 'aws-amplify';
import { Authenticator, Greetings } from 'aws-amplify-react';
import { UsernameAttributes } from 'aws-amplify-react/lib-esm/Auth/common/types';
import { GateStore } from 'service';
import { useObserver } from './useObserver';
import { PageLoading } from './PageLoading';
import { PageNoAccess } from './PageNoAccess';
import { theme3 as theme } from './themes';
import { locale, t } from 'locale';
import {
  initAmplifyTranslations,
  signUpConfigEn,
  signUpConfigPt,
} from 'locale/amplifyTranslations';
import { FedButtons } from './FedButtons';

initAmplifyTranslations();

interface IGateKeeperAwsProps {
  gate: GateStore;
  buttonBackgroundColor?: string;
}

export const GateKeeperAws: React.FC<IGateKeeperAwsProps> = ({ gate, buttonBackgroundColor }) => {
  const { loading, signedIn, belongsToGroup } = useObserver(gate);

  I18n.setLanguage(locale.getLocale());

  if (buttonBackgroundColor) {
    theme.button.backgroundColor = buttonBackgroundColor;
  }

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
        <FedButtons gate={gate} />
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
