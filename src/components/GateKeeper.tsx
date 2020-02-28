import React, { useState } from 'react';
/** @jsx jsx */ import { jsx, css } from '@emotion/core';
import { IconEye, IconEyeNo } from '@cpmech/react-icons';
import { InputTypeA, Link, Button } from 'rcomps';
import { GateStore } from 'service';
import { useObserver } from './useObserver';
import { PageLoading } from './PageLoading';
import { PageNoAccess } from './PageNoAccess';
import { VSpace } from './VSpace';
import { stylesGateKeeper as styles, colors } from './styles';
import { ISignInValues, signInValues2errors } from 'helpers';
import { t } from 'locale';
import { FedButtons } from './FedButtons';

interface IGateKeeperProps {
  gate: GateStore;
  buttonBackgroundColor?: string;
}

export const GateKeeper: React.FC<IGateKeeperProps> = ({
  gate,
  buttonBackgroundColor = '#5d5c61',
}) => {
  const loading = false;
  const signedIn = false;
  const belongsToGroup = true;
  // const { loading, signedIn, belongsToGroup } = useObserver(gate);
  const [showPassword, setShowPassword] = useState(false);
  const [touchedButtons, setTouchedButtons] = useState(false);
  const [values, setValues] = useState<ISignInValues>({ email: '', password: '' });

  const setValue = <K extends keyof ISignInValues>(key: K, value: string) => {
    const newValues = { ...values, [key]: value };
    if (touchedButtons) {
      const errors = signInValues2errors(newValues);
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

  const renderInputs = () => (
    <div css={styles.container}>
      <div css={styles.row}>
        <span css={styles.header}>{t('signIn')}</span>
      </div>
      <VSpace />
      <InputTypeA
        label="Email"
        value={values.email}
        onChange={e => setValue('email', e.target.value)}
        hlColor={colors.blue}
      />
      <VSpace />
      <InputTypeA
        label={t('password')}
        value={values.password}
        password={!showPassword}
        suffix={passwordIcon}
        onChange={e => setValue('password', e.target.value)}
        hlColor={colors.blue}
      />
      <VSpace />
      <div css={styles.smallFootnote}>
        <span>{t('forgotPassword')}</span>
        <Link css={styles.link} onClick={() => console.log('resetar')}>
          {t('resetPassword')}
        </Link>
      </div>
      <VSpace />
      <div css={styles.row}>
        <div css={styles.footnote}>
          <span>{t('noAccount')}</span>
          <Link css={styles.link} onClick={() => console.log('signUp')}>
            {t('signUp')}
          </Link>
        </div>
        <Button
          onClick={() => console.log('entrar')}
          borderRadius={300}
          color="#ffffff"
          fontWeight="bold"
          width="200px"
          backgroundColor={buttonBackgroundColor}
        >
          {t('enter').toUpperCase()}
        </Button>
      </div>
    </div>
  );

  return (
    <React.Fragment>
      {loading && <PageLoading message={t('loading')} />}
      {!loading && signedIn && !belongsToGroup && (
        <PageNoAccess gate={gate} message={t('noAccess')} btnText={t('signOut')} />
      )}
      <div
        css={css`
          ${!loading && !signedIn ? 'display: flex;' : 'display:none;'}
          flex-direction: column;
          justify-content: center;
          align-items: center;
        `}
      >
        <FedButtons gate={gate} />
        {renderInputs()}
      </div>
    </React.Fragment>
  );
};
