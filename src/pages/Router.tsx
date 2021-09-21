import { HomePage } from './HomePage';
import { LoadingPage } from './LoadingPage';
import { NotFoundPage } from './NotFoundPage';
import { SignInPage } from './SignInPage';
import { useStore, useNav, gate } from '../service';
import { withUseGateObserver } from '../lib';
import { ErrorPage } from './ErrorPage';

const useGateObserver = withUseGateObserver(gate);

export const Router: React.FC = () => {
  const gateStatus = useGateObserver('Router');
  const storeStatus = useStore('Router');
  const { route } = useNav();

  if (storeStatus.anyError) {
    return <ErrorPage error={storeStatus.anyError} />;
  }

  if (!gateStatus.ready || storeStatus.loadDataInProgress) {
    return <LoadingPage />;
  }

  if (route === '') {
    return <HomePage />;
  }

  if (route === 'signin') {
    if (gateStatus.hasAccess) {
      return <HomePage signInSuccessful={true} />;
    }
    return <SignInPage />;
  }

  // not found
  return <NotFoundPage />;
};
