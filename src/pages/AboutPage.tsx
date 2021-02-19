/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

export interface AboutPageProps {
  category: string;
}

export const AboutPage: React.FC<AboutPageProps> = ({ category }) => {
  return (
    <div
      css={css`
        background-color: #ffffff;
        margin: 60px 20px;
        font-size: 1.3em;
      `}
    >
      <h1>ABOUT</h1>

      <p>Work in progress...</p>
    </div>
  );
};
