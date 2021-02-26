/** @jsxImportSource @emotion/react */
import { IconEarth } from '@cpmech/iricons/IconEarth';
import { css } from '@emotion/react';
import { GateSignUpForm, GateStore, LocalGateSignUpForm, LocalGateStore } from '../lib';
import { gate, isLocal } from '../service';

export const SignInPage: React.FC = () => {
  const signInForm = isLocal ? (
    <LocalGateSignUpForm gate={gate as LocalGateStore} logo={<IconEarth size="100px" />} />
  ) : (
    <GateSignUpForm
      gate={gate as GateStore}
      logo={<IconEarth size="100px" />}
      mayHideEmailLogin={false}
      initShownEmailLogin={false}
    />
  );

  return (
    <div
      css={css`
        background-color: #ffffff;
        margin: 60px 20px;
        font-size: 1.3em;
      `}
    >
      {signInForm}
    </div>
  );
};
