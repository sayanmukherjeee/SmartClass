import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from './Loader';

interface ProtectedRouteProps {
  adminOnly?: boolean;
  requireAuth?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  adminOnly = false,
  requireAuth = true 
}) => {
  const { user, isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <Loader />;
  }
  
  if (requireAuth && !isAuthenticated) {
    return adminOnly 
      ? <Navigate to="/admin-login" replace />
      : <Navigate to="/login" replace />;
  }
  
  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  if (adminOnly && !user?.is_admin) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <Outlet />;
};

export default ProtectedRoute;