import Amplify, { Auth, Hub } from 'aws-amplify';
import { HubCapsule } from '@aws-amplify/core/lib/Hub';
import { CognitoHostedUIIdentityProvider } from '@aws-amplify/auth/lib/types';
import { sleep } from '@cpmech/basic';
import { IAmplifyConfig, IGateObservers, IGateState, newBlankState } from './types';
import { setTimeout } from 'timers';
import { t } from 'locale';

const NOTIFY_DELAY = 50; // to allow calling begin/end immediately and force re-rendering

// GateStore holds all state
export class GateStore {
  // observers holds everyone who is interested in state updates
  private observers: IGateObservers = {};

  // all data is held here
  /* readonly */ error = ''; // some error happened
  /* readonly */ codeFlow = false; // oAuth is processing
  /* readonly */ configured = false; // amplify has been configured
  /* readonly */ processing = false; // something is happening
  /* readonly */ state: IGateState = newBlankState();

  private clearData = () => {
    this.error = '';
    this.codeFlow = false;
    this.configured = false;
    this.processing = false;
    this.state = newBlankState();
  };

  // onChange notifies all observers that the state has been changed
  private onChange = () =>
    Object.keys(this.observers).forEach(name => this.observers[name] && this.observers[name]());

  // begin processing
  private begin = () => {
    this.error = '';
    this.processing = true;
    this.onChange();
  };

  // end processing
  private end = (withError = '') => {
    this.error = withError;
    this.processing = false;
    setTimeout(() => this.onChange(), NOTIFY_DELAY);
  };

  // constructor initializes Amplify and sets the groups that may give access to the user
  constructor(amplifyConfig: IAmplifyConfig, private mustBeInGroups?: string[]) {
    Hub.listen('auth', this.listener); // must be the first (to catch the configure event)
    Amplify.configure({
      Auth: {
        region: amplifyConfig.awsRegion,
        userPoolId: amplifyConfig.userPoolId,
        userPoolWebClientId: amplifyConfig.userPoolWebClientId,
        oauth: {
          domain: amplifyConfig.oauthDomain,
          redirectSignIn: amplifyConfig.redirectSignIn,
          redirectSignOut: amplifyConfig.redirectSignOut,
          responseType: 'code',
          scope: ['phone', 'email', 'profile', 'openid', 'aws.cognito.signin.user.admin'],
        },
      },
    });
  }

