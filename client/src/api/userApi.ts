import axiosClient from './axiosClient';
import type { User, ApiResponse } from '../types/index';

const userApi = {
  // Get user profile
  getUserProfile: (userId: number): Promise<ApiResponse<User>> => {
    return axiosClient.get(`/users/${userId}/`);
  },

  // Update user profile
  updateUserProfile: (userId: number, userData: Partial<User>): Promise<ApiResponse<User>> => {
    return axiosClient.put(`/users/${userId}/`, userData);
  },

  // Get all users (admin only)
  getAllUsers: (params?: {
    page?: number;
    page_size?: number;
    search?: string;
    is_admin?: boolean;
  }): Promise<ApiResponse<{ count: number; next: string | null; previous: string | null; results: User[] }>> => {
    return axiosClient.get('/users/', { params });
  },

  // Create user (admin only)
  createUser: (userData: Partial<User>): Promise<ApiResponse<User>> => {
    return axiosClient.post('/users/', userData);
  },

  // Delete user (admin only)
  deleteUser: (userId: number): Promise<ApiResponse<{ message: string }>> => {
    return axiosClient.delete(`/users/${userId}/`);
  },

  // Change user status (admin only)
  changeUserStatus: (userId: number, isActive: boolean): Promise<ApiResponse<User>> => {
    return axiosClient.patch(`/users/${userId}/status/`, { is_active: isActive });
  },

  // Get user statistics (admin only)
  getUserStatistics: (): Promise<ApiResponse<{
    total_users: number;
    active_users: number;
    new_users_today: number;
    admin_users: number;
    users_by_department: Record<string, number>;
  }>> => {
    return axiosClient.get('/users/statistics/');
  },

  // Upload profile picture
  uploadProfilePicture: (userId: number, file: File): Promise<ApiResponse<{ profile_picture: string }>> => {
    const formData = new FormData();
    formData.append('profile_picture', file);
    return axiosClient.post(`/users/${userId}/upload-profile/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Change password
  changePassword: (userId: number, currentPassword: string, newPassword: string): Promise<ApiResponse<{ message: string }>> => {
    return axiosClient.post(`/users/${userId}/change-password/`, {
      current_password: currentPassword,
      new_password: newPassword,
    });
  },
};

export default userApi;