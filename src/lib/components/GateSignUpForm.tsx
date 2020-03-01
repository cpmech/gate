import React, { useState } from 'react';
/** @jsx jsx */ import { jsx } from '@emotion/core';
import { IconEye, IconEyeNo } from '@cpmech/react-icons';
import { InputTypeA, Link, Button, FormErrorField, Popup } from 'rcomps';
import { GateFederatedButtons } from './GateFederatedButtons';
import { VSpace } from './VSpace';
import { VSpaceLarge } from './VSpaceLarge';
import { VSpaceSmall } from './VSpaceSmall';
import { styles, colors, params } from './styles';
import { useGateObserver } from './useGateObserver';
import { t } from '../locale';
import { GateStore, ISignUpValues } from '../service';
import { signUpValues2errors } from '../helpers';

const s = styles.signUpForm;

interface IGateSignUpFormProps {
  gate: GateStore;
  buttonBackgroundColor?: string;
}

export const GateSignUpForm: React.FC<IGateSignUpFormProps> = ({
  gate,
  buttonBackgroundColor = '#5d5c61',
}) => {
  const { error, needToConfirm, resetPasswordStep2, processing, email } = useGateObserver(
    gate,
    '@cpmech/gate/components/GateSignUpForm',
  );
  const [isSignIn, setIsSignIn] = useState(false);
  const [resetPasswordStep1, setResetPasswordStep1] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [touchedButtons, setTouchedButtons] = useState(false);
  const [values, setValues] = useState<ISignUpValues>({
    email,
    password: '',
    code: '',
  });

  const clearErrors = () => {
    setTouchedButtons(false);
    setValues({ ...values, errors: undefined });
  };

  const validate = (doIgnoreCode = false): boolean => {
    const ignoreCode = doIgnoreCode || !(needToConfirm || resetPasswordStep2);
    const errors = signUpValues2errors(values, ignoreCode);
    if (errors) {
      setValues({ ...values, errors }); // update state so we can flag errors
    }
    return errors === undefined; // allGood
  };

  const submit = async () => {
    setTouchedButtons(true);
    if (!validate()) {
      return;
    }
    if (resetPasswordStep2) {
      await gate.forgotPasswordStep2(values.email, values.password, values.code);
    }
    if (resetPasswordStep1) {
      setValues({ ...values, password: '' });
      setResetPasswordStep1(false);
      await gate.forgotPasswordStep1(values.email);
      return;
    }
    if (needToConfirm) {
      await gate.confirmSignUp(values.email, values.password, values.code);
      return;
    }
    if (isSignIn) {
      await gate.signIn(values.email, values.password);
      return;
    }
    await gate.signUp(values.email, values.password);
  };

  const setValue = <K extends keyof ISignUpValues>(key: K, value: string) => {
    const newValues = { ...values, [key]: value.trim() };
    if (touchedButtons) {
      const ignoreCode = !(needToConfirm || resetPasswordStep2);
      const errors = signUpValues2errors(newValues, ignoreCode);
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
            {needToConfirm
              ? t('confirmSignUp')
              : resetPasswordStep1 || resetPasswordStep2
              ? renderResetPasswordHeader()
              : isSignIn
              ? t('signIn')
              : t('createAccount')}
          </span>
        </div>

        {/* ----------------------- input email ------------------------ */}
        {!resetPasswordStep2 && (
          <React.Fragment>
            <VSpace />
            <InputTypeA
              label={'Email'}
              value={values.email}
              onChange={e => setValue('email', e.target.value)}
              hlColor={colors.blue}
              error={values.errors?.email}
            />
            <FormErrorField error={values.errors?.email} />
          </React.Fragment>
        )}

        {/* ----------------------- input code ------------------------- */}
        {(needToConfirm || resetPasswordStep2) && (
          <React.Fragment>
            <VSpace />
            <InputTypeA
              label={t('confirmationCode')}
              value={values.code}
              onChange={e => setValue('code', e.target.value)}
              hlColor={colors.blue}
              error={values.errors?.code}
            />
            <FormErrorField error={values.errors?.code} />
          </React.Fragment>
        )}

        {/* ----- footnote: resend code -- (resetPasswordStep2) -------- */}
        {resetPasswordStep2 && (
          <React.Fragment>
            <VSpaceSmall />
            <div css={s.smallFootnote}>
              <span>{t('lostCode')}&nbsp;</span>
              <Link onClick={async () => await gate.forgotPasswordStep1(values.email)}>
                {t('resendCode')}
              </Link>
            </div>
          </React.Fragment>
        )}

        {/* --------------------- input password ----------------------- */}
        {!(needToConfirm || resetPasswordStep1) && (
          <React.Fragment>
            <VSpace />
            <InputTypeA
              label={resetPasswordStep2 ? t('newPassword') : t('password')}
              value={values.password}
              password={!showPassword}
              suffix={passwordIcon}
              onChange={e => setValue('password', e.target.value)}
              hlColor={colors.blue}
              error={values.errors?.password}
            />
            <FormErrorField error={values.errors?.password} />
          </React.Fragment>
        )}

        {/* ----------------- footnote: reset password ----------------- */}
        {isSignIn && !(needToConfirm || resetPasswordStep1 || resetPasswordStep2) && (
          <React.Fragment>
            <VSpace />
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

        {/* ------- footnote: resend code -- (needToConfirm) ----------- */}
        {needToConfirm && (
          <React.Fragment>
            <VSpace />
            <div css={s.smallFootnote}>
              <span>{t('lostCode')}&nbsp;</span>
              <Link
                onClick={async () => {
                  validate(true);
                  await gate.resendCode(values.email);
                }}
              >
                {t('resendCode')}
              </Link>
            </div>
          </React.Fragment>
        )}

        {resetPasswordStep1 && <VSpaceLarge />}

        {/* ----------------------- submit button ---------------------- */}
        <VSpaceLarge />
        <div css={s.row}>
          {/* ....... footnote: go back ....... */}
          {needToConfirm && (
            <React.Fragment>
              <VSpace />
              <div css={s.footnote}>
                <Link
                  onClick={() => {
                    clearErrors();
                    gate.notify({ needToConfirm: false });
                  }}
                >
                  {t('back')}
                </Link>
              </div>
            </React.Fragment>
          )}

          {/* ....... footnote: go back ....... */}
          {(resetPasswordStep1 || resetPasswordStep2) && (
            <React.Fragment>
              <VSpace />
              <div css={s.footnote}>
                <Link
                  onClick={() => {
                    clearErrors();
                    setResetPasswordStep1(false);
                    gate.notify({ resetPasswordStep2: false });
                  }}
                >
                  {t('back')}
                </Link>
              </div>
            </React.Fragment>
          )}

          {/* ....... footnote: signIn or signUp ....... */}
          {!(needToConfirm || resetPasswordStep1 || resetPasswordStep2) && (
            <React.Fragment>
              <VSpace />
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
          <VSpace />
          <Button
            onClick={async () => await submit()}
            borderRadius={300}
            color="#ffffff"
            fontWeight="bold"
            fontSize={14}
            width="175px"
            height={params.buttonHeight}
            backgroundColor={buttonBackgroundColor}
          >
            {needToConfirm
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
        {!(needToConfirm || resetPasswordStep1 || resetPasswordStep2) && (
          <React.Fragment>
            <VSpaceLarge />
            <div css={s.smallFootnote}>
              <span>{t('wantToConfirm')}&nbsp;</span>
              <Link
                onClick={() => {
                  clearErrors();
                  gate.notify({ needToConfirm: true });
                }}
              >
                {t('gotoConfirm')}
              </Link>
            </div>
          </React.Fragment>
        )}
      </form>

      {processing && <Popup title={t('loading')} fontSizeTitle="1em" isLoading={true} />}
      {error && (
        <Popup
          title={t('error')}
          onClose={() => gate.notify({ error: '' })}
          isError={true}
          message={error}
        />
      )}
    </div>
  );
};
