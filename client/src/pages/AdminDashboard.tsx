import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Shield,
  Users,
  BookOpen,
  GraduationCap,
  TrendingUp,
  UserCheck,
  Percent,
  Activity,
  Database,
  RefreshCw,
  ShieldAlert,
  Mail,
  Server,
  Network,
  CheckCircle,
  AlertTriangle,
  FileText,
  ChevronRight,
  BarChart3,
  DollarSign,
  Clock,
  ArrowUp,
  Minus,
} from 'lucide-react';

interface DashboardStats {
  totalUsers: number;
  totalCourses: number;
  totalEnrollments: number;
  activeUsers: number;
  totalRevenue: number;
  completionRate: number;
}

interface RecentActivity {
  id: number;
  type: string;
  description: string;
  user: string;
  timestamp: string;
}

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    activeUsers: 0,
    totalRevenue: 0,
    completionRate: 0
  });
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setStats({
        totalUsers: 1254,
        totalCourses: 87,
        totalEnrollments: 5243,
        activeUsers: 342,
        totalRevenue: 45230,
        completionRate: 68
      });

      setRecentActivities([
        {
          id: 1,
          type: 'user_registration',
          description: 'New user registered',
          user: 'john_doe',
          timestamp: '2024-01-20T10:30:00Z'
        },
        {
          id: 2,
          type: 'course_enrollment',
          description: 'Course enrollment completed',
          user: 'jane_smith',
          timestamp: '2024-01-20T09:15:00Z'
        },
        {
          id: 3,
          type: 'payment_received',
          description: 'Payment received for course purchase',
          user: 'bob_johnson',
          timestamp: '2024-01-20T08:45:00Z'
        },
        {
          id: 4,
          type: 'course_completion',
          description: 'Course completed with certificate',
          user: 'alice_williams',
          timestamp: '2024-01-20T07:30:00Z'
        }
      ]);

      setLoading(false);
    }, 1500);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-200 border-t-slate-900 mb-4"></div>
        <p className="text-slate-600 text-lg font-medium">Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-[1600px] mx-auto p-6 lg:p-8">
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center shadow-lg">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-slate-900">
                    Admin Dashboard
                  </h1>
                  <p className="text-slate-600 mt-1">
                    Welcome back, <span className="font-semibold text-slate-900">{user?.first_name || user?.username}</span>
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3 ml-[72px]">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-sm font-medium text-emerald-700">System Operational</span>
                </div>
                <span className="text-sm text-slate-500 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  Updated {new Date().toLocaleTimeString()}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/admin/users"
                className="px-5 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors flex items-center gap-2 font-medium shadow-sm"
              >
                <Users className="w-4 h-4" />
                <span>Manage Users</span>
              </Link>
              <Link
                to="/admin/courses"
                className="px-5 py-2.5 bg-white text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-2 font-medium shadow-sm"
              >
                <BookOpen className="w-4 h-4" />
                <span>Courses</span>
              </Link>
              <Link
                to="/admin/analytics"
                className="px-5 py-2.5 bg-white text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-2 font-medium shadow-sm"
              >
                <BarChart3 className="w-4 h-4" />
                <span>Analytics</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          <StatCard
            icon={<Users className="w-5 h-5" />}
            value={stats.totalUsers.toLocaleString()}
            label="Total Users"
            trend="+12%"
            trendUp={true}
            color="blue"
          />
          <StatCard
            icon={<BookOpen className="w-5 h-5" />}
            value={stats.totalCourses.toString()}
            label="Published Courses"
            trend="3 new"
            trendUp={true}
            color="slate"
          />
          <StatCard
            icon={<GraduationCap className="w-5 h-5" />}
            value={stats.totalEnrollments.toLocaleString()}
            label="Total Enrollments"
            trend="+8%"
            trendUp={true}
            color="emerald"
          />
          <StatCard
            icon={<DollarSign className="w-5 h-5" />}
            value={`$${stats.totalRevenue.toLocaleString()}`}
            label="Total Revenue"
            trend="+15%"
            trendUp={true}
            color="green"
          />
          <StatCard
            icon={<UserCheck className="w-5 h-5" />}
            value={stats.activeUsers.toString()}
            label="Active Users (24h)"
            trend="Stable"
            trendUp={false}
            color="cyan"
          />
          <StatCard
            icon={<Percent className="w-5 h-5" />}
            value={`${stats.completionRate}%`}
            label="Completion Rate"
            trend="+5%"
            trendUp={true}
            color="orange"
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-slate-600" />
                  Recent Activity
                </h3>
                <Link to="/admin/activity" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                  View All
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="divide-y divide-slate-100">
                {recentActivities.map(activity => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
              <div className="px-6 py-5 border-b border-slate-100">
                <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-slate-600" />
                  System Actions
                </h3>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 p-6">
                <ActionButton
                  icon={<Database className="w-5 h-5" />}
                  label="Backup Database"
                  color="blue"
                />
                <ActionButton
                  icon={<RefreshCw className="w-5 h-5" />}
                  label="Clear Cache"
                  color="emerald"
                />
                <ActionButton
                  icon={<ShieldAlert className="w-5 h-5" />}
                  label="Security Scan"
                  color="red"
                />
                <ActionButton
                  icon={<Mail className="w-5 h-5" />}
                  label="Send Announcement"
                  color="amber"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
              <div className="px-6 py-5 border-b border-slate-100">
                <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-slate-600" />
                  System Health
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <HealthItem
                  icon={<Server className="w-5 h-5" />}
                  label="Server Status"
                  value="Healthy"
                  status="healthy"
                />
                <HealthItem
                  icon={<Database className="w-5 h-5" />}
                  label="Database"
                  value="85% capacity"
                  status="healthy"
                />
                <HealthItem
                  icon={<Network className="w-5 h-5" />}
                  label="API Response"
                  value="98ms average"
                  status="healthy"
                />
                <HealthItem
                  icon={<ShieldAlert className="w-5 h-5" />}
                  label="Security"
                  value="Scan required"
                  status="warning"
                />
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
              <div className="px-6 py-5 border-b border-slate-100">
                <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-slate-600" />
                  Quick Reports
                </h3>
              </div>
              <div className="divide-y divide-slate-100">
                <ReportItem
                  title="User Growth Report"
                  subtitle="Monthly analytics"
                  icon={<Users className="w-5 h-5" />}
                  color="blue"
                />
                <ReportItem
                  title="Revenue Report"
                  subtitle="Financial overview"
                  icon={<DollarSign className="w-5 h-5" />}
                  color="emerald"
                />
                <ReportItem
                  title="Course Performance"
                  subtitle="Engagement metrics"
                  icon={<BarChart3 className="w-5 h-5" />}
                  color="slate"
                />
                <ReportItem
                  title="Certificate Report"
                  subtitle="Issuance statistics"
                  icon={<GraduationCap className="w-5 h-5" />}
                  color="orange"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  trend: string;
  trendUp: boolean;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, value, label, trend, trendUp, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    slate: 'bg-slate-50 text-slate-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    green: 'bg-green-50 text-green-600',
    cyan: 'bg-cyan-50 text-cyan-600',
    orange: 'bg-orange-50 text-orange-600',
  }[color] || 'bg-slate-50 text-slate-600';

  const trendColorClasses = trendUp
    ? 'text-emerald-600 bg-emerald-50'
    : 'text-slate-600 bg-slate-50';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 hover:shadow-md transition-all hover:-translate-y-0.5">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses}`}>
          {icon}
        </div>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1 ${trendColorClasses}`}>
          {trendUp ? <ArrowUp className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
          {trend}
        </span>
      </div>
      <h3 className="text-2xl font-bold text-slate-900 mb-1">{value}</h3>
      <p className="text-sm text-slate-600 font-medium">{label}</p>
    </div>
  );
};

interface ActivityItemProps {
  activity: RecentActivity;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ activity }) => {
  const getActivityConfig = (type: string) => {
    const configs = {
      user_registration: { icon: <Users className="w-4 h-4" />, color: 'bg-blue-50 text-blue-600' },
      course_enrollment: { icon: <BookOpen className="w-4 h-4" />, color: 'bg-emerald-50 text-emerald-600' },
      payment_received: { icon: <DollarSign className="w-4 h-4" />, color: 'bg-green-50 text-green-600' },
      course_completion: { icon: <GraduationCap className="w-4 h-4" />, color: 'bg-orange-50 text-orange-600' },
    };
    return configs[type as keyof typeof configs] || configs.user_registration;
  };

  const config = getActivityConfig(activity.type);

  return (
    <div className="px-6 py-4 hover:bg-slate-50 transition-colors">
      <div className="flex items-start gap-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${config.color}`}>
          {config.icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-900">{activity.description}</p>
          <div className="flex flex-wrap items-center gap-3 mt-1.5">
            <span className="text-xs text-slate-500 font-medium">@{activity.user}</span>
            <span className="text-xs text-slate-400">
              {new Date(activity.timestamp).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  color: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({ icon, label, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 hover:bg-blue-100',
    emerald: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100',
    red: 'bg-red-50 text-red-600 hover:bg-red-100',
    amber: 'bg-amber-50 text-amber-600 hover:bg-amber-100',
  }[color] || 'bg-slate-50 text-slate-600 hover:bg-slate-100';

  return (
    <button className="flex flex-col items-center justify-center p-4 border border-slate-200 rounded-xl hover:border-slate-300 transition-all hover:-translate-y-0.5 group">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-colors ${colorClasses}`}>
        {icon}
      </div>
      <span className="text-sm font-medium text-slate-700 text-center">{label}</span>
    </button>
  );
};

interface HealthItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  status: 'healthy' | 'warning';
}

const HealthItem: React.FC<HealthItemProps> = ({ icon, label, value, status }) => {
  const statusConfig = status === 'healthy'
    ? { bg: 'bg-emerald-50', text: 'text-emerald-600', badge: 'bg-emerald-100 text-emerald-700', icon: <CheckCircle className="w-4 h-4" /> }
    : { bg: 'bg-amber-50', text: 'text-amber-600', badge: 'bg-amber-100 text-amber-700', icon: <AlertTriangle className="w-4 h-4" /> };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${statusConfig.bg} ${statusConfig.text}`}>
          {icon}
        </div>
        <span className="font-medium text-slate-700 text-sm">{label}</span>
      </div>
      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${statusConfig.badge}`}>
        {statusConfig.icon}
        {value}
      </span>
    </div>
  );
};

interface ReportItemProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
}

const ReportItem: React.FC<ReportItemProps> = ({ title, subtitle, icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 group-hover:bg-blue-100',
    emerald: 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100',
    slate: 'bg-slate-50 text-slate-600 group-hover:bg-slate-100',
    orange: 'bg-orange-50 text-orange-600 group-hover:bg-orange-100',
  }[color] || 'bg-slate-50 text-slate-600 group-hover:bg-slate-100';

  return (
    <Link
      to="#"
      className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors group"
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${colorClasses}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
          {title}
        </p>
        <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
      </div>
      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
    </Link>
  );
};

export default AdminDashboard;
