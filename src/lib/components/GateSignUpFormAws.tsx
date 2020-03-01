import React from 'react';
/** @jsx jsx */ import { jsx, css } from '@emotion/core';
import { I18n } from 'aws-amplify';
import { Authenticator, Greetings } from 'aws-amplify-react';
import { UsernameAttributes } from 'aws-amplify-react/lib-esm/Auth/common/types';
import { Popup } from 'rcomps';
import { theme3 as theme } from './themes';
import { useGateObserver } from './useGateObserver';
import { GateStore } from '../service';
import { locale, t } from '../locale';
import { initAmplifyTranslations, signUpConfigEn, signUpConfigPt } from './amplifyTranslations';
import { styles } from './styles';

const s = styles.signUpForm;

initAmplifyTranslations();

interface IGateSignUpFormAwsProps {
  gate: GateStore;
  buttonBackgroundColor?: string;
}

export const GateSignUpFormAws: React.FC<IGateSignUpFormAwsProps> = ({
  gate,
  buttonBackgroundColor,
}) => {
  const { error, processing } = useGateObserver(gate, '@cpmech/gate/components/GateSignUpFormAws');

  I18n.setLanguage(locale.getLocale());

  if (buttonBackgroundColor) {
    theme.button.backgroundColor = buttonBackgroundColor;
  }

  return (
    <div css={s.root}>
      <div
        css={css`
          flex-direction: column;
          justify-content: center;
          align-items: center;
        `}
      >
        <Authenticator
          hide={[Greetings]}
          theme={theme}
          signUpConfig={locale.getLocale() === 'pt' ? signUpConfigPt : signUpConfigEn}
          usernameAttributes={UsernameAttributes.EMAIL}
        />
      </div>

      {processing && <Popup title={t('loading')} fontSizeTitle="1em" isLoading={true} />}
      {error && (
        <Popup
          title={t('error')}
          onClose={() => gate.notify({ error: '' })}
          isError={true}
          message={error}
        />
      )}
    </div>
  );
};
