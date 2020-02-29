import Amplify, { Auth, Hub } from 'aws-amplify';
import { HubCapsule } from '@aws-amplify/core/lib/Hub';
import { CognitoHostedUIIdentityProvider } from '@aws-amplify/auth/lib/types';
import { copySimple, sleep } from '@cpmech/basic';
import {
  IAmplifyConfig,
  IGateObservers,
  IGateFlags,
  IGateUser,
  newBlankFlags,
  newBlankUser,
} from './types';
import { setTimeout } from 'timers';
import { t } from 'locale';

const NOTIFY_DELAY = 50; // to allow calling begin/end immediately and force re-rendering
const RESEND_DELAY = 10000; // to let the user find the email or to prevent sending many codes

// GateStore holds all state
export class GateStore {
  // observers holds everyone who is interested in state updates
  private observers: IGateObservers = {};

  // all data is held here
  readonly flags: IGateFlags = newBlankFlags();
  readonly user: IGateUser = newBlankUser();

  // clear data
  private clearData = () => {
    copySimple(this.flags, newBlankFlags());
    copySimple(this.user, newBlankUser());
  };

  // onChange notifies all observers that the state has been changed
  private onChange = () =>
    Object.keys(this.observers).forEach(name => this.observers[name] && this.observers[name]());

  // begin processing
  private begin = () => {
    this.flags.error = '';
    this.flags.processing = true;
    this.onChange();
  };

  // end processing
  private end = (withError = '') => {
    this.flags.error = withError;
    this.flags.ready = true; // always true upon calling "this.end", because amplify has been configured already
    this.flags.processing = false;
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

  notify = (input?: { error?: string; needToConfirm?: boolean; processing?: boolean }) => {
    this.flags.error = input?.error || '';
    this.flags.needToConfirm = input?.needToConfirm || false;
    this.flags.processing = input?.processing || false;
    this.onChange();
  };

  signUp = async (email: string, password: string) => {
    if (!email || !password) {
      return;
    }
    this.begin();
    try {
      await Auth.signUp({ username: email, password });
    } catch (error) {
      // only capturing AuthError here because the listener will capture others
      if (error.name === 'AuthError') {
        return this.end(t('UnknownSignUpException'));
      }
    }
  };

  confirmSignUp = async (email: string, password: string, code: string) => {
    if (!email || !password || !code) {
      return;
    }
    this.begin();
    try {
      const res = await Auth.confirmSignUp(email, code);
      if (res === 'SUCCESS') {
        await Auth.signIn(email, password);
        // do not call this.end() because the listener will deal with it
      } else {
        console.error('[confirmSignUp]', res);
      }
    } catch (error) {
      if (error.message === 'User cannot be confirmed. Current status is CONFIRMED') {
        return this.end(t('errorAlreadyConfirmed'));
      }
      console.error('[confirmSignUp]', error);
      return this.end(t('errorConfirm'));
    }
  };

  resendCode = async (email: string) => {
    this.begin();
    try {
      await Auth.resendSignUp(email);
      await sleep(RESEND_DELAY);
      return this.end();
    } catch (error) {
      if (error.message === 'User is already confirmed.') {
        return this.end(t('errorAlreadyConfirmed'));
      }
      if (error.code === 'LimitExceededException') {
        return this.end(t('errorResendLimitExceeded'));
      }
      console.error('[resendCode]', error);
      return this.end(t('errorResend'));
    }
  };

  signIn = async (email: string, password: string) => {
    this.begin();
    try {
      await Auth.signIn(email, password);
    } catch (error) {
      // only capturing AuthError here because the listener will capture others
      if (error.name === 'AuthError') {
        return this.end(t('UnknownSignUpException'));
      }
    }
  };

  forgotPassword = async (email: string) => {
    this.begin();
    try {
      const res = await Auth.forgotPassword(email);
      console.log('... res = ', res);
    } catch (error) {
      console.error('[resetPassword]', error);
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
      // ok
    }
  };

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////                ///////////////////////////////////////////////////////////////////////////////////////////////
  ////    internal    ///////////////////////////////////////////////////////////////////////////////////////////////
  ////                ///////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  private listener = async (capsule: HubCapsule) => {
    console.log('########## event =', capsule.payload.event, '### codeFlow =', this.flags.codeFlow);

    const { payload } = capsule;
    const { data } = payload;

    console.log('payload = ', payload);

    // set codeFlow
    // if (data.payload.event === 'codeFlow') {
    // this.codeFlow = true;
    // return;
    // }

    // detect event
    switch (capsule.payload.event) {
      case 'codeFlow':
        console.log('codeFloe');
        break;

      case 'configured':
        await this.setCurrentUser(true); // ignore error, because we may not have an authenticated user
        if (!this.flags.codeFlow) {
          // await sleep(5000);
          this.flags.ready = true;
        }
        return this.end();

      case 'signIn':
        await this.setCurrentUser();
        if (this.flags.codeFlow) {
          console.log('yes, its codeflow');
        }
        return this.end();

      case 'signUp':
        this.flags.needToConfirm = true;
        return this.end();

      case 'signOut':
        this.clearData();
        return this.end();

      case 'signUp_failure':
        this.clearData();
        switch (data.code) {
          case 'UsernameExistsException':
            return this.end(t('UsernameExistsException'));
          case 'InvalidPasswordException':
            return this.end(t('InvalidPasswordException'));
          case 'InvalidParameterException':
            return this.end(t('InvalidParameterException'));
          default:
            console.error('signUp_failure: unknown error =', data.message);
            return this.end(t('UnknownSignUpException'));
        }

      case 'signIn_failure':
        this.clearData();
        switch (data.code) {
          case 'UserNotConfirmedException':
            return this.end(t('UserNotConfirmedException'));
          case 'PasswordResetRequiredException':
            return this.end(t('PasswordResetRequiredException'));
          case 'NotAuthorizedException':
            return this.end(t('NotAuthorizedException'));
          case 'UserNotFoundException':
            return this.end(t('UserNotFoundException'));
          default:
            console.error('signIn_failure: unknown error =', data.message);
            return this.end(t('UnknownSignInException'));
        }

      case 'cognitoHostedUI':
        console.log('cognitoHostedUI');
        break;
      case 'cognitoHostedUI_failure':
        console.log('cognitoHostedUI_failure');
        break;
      case 'parsingUrl_failure':
        console.log('parsingUrl_failure');
        break;
      case 'signOut':
        console.log('signOut');
        break;
      case 'customGreetingSignOut':
        console.log('customGreetingSignOut');
        break;
      case 'parsingCallbackUrl':
        console.log('parsingCallbackUrl');
        break;

      default:
        return;
    }
  };

