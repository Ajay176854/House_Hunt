'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from '@/types';
import {
  getMe,
  loginUser,
  registerUser,
  logoutUser,
  removeAuthToken,
  togglePropertyShortlist,
  getAuthToken,
} from '@/services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { name: string; email: string; password: string; phone: string; role?: string }) => Promise<void>;
  logout: () => void;
  savedPropertyIds: string[];
  isSaved: (propertyId: string) => boolean;
  toggleSave: (propertyId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [savedPropertyIds, setSavedPropertyIds] = useState<string[]>([]);

  // Load initial profile if token exists
  useEffect(() => {
    async function loadUser() {
      const storedToken = getAuthToken();
      if (storedToken) {
        try {
          const res = await getMe();
          setUser(res.user);
          setSavedPropertyIds(res.user.savedProperties || []);
          setToken(storedToken);
        } catch (err) {
          console.warn('Session expired or invalid, logging out', err);
          removeAuthToken();
          setUser(null);
          setToken(null);
        }
      }
      setIsLoading(false);
    }
    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await loginUser(email, password);
      setUser(res.user);
      setToken(res.token || res.accessToken);
      setSavedPropertyIds(res.user.savedProperties || []);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: { name: string; email: string; password: string; phone: string; role?: string }) => {
    setIsLoading(true);
    try {
      const res = await registerUser(data);
      setUser(res.user);
      setToken(res.token || res.accessToken);
      setSavedPropertyIds(res.user.savedProperties || []);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    logoutUser();
    setUser(null);
    setToken(null);
    setSavedPropertyIds([]);
  };

  const isSaved = useCallback(
    (propertyId: string) => {
      return Array.isArray(savedPropertyIds) && savedPropertyIds.includes(propertyId);
    },
    [savedPropertyIds]
  );

  const toggleSave = async (propertyId: string) => {
    if (!user) {
      // Local fallback for guest
      setSavedPropertyIds((prev) =>
        prev.includes(propertyId) ? prev.filter((id) => id !== propertyId) : [...prev, propertyId]
      );
      return;
    }

    try {
      const res = await togglePropertyShortlist(propertyId);
      const newSavedProperties = res.savedProperties || [];
      setSavedPropertyIds(newSavedProperties);
      setUser((prev) => (prev ? { ...prev, savedProperties: newSavedProperties } : null));
    } catch (err) {
      console.error('Failed to toggle shortlist', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        savedPropertyIds,
        isSaved,
        toggleSave,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
