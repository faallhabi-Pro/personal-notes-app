import { useCallback, useEffect, useState } from 'react';
import { getUserLogged } from '../utils/network-data';
import { useAuth } from '../contexts/AuthContext';

// Memuat data dari fungsi API `fetcher` (harus stabil: fungsi modul atau useCallback).
// error: null | 'failed' (API menolak) | 'network' (jaringan bermasalah).
function useAsyncData(fetcher) {
  const { logout } = useAuth();
  const [state, setState] = useState({ data: null, loading: true, error: null });
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let ignore = false;
    setState((prev) => ({ ...prev, loading: true, error: null }));

    (async () => {
      try {
        const result = await fetcher();
        if (ignore) return;
        if (!result.error) {
          setState({ data: result.data, loading: false, error: null });
          return;
        }
        // Gagal: periksa apakah penyebabnya sesi yang tidak valid lagi.
        const session = await getUserLogged();
        if (ignore) return;
        if (session.error) {
          logout();
          return;
        }
        setState({ data: null, loading: false, error: 'failed' });
      } catch (err) {
        if (!ignore) setState({ data: null, loading: false, error: 'network' });
      }
    })();

    return () => { ignore = true; };
  }, [fetcher, reloadKey, logout]);

  const reload = useCallback(() => setReloadKey((key) => key + 1), []);

  return { ...state, reload };
}

export default useAsyncData;
