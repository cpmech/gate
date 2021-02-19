import { objKeys, isEmailValid, isPasswordValid } from '@cpmech/util';
import { ISignUpValues, ISignUpErrors } from '.';
import { t } from '../locale';

export const signUpValues2errors = (
  values: ISignUpValues,
  ignore?: { [key in keyof Partial<ISignUpErrors>]: boolean },
  simplePassword = false,
) => {
  const errors: ISignUpErrors = {
    email: isEmailValid(values.email) ? '' : t('errorEmail'),
    password: simplePassword
      ? values.password.length >= 8
        ? ''
        : t('errorPasswordSimple')
      : isPasswordValid(values.password)
      ? ''
      : t('errorPassword'),
    code: values.code ? '' : t('errorCode'),
  };
  if (ignore) {
    objKeys(ignore).forEach((key) => (errors[key] = ''));
  }
  const hasError = !!errors.email || !!errors.password || !!errors.code;
  return {
    errors,
    hasError,
  };
};
