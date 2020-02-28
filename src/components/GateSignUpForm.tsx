import React, { useState } from 'react';
/** @jsx jsx */ import { jsx } from '@emotion/core';
import { IconEye, IconEyeNo } from '@cpmech/react-icons';
import { InputTypeA, Link, Button, FormErrorField, Popup } from 'rcomps';
import { GateStore } from 'service';
import { GateFederatedButtons } from './GateFederatedButtons';
import { VSpace } from './VSpace';
import { styles, colors, params } from './styles';
import { ISignUpValues, signUpValues2errors } from 'helpers';
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
  const { error, processing } = useObserver(gate, '@cpmech/gate/components/GateSignUpForm');
  const [isSignIn, setIsSignIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [touchedButtons, setTouchedButtons] = useState(false);
  const [values, setValues] = useState<ISignUpValues>({
    email: 'doriv4l+2@gmail.com',
    password: '1carro$violeTA',
  });

  const validate = (): boolean => {
    const errors = signUpValues2errors(values);
    if (errors) {
      setValues({ ...values, errors }); // update state so we can flag errors
    }
    return errors === undefined; // allGood
  };

  const submit = async () => {
    setTouchedButtons(true);
    if (validate()) {
      if (isSignIn) {
        gate.signIn(values.email, values.password);
      } else {
        gate.signUp(values.email, values.password);
      }
    }
  };

  const setValue = <K extends keyof ISignUpValues>(key: K, value: string) => {
    const newValues = { ...values, [key]: value.trim() };
    if (touchedButtons) {
      const errors = signUpValues2errors(newValues);
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

      <div css={s.container}>
        <div css={s.centered}>
          <span css={s.header}>{isSignIn ? t('signIn') : t('createAccount')}</span>
        </div>

        <VSpace />

        <InputTypeA
          label="Email"
          value={values.email}
          onChange={e => setValue('email', e.target.value)}
          hlColor={colors.blue}
          error={values.errors?.email}
        />
        <FormErrorField error={values.errors?.email} />

        <VSpace />

        <InputTypeA
          label={t('password')}
          value={values.password}
          password={!showPassword}
          suffix={passwordIcon}
          onChange={e => setValue('password', e.target.value)}
          hlColor={colors.blue}
          error={values.errors?.password}
        />
        <FormErrorField error={values.errors?.password} />

        <VSpace />

        {isSignIn && (
          <React.Fragment>
            <div css={s.smallFootnote}>
              <span>{t('forgotPassword')}</span>
              <Link css={s.link} onClick={() => console.log('resetar')}>
                {t('resetPassword')}
              </Link>
            </div>
            <VSpace />
          </React.Fragment>
        )}

        <VSpace />

        <div css={s.row}>
          <div css={s.footnote}>
            <span>{isSignIn ? t('noAccount') : t('haveAnAccount')}</span>
            <Link css={s.link} onClick={() => setIsSignIn(!isSignIn)}>
              {isSignIn ? t('signUp') : t('enter')}
            </Link>
          </div>

          <Button
            onClick={async () => await submit()}
            borderRadius={300}
            color="#ffffff"
            fontWeight="bold"
            width="250px"
            height={params.buttonHeight}
            backgroundColor={buttonBackgroundColor}
          >
            {isSignIn ? t('enter').toUpperCase() : t('signUp').toUpperCase()}
          </Button>
        </div>
      </div>

      {processing && <Popup title={t('loading')} isLoading={true} />}
      {error && (
        <Popup title={t('error')} onClose={() => gate.notify()} isError={true} message={error} />
      )}
    </div>
  );
};
