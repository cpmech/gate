import { useState, useEffect } from 'react';
import { GateStore } from 'service';

export const useObserver = (gate: GateStore, observerName: string) => {
  const [state, setState] = useState({
    // flags
    error: '',
    needToConfirm: false,
    needNewPassword: true,
    ready: false,
    processing: false,
    // user
    email: '',
    hasAccess: false,
  });

  useEffect(() => {
    return gate.subscribe(() => {
      setState({
        // flags
        error: gate.flags.error,
        needToConfirm: gate.flags.needToConfirm,
        needNewPassword: gate.flags.needNewPassword,
        ready: gate.flags.ready,
        processing: gate.flags.processing,
        // user
        hasAccess: gate.user.hasAccess,
        email: gate.user.email,
      });
    }, observerName);
  }, [gate, observerName]);

  return state;
};
