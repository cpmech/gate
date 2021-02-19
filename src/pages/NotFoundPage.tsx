/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

export const NotFoundPage: React.FC = () => {
  return (
    <div
      css={css`
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: center;
        margin-top: 20px;
      `}
    >
      <div
        css={css`
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        `}
      >
        <div>
          <h1 style={{ fontSize: 100 }}>😱</h1>
        </div>
        <div>
          <h1>404: Not found</h1>
        </div>
      </div>
    </div>
  );
};
