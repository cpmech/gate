import { objKeys, isEmailValid, isPasswordValid } from '@cpmech/util';
import { ISignUpValues, ISignUpErrors } from '../service';
import { t } from '../locale';

export const signUpValues2errors = (
  values: ISignUpValues,
  ignore?: { [key in keyof Partial<ISignUpErrors>]: boolean },
) => {
  const errors: ISignUpErrors = {
    email: isEmailValid(values.email) ? '' : t('errorEmail'),
    password: isPasswordValid(values.password) ? '' : t('errorPassword'),
    code: values.code ? '' : t('errorCode'),
  };
  if (ignore) {
    objKeys(ignore).forEach(key => (errors[key] = ''));
  }
  const hasError = !!errors.email || !!errors.password || !!errors.code;
  return {
    errors,
    hasError,
  };
};
