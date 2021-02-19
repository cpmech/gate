import { Fragment } from 'react';
import { useMediaQuery } from 'react-responsive';
import { Footer, Header, SideBar, Warning } from './layout';
import { rcConfig, RcLayout, RcSideNav } from './rcomps';
import { Router } from './pages';
import { styles } from './styles';
import { store, useStoreObserver } from './service';

rcConfig.media.desktop.maxPageWidth = styles.dims.minMaxPageWidth;

export const App: React.FC = () => {
  const condition = useStoreObserver('App');
  const isNarrow = useMediaQuery({ maxWidth: rcConfig.media.phone.maxWidth });

  const warning = condition.showWarning && <Warning />;

  const header = condition.showHeader && <Header withMenuButton={isNarrow} />;

  const footer = condition.showFooter && <Footer />;

  const sidebar = !isNarrow && condition.showSideBar && <SideBar onMenu={false} />;

  const leftMenu = (
    <RcSideNav
      onClose={() => store.setShowLeftMenu(false)}
      bgColor={styles.colors.transparent(0.8)}
      width={styles.dims.leftMenu.width}
    >
      <SideBar onMenu={true} />
    </RcSideNav>
  );

  const main = <Router />;

  const maxContentWidth = condition.fullView
    ? styles.dims.maxMaxPageWidth
    : styles.dims.minMaxPageWidth;

  return (
    <Fragment>
      <RcLayout
        warning={warning}
        header={header}
        sidebar={sidebar}
        main={main}
        footer={footer}
        maxContentWidth={`${maxContentWidth}px`}
      />
      {isNarrow && condition.showLeftMenu && leftMenu}
    </Fragment>
  );
};
