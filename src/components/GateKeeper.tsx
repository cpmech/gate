/* eslint-disable */

import React from 'react';
import { Authenticator, Greetings } from 'aws-amplify-react';
import { UsernameAttributes } from 'aws-amplify-react/lib-esm/Auth/common/types';
import { I18n } from 'aws-amplify';

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
  },
});

const signUpConfigEn = {
  hiddenDefaults: ['phone_number'],
};

const signUpConfigPt = {
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

interface IGateKeeperProps {
  lang?: string; // 'en' or 'pt'
}

export const GateKeeper: React.FC<IGateKeeperProps> = ({ lang = 'pt' }) => {
  I18n.setLanguage(lang);
  return (
    <Authenticator
      hide={[Greetings]}
      signUpConfig={lang === 'pt' ? signUpConfigPt : signUpConfigEn}
      usernameAttributes={UsernameAttributes.EMAIL}
    />
  );
};
