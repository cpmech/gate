import React from 'react';
/** @jsx jsx */ import { jsx, css } from '@emotion/core';
import { Button } from 'rcomps';
import { GateStore } from 'service';

interface INoAccessPage {
  gate: GateStore;
  message?: string;
  btnText?: string;
}

export const PageNoAccess: React.FC<INoAccessPage> = ({
  gate,
  message = 'Cannot complete request',
  btnText = 'Sign Out',
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
      <h2>{message}</h2>
      <Button width="200px" onClick={() => gate.logout()} borderRadius={300}>
        {btnText}
      </Button>
    </div>
  );
};
