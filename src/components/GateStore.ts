import { Auth, Hub } from 'aws-amplify';
import { CognitoUser } from 'amazon-cognito-identity-js';
// import { sleep } from '@cpmech/basic';

export interface IStateData {
  loggedIn: boolean;
  loading: boolean;
  lastError: string;
  user: CognitoUser | null;
}

export const newStateData = (): IStateData => ({
  loggedIn: false,
  loading: false,
  lastError: '',
  user: null,
});

// IObservers defines the object to hold all observers by name
interface IObservers {
  [name: string]: () => void;
}

// GateStore holds all state
export class GateStore {
  // observers holds everyone who is interested in state updates
  private observers: IObservers = {};

  // all data is held here
  // NOTE: (1) do not change anything here, use setters instead!
  //       (2) you may read from state though
  readonly state: IStateData = newStateData();

  // onChange notifies all observers that the state has been changed
  private onChange = () => Object.keys(this.observers).forEach(name => this.observers[name]());

  constructor() {
    Hub.listen('auth', this.listener);
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

  getEmail = () => {
    if (this.state.user) {
      console.log(this.state.user);
    }
    return '';
  };

  access = () => !this.state.loading && this.state.loggedIn;

  // setters /////////////////////////////////////////////////////////////////////////////////////

  logout = async () => {
    this.state.loading = true;
    this.state.lastError = '';
    this.onChange();
    try {
      await Auth.signOut();
      // listener should receive event
      // and flip the loading flag
      // and call onChange
    } catch (error) {
      this.state.loading = false;
      this.state.lastError = error.message || JSON.stringify(error);
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

    console.log(`. . . ${event} . . . `);
    this.state.loading = true;
    this.state.lastError = '';
    this.onChange();
    // await sleep(4000);

    if (event === 'configured') {
      try {
        await this.readUser();
        console.log('success');
        console.log(this.state);
      } catch (error) {
        /* do nothing */
        console.log(error);
      }
    }

    if (event === 'signIn') {
      try {
        await this.readUser();
      } catch (error) {
        console.log('error =', error);
        this.state.lastError = error.message || JSON.stringify(error);
      }
    }

    if (event === 'signOut') {
      this.state.loggedIn = false;
      this.state.user = null;
    }

    this.state.loading = false;
    this.onChange();
  };

  private readUser = async () => {
    const maybeUser = await Auth.currentAuthenticatedUser();
    if (!maybeUser) {
      throw new Error('cannot get current user');
    }
    this.state.loggedIn = true;
    this.state.user = maybeUser;
  };
}

/////////////////////////////////////////
// make store global ////////////////////
export const gate = new GateStore();
/////////////////////////////////////////
/////////////////////////////////////////
