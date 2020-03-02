import { objKeys } from '@cpmech/util';
import { isPasswordValid } from './isPasswordValid';
import { t } from '../locale';
import { isEmailValid } from './isEmailValid';
import { ISignUpValues, ISignUpErrors } from '../service';

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