  // subscribe adds someone to be notified about state updates
  // NOTE: returns a function to unsubscribe
  subscribe = (observer: () => void, name: string): (() => void) => {
    this.observers[name] = observer;
    return () => {
      delete this.observers[name];
    };
  };

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////                ///////////////////////////////////////////////////////////////////////////////////////////////
  ////  main setters  ///////////////////////////////////////////////////////////////////////////////////////////////
  ////                ///////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  notify = (error = '') => {
    this.error = error;
    this.onChange();
  };

  // returns the username
  signUp = async (email: string, password: string) => {
    this.begin();
    try {
      const res = await Auth.signUp({ username: email, password });
      console.log('res = ', res);
      // if (!res.userSub) {
      // return this.end('Não foi possível iniciar criação de conta');
      // }
      // this.state.username = res.userSub;
    } catch (error) {
      console.log('error = ', error);
      switch (error.code) {
        case 'UsernameExistsException':
          return this.end(t('usernameExistsException'));
      }
      // return this.end('Algum erro aconteceu na criação da conta');
    }
    // this.end();
  };

  confirmSignUp = async (code: string) => {
    // this.begin();
    try {
      // const res = await Auth.confirmSignUp(this.username, code);
      // console.log(res);
    } catch (error) {
      console.log(error);
      // return this.end(error);
    }
  };

  resendCode = async () => {
    // this.begin();
    try {
      // await Auth.resendSignUp(this.username);
    } catch (error) {
      console.log(error);
      // return this.end(error);
    }
  };

  signIn = async (email: string, password: string) => {
    this.begin();
    try {
      const user = await Auth.signIn(email, password);
      console.log(user);
      if (user.challengeName === 'SMS_MFA' || user.challengeName === 'SOFTWARE_TOKEN_MFA') {
        console.log('Not implemented: SMS_MFA or SOFTWARE_TOKEN_MFA');
        // return this.end('Not implemented: SMS_MFA or SOFTWARE_TOKEN_MFA');
      }
      if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
        console.log('Not implemented: NEW_PASSWORD_REQUIRED');
        // return this.end('Not implemented: NEW_PASSWORD_REQUIRED');
      }
      if (user.challengeName === 'MFA_SETUP') {
        console.log('Not implemented: MFA_SETUP');
        // return this.end('Not implemented: MFA_SETUP');
      }
    } catch (error) {
      if (error.code === 'UserNotConfirmedException') {
        // return this.end('UserNotConfirmedException');
        // The error happens if the user didn't finish the confirmation step when signing up
        // In this case you need to resend the code and confirm the user
        // About how to resend the code and confirm the user, please check the signUp part
      } else if (error.code === 'PasswordResetRequiredException') {
        // return this.end('PasswordResetRequiredException');
        // The error happens when the password is reset in the Cognito console
        // In this case you need to call forgotPassword to reset the password
        // Please check the Forgot Password part.
      } else if (error.code === 'NotAuthorizedException') {
        // return this.end('NotAuthorizedException');
        // The error happens when the incorrect password is provided
      } else if (error.code === 'UserNotFoundException') {
        // return this.end('UserNotFoundException');
        // The error happens when the supplied username/email does not exist in the Cognito user pool
      } else {
        console.log(error);
        // return this.end(error);
      }
    }
  };

  facebookSignIn = async () => {
    this.begin();
    await Auth.federatedSignIn({ provider: CognitoHostedUIIdentityProvider.Facebook });
  };

  googleSignIn = async () => {
    this.begin();
    await Auth.federatedSignIn({ provider: CognitoHostedUIIdentityProvider.Google });
  };

  signOut = async () => {
    this.begin();
    try {
      await Auth.signOut(); // listener should receive event and call this.end()
    } catch (_) {
      this.end('signOut failed');
    }
  };

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////                ///////////////////////////////////////////////////////////////////////////////////////////////
  ////    internal    ///////////////////////////////////////////////////////////////////////////////////////////////
  ////                ///////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  private listener = async (data: HubCapsule) => {
    switch (data.payload.event) {
      case 'codeFlow':
        this.codeFlow = true;
        break;
      case 'configured':
        this.state = await this.getCurrentUser(true); // ignore error, because we may not have an authenticated user
        if (!this.codeFlow) {
          this.configured = true;
        }
        break;
      case 'signIn':
        this.state = await this.getCurrentUser();
        if (this.codeFlow) {
          this.codeFlow = false;
          this.configured = true;
        }
        break;
      case 'signUp':
        // this.error = 'user signed up';
        break;
      case 'signOut':
        this.clearData();
        break;
      case 'signIn_failure':
        this.clearData();
        this.error = 'user sign in failed';
        break;
    }
    this.end();
    return;
  };

  // returns error
  private getCurrentUser = async (ignoreError = false): Promise<IGateState> => {
    // get current user
    let user: any;
    try {
      user = await Auth.currentAuthenticatedUser();
    } catch (error) {
      if (!ignoreError) {
        this.error = 'there is no current authenticated user';
      }
      return newBlankState();
    }

    // extract attributes
    const { attributes, signInUserSession } = user;
    const { idToken } = signInUserSession;
    const { payload } = idToken;

    // set groups that this user belongs to
    let hasAccess = false;
    if (this.mustBeInGroups) {
      if (payload && payload['cognito:groups']) {
        const groups = payload['cognito:groups'] as string[];
        hasAccess = this.mustBeInGroups.some(g => groups.includes(g));
      }
    } else {
      hasAccess = true;
    }

    // results
    return {
      email: attributes.email,
      idToken: idToken.jwtToken,
      username: user.username,
      hasAccess,
    };
  };
}
