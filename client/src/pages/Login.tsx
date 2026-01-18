import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/form.css";

const Login: React.FC = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const [formErrors, setFormErrors] = useState<{ username?: string; password?: string }>({});
  const { login, error, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = (): boolean => {
    const errors: { username?: string; password?: string } = {};

    if (!credentials.username.trim()) {
      errors.username = "Username is required";
    }

    if (!credentials.password) {
      errors.password = "Password is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const result = await login(credentials);
    if (result.success) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <div className="form-header">
          <h2 className="form-title">
            <i className="fas fa-sign-in-alt"></i> Welcome Back
          </h2>
          <p className="form-subtitle">Sign in to your account to continue</p>
        </div>

        {error && (
          <div className="alert alert-error">
            <i className="fas fa-exclamation-circle"></i> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">
              <i className="fas fa-user"></i> Username or Email *
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              className={formErrors.username ? "error" : ""}
              disabled={loading}
              placeholder="Enter your username or email"
              autoFocus
            />
            {formErrors.username && (
              <span className="error-message">
                <i className="fas fa-exclamation-triangle"></i> {formErrors.username}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">
              <i className="fas fa-lock"></i> Password *
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              className={formErrors.password ? "error" : ""}
              disabled={loading}
              placeholder="Enter your password"
            />
            {formErrors.password && (
              <span className="error-message">
                <i className="fas fa-exclamation-triangle"></i> {formErrors.password}
              </span>
            )}
          </div>

          <div className="form-options">
            <label className="checkbox-label">
              <input type="checkbox" /> Remember me
            </label>
            <Link to="/forgot-password" className="forgot-password">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Signing in...
              </>
            ) : (
              <>
                <i className="fas fa-sign-in-alt"></i> Sign In
              </>
            )}
          </button>
        </form>

        <div className="form-footer">
          <div className="social-login">
            <p>Or sign in with</p>
            <div className="social-buttons">
              <button type="button" className="btn-social google">
                <i className="fab fa-google"></i> Google
              </button>
              <button type="button" className="btn-social facebook">
                <i className="fab fa-facebook-f"></i> Facebook
              </button>
              <button type="button" className="btn-social github">
                <i className="fab fa-github"></i> GitHub
              </button>
            </div>
          </div>

          <p className="auth-link">
            Don't have an account?{" "}
            <Link to="/register" className="link-strong">
              Create an account
            </Link>
          </p>
          <p className="admin-link">
            <Link to="/admin-login">
              <i className="fas fa-user-shield"></i> Admin Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;