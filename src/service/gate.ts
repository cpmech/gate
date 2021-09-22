import { GateStore, gateLocale, LocalGateStore, IStorage } from '../lib';
import { store } from './store';
import { config } from './config';

gateLocale.setLocale('en');

const storage: IStorage = {
  getItem: async (key: string) => window.localStorage.getItem(key),
  setItem: async (key: string, value: string) => window.localStorage.setItem(key, value),
  removeItem: async (key: string) => window.localStorage.removeItem(key),
};

const mustBeInGroups = ['customers'];

export const isLocal = !config.liveGate;

export const gate = config.liveGate
  ? new GateStore(
      {
        userPoolId: config.cognitoPoolId,
        userPoolWebClientId: config.cognitoClientId,
        oauthDomain: `${config.appKey}-login-${config.stage}.auth.us-east-1.amazoncognito.com`,
        redirectSignIn: `https://${config.stage === 'dev' ? 'dev.' : ''}${config.domain}/`,
        redirectSignOut: `https://${config.stage === 'dev' ? 'dev.' : ''}${config.domain}/`,
        awsRegion: 'us-east-1',
      },
      mustBeInGroups,
    )
  : new LocalGateStore('@cpmech/gate', storage);

// subscribe a function to capture when the user signs-in
gate.subscribe(() => {
  if (gate.flags.processing) {
    return;
  }
  if (gate.user.hasAccess && gate.user.username) {
    console.log(gate.user);
    store.loadData();
  }
}, 'store.loadData');
