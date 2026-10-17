import { useCallback, useRef } from "react";
import { createTurnstile } from "./turnstile";

// Pass `slot` as the ref of an empty <div> inside the form. Works for forms that mount
// later (conditional rendering), because it is a callback ref.
export function useTurnstile() {
  const guard = useRef(null);
  const slot = useCallback((el) => {
    if (guard.current) {
      guard.current.destroy();
      guard.current = null;
    }
    if (el) guard.current = createTurnstile(el);
  }, []);
  const getToken = useCallback(() => (guard.current ? guard.current.token() : Promise.resolve("")), []);
  const reset = useCallback(() => guard.current && guard.current.reset(), []);
  const elapsed = useCallback(() => (guard.current ? guard.current.elapsed() : null), []);
  return { slot, getToken, reset, elapsed };
}
