import { AmplifyTheme } from 'aws-amplify-react';

export const theme0 = {};

export const theme1 = AmplifyTheme;

export const theme2 = {
  ...AmplifyTheme,
  button: {
    ...AmplifyTheme.button,
    backgroundColor: '#ebebeb',
  },
  sectionBody: {
    ...AmplifyTheme.sectionBody,
    padding: '10px',
  },
  sectionHeader: {
    ...AmplifyTheme.sectionHeader,
    backgroundColor: '#a29bfe',
  },
};

export const theme3 = {
  formSection: {
    boxShadow: '1px 1px 4px 0 rgba(0,0,0,0)',
  },
  button: {
    backgroundColor: '#5d5c61',
    fontWeight: 'bold',
    borderRadius: 200,
  },
  a: {
    color: '#3498db',
  },
  input: {
    borderRadius: 200,
  },
  oAuthSignInButton: {
    display: 'none',
  },
  strike: {
    display: 'none',
  },
};
