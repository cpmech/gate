import { copySimple, maybeCopySimple } from '@cpmech/basic';
import {
  IGateObservers,
  IGateFlags,
  IGateUser,
  newBlankFlags,
  newBlankUser,
  IStorage,
} from './types';
import { delays } from './delays';
import { t } from '../locale';

// LocalGateStore holds all state
export class LocalGateStore {
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

  constructor(private storagePrefix: string, private storage: IStorage) {
    setTimeout(() => {
      this.configure();
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
    const exists = await this.storage.getItem(`${this.storagePrefix}#username`);
    if (exists) {
      return this.end(t('UsernameExistsException'));
    }
    await this.storage.setItem(`${this.storagePrefix}#username`, email);
    await this.storage.setItem(`${this.storagePrefix}#password`, password);
    await this.storage.setItem(`${this.storagePrefix}#signedIn`, 'TRUE');
    this.user.email = email;
    this.user.username = email;
    this.user.hasAccess = true;
    this.end();
  };

  signIn = async (email: string, password: string) => {
    if (!email || !password) {
      return;
    }
    this.begin();
    const exists = await this.storage.getItem(`${this.storagePrefix}#username`);
    if (!exists) {
      return this.end(t('UserNotFoundException'));
    }
    const secret = await this.storage.getItem(`${this.storagePrefix}#password`);
    if (secret && secret === password) {
      this.storage.setItem(`${this.storagePrefix}#signedIn`, 'TRUE');
      this.user.email = email;
      this.user.username = email;
      this.user.hasAccess = true;
    } else {
      return this.end(t('NotAuthorizedException'));
    }
    this.end();
  };

  signOut = async () => {
    this.begin();
    await this.storage.removeItem(`${this.storagePrefix}#signedIn`);
    this.clearData();
    this.end();
  };

  clearStorage = async () => {
    this.begin();
    await this.storage.removeItem(`${this.storagePrefix}#username`);
    await this.storage.removeItem(`${this.storagePrefix}#password`);
    await this.storage.removeItem(`${this.storagePrefix}#signedIn`);
    this.clearData();
    this.end();
  };

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////                ///////////////////////////////////////////////////////////////////////////////////////////////
  ////    internal    ///////////////////////////////////////////////////////////////////////////////////////////////
  ////                ///////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  private configure = async () => {
    const signedIn = await this.storage.getItem(`${this.storagePrefix}#signedIn`);
    const username = await this.storage.getItem(`${this.storagePrefix}#username`);
    if (signedIn && username) {
      this.user.email = username;
      this.user.username = username;
      this.user.hasAccess = true;
    }
    this.end();
  };
}
