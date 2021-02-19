type Scheme = 1;

let scheme: Scheme = 1;

export const setScheme = (sch: Scheme) => (scheme = sch);

// the color is defined by its lightened percentage
// NOTE: 0 means the "full" color and 100 is white
type Pcts = 0 | 25 | 50 | 75 | 100;

type ILighten = { [pct in Pcts]: string };

type IColor = { [sch in Scheme]: ILighten };

type IColors = { [name: string]: IColor };

const colorsDatabase: IColors = {
  red: { 1: { 0: '#c01626', 25: '#e83748', 50: '#ef7a85', 75: '#f7bcc2', 100: '#ffffff' } },
  blue: { 1: { 0: '#255fdf', 25: '5b86e7', 50: '#92aeef', 75: '#c8d6f7', 100: '#ffffff' } },
  purple: { 1: { 0: '#9900ff', 25: '#b23fff', 50: '#cb7fff', 75: '#e5bfff', 100: '#ffffff' } },
  green: { 1: { 0: '#04891f', 25: '#06e233', 50: '#4bf96f', 75: '#a5fcb7', 100: '#ffffff' } },
  orange: { 1: { 0: '#e56f00', 25: '#ff922c', 50: '#ffb672', 75: '#ffdab8', 100: '#ffffff' } },
  black: { 1: { 0: '#000000', 25: '#3f3f3f', 50: '#7f7f7f', 75: '#bfbfbf', 100: '#ffffff' } },
  grey: { 1: { 0: '#484848', 25: '#757575', 50: '#a3a3a3', 75: '#d1d1d1', 100: '#ffffff' } },
};

export const colors = {
  red: (lightenPct: Pcts = 0) => colorsDatabase.red[scheme][lightenPct],
  blue: (lightenPct: Pcts = 0) => colorsDatabase.blue[scheme][lightenPct],
  purple: (lightenPct: Pcts = 0) => colorsDatabase.purple[scheme][lightenPct],
  green: (lightenPct: Pcts = 0) => colorsDatabase.green[scheme][lightenPct],
  orange: (lightenPct: Pcts = 0) => colorsDatabase.orange[scheme][lightenPct],
  black: (lightenPct: Pcts = 0) => colorsDatabase.black[scheme][lightenPct],
  grey: (lightenPct: Pcts = 0) => colorsDatabase.grey[scheme][lightenPct],
  white: () => '#ffffff',
  transparent: (alpha = 0) => `rgba(0,0,0,${alpha})`,
};
