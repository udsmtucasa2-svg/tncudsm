import { useCallback, useEffect, useState } from 'react';

// const { data, loading, error, reload } = useFetch(api.getLeaders)
// `data` always starts as `initial` ([] by default) so pages can .map() safely even
// when the request fails; show `error` to the user instead of crashing.
export function useFetch(fn, initial = []) {
  const [state, setState] = useState({ data: initial, loading: true, error: null });
  const [tick, setTick] = useState(0);
  const reload = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    let alive = true;
    setState((s) => ({ ...s, loading: true, error: null }));
    fn()
      .then((data) => alive && setState({ data, loading: false, error: null }))
      .catch((err) => alive && setState({ data: initial, loading: false, error: err }));
    return () => { alive = false; };
  }, [tick]); // eslint-disable-line react-hooks/exhaustive-deps

  return { ...state, reload };
}
