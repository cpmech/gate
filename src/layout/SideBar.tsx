/** @jsxImportSource @emotion/react */
import { IconStar } from '@cpmech/iricons/IconStar';
import { IconStarOutline } from '@cpmech/iricons/IconStarOutline';
import { RcMenuEntry, RcMenuVert } from '../rcomps';
import { store } from '../service';
import { styles } from '../styles';

const topics = ['First', 'Second'];

const nav = (route: string, onMenu: boolean) => {
  if (onMenu) {
    store.setShowLeftMenu(false);
  }
  store.navigate(route);
};

export const getEntries = (onMenu: boolean): RcMenuEntry[] => [
  {
    icon: <IconStar size={styles.dims.icon.medium} />,
    label: 'About',
    onClick: () => nav('#about', onMenu),
  },
  {
    icon: <IconStar size={styles.dims.icon.medium} />,
    label: 'Topics',
    entries: topics.map((topic) => ({
      icon: <IconStarOutline size={styles.dims.icon.small} />,
      label: topic,
      onClick: () => {
        nav(`#topics-${topic}-1`, onMenu);
      },
    })),
  },
];

export interface SideBarProps {
  onMenu?: boolean;
}

export const SideBar: React.FC<SideBarProps> = ({ onMenu = false }) => {
  const fg = onMenu ? styles.colors.white() : styles.colors.blue();
  const hc = onMenu ? styles.colors.grey(50) : styles.colors.blue(50);
  const bg = styles.colors.transparent();

  return (
    <RcMenuVert
      entries={getEntries(onMenu)}
      color={fg}
      bgColor={bg}
      colorHover={hc}
      minWidth={styles.dims.sideBar.maxWidth}
      maxWidth={styles.dims.sideBar.maxWidth}
    />
  );
};
