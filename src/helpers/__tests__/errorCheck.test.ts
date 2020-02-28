import { signInValues2errors } from '../errorChecks';
import { t } from '../../locale';

describe('signInValues2errors', () => {
  it('should detect all wrong values', () => {
    expect(
      signInValues2errors({
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
      signInValues2errors({
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
      signInValues2errors({
        email: 'a@a.co',
        password: '1carro$violeTA',
      }),
    ).toBeUndefined();
  });
});
