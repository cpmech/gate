import { css } from '@emotion/react';
import { dims } from './dims';

export const cascade = {
  viewport: css`
    width: 100%;
    padding-top: ${100.0 / dims.aspectRatio}%;
    position: relative;
  `,
  absoluteZero: css`
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  `,
  absoluteZeroNoOverflow: css`
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    overflow: hidden;
  `,
};
