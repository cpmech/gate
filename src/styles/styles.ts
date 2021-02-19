import { backgrounds } from './backgrounds';
import { cascade } from './cascade';
import { colors } from './colors';
import { dims } from './dims';
import { IFont, fonts } from './fonts';

export const styles = {
  backgrounds,
  cascade,
  colors,
  dims,
  fonts,
  html: {
    get: (font: IFont = 'inter', bgIndex = 0) => `
      html { margin: 0; }
      body {
        margin: 0;
        ${backgrounds.get(bgIndex)};
        -webkit-font-smoothing: antialiased;
        ${fonts[font].cssFamily};
      }`,
  },
};
