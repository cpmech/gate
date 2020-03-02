import { Locales } from '@cpmech/basic';
import { en } from './en';
import { pt } from './pt';

const res = {
  en,
  pt,
};

export const gateLocale = new Locales(res, 'en', 'us');

export const t = gateLocale.translate;
