import React, { ReactNode } from 'react';
/** @jsx jsx */ import { jsx } from '@emotion/core';
import { IconFacebookCircle, IconGoogle } from '@cpmech/react-icons';
import { Pair } from '../../rcomps';
import { GateVSpaceLarge } from './GateVSpaceLarge';
import { styles } from './gateStyles';
import { GateStore } from '../service';
import { t } from '../locale';

const s = styles.federatedButtons;

interface IGateFederatedButtonsProps {
  gate: GateStore;
  logo?: ReactNode;
}

export const GateFederatedButtons: React.FC<IGateFederatedButtonsProps> = ({ gate, logo }) => (
  <div css={logo ? s.rootWithLogo : s.root}>
    {logo && (
      <div>
        {logo}
        <GateVSpaceLarge />
      </div>
    )}

    <button css={s.facebook} onClick={async () => await gate.facebookSignIn()}>
      <Pair
        left={<IconFacebookCircle />}
        right={<div css={s.rowCen}>{t('facebook').toUpperCase()}</div>}
      />
    </button>

    <button css={s.google} onClick={async () => await gate.googleSignIn()}>
      <Pair left={<IconGoogle />} right={<div css={s.rowCen}>{t('google').toUpperCase()}</div>} />
    </button>
  </div>
);
