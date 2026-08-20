import { useState } from 'react';
import { Eye, EyeOff, ArrowRight, FlaskConical, Cpu, Settings, Calculator, Trophy, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ROUTES } from '../../config/routes';
import { API_BASE_URL } from '../../config/api';
import './LoginPage.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!email.trim()) newErrors.email = 'Email or User ID is required';
    if (!password) newErrors.password = 'Password is required';

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      toast.error('Please fill in all required fields.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store user data so SchoolPanel can use the real schoolId
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }
        toast.success('Login successful!');
        navigate('/school-panel');
      } else {
        toast.error(`Error: ${data.error || 'Login failed'}`);
      }
    } catch (error) {
      console.error('Error during login:', error);
      toast.error('Network error. Is the backend server running?');
    }
  };

  return (
    <div className="login-page">
      <Helmet>
        <title>Sign In – NTI Olympiad Portal</title>
        <meta name="description" content="Access your NTI Olympiad student or school coordinator portal to view registrations and results." />
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href="https://ntiolympiad.in/login" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Sign In – NTI Olympiad Portal" />
        <meta property="og:description" content="Access your NTI Olympiad student or school coordinator portal to view registrations and results." />
        <meta property="og:site_name" content="NTI Olympiad" />
        <meta property="og:image" content="https://ntiolympiad.in/about_nti_banner.png" />
        <meta property="og:url" content="https://ntiolympiad.in/login" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Sign In – NTI Olympiad Portal" />
        <meta name="twitter:description" content="Access your NTI Olympiad student or school coordinator portal to view registrations and results." />
        <meta name="twitter:image" content="https://ntiolympiad.in/about_nti_banner.png" />
      </Helmet>

      {/* Background layer */}
      <div className="login-blue-bg" />

      {/* Content layer */}
      <div className="login-content">

        {/* ───────── LEFT SIDE ───────── */}
        <div className="login-left">
          <div className="login-visual-panel">
            {/* Animated glowing blobs */}
            <div className="blob blob-1"></div>
            <div className="blob blob-2"></div>
            <div className="blob blob-3"></div>

            {/* Main Visual Container */}
            <div className="visual-container">

              {/* Orbiting Icons */}
              <div className="orbit-item item-1">
                <FlaskConical size={26} color="#fff" strokeWidth={2.5} />
              </div>
              <div className="orbit-item item-2">
                <Cpu size={24} color="#fff" strokeWidth={2.5} />
              </div>
              <div className="orbit-item item-3">
                <BookOpen size={28} color="#fff" strokeWidth={2.5} />
              </div>
              <div className="orbit-item item-4">
                <Calculator size={26} color="#fff" strokeWidth={2.5} />
              </div>

              {/* Center Glass Sphere */}
              <div className="center-glass">
                <Trophy size={60} color="#FBBF24" className="trophy-icon" strokeWidth={2} />
              </div>
            </div>

            {/* Typography */}
            <div className="visual-text">
              <h2>NTI OLYMPIAD</h2>
              <p>Challenge your reasoning, benchmark your performance, and achieve national excellence.</p>
            </div>
          </div>
        </div>

        {/* ───────── RIGHT SIDE ───────── */}
        <div className="login-right">
          <div className="login-card">

            {/* Header */}
            <div className="login-header">
              <div className="login-brand-left">
                <span>NATIONAL TALENT</span>
                <span>IDENTIFICATION</span>
              </div>

              <div className="login-brand-right">
                <div className="login-circles">
                  <div className="circle circle-red"><FlaskConical size={18} color="#fff" /></div>
                  <div className="circle circle-green"><Cpu size={18} color="#fff" /></div>
                  <div className="circle circle-blue"><Settings size={18} color="#fff" /></div>
                  <div className="circle circle-yellow"><Calculator size={18} color="#fff" /></div>
                </div>
                <div className="login-logo-text">
                  <strong>NTI</strong> OLYMPIAD
                </div>
              </div>
            </div>


            {/* Center Title */}
            <div className="login-center-title">
              <h2>LOG IN</h2>
              <p>Log into your <span className="underline">NTI</span> account.</p>
            </div>

            {location.state?.message && (
              <div style={{ backgroundColor: '#DEF7EC', border: '1px solid #31C48D', color: '#03543F', padding: '12px', borderRadius: '6px', marginBottom: '20px', fontSize: '14px', textAlign: 'center', fontWeight: '500' }}>
                {location.state.message}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="login-form">
              <div className="login-field">
                <label>EMAIL OR USER ID <span className="asterisk">*</span></label>
                <input
                  type="text"
                  placeholder="Enter your Email or Organization User ID"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({ ...errors, email: null });
                  }}
                  style={errors.email ? { borderColor: '#ef4444' } : {}}
                />
                {errors.email && <span className="text-xs text-red-500 mt-1">{errors.email}</span>}
              </div>

              <div className="login-field">
                <label>PASSWORD <span className="asterisk">*</span></label>
                <div className="password-wrap" style={errors.password ? { borderColor: '#ef4444' } : {}}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your Password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors({ ...errors, password: null });
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="eye-btn"
                  >
                    {showPassword ? <EyeOff size={18} color="#9CA3AF" /> : <Eye size={18} color="#9CA3AF" />}
                  </button>
                </div>
                {errors.password && <span className="text-xs text-red-500 mt-1">{errors.password}</span>}
                <div className="forgot-link-wrap">
                  <Link to={ROUTES.forgotPassword} className="forgot-link">Forgot Password?</Link>
                </div>
              </div>

              <div className="submit-wrap">
                <button type="submit" className="submit-btn">
                  LOGIN <ArrowRight size={18} />
                </button>
              </div>
            </form>

            <div className="login-footer">
              <p>Use one account for every NTI Olympiad. Access all subjects and manage your registrations from one dashboard.</p>
              <p className="mt-3 text-[#4B5563]">
                Don't have a school account? <Link to="/register" className="font-semibold text-[#1976D2] hover:underline">Click here to register</Link>
              </p>
            </div>

          </div>
        </div>
      </div>


    </div>
  );
}
