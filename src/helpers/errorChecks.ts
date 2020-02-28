import { Iany } from '@cpmech/basic';
import { isPasswordValid } from './isPasswordValid';
import { t } from '../locale';
import { isEmailValid } from './isEmailValid';

export interface ISignUpValues {
  email: string;
  password: string;
  errors?: Iany;
}

export const signUpValues2errors = (values: ISignUpValues) => {
  const errors = {
    email: isEmailValid(values.email) ? '' : t('errorEmail'),
    password: isPasswordValid(values.password) ? '' : t('errorPassword'),
  };
  const hasError = errors.email || errors.password;
  return hasError ? errors : undefined;
};
