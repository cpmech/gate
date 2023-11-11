/** @jsxImportSource @emotion/react */
import { useState, ReactNode, Fragment } from 'react';
import { IconEye } from '@cpmech/iricons/IconEye';
import { IconEyeOff } from '@cpmech/iricons/IconEyeOff';
import { RcLinkOrDiv, RcButton, RcError, RcPopup, RcInput } from '../../rcomps';
import { gateStyles, gateColors, gateParams } from './gateStyles';
import { withUseGateObserver } from './withUseGateObserver';
import { t } from '../locale';
import { LocalGateStore, ISignUpValues, ISignUpErrors, signUpValues2errors } from '../service';

const s = gateStyles.signUpForm;

interface ILocalGateSignUpFormProps {
  gate: LocalGateStore;
  iniEmail?: string;
  iniPassword?: string;
  ignoreErrors?: boolean;
  logo?: ReactNode;
}

export const LocalGateSignUpForm: React.FC<ILocalGateSignUpFormProps> = ({
  gate,
  iniEmail = '',
  iniPassword = '',
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
      setVerrors({ ...vErrors, [key]: (res.errors as any)[key] });
    }
  };

  const passwordIcon = (
    <div style={{ cursor: 'pointer' }} onClick={() => setShowPassword(!showPassword)}>
      {showPassword ? <IconEye size="18px" /> : <IconEyeOff size="18px" />}
    </div>
  );

  return (
    <div css={s.root}>
      {logo && <div>{logo}</div>}

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
            <RcInput
              name="email"
              label={'Email'}
              value={values.email}
              onChange={(e) => setValue('email', e.target.value)}
              hlColor={gateColors.blue}
              error={vErrors.email}
              borderRadius={gateParams.input.radius}
            />
            <RcError error={vErrors.email} />
          </Fragment>
        )}

        {/* --------------------- input password ----------------------- */}
        {!isClearStorage && (
          <Fragment>
            <RcInput
              name="password"
              label={t('password')}
              value={values.password}
              password={!showPassword}
              suffix={passwordIcon}
              onChange={(e) => setValue('password', e.target.value)}
              onEnterKeyUp={async () => await submit()}
              hlColor={gateColors.blue}
              error={vErrors.password}
              borderRadius={gateParams.input.radius}
            />
            <RcError error={vErrors.password} />
          </Fragment>
        )}

        {/* ----------------------- submit button ---------------------- */}
        <div css={s.row}>
          {/* ....... footnote: go back ....... */}
          {isClearStorage && (
            <Fragment>
              <div css={s.footnote}>
                <RcLinkOrDiv
                  onClick={() => {
                    clearErrors();
                    setIsClearStorage(false);
                  }}
                  underline={gateParams.link.underline}
                >
                  {t('back')}
                </RcLinkOrDiv>
              </div>
            </Fragment>
          )}

          {/* ....... footnote: signIn or signUp ....... */}
          {!isClearStorage && (
            <Fragment>
              <div css={s.footnote}>
                <span>{isSignIn ? t('noAccount') : t('haveAnAccount')}&nbsp;</span>
                <RcLinkOrDiv
                  onClick={() => {
                    clearErrors();
                    setIsSignIn(!isSignIn);
                  }}
                  underline={gateParams.link.underline}
                >
                  {isSignIn ? t('signUp') : t('gotoSignIn')}
                </RcLinkOrDiv>
              </div>
            </Fragment>
          )}

          {/* ....... submit ....... */}
          <RcButton
            onClick={async () => await submit()}
            color={gateParams.button.color}
            backgroundColor={gateParams.button.bgColor}
            width={gateParams.button.widthSubmit}
            height={gateParams.button.height}
            borderRadius={gateParams.button.radius}
            fontSize={gateParams.button.fontSize}
            fontWeight={gateParams.button.fontWeight}
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
            <div css={s.smallFootnote}>
              <RcLinkOrDiv
                onClick={() => {
                  clearErrors();
                  setIsClearStorage(true);
                }}
                underline={gateParams.link.underline}
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
