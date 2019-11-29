import Amplify, { Auth, Hub } from 'aws-amplify';

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
  /* readonly */ loading = false;
  /* readonly */ lastError = '';
  /* readonly */ loggedIn = false;
  /* readonly */ idToken = '';
  /* readonly */ username = '';
  /* readonly */ sub = '';
  /* readonly */ okGroup = false;

  // onChange notifies all observers that the state has been changed
  private onChange = () => Object.keys(this.observers).forEach(name => this.observers[name]());

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

  // getters /////////////////////////////////////////////////////////////////////////////////////

  access = (): boolean => !this.loading && this.loggedIn && this.okGroup;

  getRefreshedAuthHeader = async () => {
    try {
      const session = await Auth.currentSession();
      const idToken = session.getIdToken().getJwtToken();
      return {
        headers: {
          authorization: `Bearer ${idToken}`,
        },
      };
    } catch (error) {
      console.log(error);
    }
  };

  // setters /////////////////////////////////////////////////////////////////////////////////////

  logout = async () => {
    this.loading = true;
    this.lastError = '';
    this.onChange();
    try {
      await Auth.signOut();
      // listener should receive event, flip the loading flag and call onChange
    } catch (error) {
      this.loading = false;
      this.lastError = error.message || JSON.stringify(error);
      this.onChange();
    }
  };

  // internal ////////////////////////////////////////////////////////////////////////////////////

  private listener = async (authData: any) => {
    const { payload } = authData;
    const { event } = payload;

    if (event !== 'configured' && event !== 'signIn' && event !== 'signOut') {
      return;
    }

    this.loading = true;
    this.lastError = '';
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
        this.lastError = error.message || JSON.stringify(error);
      }
    }

    if (event === 'signOut') {
      this.loggedIn = false;
      this.idToken = '';
      this.username = '';
      this.sub = '';
      this.okGroup = false;
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
    this.loggedIn = true;
    this.idToken = idToken.jwtToken;
    this.username = maybeUser.username;
    this.sub = attributes.sub;
    this.okGroup = true;

    // set groups that this user belongs to
    if (this.okGroups) {
      this.okGroup = false;
      if (payload && payload['cognito:groups']) {
        const groups = payload['cognito:groups'] as string[];
        this.okGroup = this.okGroups.some(g => groups.includes(g));
      }
    }
  };
}
