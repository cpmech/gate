import { pt } from '../pt';
import { en } from '../en';

describe('compare pt and en', () => {
  it('should have the same keys', () => {
    Object.keys(pt).forEach(key => {
      // console.log(`${(pt as any)[key]} => ${(en as any)[key]}`);
      expect((en as any)[key]).not.toBeUndefined();
    });
  });
});
