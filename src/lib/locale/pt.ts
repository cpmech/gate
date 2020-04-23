export const pt = {
  // general
  createAccount: 'Criar nova conta',
  enterEmail: 'Entre com seu email',
  enterPassword: 'Entre com sua senha',
  facebook: 'Login via Facebook',
  google: 'Login via Google',
  noAccess: 'Não foi possível completar a requisição',
  signOut: 'Sair',
  success: 'Sucesso',
  more: 'Mais',

  // local testing
  clearLocalStorage: 'Limpar armazenamento local',
  clear: 'Limpar',

  // AuthPiece
  username: 'Nome de usuário',

  // ConfirmSignIn
  doConfirmCode: 'Confirmar código',
  code: 'Código',
  confirm: 'Confirmar',
  back: 'Voltar',

  // ConfirmSignUp
  confirmSignUp: 'Confirmar cadastro',
  confirmationCode: 'Código de confirmação',
  enterCode: 'Entre o código',
  lostCode: 'Perdeu o código?',
  resendCode: 'Enviar código novamente',
  wantToConfirm: 'Recebeu um email?',
  gotoConfirm: 'Entrar código',
  doneSendCode: 'Um código de confirmação foi enviado para seu email',

  // FederatedSignIn
  or: 'ou',

  // ForgotPassword
  newPassword: 'Nova senha',
  resetPassword: 'Redefinir senha',
  resetPassword1: 'Passo 1: obter código',
  resetPassword2: 'Passo 2: alterar senha',
  submit: 'Enviar',
  sendCode: 'Enviar código',
  doneResetPassword: 'A sua senha foi alterada com sucesso. Por favor proceder com o login.',

  // Greetings
  hello: 'Olá',

  // Loading
  loading: 'Carregando...',
  processing: 'Processando...',
  initializing: 'Inicializando...',

  // RequireNewPassword
  change: 'Alterar',
  changePassword: 'Alterar senha',

  // SignIn
  enter: 'Entrar',
  gotoSignIn: 'Ir para o login',
  signIn: 'Fazer o login',
  password: 'Senha',
  forgotPassword: 'Esqueceu sua senha?',
  noAccount: 'Novo usuário?',

  // SignUp
  haveAnAccount: 'Já tem conta?',
  signUp: 'Criar conta',

  // VerifyContact
  phoneNumber: 'Telefone',
  verify: 'Verificar',
  skip: 'Pular',

  // errors
  error: 'Erro',
  errorEmail: 'Por favor, entre com um email válido',
  errorPassword:
    'A senha dever ter um mínimo de: 8 caracteres, 1 maiúscula, 1 minúscula, 1 número, e 1 símbolo',
  errorPasswordSimple: 'A senha dever ter um mínimo de 8 caracteres',
  errorCode: 'O código não dever ser em branco',
  errorNoAuthUser: 'Error interno: não existe um usuário autenticado',
  errorSomethingHappened: 'Algo de errado aconteceu',
  errorConfirm: 'Não foi possível confirmar a conta com este código',
  errorAlreadyConfirmed: 'O usuário já está confirmado',
  errorResend: 'Não foi possível re-enviar código',
  errorResendLimitExceeded: 'Por favor espere um pouco para re-enviar outro código',
  errorNoGroup: 'O usuário não pertence aos grupos corretos',

  // signUp_failure
  UsernameExistsException: 'Já existe uma conta com o email fornecido',
  InvalidPasswordException: 'O formato da senha é inválido',
  InvalidParameterException: 'Algum parâmetro é inválido',
  UnknownSignUpException: 'Algum erro aconteceu na criação da conta',

  // signIn_failure
  UserNotConfirmedException: 'O email não foi confirmado ainda',
  PasswordResetRequiredException: 'A senha deve ser redefinida',
  NotAuthorizedException: 'A senha está possivelmente errada',
  UserNotFoundException: 'O usuário não existe',
  UnknownSignInException: 'Algum erro aconteceu ao tentar entrar com essas credenciais',

  // forgotPassword_failure
  CodeMismatchException: 'Código de verificação inválido, tente novamente',
  LimitExceededException: 'Por favor espere um pouco para redefinir a senha',
  UnknownForgotPasswordException: 'Algum erro aconteceu ao tentar redefiniar a senha',
};
