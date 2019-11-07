import { Auth, Hub } from 'aws-amplify';
import { sleep } from '@cpmech/basic';

export interface IStateData {
  loggedIn: boolean;
  userId: string;
  email: string;
  loading: boolean;
  lastError: string;
}

export const newStateData = (): IStateData => ({
  loggedIn: false,
  userId: '',
  email: '',
  loading: false,
  lastError: '',
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

  // setters /////////////////////////////////////////////////////////////////////////////////////

  logout = async () => {
    this.state.loading = true;
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

    if (event === 'configured') {
      // console.log('. . . configured . . . ');
      this.state.loading = true;
      this.onChange();
      await sleep(500);
      try {
        const data = await Auth.currentAuthenticatedUser();
        const {
          attributes: { sub, email },
        } = data;
        await this.handleSignIn(sub, email);
      } catch (error) {
        this.state.loading = false;
        this.state.lastError = '';
        this.onChange();
      }
    }

    if (event === 'signIn') {
      // console.log('. . . sign in . . . ');
      const {
        data: {
          attributes: { sub, email },
        },
      } = payload;
      // console.log('IN: ', sub, email);
      await this.handleSignIn(sub, email);
    }

    if (event === 'signOut') {
      // console.log('. . . sign out . . . ');
      await this.handleSignOut();
    }
  };

  private handleSignIn = async (sub: string | undefined, email: string | undefined) => {
    if (!sub || !email) {
      this.state.lastError = 'cannot extract attributes from payload';
      return;
    }
    this.state.loggedIn = true;
    this.state.userId = sub;
    this.state.email = email;
    this.state.loading = false;
    this.state.lastError = '';
    this.onChange();
  };

  private handleSignOut = async () => {
    this.state.loggedIn = false;
    this.state.userId = '';
    this.state.email = '';
    this.state.loading = false;
    this.state.lastError = '';
    this.onChange();
  };
}

/////////////////////////////////////////
// make store global ////////////////////
export const gateStore = new GateStore();
/////////////////////////////////////////
/////////////////////////////////////////
