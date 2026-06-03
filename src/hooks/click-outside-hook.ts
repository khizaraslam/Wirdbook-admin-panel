import { useCallback, useEffect, useRef } from "react";

/**
 * Fires `callback` whenever a mousedown event occurs outside the returned ref element.
 * The callback is stabilised with useCallback internally, so callers can pass inline
 * arrow functions without causing infinite effect re-subscriptions.
 */
const useOutsideClick = <T extends HTMLElement = HTMLElement>(
  callback: () => void,
) => {
  const ref = useRef<T>(null);
  // Stabilise the callback so the effect only re-runs if it genuinely changes.
  const stableCallback = useCallback(callback, [callback]);

  useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        stableCallback();
      }
    };

    document.addEventListener("mousedown", handleMouseDown);
    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, [stableCallback]);

  return ref;
};

export default useOutsideClick;

