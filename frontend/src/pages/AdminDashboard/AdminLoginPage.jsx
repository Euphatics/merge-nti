import { useState } from 'react';
import { Eye, EyeOff, ArrowRight, Shield, Lock, ShieldCheck } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../config/api';
import './AdminLoginPage.css';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('adminAuth', 'true');
        localStorage.setItem('adminToken', data.token || 'admin-session-token');
        navigate('/admin');
      } else {
        setError(data.error || 'Invalid username or password');
      }
    } catch {
      setError('Network error. Unable to connect to backend server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <Helmet>
        <title>Admin Login – NTI Olympiad</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Background */}
      <div className="admin-login-bg" />

      {/* Animated grid */}
      <div className="admin-grid-overlay" />

      {/* Content */}
      <div className="admin-login-wrapper">

        {/* Left Visual Panel */}
        <div className="admin-login-left">
          <div className="admin-visual">
            {/* Glowing blobs */}
            <div className="a-blob a-blob-1"></div>
            <div className="a-blob a-blob-2"></div>
            <div className="a-blob a-blob-3"></div>

            {/* Floating shield icons */}
            <div className="a-float-icon a-fi-1">
              <Shield size={28} color="#fff" strokeWidth={2} />
            </div>
            <div className="a-float-icon a-fi-2">
              <Lock size={24} color="#fff" strokeWidth={2.5} />
            </div>
            <div className="a-float-icon a-fi-3">
              <ShieldCheck size={30} color="#fff" strokeWidth={2} />
            </div>

            {/* Center glass element */}
            <div className="a-center-orb">
              <Shield size={64} color="#60A5FA" strokeWidth={1.5} />
            </div>

            {/* Text */}
            <div className="a-visual-text">
              <h2>ADMIN PORTAL</h2>
              <p>Secure access to manage schools, students, payments, and olympiad operations.</p>
            </div>
          </div>
        </div>

        {/* Right Card */}
        <div className="admin-login-right">
          <div className="admin-login-card">

            {/* Header */}
            <div className="a-card-header">
              <div className="a-shield-badge">
                <Shield size={20} color="#fff" strokeWidth={2.5} />
              </div>
              <div>
                <h1>Admin Access</h1>
                <p>NTI Olympiad Control Panel</p>
              </div>
            </div>

            {/* Title */}
            <div className="a-card-title">
              <h2>SIGN IN</h2>
              <p>Enter your administrator credentials.</p>
            </div>

            {/* Error */}
            {error && (
              <div className="a-error-banner">
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="a-form">
              <div className="a-field">
                <label>USERNAME <span className="a-asterisk">*</span></label>
                <input
                  type="text"
                  placeholder="Enter admin username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                />
              </div>

              <div className="a-field">
                <label>PASSWORD <span className="a-asterisk">*</span></label>
                <div className="a-password-wrap">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter admin password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="a-eye-btn"
                  >
                    {showPassword ? <EyeOff size={18} color="#9CA3AF" /> : <Eye size={18} color="#9CA3AF" />}
                  </button>
                </div>
              </div>

              <div className="a-submit-wrap">
                <button type="submit" className="a-submit-btn" disabled={loading}>
                  {loading ? (
                    <span className="a-spinner" />
                  ) : (
                    <>
                      SIGN IN <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Footer */}
            <div className="a-card-footer">
              <p>This portal is restricted to authorized administrators only.</p>
            </div>
          </div>
        </div>
      </div>

      
    </div>
  );
}
