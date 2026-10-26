import React, {
  createContext, useCallback, useContext, useEffect, useMemo, useState,
} from 'react';
import {
  getAccessToken, putAccessToken, removeAccessToken, login as apiLogin, getUserLogged,
} from '../utils/network-data';

const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // Selama token masih perlu diverifikasi ke server, halaman terproteksi menunggu.
  const [initializing, setInitializing] = useState(() => Boolean(getAccessToken()));
  const [sessionError, setSessionError] = useState(false);

  useEffect(() => {
    if (!getAccessToken()) return undefined;
    let ignore = false;

    (async () => {
      try {
        const { error, data } = await getUserLogged();
        if (ignore) return;
        if (error) {
          // Token ditolak API: hapus agar pengguna login ulang.
          removeAccessToken();
        } else {
          setUser(data);
        }
      } catch (err) {
        // Jaringan terputus: token dipertahankan, sesi dicoba lagi saat dimuat ulang.
        if (!ignore) setSessionError(true);
      } finally {
        if (!ignore) setInitializing(false);
      }
    })();

    return () => { ignore = true; };
  }, []);

  const login = useCallback(async ({ email, password }) => {
    const result = await apiLogin({ email, password });
    if (result.error) return result;

    putAccessToken(result.data.accessToken);
    const me = await getUserLogged();
    if (me.error) {
      removeAccessToken();
      return { error: true, message: null };
    }
    setUser(me.data);
    setSessionError(false);
    return { error: false, user: me.data };
  }, []);

  const logout = useCallback(() => {
    removeAccessToken();
    setUser(null);
  }, []);

  const value = useMemo(() => ({
    user, initializing, sessionError, login, logout,
  }), [user, initializing, sessionError, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth harus dipakai di dalam AuthProvider');
  return context;
}

export { AuthProvider, useAuth };
