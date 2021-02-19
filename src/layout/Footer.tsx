/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { IconEarth } from '@cpmech/iricons/IconEarth';
import { IconLogoGithub } from '@cpmech/iricons/IconLogoGithub';
import { RcLinkOrDiv } from '../rcomps';
import { store } from '../service';
import { styles } from '../styles';

export const Footer: React.FC = () => {
  const logo = (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 30px;
      `}
    >
      <div
        onClick={() => store.navigate()}
        css={css`
          cursor: pointer;
        `}
      >
        <div
          css={css`
            color: ${styles.colors.grey()};
            background-color: white;
            border-radius: 300px;
            padding: 10px;
          `}
        >
          <IconEarth size="120px" />
        </div>
      </div>
      <div>&copy; {new Date().getFullYear()} Dorival Pedroso</div>
    </div>
  );

  const navigation = (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        gap: 20px;
      `}
    >
      <RcLinkOrDiv
        onClick={() => store.navigate('#legalpp')}
        color={styles.colors.white()}
        hoverColor={styles.colors.grey(75)}
      >
        Privacy Policy
      </RcLinkOrDiv>
      <RcLinkOrDiv
        onClick={() => store.navigate('#legalts')}
        color={styles.colors.white()}
        hoverColor={styles.colors.grey(75)}
      >
        Terms of Service
      </RcLinkOrDiv>
      <RcLinkOrDiv
        onClick={() => store.navigate()}
        color={styles.colors.white()}
        hoverColor={styles.colors.grey(75)}
      >
        Home
      </RcLinkOrDiv>
    </div>
  );

  const links = (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        gap: 20px;
      `}
    >
      <RcLinkOrDiv
        href="https://github.com/cpmech"
        color={styles.colors.white()}
        hoverColor={styles.colors.grey(75)}
      >
        <IconLogoGithub size="40px" />
      </RcLinkOrDiv>
    </div>
  );

  return (
    <footer
      css={css`
        color: white;
        background-color: ${styles.colors.grey()};
        padding: 60px 40px;
      `}
    >
      <div
        css={css`
          max-width: ${styles.dims.minMaxPageWidth}px;
          margin: 0 auto;
        `}
      >
        <div
          css={css`
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            gap: 50px;
          `}
        >
          {logo}
          {navigation}
          {links}
        </div>
      </div>
    </footer>
  );
};
