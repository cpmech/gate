import { Iany } from '@cpmech/basic';

export interface ISignUpValues {
  email: string;
  password: string;
  code: string;
  errors?: Iany;
}

export interface IAmplifyConfig {
  userPoolId: string;
  userPoolWebClientId: string;
  oauthDomain: string;
  redirectSignIn: string;
  redirectSignOut: string;
  awsRegion: string;
}

// IObservers defines the object to hold all observers by name
export interface IGateObservers {
  [name: string]: () => void;
}

export interface IGateState {
  email: string;
  username: string;
  idToken: string;
  hasAccess: boolean;
}

export const newBlankState = (): IGateState => ({
  email: '',
  username: '',
  idToken: '',
  hasAccess: false,
});
