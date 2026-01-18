import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { RegisterData } from "../types/index";
import "../styles/form.css";

const AdminRegister: React.FC = () => {
  const [formData, setFormData] = useState<RegisterData>({
    username: "",
    email: "",
    password: "",
    confirm_password: "",
    first_name: "",
    last_name: "",
    phone: "",
    department: "",
  });

  const [formErrors, setFormErrors] = useState<Partial<RegisterData>>({});
  const { adminRegister, error, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
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
    const errors: Partial<RegisterData> = {};

    if (!formData.username.trim()) {
      errors.username = "Username is required";
    } else if (formData.username.length < 3) {
      errors.username = "Username must be at least 3 characters";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 12) {
      errors.password = "Password must be at least 12 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(formData.password)) {
      errors.password = "Password must include uppercase, lowercase, number, and special character";
    }

    if (!formData.confirm_password) {
      errors.confirm_password = "Please confirm your password";
    } else if (formData.password !== formData.confirm_password) {
      errors.confirm_password = "Passwords do not match";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const result = await adminRegister(formData);
    if (result.success) {
      navigate("/admin");
    }
  };

  return (
    <div className="form-container">
      <div className="form-card admin-card">
        <div className="form-header">
          <h2 className="form-title">
            <i className="fas fa-user-shield"></i> Admin Registration
          </h2>
          <p className="form-subtitle">Create administrator account with elevated privileges</p>
        </div>

        {error && (
          <div className="alert alert-error">
            <i className="fas fa-exclamation-circle"></i> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="admin-note">
            <div className="note-box">
              <i className="fas fa-exclamation-triangle"></i>
              <div>
                <strong>Important:</strong> This form creates an administrator account with full system access.
                Use this only if you need administrative privileges. All admin activities are logged.
              </div>
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="username">
                <i className="fas fa-user"></i> Admin Username *
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={formErrors.username ? "error" : ""}
                disabled={loading}
                placeholder="Choose admin username"
              />
              {formErrors.username && (
                <span className="error-message">
                  <i className="fas fa-exclamation-triangle"></i> {formErrors.username}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="email">
                <i className="fas fa-envelope"></i> Admin Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={formErrors.email ? "error" : ""}
                disabled={loading}
                placeholder="admin@yourdomain.com"
              />
              {formErrors.email && (
                <span className="error-message">
                  <i className="fas fa-exclamation-triangle"></i> {formErrors.email}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="first_name">
                <i className="fas fa-id-card"></i> First Name
              </label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                disabled={loading}
                placeholder="First name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="last_name">
                <i className="fas fa-id-card"></i> Last Name
              </label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                disabled={loading}
                placeholder="Last name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">
                <i className="fas fa-phone"></i> Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={loading}
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div className="form-group">
              <label htmlFor="department">
                <i className="fas fa-building"></i> Department / Role
              </label>
              <input
                type="text"
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                disabled={loading}
                placeholder="e.g., System Administrator"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">
                <i className="fas fa-lock"></i> Admin Password *
                <span className="password-strength">(min. 12 characters with mixed case, numbers & symbols)</span>
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={formErrors.password ? "error" : ""}
                disabled={loading}
                placeholder="Strong admin password"
              />
              {formErrors.password && (
                <span className="error-message">
                  <i className="fas fa-exclamation-triangle"></i> {formErrors.password}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirm_password">
                <i className="fas fa-lock"></i> Confirm Admin Password *
              </label>
              <input
                type="password"
                id="confirm_password"
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleChange}
                className={formErrors.confirm_password ? "error" : ""}
                disabled={loading}
                placeholder="Confirm admin password"
              />
              {formErrors.confirm_password && (
                <span className="error-message">
                  <i className="fas fa-exclamation-triangle"></i> {formErrors.confirm_password}
                </span>
              )}
            </div>
          </div>

          <div className="form-checkbox">
            <label>
              <input type="checkbox" required />
              I understand that I will have full system access and agree to follow security protocols
            </label>
          </div>

          <button
            type="submit"
            className="btn btn-admin btn-block"
            disabled={loading}
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Creating Admin Account...
              </>
            ) : (
              <>
                <i className="fas fa-user-shield"></i> Register as System Administrator
              </>
            )}
          </button>
        </form>

        <div className="form-footer">
          <p className="security-warning">
            <i className="fas fa-shield-alt"></i> Security Warning: Administrator accounts have elevated privileges.
            Protect your credentials and follow security best practices.
          </p>
          <p className="auth-link">
            Already have an admin account?{" "}
            <Link to="/admin-login" className="link-strong">
              Login here
            </Link>
          </p>
          <p className="auth-link">
            <Link to="/register">
              <i className="fas fa-user"></i> Register as regular user
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminRegister;