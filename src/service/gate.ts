import { GateStore, gateLocale, LocalGateStore, IStorage } from '../lib';
import { store } from './store';

gateLocale.setLocale('en');

const storage: IStorage = {
  getItem: async (key: string) => window.localStorage.getItem(key),
  setItem: async (key: string, value: string) => window.localStorage.setItem(key, value),
  removeItem: async (key: string) => window.localStorage.removeItem(key),
};

export const isLocal = false;

export const gate = isLocal
  ? new LocalGateStore('@cpmech/gate', storage)
  : new GateStore({
      userPoolId: 'us-east-1_1HweE3Ykl',
      userPoolWebClientId: '6cseuviljoiasveoevl5qilaqj',
      oauthDomain: 'gate-login-dev.auth.us-east-1.amazoncognito.com',
      redirectSignIn: 'https://dev.dorival.link/',
      redirectSignOut: 'https://dev.dorival.link/',
      awsRegion: 'us-east-1',
    });

// subscribe a function to capture when the user signs-in
gate.subscribe(() => {
  if (gate.flags.processing) {
    return;
  }
  if (gate.user.hasAccess && gate.user.username) {
    store.doStart('');
    store.handleRedirect();
  }
}, 'store.doStart');
