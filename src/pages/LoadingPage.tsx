/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { RcSpinCircle } from '../rcomps';

export const LoadingPage: React.FC = () => {
  return (
    <div
      css={css`
        background-color: #ffffff;
        margin: 100px 20px;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
      `}
    >
      <RcSpinCircle />
    </div>
  );
};