  // gets current authenticated user and sets it in our internal this.user object
  // also, sets the error flag if there are any (and we are not ignoring it)
  private setCurrentUser = async (ignoreError = false) => {
    // get current user
    let amplifyUser: any;
    try {
      amplifyUser = await Auth.currentAuthenticatedUser();
    } catch (error) {
      if (!ignoreError) {
        this.flags.error = t('errorNoAuthUser');
      }
      copySimple(this.user, newBlankUser());
      return;
    }

    // extract attributes
    const { attributes, signInUserSession } = amplifyUser;
    const { idToken } = signInUserSession;
    const { payload } = idToken;

    // find whether this user belongs to the required groups
    let hasAccess = false;
    if (this.mustBeInGroups) {
      if (payload && payload['cognito:groups']) {
        const groups = payload['cognito:groups'] as string[];
        hasAccess = this.mustBeInGroups.some(g => groups.includes(g));
      }
    } else {
      hasAccess = true;
    }

    /*
    // check if user has access
    if (!ignoreError) {
      if (user.username && !hasAccess) {
        console.error('unauthorized user');
        this.error = t('notAuthorizedException');
        try {
          await Auth.signOut(); // listener should receive event and call this.end()
        } catch (_) {
          // ok
        }
        return newBlankState();
      }
    }
    */

    // results
    this.user.email = attributes.email;
    this.user.username = amplifyUser.username;
    this.user.idToken = idToken.jwtToken;
    this.user.hasAccess = hasAccess;
  };
}
