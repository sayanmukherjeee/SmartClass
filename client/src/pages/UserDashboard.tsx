import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import {
  BookOpen,
  GraduationCap,
  Award,
  Search,
  Settings,
  Clock,
  TrendingUp,
  Calendar,
  User,
  Mail,
  Briefcase,
  CheckCircle,
  PlayCircle,
  Flame,
  ChevronRight,
  Edit,
  Target,
} from 'lucide-react';

const UserDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    enrolledCourses: 0,
    completedCourses: 0,
    ongoingCourses: 0,
    certificates: 0,
    learningHours: 0,
    streakDays: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setStats({
        enrolledCourses: 8,
        completedCourses: 4,
        ongoingCourses: 4,
        certificates: 3,
        learningHours: 42,
        streakDays: 7
      });
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-200 border-t-blue-600 mb-4"></div>
        <p className="text-slate-600 text-lg font-medium">Loading your dashboard...</p>
      </div>
    );
  }

  const completionPercentage = (stats.completedCourses / stats.enrolledCourses) * 100 || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      <div className="max-w-[1400px] mx-auto p-6 lg:p-8">
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 mb-6">
            <div className="flex items-start gap-5">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-3xl font-bold text-white">
                    {user?.first_name?.[0] || user?.username?.[0] || 'U'}
                  </span>
                </div>
                {stats.streakDays >= 7 && (
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                    <Flame className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-slate-900">
                  Welcome back, {user?.first_name || user?.username}!
                </h1>
                <p className="text-slate-600 mt-2 text-lg">
                  Continue your learning journey and achieve your goals
                </p>
                {user?.is_admin && (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full shadow-sm mt-3">
                    <Award className="w-4 h-4" />
                    <span className="text-sm font-medium">Administrator</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/courses"
                className="px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium shadow-sm"
              >
                <Search className="w-4 h-4" />
                <span>Browse Courses</span>
              </Link>
              <Link
                to="/profile"
                className="px-5 py-2.5 bg-white text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-2 font-medium shadow-sm"
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <LearningStatCard
            icon={<BookOpen className="w-6 h-6" />}
            value={stats.enrolledCourses}
            label="Enrolled Courses"
            subtitle={`${stats.ongoingCourses} in progress`}
            progress={75}
            gradient="from-blue-500 to-blue-600"
          />
          <LearningStatCard
            icon={<GraduationCap className="w-6 h-6" />}
            value={stats.completedCourses}
            label="Completed Courses"
            subtitle={`${completionPercentage.toFixed(0)}% completion rate`}
            progress={completionPercentage}
            gradient="from-emerald-500 to-emerald-600"
          />
          <LearningStatCard
            icon={<Award className="w-6 h-6" />}
            value={stats.certificates}
            label="Certificates Earned"
            subtitle="View your achievements"
            progress={100}
            gradient="from-amber-500 to-amber-600"
            link="/certificates"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
              <div className="px-6 py-5 border-b border-slate-100">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <User className="w-5 h-5 text-slate-600" />
                  Your Information
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InfoField
                    icon={<User className="w-4 h-4" />}
                    label="Username"
                    value={user?.username || 'N/A'}
                  />
                  <InfoField
                    icon={<Mail className="w-4 h-4" />}
                    label="Email"
                    value={user?.email || 'N/A'}
                  />
                  <InfoField
                    icon={<User className="w-4 h-4" />}
                    label="Full Name"
                    value={`${user?.first_name || ''} ${user?.last_name || ''}`.trim() || 'Not set'}
                  />
                  <InfoField
                    icon={<Briefcase className="w-4 h-4" />}
                    label="Department"
                    value={user?.department || 'Not specified'}
                  />
                  <InfoField
                    icon={<Award className="w-4 h-4" />}
                    label="Account Type"
                    value={
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-sm font-semibold ${
                        user?.is_admin
                          ? 'bg-blue-50 text-blue-700'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {user?.is_admin ? <Award className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                        {user?.is_admin ? 'Administrator' : 'Regular User'}
                      </span>
                    }
                  />
                  <InfoField
                    icon={<Calendar className="w-4 h-4" />}
                    label="Member Since"
                    value={
                      user?.date_joined
                        ? new Date(user.date_joined).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })
                        : 'N/A'
                    }
                  />
                </div>

                <div className="mt-6 pt-6 border-t border-slate-100 flex flex-wrap gap-3">
                  <Link
                    to="/profile/edit"
                    className="px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium"
                  >
                    <Edit className="w-4 h-4" />
                    Edit Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors flex items-center gap-2 font-medium"
                  >
                    <Settings className="w-4 h-4" />
                    Account Settings
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
              <div className="px-6 py-5 border-b border-slate-100">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Target className="w-5 h-5 text-slate-600" />
                  Recommended for You
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <CourseCard
                    title="Advanced JavaScript"
                    subtitle="Continue learning"
                    icon={<BookOpen className="w-5 h-5" />}
                    color="blue"
                    progress={65}
                  />
                  <CourseCard
                    title="Database Design"
                    subtitle="Start now"
                    icon={<PlayCircle className="w-5 h-5" />}
                    color="emerald"
                  />
                  <CourseCard
                    title="React Fundamentals"
                    subtitle="Resume course"
                    icon={<BookOpen className="w-5 h-5" />}
                    color="cyan"
                    progress={40}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
              <div className="px-6 py-5 border-b border-slate-100">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-slate-600" />
                  Learning Progress
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <ProgressCircle
                    value={stats.learningHours}
                    label="Learning Hours"
                    suffix="h"
                    color="blue"
                  />
                  <ProgressBadge
                    value={stats.streakDays}
                    label="Day Streak"
                    icon={<Flame className="w-6 h-6" />}
                    color="orange"
                  />
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-slate-700">Course Completion</span>
                      <span className="text-sm font-bold text-slate-900">{completionPercentage.toFixed(0)}%</span>
                    </div>
                    <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                        style={{ width: `${completionPercentage}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-slate-700">Monthly Goal</span>
                      <span className="text-sm font-bold text-slate-900">70%</span>
                    </div>
                    <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full w-[70%]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
              <div className="px-6 py-5 border-b border-slate-100">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-slate-600" />
                  Recent Activity
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <ActivityItem
                    icon={<CheckCircle className="w-4 h-4" />}
                    title="Completed React Basics"
                    time="Yesterday, 3:45 PM"
                    badge="+5 XP"
                    badgeColor="emerald"
                  />
                  <ActivityItem
                    icon={<PlayCircle className="w-4 h-4" />}
                    title="Started Node.js Course"
                    time="2 days ago"
                    badge="In Progress"
                    badgeColor="blue"
                  />
                  <ActivityItem
                    icon={<Award className="w-4 h-4" />}
                    title="Earned Certificate"
                    time="Web Development Fundamentals"
                    badge="View"
                    badgeColor="amber"
                    link="/certificates"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface LearningStatCardProps {
  icon: React.ReactNode;
  value: number;
  label: string;
  subtitle: string;
  progress: number;
  gradient: string;
  link?: string;
}

const LearningStatCard: React.FC<LearningStatCardProps> = ({
  icon,
  value,
  label,
  subtitle,
  progress,
  gradient,
  link
}) => {
  const content = (
    <>
      <div className={`bg-gradient-to-br ${gradient} text-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all hover:-translate-y-1`}>
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            {icon}
          </div>
        </div>
        <h3 className="text-4xl font-bold mb-2">{value}</h3>
        <p className="text-white/90 font-medium mb-4">{label}</p>
        <div className="mb-3">
          <div className="h-1.5 bg-white/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-white/80">{subtitle}</p>
          {link && <ChevronRight className="w-4 h-4 text-white/80" />}
        </div>
      </div>
    </>
  );

  return link ? <Link to={link}>{content}</Link> : content;
};

interface InfoFieldProps {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}

const InfoField: React.FC<InfoFieldProps> = ({ icon, label, value }) => (
  <div className="space-y-2">
    <label className="text-sm font-semibold text-slate-500 flex items-center gap-1.5">
      <span className="text-slate-400">{icon}</span>
      {label}
    </label>
    <div className="font-semibold text-slate-900">{value}</div>
  </div>
);

interface CourseCardProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  progress?: number;
}

const CourseCard: React.FC<CourseCardProps> = ({ title, subtitle, icon, color, progress }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 group-hover:bg-blue-100',
    emerald: 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100',
    cyan: 'bg-cyan-50 text-cyan-600 group-hover:bg-cyan-100',
  }[color] || 'bg-slate-50 text-slate-600 group-hover:bg-slate-100';

  return (
    <button className="w-full flex items-center gap-4 p-4 border border-slate-200 rounded-xl hover:border-slate-300 transition-all group">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${colorClasses}`}>
        {icon}
      </div>
      <div className="flex-1 text-left">
        <p className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{title}</p>
        <p className="text-sm text-slate-500">{subtitle}</p>
        {progress !== undefined && (
          <div className="mt-2 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
      <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
    </button>
  );
};

interface ProgressCircleProps {
  value: number;
  label: string;
  suffix: string;
  color: string;
}

const ProgressCircle: React.FC<ProgressCircleProps> = ({ value, label, suffix, color }) => {
  const colorClasses = {
    blue: 'stroke-blue-600',
  }[color] || 'stroke-slate-600';

  return (
    <div className="text-center">
      <div className="relative inline-flex mb-3">
        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 36 36">
          <path
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="3"
          />
          <path
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            className={colorClasses}
            strokeWidth="3"
            strokeDasharray={`${value}, 100`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-slate-900">{value}{suffix}</span>
        </div>
      </div>
      <p className="text-sm font-semibold text-slate-600">{label}</p>
    </div>
  );
};

interface ProgressBadgeProps {
  value: number;
  label: string;
  icon: React.ReactNode;
  color: string;
}

const ProgressBadge: React.FC<ProgressBadgeProps> = ({ value, label, icon, color }) => {
  const colorClasses = {
    orange: 'from-orange-100 to-amber-100 text-orange-800',
  }[color] || 'from-slate-100 to-slate-100 text-slate-800';

  return (
    <div className="text-center">
      <div className={`inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br ${colorClasses} rounded-2xl mb-3 shadow-sm`}>
        <div className="text-center">
          {icon}
          <span className="block text-2xl font-bold mt-1">{value}</span>
        </div>
      </div>
      <p className="text-sm font-semibold text-slate-600">{label}</p>
    </div>
  );
};

interface ActivityItemProps {
  icon: React.ReactNode;
  title: string;
  time: string;
  badge: string;
  badgeColor: string;
  link?: string;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ icon, title, time, badge, badgeColor, link }) => {
  const badgeColorClasses = {
    emerald: 'bg-emerald-50 text-emerald-700',
    blue: 'bg-blue-50 text-blue-700',
    amber: 'bg-amber-50 text-amber-700',
  }[badgeColor] || 'bg-slate-50 text-slate-700';

  const iconColorClasses = {
    emerald: 'bg-emerald-100 text-emerald-600',
    blue: 'bg-blue-100 text-blue-600',
    amber: 'bg-amber-100 text-amber-600',
  }[badgeColor] || 'bg-slate-100 text-slate-600';

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${iconColorClasses}`}>
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-slate-900 text-sm truncate">{title}</p>
          <p className="text-xs text-slate-500 truncate">{time}</p>
        </div>
      </div>
      {link ? (
        <Link
          to={link}
          className={`text-xs font-semibold px-3 py-1.5 rounded-lg ml-3 flex-shrink-0 ${badgeColorClasses} hover:opacity-80 transition-opacity`}
        >
          {badge}
        </Link>
      ) : (
        <span className={`text-xs font-semibold px-3 py-1.5 rounded-lg ml-3 flex-shrink-0 ${badgeColorClasses}`}>
          {badge}
        </span>
      )}
    </div>
  );
};

export default UserDashboard;
