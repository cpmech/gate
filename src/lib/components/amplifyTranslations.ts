import { I18n } from 'aws-amplify';

export const initAmplifyTranslations = () => {
  I18n.putVocabularies({
    pt: {
      // AuthPiece
      Email: 'Email',
      'Enter your email': 'Entre com seu email',
      'Enter your username': 'Nome de usuário',

      // ConfirmSignIn
      'Confirm Code': 'Confirmar código',
      'Confirm  Code': 'Confirmar código',
      'Confirm SMS Code': 'Confirmar código SMS',
      'Confirm TOPT Code': 'Confirmar código TOPT',
      'Confirm SOFTWARE_TOKEN_MFA Code': 'Confirmar código SOFTWARE_TOKEN_MFA',
      Code: 'Código',
      Confirm: 'Confirmar',
      'Back to Sign In': 'Voltar',

      // ConfirmSignUp
      'Confirm Sign Up': 'Confirmar cadastro',
      Username: 'Nome de usuário',
      'Confirmation Code': 'Código de confirmação',
      'Enter your code': 'Entre o código',
      'Lost your code? ': 'Perdeu o código? ',
      'Resend Code': 'Enviar código novamente',

      // FederatedSignIn
      or: 'ou',

      // ForgotPassword
      'New Password': 'Nova senha',
      'Reset your password': 'Redefinir a senha',
      Submit: 'Enviar',
      'Send Code': 'Enviar código',

      // Greetings
      Hello: 'Olá',

      // Loading
      'Loading...': 'Carregando...',

      // RequireNewPassword
      Change: 'Alterar',
      'Change Password': 'Alterar senha',

      // SignIn
      'Sign in to your account': 'Fazer o login',
      Password: 'Senha',
      'Enter your password': 'Entre com sua senha',
      'Forget your password? ': 'Esqueceu sua senha? ',
      'Forgot your password? ': 'Esqueceu sua senha? ',
      'Reset password': 'Resetar senha',
      'Sign In': 'Entrar',
      'No account? ': 'Novo cliente? ',
      'Create account': 'Criar conta',

      // SignOut
      'Sign Out': 'Sair',

      // SignUp
      'Create Account': 'Criar conta',
      'Have an account? ': 'Já tem conta? ',
      'Sign in': 'Entrar',

      // VerifyContact
      'Phone Number': 'Telefone',
      'Account recovery requires verified contact information':
        'A recuperação da conta requer informações verificadas',
      Verify: 'Verificar',
      Skip: 'Pular',

      // Errors
      'An account with the given email already exists.':
        'Já existe uma conta com o email fornecido.',
      'Username cannot be empty': 'O nome de usuário não pode estar vazio',
      'Password attempts exceeded': 'Tentativas de senha excedidas',
      'User does not exist': 'Usuário não existe',
      'User already exists': 'Usuário já existe',
      'Incorrect username or password': 'Usuário ou senha incorretos',
      'Invalid password format': 'Formato de senha inválido',
      'Invalid phone number format': 'Formato de número de telefone inválido',
    },
  });
};

export const signUpConfigEn = {
  hiddenDefaults: ['phone_number'],
  header: 'Create account',
  signUpFields: [
    {
      label: 'Email',
      key: 'email',
      required: true,
      placeholder: 'Enter your email',
      type: 'email',
      displayOrder: 1,
    },
    {
      label: 'Senha',
      key: 'password',
      required: true,
      placeholder: 'Enter your password',
      type: 'password',
      displayOrder: 2,
    },
  ],
};

export const signUpConfigPt = {
  hiddenDefaults: ['phone_number'],
  header: 'Criar nova conta',
  signUpFields: [
    {
      label: 'Email',
      key: 'email',
      required: true,
      placeholder: 'Entre com seu email',
      type: 'email',
      displayOrder: 1,
    },
    {
      label: 'Senha',
      key: 'password',
      required: true,
      placeholder: 'Entre com sua senha',
      type: 'password',
      displayOrder: 2,
    },
  ],
};
