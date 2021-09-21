/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { RcLinkOrDiv } from '../rcomps';
import { gate } from '../service';
import { styles } from '../styles';

export interface ErrorPageProps {
  error: string;
}

export const ErrorPage: React.FC<ErrorPageProps> = ({ error }) => {
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
          <h1 style={{ fontSize: 100 }}>🥵</h1>
        </div>
        <div>
          <h2>{error}</h2>
          <h3>
            <RcLinkOrDiv
              onClick={() => {
                gate.signOut();
                window.location.reload();
              }}
              color={styles.colors.blue()}
              hoverColor={styles.colors.blue(50)}
              underline={true}
            >
              Please try again
            </RcLinkOrDiv>
          </h3>
        </div>
      </div>
    </div>
  );
};
