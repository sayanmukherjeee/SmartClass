import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // State for toggling menus
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    user?.is_admin ? navigate('/admin-login') : navigate('/login');
  };

  const handleProfileClick = () => {
    if (user?.is_admin) {
      navigate('/admin/profile');
    } else {
      navigate('/profile');
    }
    setIsUserDropdownOpen(false);
  };

  const isActive = (path: string) => {
    if (user?.is_admin && path === '/admin/profile' && location.pathname === '/admin/profile') {
      return 'text-indigo-600 border-b-2 border-indigo-600';
    }
    if (!user?.is_admin && path === '/profile' && location.pathname === '/profile') {
      return 'text-indigo-600 border-b-2 border-indigo-600';
    }
    return location.pathname === path 
      ? 'text-indigo-600 border-b-2 border-indigo-600' 
      : 'text-gray-600 hover:text-indigo-500 transition-colors';
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
    } else if (user?.username) {
      return user.username[0].toUpperCase();
    }
    return 'U';
  };

  // Get user display name
  const getDisplayName = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    return user?.username || 'User';
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          {/* Left Side: Brand & Main Nav */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="bg-indigo-600 p-2 rounded-lg group-hover:bg-indigo-700 transition-colors">
                <i className="fas fa-graduation-cap text-white text-lg"></i>
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
                Trainify
              </span>
            </Link>

            {/* Desktop Links (Authenticated) */}
            {isAuthenticated && (
              <div className="hidden md:flex space-x-6 h-full pt-1">
                <Link to="/courses" className={`flex items-center px-1 text-sm font-medium ${isActive('/courses')}`}>
                  Courses
                </Link>
                <Link to="/dashboard" className={`flex items-center px-1 text-sm font-medium ${isActive('/dashboard')}`}>
                  Dashboard
                </Link>
                {user?.is_admin && (
                  <Link to="/admin" className={`flex items-center px-1 text-sm font-medium ${isActive('/admin')}`}>
                    Admin Panel
                  </Link>
                )}
                <Link to="/certificates" className={`flex items-center px-1 text-sm font-medium ${isActive('/certificates')}`}>
                  Certificates
                </Link>
              </div>
            )}
          </div>

          {/* Right Side: Auth State */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative">
                <button 
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center space-x-3 p-1 rounded-full hover:bg-gray-50 transition-all focus:outline-none"
                >
                  <div className="flex flex-col items-end hidden sm:flex">
                    <span className="text-sm font-semibold text-gray-700 leading-tight">
                      {getDisplayName()}
                    </span>
                    {user?.is_admin ? (
                      <span className="text-[10px] uppercase tracking-wider font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                        Admin
                      </span>
                    ) : (
                      <span className="text-[10px] text-gray-500">
                        Student
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <div className="h-9 w-9 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center border-2 border-white shadow-sm">
                      <span className="text-white font-semibold text-sm">
                        {getUserInitials()}
                      </span>
                    </div>
                    {user?.is_admin && (
                      <div className="absolute -top-1 -right-1 bg-purple-500 text-white rounded-full p-0.5">
                        <i className="fas fa-shield-alt text-[8px]"></i>
                      </div>
                    )}
                  </div>
                  <i className={`fas fa-chevron-down text-xs text-gray-400 transition-transform ${isUserDropdownOpen ? 'rotate-180' : ''}`}></i>
                </button>

                {/* Modern User Dropdown Menu */}
                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-in fade-in zoom-in duration-200 z-50">
                    {/* User Info Header */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                          <span className="text-white font-semibold">
                            {getUserInitials()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {getDisplayName()}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {user?.email}
                          </p>
                        </div>
                      </div>
                      {user?.is_admin && (
                        <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          <i className="fas fa-shield-alt mr-1"></i>
                          Administrator
                        </div>
                      )}
                    </div>

                    {/* Dropdown Items */}
                    <div className="py-2">
                      <button 
                        onClick={handleProfileClick}
                        className="w-full text-left flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                      >
                        <i className="fas fa-user-circle w-5 mr-3 text-gray-400"></i> 
                        <div>
                          <div className="font-medium">Profile</div>
                          <div className="text-xs text-gray-500">
                            {user?.is_admin ? 'Admin Profile' : 'User Profile'}
                          </div>
                        </div>
                      </button>
                      
                      {user?.is_admin ? (
                        <>
                          <Link to="/admin" className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600">
                            <i className="fas fa-tachometer-alt w-5 mr-3 text-gray-400"></i> Dashboard
                          </Link>
                          <Link to="/admin/users" className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600">
                            <i className="fas fa-users w-5 mr-3 text-gray-400"></i> User Management
                          </Link>
                        </>
                      ) : (
                        <>
                          <Link to="/dashboard" className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600">
                            <i className="fas fa-tachometer-alt w-5 mr-3 text-gray-400"></i> Dashboard
                          </Link>
                          <Link to="/my-courses" className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600">
                            <i className="fas fa-book-open w-5 mr-3 text-gray-400"></i> My Courses
                          </Link>
                        </>
                      )}
                      
                      <Link to="/settings" className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600">
                        <i className="fas fa-cog w-5 mr-3 text-gray-400"></i> Settings
                      </Link>
                    </div>

                    <div className="border-t border-gray-100"></div>
                    
                    <div className="py-2">
                      <button 
                        onClick={handleLogout}
                        className="w-full text-left flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <i className="fas fa-sign-out-alt w-5 mr-3"></i> 
                        <div>
                          <div className="font-medium">Logout</div>
                          <div className="text-xs text-red-500">
                            {user?.is_admin ? 'Exit Admin Panel' : 'Sign out from account'}
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Guest Navigation */
              <div className="flex items-center space-x-3">
                <div className="hidden lg:flex space-x-6 mr-4">
                  <Link to="/pricing" className="text-sm font-medium text-gray-600 hover:text-indigo-600">Pricing</Link>
                  <Link to="/about" className="text-sm font-medium text-gray-600 hover:text-indigo-600">About</Link>
                </div>
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700">
                  Log in
                </Link>
                <Link to="/register" className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 rounded-full hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all">
                  Get Started
                </Link>
                <div className="h-6 w-[1px] bg-gray-200 mx-2"></div>
                <Link to="/admin-login" className="p-2 text-gray-400 hover:text-gray-600" title="Admin Portal">
                  <i className="fas fa-user-shield"></i>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Content */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-1">
          {isAuthenticated ? (
            <>
              {/* User Info in Mobile Menu */}
              <div className="px-3 py-4 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">
                      {getUserInitials()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {getDisplayName()}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user?.email}
                    </p>
                    {user?.is_admin && (
                      <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold bg-purple-100 text-purple-800 rounded-full">
                        ADMIN
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Mobile Menu Links */}
              <button 
                onClick={handleProfileClick}
                className="w-full text-left flex items-center px-3 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                <i className="fas fa-user-circle w-5 mr-3 text-gray-400"></i>
                <div>
                  <div className="font-medium">Profile</div>
                  <div className="text-xs text-gray-500">
                    {user?.is_admin ? 'Admin Profile' : 'User Profile'}
                  </div>
                </div>
              </button>
              
              <Link 
                to={user?.is_admin ? "/admin" : "/dashboard"} 
                className="flex items-center px-3 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <i className="fas fa-tachometer-alt w-5 mr-3 text-gray-400"></i>
                Dashboard
              </Link>
              
              <Link 
                to="/courses" 
                className="flex items-center px-3 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <i className="fas fa-book-open w-5 mr-3 text-gray-400"></i>
                Courses
              </Link>
              
              {user?.is_admin ? (
                <Link 
                  to="/admin/users" 
                  className="flex items-center px-3 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <i className="fas fa-users w-5 mr-3 text-gray-400"></i>
                  User Management
                </Link>
              ) : (
                <Link 
                  to="/my-courses" 
                  className="flex items-center px-3 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <i className="fas fa-book-reader w-5 mr-3 text-gray-400"></i>
                  My Courses
                </Link>
              )}
              
              <Link 
                to="/certificates" 
                className="flex items-center px-3 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <i className="fas fa-certificate w-5 mr-3 text-gray-400"></i>
                Certificates
              </Link>
              
              <div className="border-t border-gray-100 my-2"></div>
              
              <Link 
                to="/settings" 
                className="flex items-center px-3 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <i className="fas fa-cog w-5 mr-3 text-gray-400"></i>
                Settings
              </Link>
              
              <button 
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left flex items-center px-3 py-3 text-red-600 hover:bg-red-50 rounded-lg"
              >
                <i className="fas fa-sign-out-alt w-5 mr-3"></i>
                <div>
                  <div className="font-medium">Logout</div>
                  <div className="text-xs text-red-500">
                    {user?.is_admin ? 'Exit Admin Panel' : 'Sign out'}
                  </div>
                </div>
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/courses" 
                className="block px-3 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <i className="fas fa-book-open mr-3 text-gray-400"></i>
                Courses
              </Link>
              <Link 
                to="/pricing" 
                className="block px-3 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <i className="fas fa-tag mr-3 text-gray-400"></i>
                Pricing
              </Link>
              <Link 
                to="/about" 
                className="block px-3 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <i className="fas fa-info-circle mr-3 text-gray-400"></i>
                About Us
              </Link>
              <div className="border-t border-gray-100 my-2"></div>
              <Link 
                to="/login" 
                className="block px-3 py-3 text-indigo-600 hover:bg-indigo-50 rounded-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <i className="fas fa-sign-in-alt mr-3"></i>
                Log in
              </Link>
              <Link 
                to="/register" 
                className="block px-3 py-3 text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <i className="fas fa-user-plus mr-3"></i>
                Get Started
              </Link>
              <Link 
                to="/admin-login" 
                className="block px-3 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <i className="fas fa-user-shield mr-3"></i>
                Admin Portal
              </Link>
            </>
          )}
        </div>
      )}

      {/* Click outside to close dropdown */}
      {isUserDropdownOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsUserDropdownOpen(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;