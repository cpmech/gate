import React from 'react';
/** @jsx jsx */ import { jsx, css } from '@emotion/core';
import { SpinAndMsgCircle } from 'rcomps';
import { colors } from './styles';

interface IPageLoading {
  message?: string;
  spinnerColor?: string;
}

export const PageLoading: React.FC<IPageLoading> = ({
  message = 'Loading',
  spinnerColor = colors.blue,
}) => {
  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100vh;
      `}
    >
      <SpinAndMsgCircle color={spinnerColor} message={message} />
    </div>
  );
};
