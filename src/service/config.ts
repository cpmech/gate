import { initEnvars } from '@cpmech/envars';

const envars = {
  REACT_APP_KEY: '',
  REACT_APP_STAGE: '',
  REACT_APP_LIVEGATE: '',
  REACT_APP_DOMAIN: '',
  REACT_APP_APIURL: '',
  REACT_APP_COGNITO_POOLID: '',
  REACT_APP_COGNITO_CLIENTID: '',
};

initEnvars(envars);

export const config = {
  appKey: envars.REACT_APP_KEY,
  stage: envars.REACT_APP_STAGE,
  liveGate: envars.REACT_APP_LIVEGATE === 'true',
  domain: envars.REACT_APP_DOMAIN,
  apiUrl: envars.REACT_APP_APIURL.replace(/\/?$/, '/'), // make sure it ends with slash
  cognitoPoolId: envars.REACT_APP_COGNITO_POOLID,
  cognitoClientId: envars.REACT_APP_COGNITO_CLIENTID,
  isLocalApi:
    envars.REACT_APP_APIURL.includes('localhost') || envars.REACT_APP_APIURL.includes('192'),
};
