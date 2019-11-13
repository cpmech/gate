import Amplify from 'aws-amplify';

export const initAuth = (
  userPoolId: string,
  userPoolWebClientId: string,
  oauthDomain: string,
  redirectSignIn = 'https://localhost:3000/',
  redirectSignOut = 'https://localhost:3000/',
  awsRegion = 'us-east-1',
) => {
  Amplify.configure({
    Auth: {
      region: awsRegion,
      userPoolId,
      userPoolWebClientId,
      oauth: {
        domain: oauthDomain,
        scope: ['phone', 'email', 'profile', 'openid', 'aws.cognito.signin.user.admin'],
        responseType: 'code',
        redirectSignIn,
        redirectSignOut,
      },
    },
  });
};
