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

export interface IGateFlags {
  error: string; // some error happened
  needToConfirm: boolean; // need to confirm account with code
  needNewPassword: boolean; // happens when forgotPassword is selected
  codeFlow: boolean; // oAuth is processing
  ready: boolean; // amplify has been configured or some error has been caught
  processing: boolean; // something is happening
}

// export interface IGateMaybeFlags {
//   error?: string;
//   needToConfirm?: boolean;
//   needNewPassword?: boolean;
//   processing?: boolean;
// }

export interface IGateUser {
  email: string;
  username: string;
  idToken: string;
  hasAccess: boolean; // signedIn and belongs to the required groups
}

export const newBlankFlags = (): IGateFlags => ({
  error: '',
  needToConfirm: false,
  needNewPassword: false,
  codeFlow: false,
  ready: false,
  processing: false,
});

export const newBlankUser = (): IGateUser => ({
  email: '',
  username: '',
  idToken: '',
  hasAccess: false,
});
