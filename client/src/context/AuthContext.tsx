// frontend/src/context/AuthContext.tsx
import React, { createContext, useState, useEffect, useContext, ReactNode, useCallback } from 'react';
import authApi from '../api/authApi';
import type { User, AuthContextType, LoginCredentials, RegisterData } from '../types/index';

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [tokens, setTokensState] = useState<{ access: string | null; refresh: string | null }>({
    access: null,
    refresh: null
  });

  // Combined initialization and authentication check
  useEffect(() => {
    const initializeAndCheckAuth = async () => {
      // Step 1: Initialize from localStorage
      const access = localStorage.getItem('access_token');
      const refresh = localStorage.getItem('refresh_token');
      const storedUser = localStorage.getItem('user');
      
      const legacyToken = localStorage.getItem('token');
      if (legacyToken && !access) {
        localStorage.removeItem('token');
      }
      
      setTokensState({ access, refresh });
      
      // If no access token or stored user, stop here
      if (!access || !storedUser) {
        setLoading(false);
        return;
      }
      
      // Step 2: Try to parse stored user
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (e) {
        localStorage.removeItem('user');
        setLoading(false);
        return;
      }
      
      // Step 3: Validate token and get fresh user data
      try {
        const response = await authApi.getProfile();
        const updatedUser = response.data;
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      } catch (err: any) {
        // Token invalid, try refresh
        if (refresh) {
          try {
            const refreshResponse = await authApi.refreshToken(refresh);
            const { access: newAccess, refresh: newRefresh } = refreshResponse.data;
            
            localStorage.setItem('access_token', newAccess);
            if (newRefresh) {
              localStorage.setItem('refresh_token', newRefresh);
            }
            
            const profileResponse = await authApi.getProfile();
            const updatedUser = profileResponse.data;
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setTokensState({ access: newAccess, refresh: newRefresh || refresh });
          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError);
            authApi.clearTokens();
            setUser(null);
            setTokensState({ access: null, refresh: null });
          }
        } else {
          authApi.clearTokens();
          setUser(null);
          setTokensState({ access: null, refresh: null });
        }
      } finally {
        setLoading(false);
      }
    };

    initializeAndCheckAuth();
  }, []);

  const login = useCallback(async (credentials: LoginCredentials): Promise<{ success: boolean; user?: User; error?: string }> => {
    setError(null);
    try {
      const response = await authApi.login(credentials);
      
      if (response.data) {
        const { access, refresh, user: userData } = response.data;
        
        authApi.setTokens({ access, refresh });
        setTokensState({ access, refresh });
        
        authApi.clearLegacyToken();
        
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        
        return { success: true, user: userData };
      }
      return { success: false, error: 'No data received' };
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 
                          err.response?.data?.error || 
                          Object.values(err.response?.data || {}).flat().join(', ') ||
                          'Login failed. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  const adminLogin = useCallback(async (credentials: LoginCredentials): Promise<{ success: boolean; user?: User; error?: string }> => {
    setError(null);
    try {
      const response = await authApi.adminLogin(credentials);
      
      if (response.data) {
        const { access, refresh, user: userData } = response.data;
        
        if (!userData.is_admin) {
          setError('Access denied. Admin privileges required.');
          authApi.clearTokens();
          return { success: false, error: 'Access denied. Admin privileges required.' };
        }
        
        authApi.setTokens({ access, refresh });
        setTokensState({ access, refresh });
        
        authApi.clearLegacyToken();
        
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        
        return { success: true, user: userData };
      }
      return { success: false, error: 'No data received' };
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 
                          err.response?.data?.error || 
                          Object.values(err.response?.data || {}).flat().join(', ') ||
                          'Admin login failed. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  const register = useCallback(async (userData: RegisterData): Promise<{ success: boolean; user?: User; error?: string }> => {
    setError(null);
    try {
      const response = await authApi.register(userData);
      
      if (response.data) {
        const { access, refresh, user: userData } = response.data;
        
        authApi.setTokens({ access, refresh });
        setTokensState({ access, refresh });
        
        authApi.clearLegacyToken();
        
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        
        return { success: true, user: userData };
      }
      return { success: false, error: 'No data received' };
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 
                          err.response?.data?.error || 
                          Object.values(err.response?.data || {}).flat().join(', ') ||
                          'Registration failed. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  const adminRegister = useCallback(async (adminData: RegisterData): Promise<{ success: boolean; user?: User; error?: string }> => {
    setError(null);
    try {
      const response = await authApi.adminRegister(adminData);
      
      if (response.data) {
        const { access, refresh, user: userData } = response.data;
        
        authApi.setTokens({ access, refresh });
        setTokensState({ access, refresh });
        
        authApi.clearLegacyToken();
        
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        
        return { success: true, user: userData };
      }
      return { success: false, error: 'No data received' };
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 
                          err.response?.data?.error || 
                          Object.values(err.response?.data || {}).flat().join(', ') ||
                          'Admin registration failed. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    const refreshToken = localStorage.getItem('refresh_token');
    
    try {
      if (refreshToken) {
        await authApi.logout(refreshToken);
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      authApi.clearTokens();
      authApi.clearLegacyToken();
      setUser(null);
      setTokensState({ access: null, refresh: null });
    }
  }, []);

  const logoutAll = useCallback(async (): Promise<void> => {
    try {
      await authApi.logoutAll();
    } catch (err) {
      console.error('Logout all error:', err);
    } finally {
      authApi.clearTokens();
      authApi.clearLegacyToken();
      setUser(null);
      setTokensState({ access: null, refresh: null });
    }
  }, []);

  const refreshTokens = useCallback(async (): Promise<boolean> => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) return false;
    
    try {
      const response = await authApi.refreshToken(refreshToken);
      const { access, refresh } = response.data;
      
      authApi.setTokens({ access, refresh });
      setTokensState({ access, refresh });
      return true;
    } catch (err) {
      console.error('Token refresh failed:', err);
      return false;
    }
  }, []);

  const value: AuthContextType = {
    user,
    loading,
    error,
    tokens,
    login,
    register,
    adminLogin,
    adminRegister,
    logout,
    logoutAll,
    refreshTokens,
    isAuthenticated: !!user && !!tokens.access,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};