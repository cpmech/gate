import { isPasswordValid } from './isPasswordValid';
import { t } from '../locale';
import { isEmailValid } from './isEmailValid';
import { ISignUpValues } from '../service';

export const signUpValues2errors = (values: ISignUpValues, ignoreCode: boolean) => {
  const errors = {
    email: isEmailValid(values.email) ? '' : t('errorEmail'),
    password: isPasswordValid(values.password) ? '' : t('errorPassword'),
    code: ignoreCode ? '' : values.code ? '' : t('errorCode'),
  };
  const hasError = errors.email || errors.password;
  return hasError ? errors : undefined;
};
