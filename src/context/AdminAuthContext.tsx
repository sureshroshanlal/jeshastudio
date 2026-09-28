'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface AdminAuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (pinOrPass: string) => boolean;
  logout: () => void;
}

const ADMIN_STORAGE_KEY = 'jesha_admin_authenticated';
const DEFAULT_ADMIN_PASSCODE = 'jesha2026';
const DEFAULT_ADMIN_PASSWORD = 'admin';

const AdminAuthContext = createContext<AdminAuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  login: () => false,
  logout: () => {},
});

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    try {
      const savedAuth = localStorage.getItem(ADMIN_STORAGE_KEY);
      if (savedAuth === 'true') {
        setIsAuthenticated(true);
      }
    } catch (e) {
      console.error('Error checking auth state:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (input: string): boolean => {
    const trimmed = input.trim();
    if (trimmed === DEFAULT_ADMIN_PASSCODE || trimmed === DEFAULT_ADMIN_PASSWORD || trimmed === '1234') {
      setIsAuthenticated(true);
      try {
        localStorage.setItem(ADMIN_STORAGE_KEY, 'true');
      } catch (e) {
        console.error('Error saving auth token:', e);
      }
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    try {
      localStorage.removeItem(ADMIN_STORAGE_KEY);
    } catch (e) {
      console.error('Error clearing auth token:', e);
    }
  };

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}
