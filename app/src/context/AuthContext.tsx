/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User } from '@/types';
import {
  apiLogin,
  apiRegister,
  apiVerifyEmail,
  apiGetMe,
  apiUpdateProfile,
  setToken,
  getToken,
  removeToken,
} from '@/lib/api';

interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: 'customer' | 'organizer';
}

interface RegisterResult {
  requiresVerification: true;
  email: string;
  message: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string, role: string) => Promise<void>;
  register: (data: RegisterData) => Promise<RegisterResult>;
  verifyEmail: (token: string) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<User>) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const toUser = (apiUser: { id: string; name: string; email: string; phone: string; role: string; avatar: string }): User => ({
  id: apiUser.id,
  name: apiUser.name,
  email: apiUser.email,
  phone: apiUser.phone || '',
  role: apiUser.role as User['role'],
  avatar: apiUser.avatar || '',
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ─── Restore session on app start ──────────────────────────────────────────
  useEffect(() => {
    const restoreSession = async () => {
      const token = getToken();
      if (!token) { setIsLoading(false); return; }
      try {
        const profile = await apiGetMe();
        setUser(toUser(profile));
      } catch {
        removeToken();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    restoreSession();
  }, []);

  // ─── Login ──────────────────────────────────────────────────────────────────
  const login = async (email: string, password: string, role: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiLogin({ email, password, role });
      setToken(response.token);
      setUser(toUser(response.user));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed. Please try again.';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Register ── returns verification info, NOT a JWT ──────────────────────
  const register = async (data: RegisterData): Promise<RegisterResult> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiRegister(data);
      // Registration now always returns requiresVerification: true
      // No token is issued until email is verified
      return {
        requiresVerification: true,
        email: response.email,
        message: response.message,
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Registration failed. Please try again.';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Verify email (called from /verify-email page) ─────────────────────────
  const verifyEmail = async (token: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiVerifyEmail(token);
      setToken(response.token);
      setUser(toUser(response.user));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Verification failed.';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Logout ─────────────────────────────────────────────────────────────────
  const logout = () => {
    removeToken();
    setUser(null);
    setError(null);
  };

  // ─── Update profile ─────────────────────────────────────────────────────────
  const updateUser = async (data: Partial<User>) => {
    if (!user) return;
    setError(null);
    try {
      const updated = await apiUpdateProfile({
        name: data.name,
        phone: data.phone,
        avatar: data.avatar,
      });
      setUser(toUser(updated));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Profile update failed.';
      setError(message);
      throw err;
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider value={{ user, isLoading, error, login, register, verifyEmail, logout, updateUser, clearError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
