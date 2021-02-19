import { pt } from '../pt';
import { en } from '../en';

describe('compare pt and en', () => {
  it('should have the same keys', () => {
    Object.keys(pt).forEach((key) => {
      expect((en as any)[key]).not.toBeUndefined();
    });
  });
});
