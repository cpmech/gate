import { useState, useEffect } from 'react';
import { GateStore, LocalGateStore, newBlankFlags, newBlankUser } from '../service';

export const withUseGateObserver = (gate: GateStore | LocalGateStore) => (observerName: string) => {
  const [state, setState] = useState({ ...newBlankFlags(), ...newBlankUser() });

  useEffect(() => {
    // flag to prevent calling setData when the component is unmounted
    let finished = false;

    // must set the state right here and right now because the Gate
    // may have been already configured and we missed the notification
    setState({ ...gate.flags, ...gate.user });

    // now we can listen to further notifications, if any
    const unsubscribe = gate.subscribe(() => {
      if (!finished) {
        setState({ ...gate.flags, ...gate.user });
      }
    }, observerName);

    // return clean-up function
    return () => {
      finished = true;
      unsubscribe();
    };

    // note dependencies
  }, [observerName]);

  return state;
};
