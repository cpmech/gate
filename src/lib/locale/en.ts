export const en = {
  // general
  createAccount: 'Create account',
  enterEmail: 'Enter your email',
  enterPassword: 'Enter your password',
  facebook: 'Continue with Facebook',
  google: 'Continue with Google',
  apple: 'Continue with Apple',
  noAccess: 'Cannot complete request',
  signOut: 'Sign Out',
  success: 'Success',
  more: 'More',

  // local testing
  clearLocalStorage: 'Clear local storage',
  clear: 'Clear',

  // AuthPiece
  username: 'Username',

  // ConfirmSignIn
  doConfirmCode: 'Confirmar código',
  code: 'Código',
  confirm: 'Confirmar',
  back: 'Voltar',

  // ConfirmSignUp
  confirmSignUp: 'Confirm Sign Up',
  confirmationCode: 'Confirmation Code',
  enterCode: 'Enter your code',
  lostCode: 'Lost your code?',
  resendCode: 'Resend Code',
  wantToConfirm: 'Got an email?',
  gotoConfirm: 'Enter code',
  doneSendCode: 'A confirmation code has been sent to your email',

  // FederatedSignIn
  or: 'or',

  // ForgotPassword
  newPassword: 'New Password',
  resetPassword: 'Reset your password',
  resetPassword1: 'Step 1: get code',
  resetPassword2: 'Step 2: change password',
  submit: 'Submit',
  sendCode: 'Send Code',
  doneResetPassword: 'Your password has been successfully changed. Please proceed with the login.',

  // Greetings
  hello: 'Hello',

  // Loading
  loading: 'Loading...',
  processing: 'Processing...',
  initializing: 'Initializing...',

  // RequireNewPassword
  change: 'Change',
  changePassword: 'Change Password',

  // SignIn
  enter: 'Sign in',
  gotoSignIn: 'Go to sign in',
  signIn: 'Sign in to your account',
  password: 'Password',
  forgotPassword: 'Forgot your password?',
  noAccount: 'New user?',

  // SignUp
  haveAnAccount: 'Have an account? ',
  signUp: 'Create account',

  // VerifyContact
  phoneNumber: 'Phone Number',
  verify: 'Verify',
  skip: 'Skip',

  // errors
  error: 'Error',
  errorEmail: 'Please, enter a valid email',
  errorPassword:
    'The password must have a minimum of: 8 characters, 1 smallcase, 1 uppercase, 1 number, and 1 symbol',
  errorPasswordSimple: 'The password must have a minimum of 8 characters',
  errorCode: 'The code must not be blank',
  errorNoAuthUser: 'Internal error: there is no authenticated user',
  errorSomethingHappened: 'Something went wrong',
  errorConfirm: 'The account could not be verified with this code',
  errorAlreadyConfirmed: 'The user is already confirmed',
  errorResend: 'Could not resend code',
  errorResendLimitExceeded: 'Please wait a while to resend another code',
  errorNoGroup: 'The user does not belong to the correct groups',

  // signUp_failure
  UsernameExistsException: 'An account already exists with the email provided',
  InvalidPasswordException: 'The password format is invalid',
  InvalidParameterException: 'Some parameter is invalid',
  UnknownSignUpException: 'There was an error creating the account',

  // signIn_failure
  UserNotConfirmedException: 'The email has not been confirmed yet',
  PasswordResetRequiredException: 'Password must be reset',
  NotAuthorizedException: 'The password is possibly wrong',
  UserNotFoundException: 'The user does not exist',
  UnknownSignInException: 'An error occurred while trying to enter these credentials',

  // forgotPassword_failure
  CodeMismatchException: 'Invalid verification code provided, please try again',
  LimitExceededException: 'Please wait a while to reset the password',
  UnknownForgotPasswordException: 'An error occurred while trying to reset the password',
};
