/** @jsxImportSource @emotion/react */
import { useState, ReactNode, Fragment } from 'react';
import { IconEye } from '@cpmech/iricons/IconEye';
import { IconEyeOff } from '@cpmech/iricons/IconEyeOff';
import { IconChevronDown } from '@cpmech/iricons/IconChevronDown';
import { IconChevronUp } from '@cpmech/iricons/IconChevronUp';
import { RcLinkOrDiv, RcButton, RcError, RcPopup, RcInput } from '../../rcomps';
import { GateFederatedButtons } from './GateFederatedButtons';
import { GateVSpace } from './GateVSpace';
import { GateVSpaceLarge } from './GateVSpaceLarge';
import { GateVSpaceSmall } from './GateVSpaceSmall';
import { styles, colors, params } from './gateStyles';
import { withUseGateObserver } from './withUseGateObserver';
import { t } from '../locale';
import { GateStore, ISignUpValues, ISignUpErrors, signUpValues2errors } from '../service';
import { GateOrLine } from './GateOrLine';

const s = styles.signUpForm;

interface IGateSignUpFormProps {
  gate: GateStore;
  iniEmail?: string;
  iniPassword?: string;
  buttonWidth?: string;
  buttonBgColor?: string;
  colorTitleLoading?: string;
  colorSpinner?: string;
  hlColor?: string;
  logo?: ReactNode;
  mayHideEmailLogin?: boolean;
  initShownEmailLogin?: boolean;
  simplePassword?: boolean;
  showSignUpFirst?: boolean;
}

