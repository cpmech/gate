/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Fragment } from 'react';
import { RcButton } from '../rcomps';
import { useNav } from '../service';

const signin = (
  <Fragment>
    <h1>ACCESS GRANTED</h1>
    <p>Thanks for signing up!</p>
    <p style={{ fontSize: 40 }}>😀</p>
  </Fragment>
);

export interface HomePageProps {
  signInSuccessful?: boolean;
}

export const HomePage: React.FC<HomePageProps> = ({ signInSuccessful }) => {
  const { goto } = useNav();

  const welcome = (
    <Fragment>
      <h1>WELCOME</h1>
      <RcButton onClick={() => goto({ route: 'signin' })}>ACCESS</RcButton>
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
      {signInSuccessful ? signin : welcome}
    </div>
  );
};
