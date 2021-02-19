import { useRef, useCallback } from 'react';

export const useCallbackRef = <T>(
  onMount: (obj: T) => void,
  onUnmount: (obj: T) => void,
  deps: React.DependencyList,
) => {
  const ref = useRef<T | null>(null);

  const setRef = useCallback((node) => {
    if (ref.current) {
      onUnmount(ref.current);
    }

    ref.current = node;

    if (ref.current) {
      onMount(ref.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return setRef;
};
