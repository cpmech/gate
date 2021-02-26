/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { GateSignUpForm, GateStore, LocalGateSignUpForm, LocalGateStore } from '../lib';
import { gate, isLocal } from '../service';

const Logo: React.FC = () => (
  <div
    css={css`
      width: 150px;
      height: 150px;
      background: url('/assets/earth.jpg');
      border-radius: 50%;
      background-size: 610px;
      box-shadow: inset 8px 36px 80px 36px rgb(0, 0, 0, 0.6),
        inset -6px 0 12px 4px rgba(255, 255, 255, 0.3);
      animation-name: rotate;
      animation-duration: 12s;
      animation-iteration-count: infinite;
      animation-timing-function: linear;
      -webkit-animation-name: rotate;
      -webkit-animation-duration: 12s;
      -webkit-animation-iteration-count: infinite;
      -webkit-animation-timing-function: linear;
      margin-bottom: 20px;
      @keyframes rotate {
        from {
          background-position: 0px 0px;
        }
        to {
          background-position: 610px 0px;
        }
      }
      @-webkit-keyframes rotate {
        from {
          background-position: 0px 0px;
        }
        to {
          background-position: 610px 0px;
        }
      }
    `}
  ></div>
);

export const SignInPage: React.FC = () => {
  const signInForm = isLocal ? (
    <LocalGateSignUpForm gate={gate as LocalGateStore} logo={<Logo />} />
  ) : (
    <GateSignUpForm
      gate={gate as GateStore}
      logo={<Logo />}
      mayHideEmailLogin={false}
      initShownEmailLogin={false}
    />
  );

  return (
    <div
      css={css`
        background-color: #ffffff;
        margin: 60px 20px;
        font-size: 2em;
        display: flex;
        flex-direction: row;
        justify-content: center;
      `}
    >
      {signInForm}
    </div>
  );
};
