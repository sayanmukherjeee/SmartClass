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
    return localStorage.getItem('access_token') !== null;
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
    }
    if (tokens.refresh) {
      localStorage.setItem('refresh_token', tokens.refresh);
    }
  },

  clearTokens: (): void => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  },

  getLegacyToken: (): string | null => {
    return localStorage.getItem('token');
  },

  setLegacyToken: (token: string): void => {
    localStorage.setItem('token', token);
  },

  clearLegacyToken: (): void => {
    localStorage.removeItem('token');
  }
};

export default authApi;