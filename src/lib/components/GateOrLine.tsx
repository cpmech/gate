import React from 'react';
/** @jsx jsx */ import { jsx, css } from '@emotion/core';
import { t } from '../locale';

interface IProps {
  vertSpace?: number;
  vertSpaceLarge?: number;
}

export const GateOrLine: React.FC<IProps> = ({ vertSpace = 40, vertSpaceLarge = 80 }) => {
  const styles = {
    root: css`
      width: 275px;
      text-align: center;
      border-bottom: 1px solid #bbb;
      line-height: 0.1em;
      color: #828282;
      margin-top: ${vertSpace}px;
      margin-bottom: ${vertSpace}px;
      @media only screen and (min-width: 600px) {
        margin-top: ${vertSpaceLarge}px;
        margin-bottom: ${vertSpaceLarge}px;
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
