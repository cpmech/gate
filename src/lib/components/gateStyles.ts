/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

export const gateColors = {
  blue: '#236cd2',
  darkRed: '#c01626',
  darkGrey: '#343434',
};

export const gateParams = {
  maxWidth: '300px',
  vspace: '20px',
  hspace: '10px',
  hpadding: '20px',
  font: {
    size: '18px',
    family: 'Arial, Helvetica, sans-serif',
  },
  input: {
    hlColor: gateColors.blue,
    radius: '8px',
  },
  button: {
    fontSize: '14px',
    fontWeight: 'normal',
    widthSubmit: '220px',
    color: '#ffffff',
    bgColor: '#5d5c61',
    height: '45px',
    radius: '8px',
    facebook: {
      color: '#ffffff',
      backgroundColor: '#4267b2',
      hoverColor: '#314d85',
    },
    google: {
      color: '#ffffff',
      backgroundColor: '#aaaaaa',
      hoverColor: '#7f7f7f',
    },
    apple: {
      color: '#ffffff',
      backgroundColor: '#000000',
      hoverColor: '#313131',
    },
  },
  loading: {
    colorTitle: '#236cd2',
    colorSpinner: '#236cd2',
  },
  link: {
    underline: true,
  },
  orLine: {
    gap: '30px',
    color: '#828282',
  },
};

export const gateStyles = {
  federatedButtons: {
    root: css`
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: ${gateParams.vspace};
      max-width: ${gateParams.maxWidth};
      overflow: hidden;
      font-size: ${gateParams.font.size};
      font-family: ${gateParams.font.family};
    `,
  },

  signUpForm: {
    root: css`
      max-width: ${gateParams.maxWidth};
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: ${gateParams.vspace};
      padding-left: ${gateParams.hpadding};
      padding-right: ${gateParams.hpadding};
      font-size: ${gateParams.font.size};
      font-family: ${gateParams.font.family};
    `,

    container: css`
      display: flex;
      flex-direction: column;
      gap: ${gateParams.vspace};
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
      gap: ${gateParams.hspace};
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

  orLine: {
    root: css`
      min-width: 200px;
      text-align: center;
      border-bottom: 1px solid #bbb;
      line-height: 0.1em;
      color: ${gateParams.orLine.color};
      margin-top: ${gateParams.orLine.gap};
      margin-bottom: ${gateParams.orLine.gap};
    `,
    line: css`
      background: #fff;
      padding: 0 25px;
      font-size: 14px;
      font-weight: 500;
    `,
  },
};
