import { useLocation } from 'wouter';

export interface IRoute {
  route: string;
  sub?: string;
  id?: string;
}

const pendingRedirect: IRoute = {
  route: '',
  sub: '',
  id: '',
};

export const useNav = () => {
  const [location, setLocation] = useLocation();

  // no need to use slashes
  const goto = ({ route = '', sub = '', id = '' }: IRoute, scrollToTop = true, hideMenu = true) => {
    if (scrollToTop) {
      window.scrollTo(0, 0);
    }
    const path = '/' + [route, sub, id].join('/').replace(/(\/+$)/, '');
    setLocation(path);
  };

  const gohome = () => goto({ route: '', sub: '', id: '' });

  const list =
    pendingRedirect.route !== ''
      ? [pendingRedirect.route, pendingRedirect.sub, pendingRedirect.id]
      : location.split('/').slice(1);

  if (pendingRedirect.route) {
    pendingRedirect.route = '';
    pendingRedirect.sub = '';
    pendingRedirect.id = '';
  }

  return {
    goto,
    gohome,
    route: list[0] || '',
    sub: list[1] || '',
    id: list[2] || '',
    setRedirect: ({ route, sub, id }: IRoute) => {
      pendingRedirect.route = route;
      pendingRedirect.sub = sub;
      pendingRedirect.id = id;
    },
  };
};
