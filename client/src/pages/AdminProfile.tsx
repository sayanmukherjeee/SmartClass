import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';
import {
  User,
  Mail,
  Phone,
  Building2,
  CalendarDays,
  Pencil,
  Check,
  X,
  Lock,
  ShieldCheck,
  Clock,
  GraduationCap,
  BarChart3,
  Bell,
  Image as ImageIcon,
  RefreshCw,
  Trash2,
  Eye,
  EyeOff,
  Search,
  Filter,
  Upload,
  Server,
  Cpu,
  Users,
  DollarSign,
  BookOpen,
  AlertCircle,
  CheckCircle2,
  Archive,
  Settings,
  LogOut,
  ChevronsUpDown,
} from 'lucide-react';

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_admin: boolean;
  is_active: boolean;
  date_joined: string;
  last_login?: string;
}

interface Activity {
  id: number;
  user: { username: string; email: string };
  action: string;
  details: string;
  timestamp: string;
  ip_address: string;
}

interface DashboardStats {
  total_courses: number;
  total_enrollments: number;
  total_revenue: number;
  active_users: number;
}

interface SystemMetrics {
  server_uptime: string;
  database_size: string;
  cache_hit_rate: number;
  active_sessions: number;
  error_rate: number;
}

const AdminProfile: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error' | 'info';
  }>({ show: false, message: '', type: 'success' });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [userFilter, setUserFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    department: '',
  });

  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    total_courses: 0,
    total_enrollments: 0,
    total_revenue: 0,
    active_users: 0,
  });

  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>({
    server_uptime: '0 days',
    database_size: '0 MB',
    cache_hit_rate: 0,
    active_sessions: 0,
    error_rate: 0,
  });

  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      username: 'john_doe',
      email: 'john@example.com',
      first_name: 'John',
      last_name: 'Doe',
      is_admin: false,
      is_active: true,
      date_joined: '2024-01-01T10:00:00Z',
    },
    {
      id: 2,
      username: 'jane_smith',
      email: 'jane@example.com',
      first_name: 'Jane',
      last_name: 'Smith',
      is_admin: true,
      is_active: true,
      date_joined: '2024-01-02T11:00:00Z',
    },
    {
      id: 3,
      username: 'bob_wilson',
      email: 'bob@example.com',
      first_name: 'Bob',
      last_name: 'Wilson',
      is_admin: false,
      is_active: false,
      date_joined: '2024-01-03T12:00:00Z',
    },
  ]);

  const [activities, setActivities] = useState<Activity[]>([
    {
      id: 1,
      user: { username: 'john_doe', email: 'john@example.com' },
      action: 'USER_CREATED',
      details: 'Created new user account',
      timestamp: '2024-01-15T10:30:00Z',
      ip_address: '192.168.1.100',
    },
    {
      id: 2,
      user: { username: 'system', email: 'system@admin.com' },
      action: 'COURSE_PUBLISHED',
      details: 'Published React Advanced Course',
      timestamp: '2024-01-14T14:20:00Z',
      ip_address: '192.168.1.1',
    },
    {
      id: 3,
      user: { username: 'jane_smith', email: 'jane@example.com' },
      action: 'SETTINGS_UPDATED',
      details: 'Updated system configuration',
      timestamp: '2024-01-13T09:15:00Z',
      ip_address: '192.168.1.150',
    },
  ]);

  const [userAnalytics, setUserAnalytics] = useState({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    data: [120, 190, 300, 500, 700, 900],
    growth: 42,
  });

  const [systemSettings, setSystemSettings] = useState({
    forcePasswordReset: false,
    twoFactorAuth: true,
    ipWhitelisting: false,
    maintenanceMode: false,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
        department: user.department || '',
      });
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockStats: DashboardStats = {
        total_courses: 48,
        total_enrollments: 1256,
        total_revenue: 89250,
        active_users: 342,
      };
      setDashboardStats(mockStats);

      const mockMetrics: SystemMetrics = {
        server_uptime: '15 days',
        database_size: '2.4 GB',
        cache_hit_rate: 92,
        active_sessions: 156,
        error_rate: 0.2,
      };
      setSystemMetrics(mockMetrics);
    } catch (error) {
      showNotification('Failed to load dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 5000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    if (!formData.first_name || !formData.last_name || !formData.email) {
      showNotification('Please fill in all required fields', 'error');
      return;
    }

    try {
      setLoading(true);
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      showNotification('Profile updated successfully!', 'success');
      setEditMode(false);
    } catch (error) {
      showNotification('Failed to update profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUserStatusChange = async (userId: number, isActive: boolean) => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setUsers(prev => prev.map(u => 
        u.id === userId ? { ...u, is_active: isActive } : u
      ));
      
      showNotification(
        `User ${isActive ? 'activated' : 'deactivated'} successfully`,
        'success'
      );
    } catch (error) {
      showNotification('Failed to update user status', 'error');
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setUsers(prev => prev.filter(u => u.id !== userId));
        showNotification('User deleted successfully', 'success');
      } catch (error) {
        showNotification('Failed to delete user', 'error');
      }
    }
  };

  const handleBackupDatabase = async () => {
    try {
      setLoading(true);
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      showNotification('Database backup initiated successfully', 'success');
    } catch (error) {
      showNotification('Failed to backup database', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleClearCache = async () => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      showNotification('Cache cleared successfully', 'success');
    } catch (error) {
      showNotification('Failed to clear cache', 'error');
    }
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showNotification('Please select an image file', 'error');
      return;
    }

    try {
      setUploading(true);
      // Mock upload
      await new Promise(resolve => setTimeout(resolve, 1500));
      showNotification('Profile picture updated successfully!', 'success');
    } catch (error) {
      showNotification('Failed to upload profile picture', 'error');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const toggleSystemSetting = (key: keyof typeof systemSettings) => {
    setSystemSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
    } catch {
      return dateString;
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (userFilter === 'admins') return matchesSearch && user.is_admin;
    if (userFilter === 'users') return matchesSearch && !user.is_admin;
    if (userFilter === 'active') return matchesSearch && user.is_active;
    if (userFilter === 'inactive') return matchesSearch && !user.is_active;
    
    return matchesSearch;
  });

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin profile...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'profile', label: 'Admin Profile', icon: User },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'activities', label: 'Activities', icon: Clock },
    { id: 'settings', label: 'System Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 max-w-sm w-full ${
          notification.type === 'success' ? 'bg-green-50 border-green-200' :
          notification.type === 'error' ? 'bg-red-50 border-red-200' :
          'bg-blue-50 border-blue-200'
        } border rounded-lg shadow-lg p-4 transition-all duration-300`}>
          <div className="flex items-start">
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
            ) : notification.type === 'error' ? (
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            ) : null}
            <div className="ml-3 flex-1">
              <p className={`text-sm font-medium ${
                notification.type === 'success' ? 'text-green-800' :
                notification.type === 'error' ? 'text-red-800' :
                'text-blue-800'
              }`}>
                {notification.message}
              </p>
            </div>
            <button
              onClick={() => setNotification(prev => ({ ...prev, show: false }))}
              className="ml-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Admin Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-6">
            {/* Profile Picture */}
            <div className="relative">
              <div className="relative">
                <img
                  src={user.profile_picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(`${user.first_name} ${user.last_name}`)}&background=8b5cf6&color=ffffff&size=128`}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                />
                <div className="absolute -bottom-2 -right-2 bg-purple-600 text-white p-2 rounded-full shadow-lg">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="absolute bottom-0 right-8 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  {uploading ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <ImageIcon className="w-5 h-5" />
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-start justify-between">
                <div>
                  <div className="flex items-center space-x-3">
                    <h1 className="text-3xl font-bold text-gray-900">
                      {user.first_name} {user.last_name}
                    </h1>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 border border-purple-200">
                      <ShieldCheck className="w-4 h-4 mr-1" />
                      Administrator
                    </span>
                  </div>
                  <p className="text-gray-600 mt-1">@{user.username} • {user.email}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {user.department && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-700 border border-green-200">
                        <Building2 className="w-4 h-4 mr-1" />
                        {user.department}
                      </span>
                    )}
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700 border border-gray-200">
                      <CalendarDays className="w-4 h-4 mr-1" />
                      Admin since {formatDate(user.date_joined)}
                    </span>
                  </div>
                </div>

                <div className="mt-4 md:mt-0">
                  {editMode ? (
                    <div className="flex space-x-3">
                      <button
                        onClick={handleSaveProfile}
                        disabled={loading}
                        className="inline-flex items-center px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                        ) : (
                          <Check className="w-5 h-5 mr-2" />
                        )}
                        Save Changes
                      </button>
                      <button
                        onClick={() => setEditMode(false)}
                        disabled={loading}
                        className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                      >
                        <X className="w-5 h-5 mr-2" />
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setEditMode(true)}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                    >
                      <Pencil className="w-5 h-5 mr-2" />
                      Edit Profile
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-100">
                <BookOpen className="w-8 h-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Courses</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardStats.total_courses}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-100">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Enrollments</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardStats.total_enrollments.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-yellow-100">
                <DollarSign className="w-8 h-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${dashboardStats.total_revenue.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-purple-100">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardStats.active_users}</p>
              </div>
            </div>
          </div>
        </div>

        {/* System Metrics and Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">System Metrics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center p-3 rounded-lg bg-gray-50">
                <Cpu className="w-6 h-6 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Server Uptime</p>
                  <p className="font-medium text-gray-900">{systemMetrics.server_uptime}</p>
                </div>
              </div>
              <div className="flex items-center p-3 rounded-lg bg-gray-50">
                <Server className="w-6 h-6 text-green-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Database Size</p>
                  <p className="font-medium text-gray-900">{systemMetrics.database_size}</p>
                </div>
              </div>
              <div className="flex items-center p-3 rounded-lg bg-gray-50">
                <BarChart3 className="w-6 h-6 text-yellow-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Cache Hit Rate</p>
                  <p className="font-medium text-gray-900">{systemMetrics.cache_hit_rate}%</p>
                </div>
              </div>
              <div className="flex items-center p-3 rounded-lg bg-gray-50">
                <Users className="w-6 h-6 text-purple-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Active Sessions</p>
                  <p className="font-medium text-gray-900">{systemMetrics.active_sessions}</p>
                </div>
              </div>
            </div>
            <div className="mt-6 flex space-x-3">
              <button
                onClick={handleBackupDatabase}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
              >
                <Upload className="w-5 h-5 mr-2" />
                Backup Database
              </button>
              <button
                onClick={handleClearCache}
                className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                Clear Cache
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">User Growth</h3>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                userAnalytics.growth > 0 
                  ? 'bg-green-100 text-green-800 border border-green-200'
                  : 'bg-red-100 text-red-800 border border-red-200'
              }`}>
                {userAnalytics.growth > 0 ? '+' : ''}{userAnalytics.growth}%
              </span>
            </div>
            <div className="h-64 flex items-end space-x-2">
              {userAnalytics.data.map((value, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all hover:opacity-80"
                    style={{ height: `${(value / Math.max(...userAnalytics.data)) * 90}%` }}
                  />
                  <span className="mt-2 text-sm text-gray-600">{userAnalytics.labels[index]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content with Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    py-4 px-1 inline-flex items-center border-b-2 font-medium text-sm
                    ${activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <tab.icon className={`w-5 h-5 mr-2 ${activeTab === tab.id ? 'text-blue-600' : 'text-gray-400'}`} />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activities</h3>
                    <div className="space-y-3">
                      {activities.map((activity) => (
                        <div
                          key={activity.id}
                          className="flex items-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                        >
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600">
                              {getInitials(activity.user.username, '')}
                            </span>
                          </div>
                          <div className="ml-4 flex-1">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-gray-900">
                                {activity.user.username}
                                <span className="text-gray-500 ml-2">({activity.user.email})</span>
                              </p>
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                activity.action.includes('CREATE') 
                                  ? 'bg-green-100 text-green-800 border border-green-200'
                                  : activity.action.includes('DELETE')
                                  ? 'bg-red-100 text-red-800 border border-red-200'
                                  : 'bg-blue-100 text-blue-800 border border-blue-200'
                              }`}>
                                {activity.action.replace('_', ' ')}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{activity.details}</p>
                            <p className="text-xs text-gray-500 mt-2">
                              {formatDate(activity.timestamp)} • IP: {activity.ip_address}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                      <button className="w-full flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center">
                          <Users className="w-5 h-5 text-gray-400 mr-3" />
                          <span className="text-sm font-medium text-gray-900">Add New User</span>
                        </div>
                        <ChevronsUpDown className="w-5 h-5 text-gray-400" />
                      </button>
                      <button className="w-full flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center">
                          <BookOpen className="w-5 h-5 text-gray-400 mr-3" />
                          <span className="text-sm font-medium text-gray-900">Create Course</span>
                        </div>
                        <ChevronsUpDown className="w-5 h-5 text-gray-400" />
                      </button>
                      <button className="w-full flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center">
                          <BarChart3 className="w-5 h-5 text-gray-400 mr-3" />
                          <span className="text-sm font-medium text-gray-900">View Reports</span>
                        </div>
                        <ChevronsUpDown className="w-5 h-5 text-gray-400" />
                      </button>
                      <button 
                        onClick={logout}
                        className="w-full flex items-center justify-between p-4 rounded-lg border border-red-200 hover:bg-red-50 transition-colors"
                      >
                        <div className="flex items-center">
                          <LogOut className="w-5 h-5 text-red-400 mr-3" />
                          <span className="text-sm font-medium text-red-700">Logout All Sessions</span>
                        </div>
                        <ChevronsUpDown className="w-5 h-5 text-red-400" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleInputChange}
                        disabled={!editMode}
                        className={`pl-10 w-full rounded-lg border ${
                          editMode
                            ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                            : 'border-gray-200 bg-gray-50'
                        } py-2 px-3 focus:outline-none transition-colors`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleInputChange}
                        disabled={!editMode}
                        className={`pl-10 w-full rounded-lg border ${
                          editMode
                            ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                            : 'border-gray-200 bg-gray-50'
                        } py-2 px-3 focus:outline-none transition-colors`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={!editMode}
                        className={`pl-10 w-full rounded-lg border ${
                          editMode
                            ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                            : 'border-gray-200 bg-gray-50'
                        } py-2 px-3 focus:outline-none transition-colors`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        disabled={!editMode}
                        className={`pl-10 w-full rounded-lg border ${
                          editMode
                            ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                            : 'border-gray-200 bg-gray-50'
                        } py-2 px-3 focus:outline-none transition-colors`}
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Building2 className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        disabled={!editMode}
                        className={`pl-10 w-full rounded-lg border ${
                          editMode
                            ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                            : 'border-gray-200 bg-gray-50'
                        } py-2 px-3 focus:outline-none transition-colors`}
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                  <div className="flex">
                    <ShieldCheck className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">Admin Privileges</h3>
                      <p className="text-sm text-blue-700 mt-1">
                        You have full administrative access to the system, including user management,
                        course management, and system configuration.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="space-y-6">
                {/* Search and Filter */}
                <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                  <div className="relative flex-1 md:max-w-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-full rounded-lg border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="flex space-x-3">
                    <select
                      value={userFilter}
                      onChange={(e) => setUserFilter(e.target.value)}
                      className="rounded-lg border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="all">All Users</option>
                      <option value="admins">Admins Only</option>
                      <option value="users">Users Only</option>
                      <option value="active">Active Only</option>
                      <option value="inactive">Inactive Only</option>
                    </select>
                    <button
                      onClick={loadDashboardData}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                    >
                      <RefreshCw className="w-5 h-5 mr-2" />
                      Refresh
                    </button>
                  </div>
                </div>

                {/* Users Table */}
                <div className="overflow-x-auto border border-gray-200 rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Joined
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentUsers.map((userItem) => (
                        <tr key={userItem.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <span className="text-sm font-medium text-blue-600">
                                  {getInitials(userItem.first_name, userItem.last_name)}
                                </span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {userItem.first_name} {userItem.last_name}
                                </div>
                                <div className="text-sm text-gray-500">@{userItem.username}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{userItem.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              userItem.is_admin
                                ? 'bg-purple-100 text-purple-800 border border-purple-200'
                                : 'bg-gray-100 text-gray-800 border border-gray-200'
                            }`}>
                              {userItem.is_admin ? 'Admin' : 'User'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              userItem.is_active
                                ? 'bg-green-100 text-green-800 border border-green-200'
                                : 'bg-red-100 text-red-800 border border-red-200'
                            }`}>
                              {userItem.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(userItem.date_joined)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleUserStatusChange(userItem.id, !userItem.is_active)}
                                className={`p-1.5 rounded-lg ${
                                  userItem.is_active
                                    ? 'text-red-600 hover:bg-red-50'
                                    : 'text-green-600 hover:bg-green-50'
                                } transition-colors`}
                                title={userItem.is_active ? 'Deactivate User' : 'Activate User'}
                              >
                                {userItem.is_active ? (
                                  <AlertCircle className="w-5 h-5" />
                                ) : (
                                  <CheckCircle2 className="w-5 h-5" />
                                )}
                              </button>
                              <button
                                onClick={() => handleDeleteUser(userItem.id)}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete User"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing <span className="font-medium">{indexOfFirstUser + 1}</span> to{' '}
                    <span className="font-medium">{Math.min(indexOfLastUser, filteredUsers.length)}</span> of{' '}
                    <span className="font-medium">{filteredUsers.length}</span> users
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Activities Tab */}
            {activeTab === 'activities' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">System Activities</h3>
                <div className="space-y-4">
                  {activities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-medium text-blue-600">
                          {getInitials(activity.user.username, '')}
                        </span>
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {activity.user.username}
                              <span className="text-gray-500 ml-2">({activity.user.email})</span>
                            </p>
                          </div>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            activity.action.includes('CREATE') 
                              ? 'bg-green-100 text-green-800 border border-green-200'
                              : activity.action.includes('DELETE')
                              ? 'bg-red-100 text-red-800 border border-red-200'
                              : 'bg-blue-100 text-blue-800 border border-blue-200'
                          }`}>
                            {activity.action.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{activity.details}</p>
                        <div className="mt-2 text-xs text-gray-500">
                          <span>{formatDate(activity.timestamp)}</span>
                          <span className="mx-2">•</span>
                          <span>IP: {activity.ip_address}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">System Configuration</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Security Settings */}
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h4 className="text-base font-medium text-gray-900 mb-4">Security Settings</h4>
                    <div className="space-y-4">
                      {Object.entries(systemSettings).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between p-3 rounded-lg border border-gray-200">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {key === 'forcePasswordReset' && 'Force Password Reset'}
                              {key === 'twoFactorAuth' && 'Two-Factor Authentication'}
                              {key === 'ipWhitelisting' && 'IP Whitelisting'}
                              {key === 'maintenanceMode' && 'Maintenance Mode'}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              {key === 'forcePasswordReset' && 'Require users to reset password every 90 days'}
                              {key === 'twoFactorAuth' && 'Require 2FA for admin accounts'}
                              {key === 'ipWhitelisting' && 'Restrict admin access to specific IPs'}
                              {key === 'maintenanceMode' && 'Put system in maintenance mode'}
                            </p>
                          </div>
                          <button
                            onClick={() => toggleSystemSetting(key as keyof typeof systemSettings)}
                            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                              value ? 'bg-blue-600' : 'bg-gray-200'
                            }`}
                          >
                            <span
                              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                value ? 'translate-x-5' : 'translate-x-0'
                              }`}
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* System Maintenance */}
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h4 className="text-base font-medium text-gray-900 mb-4">System Maintenance</h4>
                    <div className="space-y-3">
                      <button
                        onClick={() => window.location.reload()}
                        className="w-full flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center">
                          <RefreshCw className="w-5 h-5 text-gray-400 mr-3" />
                          <span className="text-sm font-medium text-gray-900">Restart Application</span>
                        </div>
                        <ChevronsUpDown className="w-5 h-5 text-gray-400" />
                      </button>
                      
                      <button
                        onClick={handleBackupDatabase}
                        disabled={loading}
                        className="w-full flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50"
                      >
                        <div className="flex items-center">
                          <Archive className="w-5 h-5 text-gray-400 mr-3" />
                          <span className="text-sm font-medium text-gray-900">Backup Database</span>
                        </div>
                        <ChevronsUpDown className="w-5 h-5 text-gray-400" />
                      </button>
                      
                      <button
                        onClick={() => {
                          if (window.confirm('Are you sure you want to clear all cache? This may affect performance temporarily.')) {
                            handleClearCache();
                          }
                        }}
                        className="w-full flex items-center justify-between p-4 rounded-lg border border-red-200 hover:bg-red-50 transition-colors"
                      >
                        <div className="flex items-center">
                          <Trash2 className="w-5 h-5 text-red-400 mr-3" />
                          <span className="text-sm font-medium text-red-700">Clear All Cache</span>
                        </div>
                        <ChevronsUpDown className="w-5 h-5 text-red-400" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;