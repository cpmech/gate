import { useState, useEffect } from 'react';
import { GateStore } from 'service';

export const useObserver = (gate: GateStore, observerName: string) => {
  const [state, setState] = useState({
    error: '',
    configured: false,
    processing: false,
    hasAccess: false,
  });

  useEffect(() => {
    return gate.subscribe(() => {
      setState({
        error: gate.error,
        configured: gate.configured,
        processing: gate.processing,
        hasAccess: gate.state.hasAccess,
      });
    }, observerName);
  }, [gate]);

  return state;
};
