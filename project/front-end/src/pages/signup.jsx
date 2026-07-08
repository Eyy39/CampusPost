import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  GraduationCap,
  ArrowRight,
} from 'lucide-react';
import Layout from '../components/Layout';
import '../styles/signup.css';

export default function Signup() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    agreed: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <Layout activePage="Sign Up">
      <div className="signup-page">
        <main className="signup-main">
        <div className="signup-left">
          <div
            className="signup-left-bg"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1523050854058-8df90110c7f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80')`,
            }}
          />
          <div className="signup-left-overlay" />
          <div className="signup-left-card">
            <h3>Join a community of future leaders.</h3>
            <p>
              Discover the perfect university and scholarship opportunities
              tailored just for you.
            </p>
          </div>
        </div>

        <div className="signup-right">
          <div className="signup-form-container">
            <div className="signup-form-header">
              <h2>Start Your Journey</h2>
              <p>Empower your academic future with CampusPost.</p>
            </div>

            <form onSubmit={handleSubmit} className="signup-form">
              <div className="signup-input-group">
                <label htmlFor="name">Full Name</label>
                <div className="signup-input-wrapper">
                  <User size={18} className="signup-input-icon" />
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="signup-input-group">
                <label htmlFor="email">Email Address</label>
                <div className="signup-input-wrapper">
                  <Mail size={18} className="signup-input-icon" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="signup-input-group">
                <label htmlFor="password">Password</label>
                <div className="signup-input-wrapper">
                  <Lock size={18} className="signup-input-icon" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    className="signup-password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <label className="signup-checkbox">
                <input
                  type="checkbox"
                  name="agreed"
                  checked={form.agreed}
                  onChange={handleChange}
                  required
                />
                <span className="signup-checkbox-mark" />
                <span className="signup-checkbox-text">
                  I agree to the{' '}
                  <a href="#">Terms & Conditions</a> and{' '}
                  <a href="#">Privacy Policy</a>.
                </span>
              </label>

              <button type="submit" className="signup-submit-btn">
                Create Account
                <ArrowRight size={18} />
              </button>
            </form>

            <div className="signup-divider">
              <span>OR SIGN UP WITH</span>
            </div>

            <div className="signup-social">
              <button className="signup-social-btn signup-social-google">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google
              </button>
              <button className="signup-social-btn signup-social-facebook">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </button>
            </div>

            <p className="signup-bottom-text">
              Already have an account? <Link to="/login">Sign In</Link>
            </p>
          </div>
        </div>
      </main>
    </div>
    </Layout>
  );
}
