import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import AdminLogin from '../pages/AdminLogin';
import AdminRegister from '../pages/AdminRegister';
import UserDashboard from '../pages/UserDashboard';
import AdminDashboard from '../pages/AdminDashboard';
import UserProfile from '../pages/UserProfile';
import AdminProfile from '../pages/AdminProfile';
import Certificate from '../pages/student/Certificate'; // Add this import
import ProtectedRoute from '../components/ProtectedRoute';
import CourseCatalog from '../pages/CourseCatalog';
import HomePage from '../pages/HomePage';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/admin-register" element={<AdminRegister />} />
      <Route path="/courses" element={<CourseCatalog />} />

      {/* Protected user routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/my-courses" element={<div>My Courses</div>} />
        <Route path="/certificates" element={<Certificate />} /> {/* Update this line */}
      </Route>

      {/* Protected admin routes */}
      <Route element={<ProtectedRoute adminOnly={true} />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/profile" element={<AdminProfile />} />
        <Route path="/admin/users" element={<div>User Management</div>} />
        <Route path="/admin/courses" element={<div>Course Management</div>} />
        <Route path="/admin/analytics" element={<div>Analytics</div>} />
        <Route path="/admin/settings" element={<div>Settings</div>} />
      </Route>

      {/* 404 route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;