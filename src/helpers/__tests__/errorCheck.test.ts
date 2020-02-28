import { signUpValues2errors } from '../errorChecks';
import { t } from '../../locale';

describe('signUpValues2errors', () => {
  it('should detect all wrong values', () => {
    expect(
      signUpValues2errors({
        email: '',
        password: '',
      }),
    ).toStrictEqual({
      email: t('errorEmail'),
      password: t('errorPassword'),
    });
  });

  it('should detect correct and wrong values', () => {
    expect(
      signUpValues2errors({
        email: 'a@a.co',
        password: '',
      }),
    ).toStrictEqual({
      email: '',
      password: t('errorPassword'),
    });
  });

  it('should detect correct values', () => {
    expect(
      signUpValues2errors({
        email: 'a@a.co',
        password: '1carro$violeTA',
      }),
    ).toBeUndefined();
  });
});
