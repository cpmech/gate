import { useStoreObserver } from '../service';
import { AboutPage } from './AboutPage';
import { HomePage } from './HomePage';
import { LegalPpPage } from './LegalPpPage';
import { LegalTsPage } from './LegalTsPage';
import { NotFoundPage } from './NotFoundPage';
import { TopicsPage } from './TopicsPage';

export const Router: React.FC = () => {
  const { route } = useStoreObserver('Router');

  const [hash, first, second] = route.split('-');

  if (hash === '#topics' && first && second) {
    return <TopicsPage topicId={first} sectionId={second} />;
  }

  if (hash === '#about') {
    return <AboutPage category="me" />;
  }

  if (hash === '#legalpp') {
    return <LegalPpPage />;
  }

  if (hash === '#legalts') {
    return <LegalTsPage />;
  }

  if (route.length > 1) {
    return <NotFoundPage />;
  }

  return <HomePage />;
};
