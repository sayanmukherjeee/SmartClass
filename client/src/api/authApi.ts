import axiosClient from './axiosClient';
import type { LoginCredentials, RegisterData, User, AuthTokens, ApiResponse } from '../types/index';

const authApi = {
  register: (userData: RegisterData): Promise<ApiResponse<{ access: string; refresh: string; user: User }>> => {
    return axiosClient.post('/auth/register/', userData);
  },

  adminRegister: (adminData: RegisterData): Promise<ApiResponse<{ access: string; refresh: string; user: User }>> => {
    return axiosClient.post('/auth/admin/register/', adminData);
  },

  login: (credentials: LoginCredentials): Promise<ApiResponse<{ access: string; refresh: string; user: User }>> => {
    return axiosClient.post('/auth/login/', credentials);
  },

  adminLogin: (credentials: LoginCredentials): Promise<ApiResponse<{ access: string; refresh: string; user: User }>> => {
    return axiosClient.post('/auth/admin/login/', credentials);
  },

  refreshToken: (refreshToken: string): Promise<ApiResponse<AuthTokens>> => {
    return axiosClient.post('/auth/token/refresh/', { refresh: refreshToken });
  },

  verifyToken: (token: string): Promise<ApiResponse<{ valid: boolean; user_id?: number }>> => {
    return axiosClient.post('/auth/token/verify/', { token });
  },

  logout: (refreshToken: string): Promise<ApiResponse<{ message: string }>> => {
    return axiosClient.post('/auth/logout/', { refresh: refreshToken });
  },

  logoutAll: (): Promise<ApiResponse<{ message: string }>> => {
    return axiosClient.post('/auth/logout/all/');
  },

  getProfile: (): Promise<ApiResponse<User>> => {
    return axiosClient.get('/auth/profile/');
  },

  updateProfile: (userData: Partial<User>): Promise<ApiResponse<User>> => {
    return axiosClient.put('/auth/profile/', userData);
  },

  isAuthenticated: (): boolean => {
    const token = localStorage.getItem('access_token');
    if (!token) return false;
    
    // Check token expiration (optional)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  },

  getTokens: (): { access: string | null; refresh: string | null } => {
    return {
      access: localStorage.getItem('access_token'),
      refresh: localStorage.getItem('refresh_token')
    };
  },

  setTokens: (tokens: { access?: string; refresh?: string }): void => {
    if (tokens.access) {
      localStorage.setItem('access_token', tokens.access);
      // Store token expiration time
      try {
        const payload = JSON.parse(atob(tokens.access.split('.')[1]));
        localStorage.setItem('token_expires', payload.exp.toString());
      } catch (e) {
        console.warn('Could not parse token payload');
      }
    }
    if (tokens.refresh) {
      localStorage.setItem('refresh_token', tokens.refresh);
    }
  },

  clearTokens: (): void => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    localStorage.removeItem('token_expires');
  },

  // For development logging
  debugInfo: () => {
    if (!import.meta.env.PROD) {
      console.log('API Base URL:', axiosClient.defaults.baseURL);
      console.log('Environment:', import.meta.env.MODE);
      console.log('Has token:', !!localStorage.getItem('access_token'));
    }
  }
};

export default authApi;