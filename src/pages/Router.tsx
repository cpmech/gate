import { AboutPage } from './AboutPage';
import { HomePage } from './HomePage';
import { LegalPpPage } from './LegalPpPage';
import { LegalTsPage } from './LegalTsPage';
import { LoadingPage } from './LoadingPage';
import { NotFoundPage } from './NotFoundPage';
import { SignInPage } from './SignInPage';
import { TopicsPage } from './TopicsPage';
import { useStoreObserver, gate } from '../service';
import { withUseGateObserver } from '../lib';

const useGateObserver = withUseGateObserver(gate);

export const Router: React.FC = () => {
  const gateStatus = useGateObserver('Router');
  const { route } = useStoreObserver('Router');

  const [hash, first, second] = route.split('-');

  if (route.length === 0 || hash === '' || hash === '#' || hash === '#home') {
    return <HomePage />;
  }

  if (hash === '#legalpp') {
    return <LegalPpPage />;
  }

  if (hash === '#legalts') {
    return <LegalTsPage />;
  }

  if (hash === '#about') {
    return <AboutPage category="me" />;
  }

  if (hash === '#signin') {
    if (!gateStatus.ready) {
      return <LoadingPage />;
    }
    if (gateStatus.hasAccess) {
      return <HomePage />;
    }
    return <SignInPage />;
  }

  // protected route
  if (hash === '#topics' && first && second) {
    if (gateStatus.hasAccess) {
      return <TopicsPage topicId={first} sectionId={second} />;
    } else {
      return <SignInPage />;
    }
  }

  // waiting federation login
  if (hash === '#_=_' || gateStatus.waitApple || gateStatus.waitFacebook || gateStatus.waitGoogle) {
    return <LoadingPage />;
  }

  // not found
  return <NotFoundPage />;
};
