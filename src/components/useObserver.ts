import { useState, useEffect } from 'react';
import { GateStore } from 'service';

export const useObserver = (gate: GateStore) => {
  const [state, setState] = useState({
    configured: false,
    processing: false,
    hasAccess: false,
    // signingIn: false,
    // signedIn: false,
    // belongsToGroup: false,
    // email: '',
  });

  useEffect(() => {
    return gate.subscribe(() => {
      setState({
        configured: gate.configured,
        processing: gate.processing,
        hasAccess: gate.state.hasAccess,
        // signingIn: gate.signingIn,
        // signedIn: gate.signedIn,
        // belongsToGroup: gate.belongsToGroup,
        // email: gate.email,
      });
    }, '@cpmech/components/useObserver');
  }, [gate]);

  return state;
};
