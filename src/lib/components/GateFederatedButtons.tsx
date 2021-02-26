/** @jsxImportSource @emotion/react */
import { ReactNode } from 'react';
import { IconLogoApple } from '@cpmech/iricons/IconLogoApple';
import { IconLogoFacebook } from '@cpmech/iricons/IconLogoFacebook';
import { IconLogoGoogle } from '@cpmech/iricons/IconLogoGoogle';
import { RcButton, RcPair } from '../../rcomps';
import { gateParams, gateStyles } from './gateStyles';
import { GateStore } from '../service';
import { t } from '../locale';

const s = gateStyles.federatedButtons;

interface IGateFederatedButtonsProps {
  gate: GateStore;
  logo?: ReactNode;
  withApple?: boolean;
}

export const GateFederatedButtons: React.FC<IGateFederatedButtonsProps> = ({
  gate,
  logo,
  withApple,
}) => (
  <div css={logo ? s.rootWithLogo : s.root}>
    {logo && <div>{logo}</div>}

    <RcButton
      onClick={async () => await gate.facebookSignIn()}
      color={gateParams.button.facebook.color}
      backgroundColor={gateParams.button.facebook.backgroundColor}
      hoverColor={gateParams.button.facebook.hoverColor}
      borderRadius={gateParams.button.radius}
      height={gateParams.button.height}
      fontSize={gateParams.button.font.size}
      fontWeight={gateParams.button.font.weight}
      width="100%"
    >
      <RcPair
        left={<IconLogoFacebook />}
        right={<div>{t('facebook').toUpperCase()}</div>}
        spaceBetween={true}
      />
    </RcButton>

    <RcButton
      onClick={async () => await gate.googleSignIn()}
      color="#ffffff"
      backgroundColor="#aaaaaa"
      hoverColor="#7f7f7f"
      borderRadius={gateParams.button.radius}
      height={gateParams.button.height}
      fontSize={gateParams.button.font.size}
      fontWeight={gateParams.button.font.weight}
      width="100%"
    >
      <RcPair
        left={<IconLogoGoogle />}
        right={<div>{t('google').toUpperCase()}</div>}
        spaceBetween={true}
      />
    </RcButton>

    {withApple && (
      <RcButton
        onClick={async () => await gate.appleSignIn()}
        color="#ffffff"
        backgroundColor="#000000"
        hoverColor="#313131"
        borderRadius={gateParams.button.radius}
        height={gateParams.button.height}
        fontSize={gateParams.button.font.size}
        fontWeight={gateParams.button.font.weight}
        width="100%"
      >
        <RcPair
          left={<IconLogoApple />}
          right={<div>{t('apple').toUpperCase()}</div>}
          spaceBetween={true}
        />
      </RcButton>
    )}
  </div>
);
