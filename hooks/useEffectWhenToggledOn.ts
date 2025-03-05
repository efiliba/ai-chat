import { useEffect, useRef } from "react";

export const useEffectWhenToggledOn = (
  effect: React.EffectCallback,
  value?: boolean
) => {
  const toggled = useRef(false);

  useEffect(() => {
    if (!toggled.current && !value) {
      toggled.current = true;
    }
    if (toggled.current && value) {
      toggled.current = false;
      return effect();
    }
  }, [value, effect]);
};
