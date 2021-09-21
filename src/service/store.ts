import { SimpleStore } from '@cpmech/simple-state';

// define possible actions
type Action = 'loadData' | 'clearState';
const actionNames: Action[] = ['loadData', 'clearState'];

// define the state interface
interface IState {
  data: { email: string };
}

// define a function to generate a blank state
const newZeroState = (): IState => ({
  data: { email: '' },
});

// extend the SimpleStore class; it may have any additional members
class Store extends SimpleStore<Action, IState, null> {
  constructor(private scrollToTop = true, private silentNavigation = false) {
    super(actionNames, newZeroState);
  }

  loadData = async () => {
    this.updateState('loadData', async () => {
      this.state.data.email = 'my.email@gmail.com';
    });
  };
}

// instantiate store
export const store = new Store();
