export interface ISignUpValues {
  email: string;
  password: string;
  code: string;
}

export type ISignUpErrors = ISignUpValues;

export interface IAmplifyConfig {
  userPoolId: string;
  userPoolWebClientId: string;
  oauthDomain: string;
  redirectSignIn: string;
  redirectSignOut: string;
  urlOpener?: (url: string, redirectUrl: string) => Promise<any>;
  awsRegion: string;
}

// IObservers defines the object to hold all observers by name
export interface IGateObservers {
  [name: string]: () => void;
}

export interface IGateFlags {
  error: string; // some error happened
  needToConfirm: boolean; // need to confirm account with code
  resetPasswordStep2: boolean; // happens when forgotPassword is selected
  codeFlow: boolean; // oAuth is processing
  ready: boolean; // amplify has been configured or some error has been caught
  processing: boolean; // something is happening
  doneSendCode: boolean; // signUp process initiated with sending a code
  doneResetPassword: boolean; // end of forgotPasswordStep2
  waitFacebook: boolean; // waiting for Facebook login
  waitGoogle: boolean; // waiting for Google login
  waitApple: boolean; // waiting for Google login
}

export interface IGateUser {
  email: string;
  username: string;
  idToken: string;
  hasAccess: boolean; // signedIn and belongs to the required groups
}

export interface IDelays {
  constructor: number; // in the constructor, when calling Amplify.configure => wait until all subscribers are ready so no one will miss the configure notification
  onChange: number; // to allow calling begin/end one after another immediately and force re-rendering
  resendCode: number; // to let the user find the email and/or to prevent sending many codes
  fedKeepLoading: number; // keep loading until federation login starts
}

export interface IStorage {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}

export const newBlankFlags = (): IGateFlags => ({
  error: '',
  needToConfirm: false,
  resetPasswordStep2: false,
  codeFlow: false,
  ready: false,
  processing: false,
  doneSendCode: false,
  doneResetPassword: false,
  waitFacebook: false,
  waitGoogle: false,
  waitApple: false,
});

export const newBlankUser = (): IGateUser => ({
  email: '',
  username: '',
  idToken: '',
  hasAccess: false,
});
