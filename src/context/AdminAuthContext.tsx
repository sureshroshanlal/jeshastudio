'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AdminUser } from '@/types';

interface LoginCredentials {
  identifier: string; // Email or username
  password: string;
  rememberMe?: boolean;
}

interface LoginResult {
  success: boolean;
  message?: string;
  user?: AdminUser;
}

interface AdminAuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  currentUser: AdminUser | null;
  login: (credentials: LoginCredentials | string) => Promise<LoginResult>;
  logout: () => void;
  authorizedAccounts: Array<{ username: string; email: string; name: string; role: string }>;
}

const ADMIN_STORAGE_KEY = 'jesha_admin_session_v2';
const LEGACY_STORAGE_KEY = 'jesha_admin_authenticated';

// Pre-configured Admin Staff Accounts
export const AUTHORIZED_ADMIN_USERS: Array<AdminUser & { passwordHash: string }> = [
  {
    id: 'admin-01',
    email: 'admin@jeshastudio.com',
    username: 'admin',
    name: 'Jesha Atelier Master',
    role: 'Master Atelier Admin',
    passwordHash: 'admin123', // Demo authentication
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'admin-02',
    email: 'curator@jeshastudio.com',
    username: 'jesha',
    name: 'Jesha Roshanlal',
    role: 'Master Atelier Admin',
    passwordHash: 'jesha2026',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'admin-03',
    email: 'manager@jeshastudio.com',
    username: 'storemanager',
    name: 'Priya Sharma',
    role: 'Store Manager',
    passwordHash: 'studio2026',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
  },
];

const AdminAuthContext = createContext<AdminAuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  currentUser: null,
  login: async () => ({ success: false, message: 'Not initialized' }),
  logout: () => {},
  authorizedAccounts: [],
});

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Restore session on mount
  useEffect(() => {
    try {
      const savedSession = localStorage.getItem(ADMIN_STORAGE_KEY);
      if (savedSession) {
        const parsed = JSON.parse(savedSession) as AdminUser;
        if (parsed && parsed.id) {
          setCurrentUser(parsed);
          setIsAuthenticated(true);
          setIsLoading(false);
          return;
        }
      }

      // Check legacy session fallback
      const legacyAuth = localStorage.getItem(LEGACY_STORAGE_KEY);
      if (legacyAuth === 'true') {
        const defaultUser: AdminUser = {
          id: AUTHORIZED_ADMIN_USERS[0].id,
          email: AUTHORIZED_ADMIN_USERS[0].email,
          username: AUTHORIZED_ADMIN_USERS[0].username,
          name: AUTHORIZED_ADMIN_USERS[0].name,
          role: AUTHORIZED_ADMIN_USERS[0].role,
          avatar: AUTHORIZED_ADMIN_USERS[0].avatar,
          lastLogin: new Date().toISOString(),
        };
        setCurrentUser(defaultUser);
        setIsAuthenticated(true);
      }
    } catch (e) {
      console.error('Error restoring admin session:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(
    async (input: LoginCredentials | string): Promise<LoginResult> => {
      // Support legacy single string (passcode) or new LoginCredentials object
      let identifier = '';
      let password = '';
      let rememberMe = true;

      if (typeof input === 'string') {
        const trimmed = input.trim();
        // Legacy passcode check
        if (trimmed === 'jesha2026' || trimmed === 'admin' || trimmed === '1234') {
          const matchedUser = AUTHORIZED_ADMIN_USERS[0];
          const userSession: AdminUser = {
            id: matchedUser.id,
            email: matchedUser.email,
            username: matchedUser.username,
            name: matchedUser.name,
            role: matchedUser.role,
            avatar: matchedUser.avatar,
            lastLogin: new Date().toISOString(),
          };
          setCurrentUser(userSession);
          setIsAuthenticated(true);
          try {
            localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(userSession));
            localStorage.setItem(LEGACY_STORAGE_KEY, 'true');
          } catch (e) {
            console.error('Failed to save session:', e);
          }
          return { success: true, user: userSession };
        }
        return { success: false, message: 'Invalid passcode entered.' };
      }

      identifier = input.identifier.trim().toLowerCase();
      password = input.password.trim();
      rememberMe = input.rememberMe ?? true;

      if (!identifier || !password) {
        return { success: false, message: 'Please provide both an Email/Username and Password.' };
      }

      // Match against authorized accounts or universal admin bypass for demo
      const matched = AUTHORIZED_ADMIN_USERS.find(
        (u) =>
          (u.email.toLowerCase() === identifier || u.username.toLowerCase() === identifier) &&
          (u.passwordHash === password || password === 'jesha2026' || password === 'admin123')
      );

      // Also allow quick admin / 1234 or demo credentials
      if (matched) {
        const userSession: AdminUser = {
          id: matched.id,
          email: matched.email,
          username: matched.username,
          name: matched.name,
          role: matched.role,
          avatar: matched.avatar,
          lastLogin: new Date().toISOString(),
        };

        setCurrentUser(userSession);
        setIsAuthenticated(true);

        if (rememberMe) {
          try {
            localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(userSession));
            localStorage.setItem(LEGACY_STORAGE_KEY, 'true');
          } catch (e) {
            console.error('Failed to save session:', e);
          }
        }

        return { success: true, user: userSession };
      }

      return {
        success: false,
        message: 'Invalid credentials. Please verify your email/username and password.',
      };
    },
    []
  );

  const logout = useCallback(() => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    try {
      localStorage.removeItem(ADMIN_STORAGE_KEY);
      localStorage.removeItem(LEGACY_STORAGE_KEY);
    } catch (e) {
      console.error('Failed to clear admin session:', e);
    }
  }, []);

  const authorizedAccounts = AUTHORIZED_ADMIN_USERS.map(({ username, email, name, role }) => ({
    username,
    email,
    name,
    role,
  }));

  return (
    <AdminAuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        currentUser,
        login,
        logout,
        authorizedAccounts,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}
