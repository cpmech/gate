import React, { useState } from 'react';
/** @jsx jsx */ import { jsx } from '@emotion/core';
import { IconEye, IconEyeNo } from '@cpmech/react-icons';
import { InputTypeA, Link, Button, FormErrorField, Popup } from 'rcomps';
import { VSpace } from './VSpace';
import { VSpaceLarge } from './VSpaceLarge';
import { styles, colors, params } from './styles';
import { useGateObserver } from './useGateObserver';
import { t } from '../locale';
import { LocalGateStore, ISignUpValues, ISignUpErrors } from '../service';
import { signUpValues2errors } from '../helpers';

const s = styles.signUpForm;

interface ILocalGateSignUpFormProps {
  gate: LocalGateStore;
  buttonBgColor?: string;
}

export const LocalGateSignUpForm: React.FC<ILocalGateSignUpFormProps> = ({
  gate,
  buttonBgColor = '#5d5c61',
}) => {
  const { error, processing, email } = useGateObserver(gate, '@cpmech/gate/LocalGateSignUpForm');
  const [isSignIn, setIsSignIn] = useState(false);
  const [isClearStorage, setIsClearStorage] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [touchedButtons, setTouchedButtons] = useState(false);
  const [values, setValues] = useState<ISignUpValues>({ email, password: '', code: '' });
  const [vErrors, setVerrors] = useState<ISignUpErrors>({ email: '', password: '', code: '' });

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

    // remove account
    if (isClearStorage) {
      await gate.clearStorage();
      setValues({ email: '', password: '', code: '' });
      clearErrors();
      setIsClearStorage(false);
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

  return (
    <div css={s.root}>
      <form css={s.container}>
        {/* ----------------------- show header ------------------------ */}
        <div css={s.centered}>
          <span css={s.header}>
            {isClearStorage ? t('clearLocalStorage') : isSignIn ? t('signIn') : t('createAccount')}
          </span>
        </div>

        {/* ----------------------- input email ------------------------ */}
        {!isClearStorage && (
          <React.Fragment>
            <VSpace />
            <InputTypeA
              label={'Email'}
              value={values.email}
              onChange={e => setValue('email', e.target.value)}
              hlColor={colors.blue}
              error={!!vErrors.email}
            />
            <FormErrorField error={vErrors.email} />
          </React.Fragment>
        )}

        {/* --------------------- input password ----------------------- */}
        {!isClearStorage && (
          <React.Fragment>
            <VSpace />
            <InputTypeA
              label={t('password')}
              value={values.password}
              password={!showPassword}
              suffix={passwordIcon}
              onChange={e => setValue('password', e.target.value)}
              hlColor={colors.blue}
              error={!!vErrors.password}
            />
            <FormErrorField error={vErrors.password} />
          </React.Fragment>
        )}

        {/* ----------------------- submit button ---------------------- */}
        <VSpaceLarge />
        <div css={s.row}>
          {/* ....... footnote: go back ....... */}
          {isClearStorage && (
            <React.Fragment>
              <VSpace />
              <div css={s.footnote}>
                <Link
                  onClick={() => {
                    clearErrors();
                    setIsClearStorage(false);
                  }}
                >
                  {t('back')}
                </Link>
              </div>
            </React.Fragment>
          )}

          {/* ....... footnote: signIn or signUp ....... */}
          {!isClearStorage && (
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
            backgroundColor={buttonBgColor}
          >
            {isClearStorage
              ? t('clear').toUpperCase()
              : isSignIn
              ? t('enter').toUpperCase()
              : t('signUp').toUpperCase()}
          </Button>
        </div>

        {/* ----------------- footnote: remove account ----------------- */}
        {!isClearStorage && (
          <React.Fragment>
            <VSpaceLarge />
            <div css={s.smallFootnote}>
              <Link
                onClick={() => {
                  clearErrors();
                  setIsClearStorage(true);
                }}
              >
                {t('clearLocalStorage')}
              </Link>
            </div>
          </React.Fragment>
        )}
      </form>

      {processing && <Popup title={t('loading')} fontSizeTitle="0.8em" isLoading={true} />}
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
