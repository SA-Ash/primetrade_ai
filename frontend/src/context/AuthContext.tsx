import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

interface JWTPayload {
  sub: string;
  role: string;
  exp: number;
}

interface AuthContextValue {
  token: string | null;
  user: { email: string; role: string } | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const TOKEN_KEY = 'pt_token';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));

  const user = useMemo(() => {
    if (!token) return null;
    try {
      const payload = jwtDecode<JWTPayload>(token);
      return { email: payload.sub, role: payload.role };
    } catch {
      return null;
    }
  }, [token]);

  const login = (tok: string) => {
    localStorage.setItem(TOKEN_KEY, tok);
    setToken(tok);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
  };

  useEffect(() => {
    if (!token) return;
    try {
      const { exp } = jwtDecode<JWTPayload>(token);
      const now = Date.now() / 1000;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (exp < now) logout();
    } catch {
      logout();
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>{children}</AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
