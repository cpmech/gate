import { useState, useEffect } from 'react';
import { GateStore } from 'service';

export const useObserver = (gate: GateStore) => {
  const [state, setState] = useState({
    loading: true,
    signedIn: false,
    belongsToGroup: false,
  });

  useEffect(() => {
    setState({
      loading: gate.loading,
      signedIn: gate.signedIn,
      belongsToGroup: gate.belongsToGroup,
    });
    return gate.subscribe(() => {
      setState({
        loading: gate.loading,
        signedIn: gate.signedIn,
        belongsToGroup: gate.belongsToGroup,
      });
    }, '@cpmech/components/useObserver');
  }, [gate]);

  return state;
};
