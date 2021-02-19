import { GateStore, gateLocale, LocalGateStore, IStorage } from './lib';

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
      oauthDomain: 'gate.auth.us-east-1.amazoncognito.com',
      redirectSignIn: 'https://localhost:3000/',
      redirectSignOut: 'https://localhost:3000/',
      awsRegion: 'us-east-1',
    });
