/** @jsxImportSource @emotion/react */
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
  withApple?: boolean;
}

export const GateFederatedButtons: React.FC<IGateFederatedButtonsProps> = ({ gate, withApple }) => (
  <div css={s.root}>
    <RcButton
      onClick={async () => await gate.facebookSignIn()}
      color={gateParams.button.facebook.color}
      backgroundColor={gateParams.button.facebook.backgroundColor}
      hoverColor={gateParams.button.facebook.hoverColor}
      borderRadius={gateParams.button.radius}
      height={gateParams.button.height}
      fontSize={gateParams.button.fontSize}
      fontWeight={gateParams.button.fontWeight}
      width="100%"
    >
      <RcPair
        left={<IconLogoFacebook />}
        right={<div>{t('facebook').toUpperCase()}</div>}
        spacing={gateParams.hspace}
      />
    </RcButton>

    <RcButton
      onClick={async () => await gate.googleSignIn()}
      color={gateParams.button.google.color}
      backgroundColor={gateParams.button.google.backgroundColor}
      hoverColor={gateParams.button.google.hoverColor}
      borderRadius={gateParams.button.radius}
      height={gateParams.button.height}
      fontSize={gateParams.button.fontSize}
      fontWeight={gateParams.button.fontWeight}
      width="100%"
    >
      <RcPair
        left={<IconLogoGoogle />}
        right={<div>{t('google').toUpperCase()}</div>}
        spacing={gateParams.hspace}
      />
    </RcButton>

    {withApple && (
      <RcButton
        onClick={async () => await gate.appleSignIn()}
        color={gateParams.button.apple.color}
        backgroundColor={gateParams.button.apple.backgroundColor}
        hoverColor={gateParams.button.apple.hoverColor}
        borderRadius={gateParams.button.radius}
        height={gateParams.button.height}
        fontSize={gateParams.button.fontSize}
        fontWeight={gateParams.button.fontWeight}
        width="100%"
      >
        <RcPair
          left={<IconLogoApple />}
          right={<div>{t('apple').toUpperCase()}</div>}
          spacing={gateParams.hspace}
        />
      </RcButton>
    )}
  </div>
);
