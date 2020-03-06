import { useState, useEffect } from 'react';
import { GateStore, LocalGateStore, newBlankFlags, newBlankUser } from '../service';

export const useGateObserver = (gate: GateStore | LocalGateStore, observerName: string) => {
  const [state, setState] = useState({ ...newBlankFlags(), ...newBlankUser() });

  useEffect(() => {
    // must set the state right here and right now because the Gate
    // may have been already configured and we missed the notification
    setState({ ...gate.flags, ...gate.user });

    // now we can listen to further notifications, if any
    return gate.subscribe(() => {
      setState({ ...gate.flags, ...gate.user });
    }, observerName);

    //
  }, [gate, observerName]);

  return state;
};
