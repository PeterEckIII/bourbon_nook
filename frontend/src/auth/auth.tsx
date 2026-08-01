import React, { createContext, useContext, useState, useEffect } from 'react';
import { router } from '../main';
import { customUsersInstance } from '../api/axios-instance';
import type { UserResponseModel } from '../api/generated/users-api';

interface User {
  id: string;
  username: string;
  email: string;
  roles: string[];
}

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    username: string,
    password: string,
  ) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let ignore = false;

    (async () => {
      setIsLoading(true);
      try {
        const userData = await customUsersInstance<UserResponseModel>({
          url: '/auth/me',
          method: 'GET',
        });

        if (!ignore) {
          setUser({
            id: userData.userId,
            email: userData.email,
            username: userData.username,
            roles: userData.roles,
          });
          setIsAuthenticated(true);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      ignore = true;
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const userData = await customUsersInstance<UserResponseModel>({
        url: '/auth/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        data: { email, password },
      });

      setUser({
        id: userData.userId,
        email: userData.email,
        username: userData.username,
        roles: userData.roles,
      });

      setIsAuthenticated(true);
    } catch (error) {
      throw new Error(`Authentication failed: ${error}`);
    }
  };

  const register = async (
    email: string,
    username: string,
    password: string,
  ) => {
    try {
      const userData = await customUsersInstance<UserResponseModel>({
        url: '/auth/register',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        data: { email, username, password },
      });

      setUser({
        id: userData.userId,
        email: userData.email,
        username: userData.username,
        roles: userData.roles,
      });
      setIsAuthenticated(true);
    } catch (error) {
      throw new Error(`Registration failed. Please try again. -- ${error}`);
    }
  };

  const logout = async () => {
    await customUsersInstance({
      url: '/auth/logout',
      method: 'POST',
    });
    setUser(null);
    setIsAuthenticated(false);
    router.navigate({ to: '/login', search: { redirect: '/' } });
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isLoading, user, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
