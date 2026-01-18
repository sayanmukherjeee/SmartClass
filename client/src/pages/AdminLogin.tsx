import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/form.css";

const AdminLogin: React.FC = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const [formErrors, setFormErrors] = useState<{ username?: string; password?: string }>({});
  const { adminLogin, error, loading } = useAuth();
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

    const result = await adminLogin(credentials);
    if (result.success) {
      navigate("/admin");
    }
  };

  return (
    <div className="form-container">
      <div className="form-card admin-card">
        <div className="form-header">
          <h2 className="form-title">
            <i className="fas fa-user-shield"></i> Admin Portal
          </h2>
          <p className="form-subtitle">Administrator access only</p>
        </div>

        {error && (
          <div className="alert alert-error">
            <i className="fas fa-exclamation-circle"></i> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="admin-note">
            <div className="note-box">
              <i className="fas fa-info-circle"></i>
              <div>
                <strong>Security Notice:</strong> This portal is restricted to authorized administrators only.
                Unauthorized access is prohibited.
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="username">
              <i className="fas fa-user"></i> Admin Username *
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              className={formErrors.username ? "error" : ""}
              disabled={loading}
              placeholder="Enter admin username"
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
              placeholder="Enter admin password"
            />
            {formErrors.password && (
              <span className="error-message">
                <i className="fas fa-exclamation-triangle"></i> {formErrors.password}
              </span>
            )}
          </div>

          <div className="form-options">
            <label className="checkbox-label">
              <input type="checkbox" /> Remember this device
            </label>
          </div>

          <button
            type="submit"
            className="btn btn-admin btn-block"
            disabled={loading}
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Authenticating...
              </>
            ) : (
              <>
                <i className="fas fa-sign-in-alt"></i> Access Admin Panel
              </>
            )}
          </button>
        </form>

        <div className="form-footer">
          <p className="security-note">
            <i className="fas fa-shield-alt"></i> For security reasons, access is logged and monitored.
          </p>
          <p className="auth-link">
            <Link to="/login">
              <i className="fas fa-arrow-left"></i> Back to User Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;