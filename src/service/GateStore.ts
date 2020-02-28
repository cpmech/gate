import Amplify, { Auth, Hub } from 'aws-amplify';

const NOTIFY_DELAY = 50; // to allow calling begin/end immediately and force re-rendering

export interface IAmplifyConfig {
  userPoolId: string;
  userPoolWebClientId: string;
  oauthDomain: string;
  redirectSignIn: string;
  redirectSignOut: string;
  awsRegion: string;
}

// IObservers defines the object to hold all observers by name
interface IObservers {
  [name: string]: () => void;
}

// GateStore holds all state
export class GateStore {
  // observers holds everyone who is interested in state updates
  private observers: IObservers = {};

  // all data is held here
  /* readonly */ email = '';
  /* readonly */ username = '';
  /* readonly */ idToken = '';
  /* readonly */ error = '';
  /* readonly */ loading = false;
  /* readonly */ signedIn = false;
  /* readonly */ belongsToGroup = false;

  // onChange notifies all observers that the state has been changed
  private onChange = () =>
    Object.keys(this.observers).forEach(name => this.observers[name] && this.observers[name]());

  // loading: prepare for changes
  private begin = () => {
    this.error = '';
    this.loading = true;
    this.onChange();
  };

  // loading: notify observers. returns success flag
  private end = (withError = '') => {
    this.error = withError;
    this.loading = false;
    setTimeout(() => this.onChange(), NOTIFY_DELAY);
  };

  // constructor initializes Amplify and sets the groups that may give access to the user
  constructor(amplifyConfig: IAmplifyConfig, private okGroups?: string[]) {
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
  ////               ////////////////////////////////////////////////////////////////////////////////////////////////
  ////    getters    ////////////////////////////////////////////////////////////////////////////////////////////////
  ////               ////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  hasAccess = (): boolean => !this.loading && this.signedIn && this.belongsToGroup;

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////                ///////////////////////////////////////////////////////////////////////////////////////////////
  ////  main setters  ///////////////////////////////////////////////////////////////////////////////////////////////
  ////                ///////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // returns the username
  signUp = async (email: string, password: string) => {
    this.begin();
    try {
      const res = await Auth.signUp({ username: email, password });
      if (!res.userSub) {
        return this.end('Não foi possível iniciar criação de conta');
      }
      this.username = res.userSub;
    } catch (error) {
      console.log(error);
      return this.end('Algum erro aconteceu na criação da conta');
    }
    this.end();
  };

  confirmSignUp = async (code: string) => {
    this.begin();
    try {
      const res = await Auth.confirmSignUp(this.username, code);
      console.log(res);
    } catch (error) {
      console.log(error);
      return this.end(error);
    }
    this.end();
  };

  resendCode = async () => {
    this.begin();
    try {
      await Auth.resendSignUp(this.username);
    } catch (error) {
      console.log(error);
      return this.end(error);
    }
    this.end();
  };

  signIn = async (email: string, password: string) => {
    this.begin();
    try {
      const user = await Auth.signIn(email, password);
      console.log(user);
      if (user.challengeName === 'SMS_MFA' || user.challengeName === 'SOFTWARE_TOKEN_MFA') {
        console.log('Not implemented: SMS_MFA or SOFTWARE_TOKEN_MFA');
        return this.end('Not implemented: SMS_MFA or SOFTWARE_TOKEN_MFA');
      }
      if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
        console.log('Not implemented: NEW_PASSWORD_REQUIRED');
        return this.end('Not implemented: NEW_PASSWORD_REQUIRED');
      }
      if (user.challengeName === 'MFA_SETUP') {
        console.log('Not implemented: MFA_SETUP');
        return this.end('Not implemented: MFA_SETUP');
      }
    } catch (error) {
      if (error.code === 'UserNotConfirmedException') {
        return this.end('UserNotConfirmedException');
        // The error happens if the user didn't finish the confirmation step when signing up
        // In this case you need to resend the code and confirm the user
        // About how to resend the code and confirm the user, please check the signUp part
      } else if (error.code === 'PasswordResetRequiredException') {
        return this.end('PasswordResetRequiredException');
        // The error happens when the password is reset in the Cognito console
        // In this case you need to call forgotPassword to reset the password
        // Please check the Forgot Password part.
      } else if (error.code === 'NotAuthorizedException') {
        return this.end('NotAuthorizedException');
        // The error happens when the incorrect password is provided
      } else if (error.code === 'UserNotFoundException') {
        return this.end('UserNotFoundException');
        // The error happens when the supplied username/email does not exist in the Cognito user pool
      } else {
        console.log(error);
        return this.end(error);
      }
    }
    return this.end();
  };

  logout = async () => {
    this.begin();
    try {
      await Auth.signOut();
      // listener should receive event, flip the loading flag and call onChange
    } catch (error) {
      this.loading = false;
      this.error = error.message || JSON.stringify(error);
      this.onChange();
    }
  };

  // internal ////////////////////////////////////////////////////////////////////////////////////

  private listener = async (authData: any) => {
    const { payload } = authData;
    const { event } = payload;

    console.log('################################################');
    console.log('event = ', event);

    if (event !== 'configured' && event !== 'signIn' && event !== 'signOut') {
      return;
    }

    this.loading = true;
    this.error = '';
    this.onChange();

    if (event === 'configured') {
      try {
        await this.readUser();
      } catch (error) {
        // ignore error, because there may not be an authenticated user
      }
    }

    if (event === 'signIn') {
      try {
        await this.readUser();
      } catch (error) {
        this.error = error.message || JSON.stringify(error);
      }
    }

    if (event === 'signOut') {
      this.signedIn = false;
      this.idToken = '';
      this.username = '';
      this.email = '';
      this.belongsToGroup = false;
    }

    this.loading = false;
    this.onChange();
  };

  private readUser = async () => {
    // get current user
    const maybeUser = await Auth.currentAuthenticatedUser();
    if (!maybeUser) {
      throw new Error('cannot get current user');
    }

    // get attributes and set state
    const { attributes, signInUserSession } = maybeUser;
    const { idToken } = signInUserSession;
    const { payload } = idToken;
    this.signedIn = true;
    this.idToken = idToken.jwtToken;
    this.username = maybeUser.username;
    this.email = attributes.email;
    this.belongsToGroup = true;

    // set groups that this user belongs to
    if (this.okGroups) {
      this.belongsToGroup = false;
      if (payload && payload['cognito:groups']) {
        const groups = payload['cognito:groups'] as string[];
        this.belongsToGroup = this.okGroups.some(g => groups.includes(g));
      }
    }
  };
}
