/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Fragment } from 'react';

const welcome = (
  <Fragment>
    <h1>WELCOME</h1>
  </Fragment>
);

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
