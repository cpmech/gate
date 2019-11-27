import React from 'react';
/** @jsx jsx */ import { jsx, css } from '@emotion/core';
import { SpinAndMsgCircle } from 'rcomps';

interface IPageLoading {
  message?: string;
}

export const PageLoading: React.FC<IPageLoading> = ({ message = 'Loading' }) => {
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
      <SpinAndMsgCircle color="#343434" message={message} />
    </div>
  );
};
