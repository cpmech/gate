import { css } from '@emotion/core';

export const colors = {
  blue: '#236cd2',
  darkRed: '#c01626',
};

export const params = {
  vspace: {
    tiny: 5,
    small: 10,
    normal: 20,
    medium: 30,
    large: 50,
    huge: 80,
  },
  hspace: {
    small: 15,
    normal: 25,
    medium: 35,
    large: 55,
    huge: 85,
  },
  vpadding: {
    small: 5,
    normal: 10,
    large: 20,
    huge: 30,
  },
  hpadding: {
    small: 10,
    normal: 20,
    large: 40,
    huge: 60,
  },
  orLineVertSpace: 40,
  orLineVertSpaceLarge: 80,
  inputWidth: 300,
  buttonHeight: 45,
};

export const styles = {
  federatedButtons: {
    root: css`
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding-left: ${params.hpadding.normal}px;
      padding-right: ${params.hpadding.normal}px;
      margin-top: 30px;
      @media only screen and (min-width: 360px) {
        margin-top: 60px;
      }
      @media only screen and (min-width: 375px) {
        margin-top: 60px;
      }
      @media only screen and (min-width: 600px) {
        margin-top: 160px;
      }
      width: ${params.inputWidth}px;
    `,

    rowCen: css`
      display: flex;
      flex-direction: row;
      justify-content: center;
      width: 200px;
    `,

    facebook: css`
      font-size: 16px;
      color: white;
      background-color: #4267b2;
      border-radius: 5px;
      color: white;
      height: ${params.buttonHeight}px;
      text-align: center;
      width: 100%;
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
      height: ${params.buttonHeight}px;
      text-align: center;
      width: 100%;
      border: 0;
      cursor: pointer;
      &:hover {
        background-color: #7f7f7f;
      }
      border-radius: 200px;
      margin-top: 30px;
    `,

    orLineContainer: css`
      width: 275px;
      text-align: center;
      border-bottom: 1px solid #bbb;
      line-height: 0.1em;
      color: #828282;
      margin-top: ${params.orLineVertSpace}px;
      @media only screen and (min-width: 600px) {
        margin-top: ${params.orLineVertSpaceLarge}px;
      }
    `,

    orLine: css`
      background: #fff;
      padding: 0 25px;
      font-size: 14px;
      font-weight: 500;
    `,
  },

  signUpForm: {
    root: css`
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding-left: ${params.hpadding.normal}px;
      padding-right: ${params.hpadding.normal}px;
    `,

    container: css`
      margin-top: ${params.orLineVertSpace}px;
      @media only screen and (min-width: 600px) {
        margin-top: ${params.orLineVertSpaceLarge}px;
      }
      width: ${params.inputWidth}px;
    `,

    centered: css`
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      width: 100%;
    `,

    row: css`
      display: flex;
      flex-direction: row;
      align-items: center;
      width: 100%;
    `,

    header: css`
      font-size: 1.15em;
      color: #484848;
    `,

    smallFootnote: css`
      width: 100%;
      font-size: 0.8em;
      color: #484848;
    `,

    footnote: css`
      display: flex;
      flex-direction: column;
      width: 100%;
      font-size: 0.95em;
      color: #484848;
    `,

    link: css`
      color: ${colors.blue};
      :hover {
        text-decoration: underline;
      }
    `,
  },

  modalError: {
    minWidth: '290px',
    maxWidth: '500px',

    title: css`
      color: ${colors.darkRed};
      font-size: 1.2em;
      font-weight: bold;
    `,

    content: css`
      margin-top: ${params.vspace.normal}px;
      margin-bottom: ${params.vspace.normal}px;
    `,
  },
};
