import React, { useState } from 'react';
/** @jsx jsx */ import { jsx } from '@emotion/core';
import { IconEye, IconEyeNo } from '@cpmech/react-icons';
import { InputTypeA, Link, Button, FormErrorField, Popup } from 'rcomps';
import { GateFederatedButtons } from './GateFederatedButtons';
import { GateVSpace } from './GateVSpace';
import { GateVSpaceLarge } from './GateVSpaceLarge';
import { GateVSpaceSmall } from './GateVSpaceSmall';
import { styles, colors, params } from './gateStyles';
import { useGateObserver } from './useGateObserver';
import { t } from '../locale';
import { GateStore, ISignUpValues, ISignUpErrors } from '../service';
import { signUpValues2errors } from '../helpers';

const s = styles.signUpForm;

interface IGateSignUpFormProps {
  gate: GateStore;
  buttonBgColor?: string;
  colorTitleLoading?: string;
  colorSpinner?: string;
  hlColor?: string;
}

export const GateSignUpForm: React.FC<IGateSignUpFormProps> = ({
  gate,
  buttonBgColor = '#5d5c61',
  colorTitleLoading = '#236cd2',
  colorSpinner = '#236cd2',
  hlColor = colors.blue,
}) => {
  const { error, needToConfirm, resetPasswordStep2, processing, email } = useGateObserver(
    gate,
    '@cpmech/gate/GateSignUpForm',
  );

  const [isSignIn, setIsSignIn] = useState(false);
  const [wantToConfirm, setWantToConfirm] = useState(false);
  const [resetPasswordStep1, setResetPasswordStep1] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [touchedButtons, setTouchedButtons] = useState(false);
  const [values, setValues] = useState<ISignUpValues>({ email, password: '', code: '' });
  const [vErrors, setVerrors] = useState<ISignUpErrors>({ email: '', password: '', code: '' });

  const isConfirm = wantToConfirm || needToConfirm;
  const isResetPassword = resetPasswordStep1 || resetPasswordStep2;
  const atNextPage = isConfirm || isResetPassword;

  const clearErrors = () => {
    setTouchedButtons(false);
    setVerrors({ email: '', password: '', code: '' });
  };

  const validate = (ignore?: { [key in keyof Partial<ISignUpErrors>]: boolean }): boolean => {
    const res = signUpValues2errors(values, ignore);
    setVerrors(res.errors);
    return !res.hasError;
  };

  const submit = async () => {
    setTouchedButtons(true);

    // resetPasswordStep2
    if (resetPasswordStep2) {
      if (!validate()) {
        return;
      }
      await gate.forgotPasswordStep2(values.email, values.password, values.code);
      return;
    }

    // resetPasswordStep1
    if (resetPasswordStep1) {
      if (!validate({ password: true, code: true })) {
        return;
      }
      setValues({ ...values, password: '' });
      setResetPasswordStep1(false);
      await gate.forgotPasswordStep1(values.email);
      return;
    }

    // wantToConfirm
    if (wantToConfirm) {
      if (!validate({ password: true })) {
        return;
      }
      await gate.confirmSignUpOnly(values.email, values.code);
      setValues({ email: '', password: '', code: '' });
      clearErrors();
      setWantToConfirm(false);
      setIsSignIn(true);
      return;
    }

    // needToConfirm
    if (needToConfirm) {
      if (!validate()) {
        return;
      }
      await gate.confirmSignUpAndSignIn(values.email, values.password, values.code);
      return;
    }

    // signIn
    if (isSignIn) {
      if (!validate({ code: true })) {
        return;
      }
      await gate.signIn(values.email, values.password);
      return;
    }

    // signUp
    if (!validate({ code: true })) {
      return;
    }
    await gate.signUp(values.email, values.password);
  };

  const resendCodeInResetPwdView = async () => await gate.forgotPasswordStep1(values.email);

  const resendCodeInConfirmView = async () => {
    setTouchedButtons(true);
    if (validate({ password: true, code: true })) {
      await gate.resendCode(values.email);
    }
  };

  const setValue = <K extends keyof ISignUpValues>(key: K, value: string) => {
    const newValues = { ...values, [key]: value.trim() };
    setValues(newValues);
    if (touchedButtons) {
      const res = signUpValues2errors(newValues);
      setVerrors({ ...vErrors, [key]: (res as any)[key] });
    }
  };

  const passwordIcon = (
    <div style={{ cursor: 'pointer' }} onClick={() => setShowPassword(!showPassword)}>
      {showPassword ? <IconEye size={18} /> : <IconEyeNo size={18} />}
    </div>
  );

  const renderResetPasswordHeader = () => (
    <div css={s.centered}>
      <div>{t('resetPassword')}</div>
      <div css={s.subheader}>{resetPasswordStep1 ? t('resetPassword1') : t('resetPassword2')}</div>
    </div>
  );

  return (
    <div css={s.root}>
      <GateFederatedButtons gate={gate} />

      <form css={s.container}>
        {/* ----------------------- show header ------------------------ */}
        <div css={s.centered}>
          <span css={s.header}>
            {isConfirm
              ? t('confirmSignUp')
              : isResetPassword
              ? renderResetPasswordHeader()
              : isSignIn
              ? t('signIn')
              : t('createAccount')}
          </span>
        </div>

        {/* ----------------------- input email ------------------------ */}
        {!resetPasswordStep2 && (
          <React.Fragment>
            <GateVSpace />
            <InputTypeA
              label={'Email'}
              value={values.email}
              onChange={e => setValue('email', e.target.value)}
              hlColor={hlColor}
              error={!!vErrors.email}
            />
            <FormErrorField error={vErrors.email} />
          </React.Fragment>
        )}

        {/* ----------------------- input code ------------------------- */}
        {(isConfirm || resetPasswordStep2) && (
          <React.Fragment>
            <GateVSpace />
            <InputTypeA
              label={t('confirmationCode')}
              value={values.code}
              onChange={e => setValue('code', e.target.value)}
              hlColor={hlColor}
              error={!!vErrors.code}
            />
            <FormErrorField error={vErrors.code} />
          </React.Fragment>
        )}

        {/* ----- footnote: resend code -- (resetPasswordStep2) -------- */}
        {resetPasswordStep2 && (
          <React.Fragment>
            <GateVSpaceSmall />
            <div css={s.smallFootnote}>
              <span>{t('lostCode')}&nbsp;</span>
              <Link onClick={async () => await resendCodeInResetPwdView()}>{t('resendCode')}</Link>
            </div>
          </React.Fragment>
        )}

        {/* --------------------- input password ----------------------- */}
        {!(isConfirm || resetPasswordStep1) && (
          <React.Fragment>
            <GateVSpace />
            <InputTypeA
              label={resetPasswordStep2 ? t('newPassword') : t('password')}
              value={values.password}
              password={!showPassword}
              suffix={passwordIcon}
              onChange={e => setValue('password', e.target.value)}
              hlColor={hlColor}
              error={!!vErrors.password}
            />
            <FormErrorField error={vErrors.password} />
          </React.Fragment>
        )}

        {/* ----------------- footnote: reset password ----------------- */}
        {isSignIn && !atNextPage && (
          <React.Fragment>
            <GateVSpace />
            <div css={s.smallFootnote}>
              <span>{t('forgotPassword')}&nbsp;</span>
              <Link
                onClick={() => {
                  clearErrors();
                  setResetPasswordStep1(true);
                }}
              >
                {t('resetPassword')}
              </Link>
            </div>
          </React.Fragment>
        )}

        {/* ----------------- footnote: resend code -------------------- */}
        {isConfirm && (
          <React.Fragment>
            <GateVSpace />
            <div css={s.smallFootnote}>
              <span>{t('lostCode')}&nbsp;</span>
              <Link onClick={async () => await resendCodeInConfirmView()}>{t('resendCode')}</Link>
            </div>
          </React.Fragment>
        )}

        {resetPasswordStep1 && <GateVSpaceLarge />}

        {/* ----------------------- submit button ---------------------- */}
        <GateVSpaceLarge />
        <div css={s.row}>
          {/* ....... footnote: go back ....... */}
          {atNextPage && (
            <React.Fragment>
              <GateVSpace />
              <div css={s.footnote}>
                <Link
                  onClick={() => {
                    clearErrors();
                    wantToConfirm && setWantToConfirm(false);
                    needToConfirm && gate.notify({ needToConfirm: false });
                    resetPasswordStep1 && setResetPasswordStep1(false);
                    resetPasswordStep2 && gate.notify({ resetPasswordStep2: false });
                  }}
                >
                  {t('back')}
                </Link>
              </div>
            </React.Fragment>
          )}

          {/* ....... footnote: signIn or signUp ....... */}
          {!atNextPage && (
            <React.Fragment>
              <GateVSpace />
              <div css={s.footnote}>
                <span>{isSignIn ? t('noAccount') : t('haveAnAccount')}&nbsp;</span>
                <Link
                  onClick={() => {
                    clearErrors();
                    setIsSignIn(!isSignIn);
                  }}
                >
                  {isSignIn ? t('signUp') : t('gotoSignIn')}
                </Link>
              </div>
            </React.Fragment>
          )}

          {/* ....... submit ....... */}
          <GateVSpace />
          <Button
            onClick={async () => await submit()}
            borderRadius={300}
            color="#ffffff"
            fontWeight="bold"
            fontSize={14}
            width="175px"
            height={params.buttonHeight}
            backgroundColor={buttonBgColor}
          >
            {isConfirm
              ? t('confirm').toUpperCase()
              : resetPasswordStep1
              ? t('sendCode').toUpperCase()
              : resetPasswordStep2
              ? t('submit').toUpperCase()
              : isSignIn
              ? t('enter').toUpperCase()
              : t('signUp').toUpperCase()}
          </Button>
        </div>

        {/* ----------------- footnote: want to confirm ---------------- */}
        {!atNextPage && (
          <React.Fragment>
            <GateVSpaceLarge />
            <div css={s.smallFootnote}>
              <span>{t('wantToConfirm')}&nbsp;</span>
              <Link
                onClick={() => {
                  clearErrors();
                  setWantToConfirm(true);
                }}
              >
                {t('gotoConfirm')}
              </Link>
            </div>
          </React.Fragment>
        )}
      </form>

      {processing && (
        <Popup
          title={t('loading')}
          fontSizeTitle="0.8em"
          isLoading={true}
          colorTitleLoading={colorTitleLoading}
          colorSpinner={colorSpinner}
        />
      )}

      {error && (
        <Popup
          title={t('error')}
          onClose={() => gate.notify({ error: '' })}
          isError={true}
          message={error}
          fontSizeTitle="0.8em"
        />
      )}
    </div>
  );
};
