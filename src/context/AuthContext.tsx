import { createContext, useContext, useState, type ReactNode } from 'react';
import { api } from '@/api/client';

export interface PlatformAdmin {
  id: string;
  name: string;
  phone: string;
}

interface AuthState {
  admin: PlatformAdmin | null;
  ready: boolean;
  login: (phone: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<PlatformAdmin | null>(() => {
    try {
      const raw = localStorage.getItem('sa_admin');
      return raw ? (JSON.parse(raw) as PlatformAdmin) : null;
    } catch {
      return null;
    }
  });

  async function login(phone: string, password: string) {
    const res = await api.post('/auth/login', { phone, password });
    const { accessToken, admin: who } = res.data.data as { accessToken: string; admin: PlatformAdmin };
    localStorage.setItem('sa_access_token', accessToken);
    localStorage.setItem('sa_admin', JSON.stringify(who));
    setAdmin(who);
  }

  function logout() {
    localStorage.removeItem('sa_access_token');
    localStorage.removeItem('sa_admin');
    setAdmin(null);
  }

  return <AuthContext.Provider value={{ admin, ready: true, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
