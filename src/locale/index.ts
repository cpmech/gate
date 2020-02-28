import { Locales } from '@cpmech/basic';
import { en } from './en';
import { pt } from './pt';

const res = {
  en,
  pt,
};

export const locale = new Locales(res, 'en', 'us');

export const t = locale.translate;
