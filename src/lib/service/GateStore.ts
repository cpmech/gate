import Amplify, { Auth, Hub } from 'aws-amplify';
import { HubCapsule } from '@aws-amplify/core/lib/Hub';
import { CognitoHostedUIIdentityProvider } from '@aws-amplify/auth/lib/types';
import { copySimple, sleep, maybeCopySimple } from '@cpmech/basic';
import {
  IAmplifyConfig,
  IGateObservers,
  IGateFlags,
  IGateUser,
  newBlankFlags,
  newBlankUser,
} from './types';
import { t } from '../locale';
import { delays } from './delays';

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
    setTimeout(() => this.onChange(), delays.onChange);
  };

  // constructor initializes Amplify and sets the groups that may give access to the user
  constructor(amplifyConfig: IAmplifyConfig, private mustBeInGroups?: string[]) {
    Hub.listen('auth', this.listener); // must be the first (to catch the configure event)
    setTimeout(() => {
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
    }, delays.constructor);
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

  notify = (input?: Partial<IGateFlags>) => {
    if (input) {
      maybeCopySimple(this.flags, input);
    }
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

  confirmSignUpAndSignIn = async (email: string, password: string, code: string) => {
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

  confirmSignUpOnly = async (email: string, code: string) => {
    if (!email || !code) {
      return;
    }
    this.begin();
    try {
      const res = await Auth.confirmSignUp(email, code);
      if (res === 'SUCCESS') {
        // this.end()
      } else {
        console.error('[confirmSignUp]', res);
        // return this.end(t('errorConfirm'));
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
    if (!email) {
      return;
    }
    this.begin();
    try {
      await Auth.resendSignUp(email);
      await sleep(delays.resendCode);
      return this.end();
    } catch (error) {
      if (error.message === 'User is already confirmed.') {
        return this.end(t('errorAlreadyConfirmed'));
      }
      if (error.code === 'LimitExceededException') {
        return this.end(t('errorResendLimitExceeded'));
      }
      if (error.code === 'UserNotFoundException') {
        return this.end(t('UserNotFoundException'));
      }
      console.error('[resendCode]', error);
      return this.end(t('errorResend'));
    }
  };

  signIn = async (email: string, password: string) => {
    if (!email || !password) {
      return;
    }
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

  forgotPasswordStep1 = async (email: string) => {
    if (!email) {
      return;
    }
    this.begin();
    try {
      await Auth.forgotPassword(email);
    } catch (error) {
      console.error('[resetPassword]', error);
    }
  };

  forgotPasswordStep2 = async (email: string, password: string, code: string) => {
    if (!email || !password || !code) {
      return;
    }
    this.begin();
    try {
      await Auth.forgotPasswordSubmit(email, code, password);
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

    // detect event
    switch (capsule.payload.event) {
      case 'codeFlow':
        this.flags.codeFlow = true;
        break;

      case 'configured':
        if (this.flags.codeFlow) {
          return; // ignore this event and let signIn two switch the flag
        }
        await this.setCurrentUser(true); // ignore error, because we may not have an authenticated user
        return this.end();

      case 'signIn':
        await this.setCurrentUser();
        if (this.flags.codeFlow) {
          this.flags.codeFlow = false;
        }
        return this.end();

      case 'signUp':
        this.flags.needToConfirm = true;
        return this.end();

      case 'signOut':
        return this.end(); // no need to clear here because configure will do it

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

      case 'forgotPassword':
        this.flags.resetPasswordStep2 = true;
        return this.end();

      case 'forgotPasswordSubmit':
        this.clearData();
        return this.end();

      case 'forgotPassword_failure':
        switch (data.code) {
          case 'LimitExceededException':
            return this.end(t('LimitExceededException'));
          default:
            console.error('forgotPassword_failure: unknown error =', data.message);
            return this.end(t('UnknownForgotPasswordException'));
        }

      case 'forgotPasswordSubmit_failure':
        switch (data.code) {
          case 'CodeMismatchException':
            return this.end(t('CodeMismatchException'));
          case 'LimitExceededException':
            return this.end(t('LimitExceededException'));
          default:
            console.error('forgotPasswordSubmit_failure: unknown error =', data.message);
            return this.end(t('UnknownForgotPasswordException'));
        }
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

    // check if user has access
    if (!ignoreError) {
      // user is signedIn but doesn't have access => sign him/her out
      if (amplifyUser.username && !hasAccess) {
        console.error('[noGroup] unauthorized user');
        this.flags.error = t('errorNoGroup');
        try {
          await Auth.signOut(); // listener should receive event and call this.end()
        } catch (_) {
          // ok
        }
      }
    }

    // results
    this.user.email = attributes.email;
    this.user.username = amplifyUser.username;
    this.user.idToken = idToken.jwtToken;
    this.user.hasAccess = hasAccess;
  };
}
