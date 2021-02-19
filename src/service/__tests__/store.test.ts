import { sleep } from '@cpmech/basic';
import { store } from '../store';

describe('store', () => {
  it('should set data', async () => {
    store.loadTopic('todo');
    await sleep(50);
    expect(store.error).toBe('');
    expect(store.started).toBeTruthy();
    expect(store.ready).toBeTruthy();
  });
});
