import axiosClient from './axiosClient';
import type { ApiResponse } from '../types/index';

const adminApi = {
  // Get admin dashboard stats
  getDashboardStats: (): Promise<ApiResponse<{
    total_courses: number;
    total_enrollments: number;
    total_revenue: number;
    active_users: number;
    recent_activities: Array<{
      id: number;
      user: string;
      action: string;
      timestamp: string;
    }>;
  }>> => {
    return axiosClient.get('/admin/dashboard-stats/');
  },

  // Get system metrics
  getSystemMetrics: (): Promise<ApiResponse<{
    server_uptime: string;
    database_size: string;
    cache_hit_rate: number;
    active_sessions: number;
    error_rate: number;
  }>> => {
    return axiosClient.get('/admin/system-metrics/');
  },

  // Get recent activities
  getRecentActivities: (params?: {
    limit?: number;
    offset?: number;
  }): Promise<ApiResponse<Array<{
    id: number;
    user: {
      id: number;
      username: string;
      email: string;
    };
    action: string;
    details: string;
    timestamp: string;
    ip_address: string;
  }>>> => {
    return axiosClient.get('/admin/recent-activities/', { params });
  },

  // Get user analytics
  getUserAnalytics: (timeRange: 'today' | 'week' | 'month' | 'year' = 'week'): Promise<ApiResponse<{
    labels: string[];
    data: number[];
    growth: number;
  }>> => {
    return axiosClient.get(`/admin/user-analytics/?time_range=${timeRange}`);
  },

  // Get course analytics
  getCourseAnalytics: (): Promise<ApiResponse<{
    popular_courses: Array<{
      id: number;
      title: string;
      enrollments: number;
      rating: number;
      revenue: number;
    }>;
    categories: Array<{
      name: string;
      count: number;
    }>;
  }>> => {
    return axiosClient.get('/admin/course-analytics/');
  },

  // Backup database
  backupDatabase: (): Promise<ApiResponse<{ backup_url: string; message: string }>> => {
    return axiosClient.post('/admin/backup/');
  },

  // Clear cache
  clearCache: (): Promise<ApiResponse<{ message: string }>> => {
    return axiosClient.post('/admin/clear-cache/');
  },
};

export default adminApi;