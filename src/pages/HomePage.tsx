/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Fragment } from 'react';
import { RcButton } from '../rcomps';
import { gate, useNav } from '../service';

export interface HomePageProps {
  signInSuccessful?: boolean;
}

export const HomePage: React.FC<HomePageProps> = ({ signInSuccessful }) => {
  const { goto } = useNav();

  const welcome = (
    <Fragment>
      <h1>WELCOME</h1>
      <RcButton onClick={() => goto({ route: 'signin' })}>SIGN IN</RcButton>
    </Fragment>
  );

  const granted = (
    <Fragment>
      <h1>ACCESS GRANTED</h1>
      <p>Thanks for signing up!</p>
      <p style={{ fontSize: 40 }}>😀</p>
      <RcButton
        onClick={async () => {
          await gate.signOut();
          goto({ route: '' });
        }}
      >
        SIGN OUT
      </RcButton>
    </Fragment>
  );

  return (
    <div
      css={css`
        background-color: #ffffff;
        margin: 60px 20px;
        font-size: 1.3em;
      `}
    >
      {signInSuccessful ? granted : welcome}
    </div>
  );
};
