import { useState, useEffect } from 'react';
import { store } from './store';

interface IUseStoreState {
  anyError: string;
  loadDataInProgress: boolean;
}

const makeUseStoreState = (): IUseStoreState => ({
  anyError: store.getFirstError(),
  loadDataInProgress: store.actions.loadData.inProgress,
});

export const useStore = (observerName: string) => {
  const [data, setData] = useState<IUseStoreState>({
    anyError: '',
    loadDataInProgress: false,
  });

  useEffect(() => {
    // flag to prevent calling setData when the component is unmounted
    let finished = false;

    // must set the state right here and right now because the login/signup
    // may have been already configured and we missed the notification
    setData(makeUseStoreState());

    // now we can listen to further notifications, if any
    const unsubscribe = store.subscribe(() => {
      if (!finished) {
        setData(makeUseStoreState());
      }
    }, observerName);

    // return clean-up function
    return () => {
      finished = true;
      unsubscribe();
    };

    // note dependencies
  }, [observerName]);

  return data;
};
