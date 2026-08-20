import { useState } from 'react';
import { FlaskConical, Cpu, Settings, Calculator, Trophy, BookOpen, ArrowRight, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ROUTES } from '../../config/routes';
import { API_BASE_URL } from '../../config/api';
import toast from 'react-hot-toast';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    if (!token) {
      setErrorMessage("Reset token is missing from the URL. Please request a new link.");
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || 'Password reset successfully!');
        setIsSubmitted(true);
        setTimeout(() => {
          navigate(ROUTES.login);
        }, 3000);
      } else {
        toast.error(data.error || 'Failed to reset password. The link may have expired.');
        setErrorMessage(data.error || 'Failed to reset password. The link may have expired.');
      }
    } catch (error) {
      console.error('Error during password reset:', error);
      toast.error('Network error. Please try again later.');
      setErrorMessage('Network error. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Helmet>
        <title>Reset Password – NTI Olympiad Portal</title>
        <meta name="description" content="Reset your NTI Olympiad student or school coordinator portal password." />
        <meta name="robots" content="noindex, follow" />
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
              <div className="orbit-item item-1"><FlaskConical size={26} color="#fff" strokeWidth={2.5} /></div>
              <div className="orbit-item item-2"><Cpu size={24} color="#fff" strokeWidth={2.5} /></div>
              <div className="orbit-item item-3"><BookOpen size={28} color="#fff" strokeWidth={2.5} /></div>
              <div className="orbit-item item-4"><Calculator size={26} color="#fff" strokeWidth={2.5} /></div>

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
              <h2>RESET PASSWORD</h2>
              <p>Create a new password for your account.</p>
            </div>

            {/* Form */}
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="login-form">
                {errorMessage && (
                  <div style={{ color: '#dc2626', backgroundColor: '#fee2e2', padding: '12px', borderRadius: '6px', fontSize: '13px', fontWeight: '500' }}>
                    {errorMessage}
                  </div>
                )}
                <div className="login-field">
                  <label>NEW PASSWORD <span className="asterisk">*</span></label>
                  <div className="password-wrap">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter new password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="eye-btn"
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff size={18} color="#9CA3AF" /> : <Eye size={18} color="#9CA3AF" />}
                    </button>
                  </div>
                </div>

                <div className="login-field">
                  <label>CONFIRM PASSWORD <span className="asterisk">*</span></label>
                  <div className="password-wrap">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={isLoading}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="eye-btn"
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? <EyeOff size={18} color="#9CA3AF" /> : <Eye size={18} color="#9CA3AF" />}
                    </button>
                  </div>
                </div>

                <div className="submit-wrap" style={{ marginTop: '16px' }}>
                  <button type="submit" className="submit-btn" style={{ width: '100%', justifyContent: 'center' }} disabled={isLoading}>
                    {isLoading ? (
                      <>
                        RESETTING... <Loader2 className="animate-spin" size={18} />
                      </>
                    ) : (
                      <>
                        RESET PASSWORD <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div className="success-message" style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ width: '60px', height: '60px', background: '#d1fae5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>Password Reset Successful</h3>
                <p style={{ fontSize: '14px', color: '#6B7280', lineHeight: '1.5' }}>
                  Your password has been changed successfully. You will be redirected to the login page shortly.
                </p>
                <p style={{ fontSize: '14px', color: '#6B7280', marginTop: '16px' }}>
                  <Link to={ROUTES.login} style={{ color: '#1976D2', textDecoration: 'none', fontWeight: '500' }}>Click here to login now</Link>
                </p>
              </div>
            )}

          </div>
        </div>
      </div>

      <style>{`
        .login-page {
          position: relative;
          width: 100%;
          min-height: calc(100vh - 64px);
          font-family: 'Inter', sans-serif;
        }
        .login-blue-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: #0f4c9c;
          z-index: 0;
        }
        .login-content {
          position: relative;
          z-index: 1;
          display: flex;
          width: 100%;
          max-width: 1240px;
          margin: 0 auto;
          min-height: calc(100vh - 64px);
        }
        .login-left {
          flex: 0 0 45%;
          padding: 64px 32px 80px 48px;
          display: flex;
          align-items: flex-start;
          justify-content: flex-end;
        }
        .login-visual-panel {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding-bottom: 20px;
          z-index: 2;
        }
        .blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(40px);
          opacity: 0.5;
          animation: floatBlob 8s infinite alternate ease-in-out;
          z-index: -1;
        }
        .blob-1 { top: 15%; left: 15%; width: 160px; height: 160px; background: #60A5FA; }
        .blob-2 { top: 25%; right: 15%; width: 140px; height: 140px; background: #34D399; animation-delay: -2s; }
        .blob-3 { bottom: 25%; left: 25%; width: 180px; height: 180px; background: #818CF8; animation-delay: -4s; }
        @keyframes floatBlob {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(20px, -20px) scale(1.1); }
        }
        .visual-container {
          position: relative;
          width: 280px;
          height: 280px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 40px;
        }
        .center-glass {
          width: 130px;
          height: 130px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15), inset 0 0 20px rgba(255, 255, 255, 0.05);
          z-index: 10;
        }
        .trophy-icon {
          filter: drop-shadow(0 0 12px rgba(251, 191, 36, 0.6));
        }
        .orbit-item {
          position: absolute;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 18px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
          animation: floatIcon 6s infinite alternate ease-in-out;
        }
        .item-1 { top: 5%; left: 0%; width: 56px; height: 56px; background: linear-gradient(135deg, #F87171, #DC2626); --rot: -10; }
        .item-2 { top: 10%; right: 5%; width: 50px; height: 50px; background: linear-gradient(135deg, #34D399, #059669); --rot: 15; animation-delay: -1.5s; }
        .item-3 { bottom: 10%; left: 5%; width: 64px; height: 64px; background: linear-gradient(135deg, #60A5FA, #2563EB); --rot: -5; animation-delay: -3s; }
        .item-4 { bottom: 15%; right: 0%; width: 54px; height: 54px; background: linear-gradient(135deg, #FBBF24, #D97706); --rot: 10; animation-delay: -4.5s; }
        @keyframes floatIcon {
          0% { transform: translateY(0px) rotate(calc(var(--rot) * 1deg)); }
          100% { transform: translateY(-15px) rotate(calc(var(--rot) * 1deg + 5deg)); }
        }
        .visual-text {
          text-align: center;
          color: #fff;
          z-index: 10;
        }
        .visual-text h2 {
          font-family: 'Lora', serif;
          font-size: 32px;
          font-weight: 800;
          letter-spacing: 1px;
          margin: 0 0 12px 0;
          text-shadow: 0 2px 10px rgba(0,0,0,0.15);
        }
        .visual-text p {
          font-family: 'Inter', sans-serif;
          font-size: 15px;
          line-height: 1.6;
          color: rgba(255,255,255,0.9);
          max-width: 340px;
          margin: 0 auto;
        }
        .login-right {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          padding: 64px 48px;
        }
        .login-card {
          width: 100%;
          max-width: 560px;
          background: #ffffff;
          border-radius: 12px;
          padding: 40px;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .login-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
        }
        .login-brand-left {
          display: flex;
          flex-direction: column;
          font-family: 'Montserrat', 'Inter', sans-serif;
          font-weight: 700;
          font-size: 14px;
          letter-spacing: 1.5px;
          color: #1F2937;
          line-height: 1.3;
        }
        .login-brand-right {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .login-circles {
          display: flex;
          gap: 6px;
          margin-bottom: 6px;
        }
        .circle {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .circle-red { background-color: #E53935; }
        .circle-green { background-color: #4CAF50; }
        .circle-blue { background-color: #2196F3; }
        .circle-yellow { background-color: #FF9800; }
        .login-logo-text {
          font-family: 'Montserrat', 'Inter', sans-serif;
          font-size: 13px;
          font-weight: 600;
          color: #1F2937;
          letter-spacing: 0.5px;
        }
        .login-center-title {
          text-align: center;
          margin-bottom: 32px;
        }
        .login-center-title h2 {
          font-size: 32px;
          font-weight: 400;
          color: #374151;
          margin: 0 0 12px 0;
          letter-spacing: 1px;
        }
        .login-center-title p {
          font-size: 14px;
          color: #9CA3AF;
          margin: 0;
        }
        .login-form {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .login-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .login-field label {
          font-size: 11.5px;
          font-weight: 700;
          color: #4B5563;
          letter-spacing: 0.5px;
        }
        .asterisk {
          color: #EF4444;
          margin-left: 2px;
        }
        .password-wrap {
          position: relative;
        }
        .login-field input[type="text"],
        .login-field input[type="password"] {
          width: 100%;
          padding: 12px 40px 12px 14px;
          font-size: 14px;
          border: 1px solid #D1D5DB;
          border-radius: 6px;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          font-family: 'Inter', sans-serif;
        }
        .login-field input::placeholder {
          color: #9CA3AF;
        }
        .login-field input:focus {
          border-color: #1976D2;
          box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
        }
        .eye-btn {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          padding: 4px;
        }
        .submit-wrap {
          display: flex;
          justify-content: flex-end;
          margin-top: 4px;
        }
        .submit-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          background: #1976D2;
          color: #fff;
          font-size: 14px;
          font-weight: 600;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
          letter-spacing: 0.5px;
        }
        .submit-btn:hover {
          background: #1565C0;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(25, 118, 210, 0.2);
        }
        @media (max-width: 768px) {
          .login-content {
            flex-direction: column;
          }
          .login-left, .login-right {
            flex: none;
            width: 100%;
            padding: 24px;
          }
          .login-left > div {
            margin: 0 auto;
          }
          .login-card {
            margin: 0 auto;
            padding: 32px 24px;
          }
          .login-header {
            flex-direction: column;
            gap: 24px;
            align-items: center;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
}
