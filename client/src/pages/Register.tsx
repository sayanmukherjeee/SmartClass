import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { RegisterData } from "../types/index";
import "../styles/form.css";

const Register: React.FC = () => {
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
  const { register, error, loading } = useAuth();
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
    } else if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
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

    const result = await register(formData);
    if (result.success) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <div className="form-header">
          <h2 className="form-title">
            <i className="fas fa-user-plus"></i> Create Account
          </h2>
          <p className="form-subtitle">Join thousands of learners worldwide</p>
        </div>

        {error && (
          <div className="alert alert-error">
            <i className="fas fa-exclamation-circle"></i> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="username">
                <i className="fas fa-user"></i> Username *
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={formErrors.username ? "error" : ""}
                disabled={loading}
                placeholder="Choose a username"
              />
              {formErrors.username && (
                <span className="error-message">
                  <i className="fas fa-exclamation-triangle"></i> {formErrors.username}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="email">
                <i className="fas fa-envelope"></i> Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={formErrors.email ? "error" : ""}
                disabled={loading}
                placeholder="your@email.com"
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
                placeholder="Phone number"
              />
            </div>

            <div className="form-group">
              <label htmlFor="department">
                <i className="fas fa-building"></i> Department
              </label>
              <input
                type="text"
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                disabled={loading}
                placeholder="Department"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">
                <i className="fas fa-lock"></i> Password *
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={formErrors.password ? "error" : ""}
                disabled={loading}
                placeholder="At least 8 characters"
              />
              {formErrors.password && (
                <span className="error-message">
                  <i className="fas fa-exclamation-triangle"></i> {formErrors.password}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirm_password">
                <i className="fas fa-lock"></i> Confirm Password *
              </label>
              <input
                type="password"
                id="confirm_password"
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleChange}
                className={formErrors.confirm_password ? "error" : ""}
                disabled={loading}
                placeholder="Confirm your password"
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
              I agree to the{" "}
              <Link to="/terms" className="link">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="link">
                Privacy Policy
              </Link>
            </label>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Creating Account...
              </>
            ) : (
              <>
                <i className="fas fa-user-plus"></i> Create Account
              </>
            )}
          </button>
        </form>

        <div className="form-footer">
          <div className="social-login">
            <p>Or sign up with</p>
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
            Already have an account?{" "}
            <Link to="/login" className="link-strong">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;