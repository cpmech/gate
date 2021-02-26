/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

export const gateColors = {
  blue: '#236cd2',
  darkRed: '#c01626',
  darkGrey: '#343434',
};

export const gateParams = {
  vspace: {
    tiny: '5px',
    small: '10px',
    normal: '20px',
    medium: '30px',
    large: '50px',
    huge: '80px',
  },
  hspace: {
    tiny: '10px',
    small: '15px',
    normal: '25px',
    medium: '35px',
    large: '55px',
    huge: '85px',
  },
  vpadding: {
    small: '5px',
    normal: '10px',
    large: '20px',
    huge: '30px',
  },
  hpadding: {
    small: '10px',
    normal: '20px',
    large: '40px',
    huge: '60px',
  },
  input: {
    width: '300px',
    hlColor: gateColors.blue,
  },
  button: {
    font: {
      size: '14px',
      weight: 'bold',
      family: 'Arial, Helvetica, sans-serif',
    },
    width: '100%',
    color: '#ffffff',
    bgColor: '#5d5c61',
    height: '45px',
    radius: '300px',
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
};

export const gateStyles = {
  federatedButtons: {
    rootWithLogo: css`
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: ${gateParams.vspace.normal};
      padding-left: ${gateParams.hpadding.normal};
      padding-right: ${gateParams.hpadding.normal};
      margin-top: 18px;
      width: ${gateParams.input.width};
      font-family: ${gateParams.button.font.family};
    `,

    root: css`
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding-left: ${gateParams.hpadding.normal};
      padding-right: ${gateParams.hpadding.normal};
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
      width: ${gateParams.input.width};
    `,
  },

  signUpForm: {
    root: css`
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: ${gateParams.vspace.normal};
      padding-left: ${gateParams.hpadding.normal};
      padding-right: ${gateParams.hpadding.normal};
    `,

    container: css`
      display: flex;
      flex-direction: column;
      gap: ${gateParams.vspace.normal};
      width: ${gateParams.input.width};
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
      gap: ${gateParams.hspace.tiny};
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
