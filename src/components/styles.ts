import { css } from '@emotion/core';

export const stylesGateKeeper = {
  root: css`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 40px;
  `,

  container: css`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 80px;
    @media only screen and (max-width: 320px) {
      margin-top: 40px;
    }
    @media only screen and (min-width: 620px) {
      margin-top: 160px;
    }
  `,

  facebook: css`
    font-size: 16px;
    color: white;
    background-color: #4267b2;
    border-radius: 5px;
    color: white;
    height: 45px;
    text-align: center;
    min-width: 280px;
    border: 0;
    cursor: pointer;
    &:hover {
      background-color: #314d85;
    }
    border-radius: 200px;
  `,

  google: css`
    font-size: 16px;
    color: white;
    background-color: #aaaaaa;
    border-radius: 5px;
    color: white;
    height: 45px;
    text-align: center;
    min-width: 280px;
    border: 0;
    cursor: pointer;
    &:hover {
      background-color: #7f7f7f;
    }
    margin-top: 20px;
    border-radius: 200px;
  `,

  txt: css`
    min-width: 200px;
    text-align: left;
    background-color: red;
  `,

  orLineContainer: css`
    width: 275px;
    text-align: center;
    border-bottom: 1px solid #bbb;
    line-height: 0.1em;
    color: #828282;
    margin-top: 40px;
    margin-bottom: 8px;
    @media only screen and (min-width: 620px) {
      margin-top: 80px;
    }
  `,

  orLine: css`
    background: #fff;
    padding: 0 25px;
    font-size: 14px;
    font-weight: 500;
  `,
};
