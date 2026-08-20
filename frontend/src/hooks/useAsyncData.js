import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Loads data on mount and exposes loading / error / reload.
 *
 * The effect deliberately performs no synchronous `setState`: the initial
 * "loading" value comes from the `useState` initialiser, and every subsequent
 * update happens after an `await`. That is what keeps this off the wrong side
 * of react-hooks/set-state-in-effect, and it avoids the cascading render the
 * rule exists to prevent.
 *
 * @param {() => Promise<any>} fetcher   Called to load the data.
 * @param {Array} deps                   Re-fetch when these change.
 * @returns {{ data: any, error: Error|null, isLoading: boolean, reload: () => void, setData: Function }}
 */
export function useAsyncData(fetcher, deps = []) {
  const [state, setState] = useState({ data: null, error: null, isLoading: true });
  const [attempt, setAttempt] = useState(0);

  // Held in a ref so an inline arrow fetcher does not retrigger the effect on
  // every render.
  const fetcherRef = useRef(fetcher);
  useEffect(() => {
    fetcherRef.current = fetcher;
  });

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const data = await fetcherRef.current();
        if (active) setState({ data, error: null, isLoading: false });
      } catch (error) {
        if (active) setState({ data: null, error, isLoading: false });
      }
    })();

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attempt, ...deps]);

  /** Retry. Called from event handlers, where setting state is expected. */
  const reload = useCallback(() => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    setAttempt((n) => n + 1);
  }, []);

  /** Apply a local update without a round trip (optimistic edits). */
  const setData = useCallback((updater) => {
    setState((prev) => ({
      ...prev,
      data: typeof updater === 'function' ? updater(prev.data) : updater,
    }));
  }, []);

  return { ...state, reload, setData };
}
