/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { t } from '../locale';

interface IProps {
  vertSpace?: string;
  vertSpaceLarge?: string;
}

export const GateOrLine: React.FC<IProps> = ({ vertSpace = '40px', vertSpaceLarge = '40px' }) => {
  const styles = {
    root: css`
      width: 275px;
      text-align: center;
      border-bottom: 1px solid #bbb;
      line-height: 0.1em;
      color: #828282;
      margin-top: ${vertSpace};
      margin-bottom: ${vertSpace};
      @media only screen and (min-width: 600px) {
        margin-top: ${vertSpaceLarge};
        margin-bottom: ${vertSpaceLarge};
      }
    `,

    line: css`
      background: #fff;
      padding: 0 25px;
      font-size: 14px;
      font-weight: 500;
    `,
  };

  return (
    <div css={styles.root}>
      <span css={styles.line}>{t('or')}</span>
    </div>
  );
};
