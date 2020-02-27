import React from 'react';
/** @jsx jsx */ import { jsx, css } from '@emotion/core';
import { RouteComponentProps } from '@reach/router';
import { Button } from 'rcomps';
import { GateStore } from 'service';

interface IHomeProps extends RouteComponentProps {
  gate: GateStore;
}

export const Home: React.FC<IHomeProps> = ({ gate }) => {
  return (
    <div
      css={css`
        display: flex;
        justify-content: center;
        align-items: center;
        height: 500px;
        width: 100%;
        font-size: 150%;
        color: #343434;
        background-color: #bde0fc;
        p {
          margin: 100px 100px;
        }
      `}
    >
      <p>HOME</p>
      <Button
        onClick={async () => {
          const header = await gate.getRefreshedAuthHeader();
          console.log('header = ', header);
        }}
      >
        Get Auth Header
      </Button>
    </div>
  );
};
