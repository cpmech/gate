import { newZeroData, chkData } from '../data';

describe('data', () => {
  it('should return zero data', () => {
    expect(newZeroData()).toEqual({ email: '' });
  });

  it('should check input of type any', () => {
    const bad1 = { notEmail: '' };
    const ok1 = { email: '' };
    expect(chkData(bad1)).toBeNull();
    expect(chkData(ok1)).toEqual({ email: '' });
  });
});
