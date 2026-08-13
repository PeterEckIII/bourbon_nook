import React, { useState, useEffect } from 'react';
import { router } from '../router';
import { customUsersInstance } from '../api/axios-instance';
import type { UserResponseModel } from '../api/generated/users-api';
import {
  type ChangePasswordCredentials,
  type LoginCredentials,
  type RegisterCredentials,
  type User,
} from './types';
import { AuthContext } from './context';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const hasRole = (role: string) => user?.roles.includes(role) ?? false;
  const hasAnyRole = (roles: string[]) => roles.some((role) => user?.roles.includes(role)) ?? false;

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

  const login = async (credentials: LoginCredentials) => {
    const userData = await customUsersInstance<UserResponseModel>({
      url: '/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      data: {
        email: credentials.email,
        password: credentials.password,
      },
    });

    setUser({
      id: userData.userId,
      email: userData.email,
      username: userData.username,
      roles: userData.roles,
    });

    setIsAuthenticated(true);
  };

  const register = async (credentials: RegisterCredentials) => {
    try {
      const userData = await customUsersInstance<UserResponseModel>({
        url: '/auth/register',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        data: {
          email: credentials.email,
          username: credentials.username,
          password: credentials.password,
        },
      });

      setUser({
        id: userData.userId,
        email: userData.email,
        username: userData.username,
        roles: userData.roles,
      });
      setIsAuthenticated(true);
    } catch (error) {
      throw new Error(`Registration failed. Please try again. -- ${error}`, {
        cause: error,
      });
    }
  };

  const logout = async () => {
    try {
      await customUsersInstance({
        url: '/auth/logout',
        method: 'POST',
      });
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.log(`Error logging out: ${error}`);
    }
    router.navigate({ to: '/login', search: { redirect: '/' } });
  };

  const changePassword = async (credentials: ChangePasswordCredentials) => {
    try {
      await customUsersInstance<void>({
        url: '/change-password',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          oldPassword: credentials.oldPassword,
          newPassword: credentials.newPassword,
          confirmPassword: credentials.confirmPassword,
        },
      });
    } catch (error) {
      throw new Error(`Error changing your password: ${error}`, {
        cause: error,
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        hasRole,
        hasAnyRole,
        login,
        register,
        logout,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