export const GateSignUpForm: React.FC<IGateSignUpFormProps> = ({
  gate,
  iniEmail = '',
  iniPassword = '',
  buttonWidth = '220px',
  buttonBgColor = '#5d5c61',
  colorTitleLoading = '#236cd2',
  colorSpinner = '#236cd2',
  hlColor = colors.blue,
  logo,
  mayHideEmailLogin,
  initShownEmailLogin,
  simplePassword,
  showSignUpFirst = false,
}) => {
  const useObserver = withUseGateObserver(gate);
  const {
    error,
    needToConfirm,
    resetPasswordStep2,
    processing,
    doneSendCode,
    doneResetPassword,
  } = useObserver('@cpmech/gate/GateSignUpForm');

  const [showEmailLogin, setShowEmailLogin] = useState(initShownEmailLogin);
  const [isSignIn, setIsSignIn] = useState(!showSignUpFirst);
  const [wantToConfirm, setWantToConfirm] = useState(false);
  const [resetPasswordStep1, setResetPasswordStep1] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [touchedButtons, setTouchedButtons] = useState(false);
  const [values, setValues] = useState<ISignUpValues>({
    email: iniEmail,
    password: iniPassword,
    code: '',
  });
  const [vErrors, setVerrors] = useState<ISignUpErrors>({ email: '', password: '', code: '' });

  const isConfirm = wantToConfirm || needToConfirm;
  const isResetPassword = resetPasswordStep1 || resetPasswordStep2;
  const atNextPage = isConfirm || isResetPassword;

  const clearErrors = () => {
    setTouchedButtons(false);
    setVerrors({ email: '', password: '', code: '' });
  };

  const validate = (ignore?: { [key in keyof Partial<ISignUpErrors>]: boolean }): boolean => {
    const res = signUpValues2errors(values, ignore, simplePassword);
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

  const renderPasswordIcon = () => (
    <div style={{ cursor: 'pointer' }} onClick={() => setShowPassword(!showPassword)}>
      {showPassword ? <IconEye size="18px" /> : <IconEyeOff size="18px" />}
    </div>
  );

  const renderShowHide = () => (
    <div css={styles.showHide.root} onClick={() => setShowEmailLogin(!showEmailLogin)}>
      <div css={styles.showHide.text}>{t('more').toUpperCase()}</div>
      <div css={styles.showHide.icon}>
        {showEmailLogin ? <IconChevronUp size="18px" /> : <IconChevronDown size="18px" />}
      </div>
    </div>
  );

  const renderEmailLogin = () => (
    <div css={s.container}>
      {/* ----------------- header -- reset password ---------------- */}
      {isResetPassword && (
        <div css={s.centered}>
          <div css={s.header}>{t('resetPassword')}</div>
          <div css={s.subheader}>
            {resetPasswordStep1 ? t('resetPassword1') : t('resetPassword2')}
          </div>
        </div>
      )}

      {/* --------------------- header -- normal -------------------- */}
      {!isResetPassword && (
        <div css={s.centered}>
          <span css={s.header}>
            {isConfirm ? t('confirmSignUp') : isSignIn ? t('signIn') : t('createAccount')}
          </span>
        </div>
      )}

      {/* ----------------------- input email ------------------------ */}
      {!resetPasswordStep2 && (
        <Fragment>
          <GateVSpaceSmall />
          <RcInput
            label="Email"
            value={values.email}
            onChange={(e) => setValue('email', e.target.value)}
            hlColor={hlColor}
            error={vErrors.email}
          />
          <RcError error={vErrors.email} />
        </Fragment>
      )}

      {/* ----------------------- input code ------------------------- */}
      {(isConfirm || resetPasswordStep2) && (
        <Fragment>
          <GateVSpace />
          <RcInput
            label={t('confirmationCode')}
            value={values.code}
            onChange={(e) => setValue('code', e.target.value)}
            hlColor={hlColor}
            error={vErrors.code}
          />
          <RcError error={vErrors.code} />
        </Fragment>
      )}

      {/* ----- footnote: resend code -- (resetPasswordStep2) -------- */}
      {resetPasswordStep2 && (
        <Fragment>
          <GateVSpaceSmall />
          <div css={s.smallFootnote}>
            <span>{t('lostCode')}&nbsp;</span>
            <RcLinkOrDiv onClick={async () => await resendCodeInResetPwdView()}>
              {t('resendCode')}
            </RcLinkOrDiv>
          </div>
        </Fragment>
      )}

      {/* --------------------- input password ----------------------- */}
      {!(isConfirm || resetPasswordStep1) && (
        <Fragment>
          <GateVSpaceSmall />
          <RcInput
            label={resetPasswordStep2 ? t('newPassword') : t('password')}
            value={values.password}
            password={!showPassword}
            suffix={renderPasswordIcon()}
            onChange={(e) => setValue('password', e.target.value)}
            hlColor={hlColor}
            error={vErrors.password}
          />
          <RcError error={vErrors.password} />
        </Fragment>
      )}

      {/* ----------------- footnote: reset password ----------------- */}
      {isSignIn && !atNextPage && (
        <Fragment>
          <GateVSpaceSmall />
          <div css={s.smallFootnote}>
            <span>{t('forgotPassword')}&nbsp;</span>
            <RcLinkOrDiv
              onClick={() => {
                clearErrors();
                setResetPasswordStep1(true);
              }}
            >
              {t('resetPassword')}
            </RcLinkOrDiv>
          </div>
        </Fragment>
      )}

      {/* ----------------- footnote: resend code -------------------- */}
      {isConfirm && (
        <Fragment>
          <GateVSpace />
          <div css={s.smallFootnote}>
            <span>{t('lostCode')}&nbsp;</span>
            <RcLinkOrDiv onClick={async () => await resendCodeInConfirmView()}>
              {t('resendCode')}
            </RcLinkOrDiv>
          </div>
        </Fragment>
      )}

      {resetPasswordStep1 && <GateVSpaceLarge />}

      {/* ----------------------- submit button ---------------------- */}
      <GateVSpaceLarge />
      <div css={s.row}>
        {/* ....... footnote: go back ....... */}
        {atNextPage && (
          <Fragment>
            <GateVSpace />
            <div css={s.footnote}>
              <RcLinkOrDiv
                onClick={() => {
                  clearErrors();
                  wantToConfirm && setWantToConfirm(false);
                  needToConfirm && gate.notify({ needToConfirm: false });
                  resetPasswordStep1 && setResetPasswordStep1(false);
                  resetPasswordStep2 && gate.notify({ resetPasswordStep2: false });
                }}
              >
                {t('back')}
              </RcLinkOrDiv>
            </div>
          </Fragment>
        )}

        {/* ....... footnote: signIn or signUp ....... */}
        {!atNextPage && (
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
          height={params.buttonHeight}
          borderRadius={params.buttonRadius}
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
        </RcButton>
      </div>

      {/* ----------------- footnote: want to confirm ---------------- */}
      {!atNextPage && (
        <Fragment>
          <GateVSpace />
          <div css={s.smallFootnote}>
            <span>{t('wantToConfirm')}&nbsp;</span>
            <RcLinkOrDiv
              onClick={() => {
                clearErrors();
                setWantToConfirm(true);
              }}
            >
              {t('gotoConfirm')}
            </RcLinkOrDiv>
          </div>
        </Fragment>
      )}
    </div>
  );

  return (
    <div css={s.root}>
      <GateFederatedButtons gate={gate} logo={logo} />

      {mayHideEmailLogin ? (
        <Fragment>
          {renderShowHide()}
          {showEmailLogin && (
            <Fragment>
              <GateOrLine />
              {renderEmailLogin()}
            </Fragment>
          )}
        </Fragment>
      ) : (
        <Fragment>
          <GateOrLine />
          {renderEmailLogin()}
        </Fragment>
      )}

      {processing && (
        <RcPopup
          title={t('loading')}
          fontSizeTitle="0.8em"
          isLoading={true}
          colorTitleLoading={colorTitleLoading}
          colorSpinner={colorSpinner}
        />
      )}

      {error && (
        <RcPopup
          title={t('error')}
          onClose={() => gate.notify({ error: '' })}
          isError={true}
          message={error}
          fontSizeTitle="0.8em"
        />
      )}

      {doneSendCode && (
        <RcPopup
          title={t('success')}
          onClose={() => gate.notify({ doneSendCode: false })}
          message={t('doneSendCode')}
          fontSizeTitle="0.8em"
        />
      )}

      {doneResetPassword && (
        <RcPopup
          title={t('success')}
          onClose={() => gate.notify({ doneResetPassword: false })}
          message={t('doneResetPassword')}
          fontSizeTitle="0.8em"
        />
      )}
    </div>
  );
};
