import { Iany } from '@cpmech/basic';
import { isPasswordValid } from './isPasswordValid';
import { t } from '../locale';

export interface ISignInValues {
  email: string;
  password: string;
  errors?: Iany;
}

export const signInValues2errors = (values: ISignInValues) => {
  const errors = {
    email: values.email ? '' : t('errorEmail'),
    password: isPasswordValid(values.password) ? '' : t('errorPassword'),
  };
  const hasError = errors.email || errors.password;
  return hasError ? errors : undefined;
};
