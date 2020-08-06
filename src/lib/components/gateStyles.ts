import { css } from '@emotion/core';

export const colors = {
  blue: '#236cd2',
  darkRed: '#c01626',
  darkGrey: '#343434',
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
  inputWidth: 300,
  buttonHeight: 45,
};

export const styles = {
  federatedButtons: {
    rootWithLogo: css`
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding-left: ${params.hpadding.normal}px;
      padding-right: ${params.hpadding.normal}px;
      margin-top: 18px;
      width: ${params.inputWidth}px;
    `,

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
      font-size: 14px;
      font-weight: bold;
      color: white;
      background-color: #4267b2;
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
      font-size: 14px;
      font-weight: bold;
      color: white;
      background-color: #aaaaaa;
      height: ${params.buttonHeight}px;
      text-align: center;
      width: 100%;
      border: 0;
      cursor: pointer;
      &:hover {
        background-color: #7f7f7f;
      }
      border-radius: 200px;
      margin-top: 12px;
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
      width: ${params.inputWidth}px;
    `,

    centered: css`
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    `,

    row: css`
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      width: 100%;
    `,

    header: css`
      font-size: 1.05em;
      color: #484848;
    `,

    subheader: css`
      font-size: 0.85em;
      color: #484848;
    `,

    smallFootnote: css`
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      width: 100%;
      font-size: 0.65em;
      color: #484848;
    `,

    footnote: css`
      display: flex;
      flex-direction: column;
      font-size: 0.8em;
      color: #484848;
    `,

    submitButton: css`
      width: 180px;
    `,
  },

  showHide: {
    root: css`
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      margin-top: 40px;
      border: 1px solid #a3a3a3;
      border-radius: 300px;
      line-height: 0;
      padding: 6px 12px;
      cursor: pointer;
      :hover {
        border-color: #6c6c6c;
      }
    `,

    text: css`
      margin-right: 5px;
      font-size: 0.75em;
      color: #737373;
      :hover {
        color: #6c6c6c;
      }
    `,

    icon: css`
      color: #737373;
    `,
  },
};
