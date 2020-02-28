import React from 'react';
/** @jsx jsx */ import { jsx } from '@emotion/core';
import { IconFacebookCircle, IconGoogle } from '@cpmech/react-icons';
import { Pair } from 'rcomps';
import { GateStore } from 'service';
import { t } from 'locale';
import { styles } from './styles';

const s = styles.federatedButtons;

interface IGateFederatedButtonsProps {
  gate: GateStore;
}

export const GateFederatedButtons: React.FC<IGateFederatedButtonsProps> = ({ gate }) => (
  <div css={s.root}>
    <button css={s.facebook} onClick={async () => await gate.facebookSignIn()}>
      <Pair left={<IconFacebookCircle />} right={<div css={s.rowCen}>{t('facebook')}</div>} />
    </button>

    <button css={s.google} onClick={async () => await gate.googleSignIn()}>
      <Pair left={<IconGoogle />} right={<div css={s.rowCen}>{t('google')}</div>} />
    </button>

    <div css={s.orLineContainer}>
      <span css={s.orLine}>{t('or')}</span>
    </div>
  </div>
);
