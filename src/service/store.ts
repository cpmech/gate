import { SimpleStore } from '@cpmech/simple-state';
import { IData } from '../data';
import { downloadJson } from './downloadJson';

// define the state interface
interface IState {
  interface: {
    fullView: boolean;
    warningMessage: string;
    showWarning: boolean;
    showHeader: boolean;
    showLeftMenu: boolean;
    showSideBar: boolean;
    showFooter: boolean;
    route: string;
  };
  data: IData;
}

// define a function to generate a blank state
const newZeroState = (): IState => ({
  interface: {
    fullView: false,
    warningMessage: '',
    showWarning: false,
    showHeader: true,
    showLeftMenu: false,
    showSideBar: true,
    showFooter: true,
    route: '',
  },
  data: { email: '' },
});

const onStart = async (_: string): Promise<IState> => {
  // blank state
  const state = newZeroState();

  // load and set data
  // TODO

  // set route
  state.interface.route = window.location.hash;

  // return initialized state
  return state;
};

// extend the SimpleStore class; it may have any additional members
class Store extends SimpleStore<IState, null> {
  constructor(private scroolToTop = true, private silentNavigation = false) {
    super(newZeroState, onStart);

    // set ready flag here [important]
    this.ready = true;

    // listen for route changes
    window.addEventListener(
      'hashchange',
      () => {
        if (window.location.hash !== this.state.interface.route) {
          if (!this.silentNavigation) {
            this.notifyBeginReady();
          }
          this.state.interface.route = window.location.hash;
          if (!this.silentNavigation) {
            if (this.scroolToTop) {
              window.scrollTo(0, 0);
            }
            this.notifyEndReady();
          }
          this.silentNavigation = true;
        }
      },
      false,
    );
  }

  navigate = (route = '', silent = false) => {
    this.silentNavigation = silent;
    window.location.hash = route;
  };

  toggleFullView = () => {
    this.notifyBeginStart();
    if (this.state.interface.fullView) {
      this.state.interface.fullView = false;
      this.state.interface.showHeader = true;
      this.state.interface.showSideBar = true;
      this.state.interface.showFooter = true;
    } else {
      this.state.interface.fullView = true;
      this.state.interface.showHeader = false;
      this.state.interface.showSideBar = false;
      this.state.interface.showFooter = false;
    }
    this.notifyEndStart();
  };

  setShowWarning = (value: boolean, message = 'WARNING') => {
    this.notifyBeginStart();
    this.state.interface.showWarning = value;
    this.state.interface.warningMessage = message;
    this.notifyEndStart();
  };

  setShowHeader = (value: boolean) => {
    this.notifyBeginStart();
    this.state.interface.showHeader = value;
    this.notifyEndStart();
  };

  setShowLeftMenu = (value: boolean) => {
    this.notifyBeginStart();
    this.state.interface.showLeftMenu = value;
    this.notifyEndStart();
  };

  setShowSideBar = (value: boolean) => {
    this.notifyBeginStart();
    this.state.interface.showSideBar = value;
    this.notifyEndStart();
  };

  setShowFooter = (value: boolean) => {
    this.notifyBeginStart();
    this.state.interface.showFooter = value;
    this.notifyEndStart();
  };

  loadTopic = async (id: string, forceReload = true) => {
    this.notifyBeginReady();
    console.log('loadTopic: TODO');
    this.notifyEndReady();
  };

  downloadJson = async () => {
    this.notifyBeginReady();
    downloadJson(this.state.data, `my-data`);
    this.notifyEndReady();
  };
}

// instantiate store
export const store = new Store();
store.doStart('');
