/** @jsxImportSource @emotion/react */
import { useState, ReactNode, Fragment } from 'react';
import { IconEye } from '@cpmech/iricons/IconEye';
import { IconEyeOff } from '@cpmech/iricons/IconEyeOff';
import { IconChevronDown } from '@cpmech/iricons/IconChevronDown';
import { IconChevronUp } from '@cpmech/iricons/IconChevronUp';
import { RcLinkOrDiv, RcButton, RcError, RcPopup, RcInput } from '../../rcomps';
import { GateFederatedButtons } from './GateFederatedButtons';
import { gateStyles, gateParams } from './gateStyles';
import { withUseGateObserver } from './withUseGateObserver';
import { t } from '../locale';
import { GateStore, ISignUpValues, ISignUpErrors, signUpValues2errors } from '../service';
import { GateOrLine } from './GateOrLine';

const s = gateStyles.signUpForm;

interface IGateSignUpFormProps {
  gate: GateStore;
  iniEmail?: string;
  iniPassword?: string;
  logo?: ReactNode;
  mayHideEmailLogin?: boolean;
  initShownEmailLogin?: boolean;
  simplePassword?: boolean;
  showSignUpFirst?: boolean;
  withFederated?: boolean;
  withApple?: boolean;
}

export const GateSignUpForm: React.FC<IGateSignUpFormProps> = ({
  gate,
  iniEmail = '',
  iniPassword = '',
  logo,
  mayHideEmailLogin,
  initShownEmailLogin,
  simplePassword,
  showSignUpFirst = false,
  withFederated = true,
  withApple = false,
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
    <div css={gateStyles.showHide.root} onClick={() => setShowEmailLogin(!showEmailLogin)}>
      <div css={gateStyles.showHide.text}>{t('more').toUpperCase()}</div>
      <div css={gateStyles.showHide.icon}>
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
          <RcInput
            label="Email"
            value={values.email}
            onChange={(e) => setValue('email', e.target.value)}
            hlColor={gateParams.input.hlColor}
            error={vErrors.email}
            fontSize={gateParams.font.size}
            labelFontSize={gateParams.font.size}
            borderRadius={gateParams.input.radius}
          />
          <RcError error={vErrors.email} />
        </Fragment>
      )}

      {/* ----------------------- input code ------------------------- */}
      {(isConfirm || resetPasswordStep2) && (
        <Fragment>
          <RcInput
            label={t('confirmationCode')}
            value={values.code}
            onChange={(e) => setValue('code', e.target.value)}
            hlColor={gateParams.input.hlColor}
            error={vErrors.code}
            fontSize={gateParams.font.size}
            labelFontSize={gateParams.font.size}
            borderRadius={gateParams.input.radius}
          />
          <RcError error={vErrors.code} />
        </Fragment>
      )}

      {/* ----- footnote: resend code -- (resetPasswordStep2) -------- */}
      {resetPasswordStep2 && (
        <Fragment>
          <div css={s.smallFootnote}>
            <span>{t('lostCode')}&nbsp;</span>
            <RcLinkOrDiv
              onClick={async () => await resendCodeInResetPwdView()}
              underline={gateParams.link.underline}
            >
              {t('resendCode')}
            </RcLinkOrDiv>
          </div>
        </Fragment>
      )}

      {/* --------------------- input password ----------------------- */}
      {!(isConfirm || resetPasswordStep1) && (
        <Fragment>
          <RcInput
            label={resetPasswordStep2 ? t('newPassword') : t('password')}
            value={values.password}
            password={!showPassword}
            suffix={renderPasswordIcon()}
            onChange={(e) => setValue('password', e.target.value)}
            hlColor={gateParams.input.hlColor}
            error={vErrors.password}
            fontSize={gateParams.font.size}
            labelFontSize={gateParams.font.size}
            borderRadius={gateParams.input.radius}
          />
          <RcError error={vErrors.password} />
        </Fragment>
      )}

      {/* ----------------- footnote: reset password ----------------- */}
      {isSignIn && !atNextPage && (
        <Fragment>
          <div css={s.smallFootnote}>
            <span>{t('forgotPassword')}&nbsp;</span>
            <RcLinkOrDiv
              onClick={() => {
                clearErrors();
                setResetPasswordStep1(true);
              }}
              underline={gateParams.link.underline}
            >
              {t('resetPassword')}
            </RcLinkOrDiv>
          </div>
        </Fragment>
      )}

      {/* ----------------- footnote: resend code -------------------- */}
      {isConfirm && (
        <Fragment>
          <div css={s.smallFootnote}>
            <span>{t('lostCode')}&nbsp;</span>
            <RcLinkOrDiv
              onClick={async () => await resendCodeInConfirmView()}
              underline={gateParams.link.underline}
            >
              {t('resendCode')}
            </RcLinkOrDiv>
          </div>
        </Fragment>
      )}

      {/* ----------------------- submit button ---------------------- */}
      <div css={s.row}>
        {/* ....... footnote: go back ....... */}
        {atNextPage && (
          <Fragment>
            <div css={s.footnote}>
              <RcLinkOrDiv
                onClick={() => {
                  clearErrors();
                  wantToConfirm && setWantToConfirm(false);
                  needToConfirm && gate.notify({ needToConfirm: false });
                  resetPasswordStep1 && setResetPasswordStep1(false);
                  resetPasswordStep2 && gate.notify({ resetPasswordStep2: false });
                }}
                underline={gateParams.link.underline}
              >
                {t('back')}
              </RcLinkOrDiv>
            </div>
          </Fragment>
        )}

        {/* ....... footnote: signIn or signUp ....... */}
        {!atNextPage && (
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
          <div css={s.smallFootnote}>
            <span>{t('wantToConfirm')}&nbsp;</span>
            <RcLinkOrDiv
              onClick={() => {
                clearErrors();
                setWantToConfirm(true);
              }}
              underline={gateParams.link.underline}
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
      {logo}

      {withFederated && <GateFederatedButtons gate={gate} withApple={withApple} />}

      {mayHideEmailLogin ? (
        <Fragment>
          {renderShowHide()}
          {showEmailLogin && (
            <Fragment>
              {withFederated && <GateOrLine />}
              {renderEmailLogin()}
            </Fragment>
          )}
        </Fragment>
      ) : (
        <Fragment>
          {withFederated && <GateOrLine />}
          {renderEmailLogin()}
        </Fragment>
      )}

      {processing && (
        <RcPopup
          title={t('loading')}
          fontSizeTitle="0.8em"
          isLoading={true}
          colorTitleLoading={gateParams.loading.colorTitle}
          colorSpinner={gateParams.loading.colorSpinner}
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
