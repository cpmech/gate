import React, { useState } from 'react';
/** @jsx jsx */ import { jsx } from '@emotion/core';
import { IconEye, IconEyeNo } from '@cpmech/react-icons';
import { InputTypeA, Link, Button, FormErrorField, Popup } from 'rcomps';
import { GateStore, ISignUpValues } from 'service';
import { signUpValues2errors } from 'helpers';
import { GateFederatedButtons } from './GateFederatedButtons';
import { VSpace } from './VSpace';
import { styles, colors, params } from './styles';
import { t } from 'locale';
import { useObserver } from './useObserver';

const s = styles.signUpForm;

interface IGateSignUpFormProps {
  gate: GateStore;
  buttonBackgroundColor?: string;
}

export const GateSignUpForm: React.FC<IGateSignUpFormProps> = ({
  gate,
  buttonBackgroundColor = '#5d5c61',
}) => {
  const { error, needToConfirm, needNewPassword, processing, email } = useObserver(
    gate,
    '@cpmech/gate/components/GateSignUpForm',
  );
  const [isSignIn, setIsSignIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [touchedButtons, setTouchedButtons] = useState(false);
  const [values, setValues] = useState<ISignUpValues>({
    email: 'doriv4l+2@gmail.com',
    password: '1carro$violeTA',
    // email,
    // password: '',
    code: '',
  });

  const validate = (): boolean => {
    //
    return true;
    //
    const errors = signUpValues2errors(values, !needToConfirm);
    if (errors) {
      setValues({ ...values, errors }); // update state so we can flag errors
    }
    return errors === undefined; // allGood
  };

  const submit = async () => {
    setTouchedButtons(true);
    if (validate()) {
      if (needToConfirm) {
        await gate.confirmSignUp(values.email, values.password, values.code);
      } else {
        if (isSignIn) {
          await gate.signIn(values.email, values.password);
        } else {
          await gate.signUp(values.email, values.password);
          // setIsConfirmSignUp(true);
        }
      }
    }
  };

  const setValue = <K extends keyof ISignUpValues>(key: K, value: string) => {
    const newValues = { ...values, [key]: value.trim() };
    //
    setValues(newValues);
    return;
    //
    if (touchedButtons) {
      const errors = signUpValues2errors(newValues, !needToConfirm);
      setValues({ ...newValues, errors });
    } else {
      setValues(newValues);
    }
  };

  const passwordIcon = (
    <div style={{ cursor: 'pointer' }} onClick={() => setShowPassword(!showPassword)}>
      {showPassword ? <IconEye size={18} /> : <IconEyeNo size={18} />}
    </div>
  );

  return (
    <div css={s.root}>
      <GateFederatedButtons gate={gate} />

      <form css={s.container}>
        {/* ----------------------- show header ------------------------ */}
        <div css={s.centered}>
          <span css={s.header}>
            {needToConfirm
              ? t('confirmSignUp')
              : needNewPassword
              ? t('resetPassword')
              : isSignIn
              ? t('signIn')
              : t('createAccount')}
          </span>
        </div>

        <VSpace />

        {/* ----------------------- input email ------------------------ */}
        <InputTypeA
          label={needToConfirm || needNewPassword ? '' : 'Email'}
          value={values.email}
          onChange={e => setValue('email', e.target.value)}
          hlColor={colors.blue}
          error={values.errors?.email}
          readOnly={needToConfirm || needNewPassword}
          bgColor={needToConfirm || needNewPassword ? '#e1e4ea' : undefined}
        />
        <FormErrorField error={values.errors?.email} />

        <VSpace />

        {/* ----------------------- input code ------------------------- */}
        {(needToConfirm || needNewPassword) && (
          <React.Fragment>
            <InputTypeA
              label={t('confirmationCode')}
              value={values.code}
              onChange={e => setValue('code', e.target.value)}
              hlColor={colors.blue}
              error={values.errors?.code}
            />
            <FormErrorField error={values.errors?.code} />
            <VSpace />
            {needNewPassword && (
              <React.Fragment>
                <div css={s.smallFootnote}>
                  <span>{t('lostCode')}&nbsp;</span>
                  <Link onClick={() => gate.resendCode(values.email)}>{t('resendCode')}</Link>
                </div>
                <VSpace />
                <VSpace />
              </React.Fragment>
            )}
          </React.Fragment>
        )}

        {/* --------------------- input password ----------------------- */}
        {!needToConfirm && (
          <React.Fragment>
            <InputTypeA
              label={needNewPassword ? t('newPassword') : t('password')}
              value={values.password}
              password={!showPassword}
              suffix={passwordIcon}
              onChange={e => setValue('password', e.target.value)}
              hlColor={colors.blue}
              error={values.errors?.password}
            />
            <FormErrorField error={values.errors?.password} />
            <VSpace />
          </React.Fragment>
        )}

        {/* ----------------- footnote: reset password ----------------- */}
        {isSignIn && !(needToConfirm || needNewPassword) && (
          <React.Fragment>
            <div css={s.smallFootnote}>
              <span>{t('forgotPassword')}&nbsp;</span>
              <Link onClick={() => gate.forgotPassword(values.email)}>{t('resetPassword')}</Link>
            </div>
            <VSpace />
          </React.Fragment>
        )}

        {/* ----------------- footnote: resend code -------------------- */}
        {needToConfirm && (
          <React.Fragment>
            <div css={s.smallFootnote}>
              <span>{t('lostCode')}&nbsp;</span>
              <Link onClick={() => gate.resendCode(values.email)}>{t('resendCode')}</Link>
            </div>
            <VSpace />
          </React.Fragment>
        )}

        {/* ----------------- footnote: want to confirm ---------------- */}
        {!(needToConfirm || needNewPassword) && (
          <React.Fragment>
            <div css={s.smallFootnote}>
              <span>{t('wantToConfirm')}&nbsp;</span>
              <Link onClick={() => gate.notify({ needToConfirm: true })}>{t('gotoConfirm')}</Link>
            </div>
            <VSpace />
          </React.Fragment>
        )}

        <VSpace />

        {/* ----------------------- submit button ---------------------- */}
        <div css={s.row}>
          {/* ....... footnote: go back ....... */}
          {needToConfirm && (
            <div css={s.footnote}>
              <Link onClick={() => gate.notify({ needToConfirm: false })}>{t('back')}</Link>
            </div>
          )}

          {/* ....... footnote: go back ....... */}
          {needNewPassword && (
            <div css={s.footnote}>
              <Link onClick={() => gate.notify({ needNewPassword: false })}>{t('back')}</Link>
            </div>
          )}

          {/* ....... footnote: signIn or signUp ....... */}
          {!(needToConfirm || needNewPassword) && (
            <div css={s.footnote}>
              <span>{isSignIn ? t('noAccount') : t('haveAnAccount')}&nbsp;</span>
              <Link onClick={() => setIsSignIn(!isSignIn)}>
                {isSignIn ? t('signUp') : t('gotoSignIn')}
              </Link>
            </div>
          )}

          {/* ....... submit ....... */}
          <div css={s.submitButton}>
            <Button
              onClick={async () => await submit()}
              borderRadius={300}
              color="#ffffff"
              fontWeight="bold"
              fontSize={14}
              width="100%"
              height={params.buttonHeight}
              backgroundColor={buttonBackgroundColor}
            >
              {needToConfirm
                ? t('confirm').toUpperCase()
                : needNewPassword
                ? t('submit').toUpperCase()
                : isSignIn
                ? t('enter').toUpperCase()
                : t('signUp').toUpperCase()}
            </Button>
          </div>
        </div>
      </form>

      {processing && <Popup title={t('loading')} isLoading={true} />}
      {error && (
        <Popup title={t('error')} onClose={() => gate.notify()} isError={true} message={error} />
      )}
    </div>
  );
};
