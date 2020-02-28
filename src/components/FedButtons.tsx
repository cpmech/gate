import React from 'react';
/** @jsx jsx */ import { jsx } from '@emotion/core';
import { Auth } from 'aws-amplify';
import { CognitoHostedUIIdentityProvider } from '@aws-amplify/auth/lib-esm/types';
import { IconFacebookCircle, IconGoogle } from '@cpmech/react-icons';
import { Pair } from 'rcomps';
import { GateStore } from 'service';
import { stylesGateKeeper as styles } from './styles';
import { t } from 'locale';

interface IFedButtonsProps {
  gate: GateStore;
}

export const FedButtons: React.FC<IFedButtonsProps> = ({ gate }) => {
  const handleFacebookLogin = async () => {
    gate.notifyLoading();
    await Auth.federatedSignIn({
      provider: CognitoHostedUIIdentityProvider.Facebook,
    });
  };

  const handleGoogleLogin = async () => {
    gate.notifyLoading();
    await Auth.federatedSignIn({
      provider: CognitoHostedUIIdentityProvider.Google,
    });
  };

  return (
    <div css={styles.federationContainer}>
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
};
