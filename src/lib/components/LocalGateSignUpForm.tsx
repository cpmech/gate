/** @jsxImportSource @emotion/react */
import { useState, ReactNode, Fragment } from 'react';
import { IconEye } from '@cpmech/iricons/IconEye';
import { IconEyeOff } from '@cpmech/iricons/IconEyeOff';
import { RcLinkOrDiv, RcButton, RcError, RcPopup, RcInput } from '../../rcomps';
import { GateVSpace } from './GateVSpace';
import { GateVSpaceLarge } from './GateVSpaceLarge';
import { gateStyles, gateColors, gateParams } from './gateStyles';
import { withUseGateObserver } from './withUseGateObserver';
import { t } from '../locale';
import { LocalGateStore, ISignUpValues, ISignUpErrors, signUpValues2errors } from '../service';

const s = gateStyles.signUpForm;

interface ILocalGateSignUpFormProps {
  gate: LocalGateStore;
  iniEmail?: string;
  iniPassword?: string;
  buttonWidth?: string;
  buttonBgColor?: string;
  ignoreErrors?: boolean;
  logo?: ReactNode;
}

export const LocalGateSignUpForm: React.FC<ILocalGateSignUpFormProps> = ({
  gate,
  iniEmail = '',
  iniPassword = '',
  buttonWidth = '220px',
  buttonBgColor = '#5d5c61',
  ignoreErrors,
  logo,
}) => {
  const useObserver = withUseGateObserver(gate);
  const { error, processing } = useObserver('@cpmech/gate/LocalGateSignUpForm');
  const [isSignIn, setIsSignIn] = useState(false);
  const [isClearStorage, setIsClearStorage] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [touchedButtons, setTouchedButtons] = useState(false);
  const [values, setValues] = useState<ISignUpValues>({
    email: iniEmail,
    password: iniPassword,
    code: '',
  });
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

    // validate
    if (!ignoreErrors) {
      if (!validate({ code: true })) {
        return;
      }
    }

    // fix password
    let pwd = values.password;
    if (ignoreErrors && values.password === '') {
      pwd = '123';
    }

    // signIn
    if (isSignIn) {
      await gate.signIn(values.email, pwd);
      return;
    }

    // signUp
    await gate.signUp(values.email, pwd);
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
      {showPassword ? <IconEye size="18px" /> : <IconEyeOff size="18px" />}
    </div>
  );

  return (
    <div css={s.root}>
      {logo && (
        <div>
          <GateVSpaceLarge />
          {logo}
        </div>
      )}

      <form css={s.container}>
        {/* ----------------------- show header ------------------------ */}
        <div css={s.centered}>
          <span css={s.header}>
            {isClearStorage ? t('clearLocalStorage') : isSignIn ? t('signIn') : t('createAccount')}
          </span>
        </div>

        {/* ----------------------- input email ------------------------ */}
        {!isClearStorage && (
          <Fragment>
            <GateVSpace />
            <RcInput
              label={'Email'}
              value={values.email}
              onChange={(e) => setValue('email', e.target.value)}
              hlColor={gateColors.blue}
              error={vErrors.email}
            />
            <RcError error={vErrors.email} />
          </Fragment>
        )}

        {/* --------------------- input password ----------------------- */}
        {!isClearStorage && (
          <Fragment>
            <GateVSpace />
            <RcInput
              label={t('password')}
              value={values.password}
              password={!showPassword}
              suffix={passwordIcon}
              onChange={(e) => setValue('password', e.target.value)}
              hlColor={gateColors.blue}
              error={vErrors.password}
            />
            <RcError error={vErrors.password} />
          </Fragment>
        )}

        {/* ----------------------- submit button ---------------------- */}
        <GateVSpaceLarge />
        <div css={s.row}>
          {/* ....... footnote: go back ....... */}
          {isClearStorage && (
            <Fragment>
              <GateVSpace />
              <div css={s.footnote}>
                <RcLinkOrDiv
                  onClick={() => {
                    clearErrors();
                    setIsClearStorage(false);
                  }}
                >
                  {t('back')}
                </RcLinkOrDiv>
              </div>
            </Fragment>
          )}

          {/* ....... footnote: signIn or signUp ....... */}
          {!isClearStorage && (
            <Fragment>
              <GateVSpace />
              <div css={s.footnote}>
                <span>{isSignIn ? t('noAccount') : t('haveAnAccount')}&nbsp;</span>
                <div css={s.link}>
                  <RcLinkOrDiv
                    onClick={() => {
                      clearErrors();
                      setIsSignIn(!isSignIn);
                    }}
                  >
                    {isSignIn ? t('signUp') : t('gotoSignIn')}
                  </RcLinkOrDiv>
                </div>
              </div>
            </Fragment>
          )}

          {/* ....... submit ....... */}
          <GateVSpace />
          <RcButton
            onClick={async () => await submit()}
            color="#ffffff"
            fontWeight="bold"
            fontSize="14px"
            width={buttonWidth}
            height={gateParams.buttonHeight}
            borderRadius={gateParams.buttonRadius}
            backgroundColor={buttonBgColor}
          >
            {isClearStorage
              ? t('clear').toUpperCase()
              : isSignIn
              ? t('enter').toUpperCase()
              : t('signUp').toUpperCase()}
          </RcButton>
        </div>

        {/* ----------------- footnote: remove account ----------------- */}
        {!isClearStorage && (
          <Fragment>
            <GateVSpaceLarge />
            <div css={s.smallFootnote}>
              <RcLinkOrDiv
                onClick={() => {
                  clearErrors();
                  setIsClearStorage(true);
                }}
              >
                {t('clearLocalStorage')}
              </RcLinkOrDiv>
            </div>
          </Fragment>
        )}
      </form>

      {processing && <RcPopup title={t('loading')} fontSizeTitle="0.8em" isLoading={true} />}
      {error && (
        <RcPopup
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
