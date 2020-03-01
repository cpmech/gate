import { signUpValues2errors } from '../errorChecks';
import { t } from '../../locale';

describe('signUpValues2errors', () => {
  it('should detect all wrong values', () => {
    expect(
      signUpValues2errors({
        email: '',
        password: '',
        code: '',
      }),
    ).toStrictEqual({
      errors: {
        email: t('errorEmail'),
        password: t('errorPassword'),
        code: t('errorCode'),
      },
      hasError: true,
    });
  });

  it('should detect correct and wrong values', () => {
    expect(
      signUpValues2errors({
        email: 'a@a.co',
        password: '',
        code: '123',
      }),
    ).toStrictEqual({
      errors: {
        email: '',
        password: t('errorPassword'),
        code: '',
      },
      hasError: true,
    });
  });

  it('should detect correct values', () => {
    expect(
      signUpValues2errors({
        email: 'a@a.co',
        password: '1carro$violeTA',
        code: '123',
      }),
    ).toStrictEqual({
      errors: {
        email: '',
        password: '',
        code: '',
      },
      hasError: false,
    });
  });
});
