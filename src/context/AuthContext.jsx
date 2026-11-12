import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../services/api.js';

const AuthContext = createContext(null);

// The frontend never decides who is an admin. The backend verifies credentials and returns
// the user and role; this context only stores what it is told.
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;
    api.me().then((u) => { if (alive) { setUser(u); setReady(true); } });
    return () => { alive = false; };
  }, []);

  const login = useCallback(async (c) => { const u = await api.login(c); setUser(u); return u; }, []);
  const register = useCallback(async (d) => { const u = await api.register(d); setUser(u); return u; }, []);
  const logout = useCallback(async () => { await api.logout(); setUser(null); }, []);

  const value = useMemo(() => ({ user, ready, isAdmin: user?.role === 'admin', login, register, logout }), [user, ready, login, register, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
