import { useEffect, useRef } from "react";

export const useNonConstructorEffect = (
  effect: React.EffectCallback,
  deps?: React.DependencyList
) => {
  const mounted = useRef(false);

  useEffect(() => {
    if (mounted.current) {
      return effect();
    }

    mounted.current = true;
  }, deps);
};
