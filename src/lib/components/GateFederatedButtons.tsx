/** @jsxImportSource @emotion/react */
import { ReactNode } from 'react';
import { IconLogoApple } from '@cpmech/iricons/IconLogoApple';
import { IconLogoFacebook } from '@cpmech/iricons/IconLogoFacebook';
import { IconLogoGoogle } from '@cpmech/iricons/IconLogoGoogle';
import { RcPair } from '../../rcomps';
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
      <RcPair
        left={<IconLogoFacebook />}
        right={<div css={s.rowCen}>{t('facebook').toUpperCase()}</div>}
      />
    </button>

    <button css={s.google} onClick={async () => await gate.googleSignIn()}>
      <RcPair
        left={<IconLogoGoogle />}
        right={<div css={s.rowCen}>{t('google').toUpperCase()}</div>}
      />
    </button>

    <button css={s.apple} onClick={async () => await gate.appleSignIn()}>
      <RcPair
        left={<IconLogoApple />}
        right={<div css={s.rowCen}>{t('apple').toUpperCase()}</div>}
      />
    </button>
  </div>
);
