import Amplify, { Auth, Hub } from 'aws-amplify';
import { HubCapsule } from '@aws-amplify/core/lib/Hub';
import { CognitoHostedUIIdentityProvider } from '@aws-amplify/auth/lib/types';
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
    Object.keys(this.observers).forEach(name => {
      // console.log('notifying ', name, this.state, this.error, this.configured, this.processing);
      this.observers[name] && this.observers[name]();
    });

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

  notify = (input?: { error?: string; processing?: boolean }) => {
    this.error = input?.error || '';
    this.processing = input?.processing || false;
    this.onChange();
  };

  // returns the username
  signUp = async (email: string, password: string) => {
    if (!email || !password) {
      return;
    }
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
        case 'InvalidParameterException':
          return this.end(t('invalidParameterException'));
      }
      return this.end(t('unknownSignUpError'));
    }
  };

  confirmSignUp = async (email: string, password: string, code: string) => {
    if (!email || !password || !code) {
      return;
    }
    this.begin();
    try {
      const res = await Auth.confirmSignUp(email, code);
      console.log('>> res = ', res);
      if (res === 'SUCCESS') {
        const r2 = await Auth.signIn(email, password);
      }
    } catch (error) {
      console.log(error);
      return this.end(t('asdfasd'));
    }
  };

  resendCode = async (email: string) => {
    this.begin();
    try {
      const res = await Auth.resendSignUp(email);
      console.log('resend results = ', res);
    } catch (error) {
      console.log(error);
      return this.end(t('resend failed'));
    }
  };

  signIn = async (email: string, password: string) => {
    this.begin();
    try {
      const user = await Auth.signIn(email, password);
      console.log('user = ', user);
    } catch (error) {
      console.log('signIn: error = ', error);
      switch (error.code) {
        case 'UserNotConfirmedException':
          return this.end(t('userNotConfirmedException'));
        case 'PasswordResetRequiredException':
          return this.end(t('passwordResetRequiredException'));
        case 'NotAuthorizedException':
          return this.end(t('notAuthorizedException'));
        case 'UserNotFoundException':
          return this.end(t('userNotFoundException'));
        default:
          return this.end(t('errorSomethingHappened'));
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
      /* ok */
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
    console.log('##############', data.payload.event);
    // detect event
    switch (data.payload.event) {
      case 'codeFlow':
        this.codeFlow = true;
        console.log('>>> codeFlow, state = ', this.state);
        break;

      case 'configured':
        this.state = await this.getCurrentUser(true); // ignore error, because we may not have an authenticated user
        if (!this.codeFlow) {
          this.configured = true;
        }
        console.log('>>> configured, state = ', this.state);
        break;

      case 'signIn':
        this.state = await this.getCurrentUser();
        if (this.codeFlow) {
          this.codeFlow = false;
          this.configured = true;
        }
        console.log('>>> signIn, state = ', this.state);
        break;

      case 'signUp':
        // this.error = 'user signed up';
        console.log('>>> signUp, state = ', this.state);
        break;

      case 'signOut':
        this.clearData();
        console.log('>>> signOut <<<');
        this.configured = true;
        break;

      case 'signUp_failure':
        this.clearData();
        console.log('>>> signUp_failure <<<');
        this.configured = true;
        break;

      case 'signIn_failure':
        this.clearData();
        console.log('>>> signIn_failure <<<');
        this.configured = true;
        break;

      default:
        this.clearData();
        console.log('>>> dont know this event <<<');
    }

    // check if user has access
    if (this.state.username && !this.state.hasAccess) {
      try {
        await Auth.signOut(); // listener should receive event and call this.end()
      } catch (_) {
        /* ok */
      }
      console.error('unauthorized user');
    }

    // notify observers
    console.log('... notifying observers ...');
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

/*
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
*/
