import { useState, useEffect } from 'react';
import { GateStore, LocalGateStore } from '../service';

export const useGateObserver = (gate: GateStore | LocalGateStore, observerName: string) => {
  const [state, setState] = useState({
    // flags
    error: '',
    needToConfirm: false,
    resetPasswordStep2: false,
    ready: false,
    processing: false,
    doneSendCode: false,
    doneResetPassword: false,
    // user
    hasAccess: false,
    email: '',
    username: '',
    idToken: '',
  });

  useEffect(() => {
    return gate.subscribe(() => {
      setState({
        // flags
        error: gate.flags.error,
        needToConfirm: gate.flags.needToConfirm,
        resetPasswordStep2: gate.flags.resetPasswordStep2,
        ready: gate.flags.ready,
        processing: gate.flags.processing,
        doneSendCode: gate.flags.doneSendCode,
        doneResetPassword: gate.flags.doneResetPassword,
        // user
        hasAccess: gate.user.hasAccess,
        email: gate.user.email,
        username: gate.user.username,
        idToken: gate.user.idToken,
      });
    }, observerName);
  }, [gate, observerName]);

  return state;
};
