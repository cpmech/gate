import Typography from 'typography';
import fairyGateTheme from 'typography-theme-fairy-gates';
import { colors } from './lib/components/gateStyles';

const linkColor = colors.blue;

fairyGateTheme.overrideThemeStyles = () => ({
  a: {
    color: linkColor,
    textShadow: 'none',
    backgroundImage: 'none',
  },
  'a:hover,a:active': {
    color: linkColor,
    textDecoration: 'none',
    backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0) 1px, ${linkColor} 1px, ${linkColor} 2px, rgba(0, 0, 0, 0) 2px)`, // eslint-disable-line
  },
});

export const typography = new Typography(fairyGateTheme);

export const { scale, rhythm, options } = typography;
