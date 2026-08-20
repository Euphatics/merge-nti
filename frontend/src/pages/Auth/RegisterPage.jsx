import { useState, useEffect } from 'react';
import { Eye, EyeOff, ArrowRight, FlaskConical, Cpu, Settings, Calculator, Trophy, BookOpen, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../config/api';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    schoolName: '',
    email: '',
    username: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [regStatus, setRegStatus] = useState({ loading: true, isOpen: true, startDate: null, endDate: null });

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/auth/registration-status`)
      .then(res => res.json())
      .then(data => setRegStatus({ loading: false, isOpen: data.isOpen, startDate: data.startDate, endDate: data.endDate }))
      .catch(() => setRegStatus(prev => ({ ...prev, loading: false })));
  }, []);

  const validate = (data) => {
    let newErrors = {};
    if (!data.schoolName.trim()) newErrors.schoolName = 'Required';
    if (!data.email.trim()) newErrors.email = 'Required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) newErrors.email = 'Invalid email';
    if (!data.username.trim()) newErrors.username = 'Required';
    if (!data.password) newErrors.password = 'Required';
    else if (
      data.password.length < 8 ||
      !/[0-9]/.test(data.password) ||
      !/[^A-Za-z0-9]/.test(data.password)
    ) {
      newErrors.password = 'Password must be at least 8 chars, 1 number, 1 special char';
    }
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      setErrors(validate({ ...formData, [name]: value }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors(validate(formData));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate(formData);
    setErrors(validationErrors);
    setTouched({
      schoolName: true,
      email: true,
      username: true,
      password: true,
    });

    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const data = await response.json();
        if (response.ok) {
          toast.success('Registration successful! Please check your email for verification. You can log in now.');
          navigate('/login', { state: { message: 'Registered successfully! Please log in.' } });
        } else {
          toast.error(`Error: ${data.error || data.message || 'Registration failed'}`);
        }
      } catch (error) {
        console.error('Error during registration:', error);
        toast.error('Network error. Please try again later.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const criteria = [
    { label: '8+ characters', met: formData.password.length >= 8 },
    { label: 'At least 1 number', met: /[0-9]/.test(formData.password) },
    { label: 'At least 1 special char', met: /[^A-Za-z0-9]/.test(formData.password) }
  ];

  return (
    <div className="login-page">
      <Helmet>
        <title>Register | NTI Olympiad</title>
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
              <h2>REGISTER</h2>
              <p>Create a school account to join the NTI network.</p>
            </div>

            {!regStatus.loading && !regStatus.isOpen && (
              <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA', color: '#991B1B', padding: '14px 16px', borderRadius: '6px', marginBottom: '20px', fontSize: '14px', textAlign: 'center', fontWeight: '500', lineHeight: '1.5' }}>
                Registration is currently closed.
                {regStatus.startDate && regStatus.endDate && (
                  <> It is open from <strong>{new Date(regStatus.startDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</strong> to <strong>{new Date(regStatus.endDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</strong>.</>
                )}
              </div>
            )}

            {!regStatus.loading && regStatus.isOpen && regStatus.endDate && (
              <div style={{ backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', color: '#065F46', padding: '10px 16px', borderRadius: '6px', marginBottom: '20px', fontSize: '13px', textAlign: 'center', fontWeight: '500' }}>
                Registration is open until <strong>{new Date(regStatus.endDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</strong>.
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="login-form">
              <div className="login-field">
                <label>SCHOOL NAME <span className="asterisk">*</span></label>
                <input
                  type="text"
                  name="schoolName"
                  placeholder="Enter School Name"
                  value={formData.schoolName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  style={touched.schoolName && errors.schoolName ? { borderColor: '#EF4444' } : {}}
                />
                {touched.schoolName && errors.schoolName && (
                  <span className="error-text">{errors.schoolName}</span>
                )}
              </div>

              <div className="login-field">
                <label>OFFICIAL EMAIL <span className="asterisk">*</span></label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter Official Email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  style={touched.email && errors.email ? { borderColor: '#EF4444' } : {}}
                />
                {touched.email && errors.email && (
                  <span className="error-text">{errors.email}</span>
                )}
              </div>

              <div className="login-field">
                <label>USERNAME <span className="asterisk">*</span></label>
                <input
                  type="text"
                  name="username"
                  placeholder="Choose a Username"
                  value={formData.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  style={touched.username && errors.username ? { borderColor: '#EF4444' } : {}}
                />
                {touched.username && errors.username && (
                  <span className="error-text">{errors.username}</span>
                )}
              </div>

              <div className="login-field">
                <label>PASSWORD <span className="asterisk">*</span></label>
                <div className="password-wrap">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Enter your Password"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    style={touched.password && errors.password ? { borderColor: '#EF4444' } : {}}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="eye-btn"
                  >
                    {showPassword ? <EyeOff size={18} color="#9CA3AF" /> : <Eye size={18} color="#9CA3AF" />}
                  </button>
                </div>
                {touched.password && errors.password && (
                  <span className="error-text">{errors.password}</span>
                )}
              </div>

              <div className="password-criteria">
                <p className="criteria-title">Password requirements:</p>
                <ul className="criteria-list">
                  {criteria.map((c, i) => (
                    <li key={i} className={c.met ? 'met' : ''}>
                      {c.met ? <Check size={14} className="check-icon" /> : <span className="dot" />}
                      {c.label}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="submit-wrap" style={{ marginTop: '16px' }}>
                <button type="submit" disabled={isSubmitting || (!regStatus.loading && !regStatus.isOpen)} className="submit-btn" style={{ width: '100%', justifyContent: 'center' }}>
                  {isSubmitting ? 'REGISTERING...' : 'CREATE ACCOUNT'} 
                  {!isSubmitting && <ArrowRight size={18} />}
                </button>
              </div>
            </form>

            <div className="login-footer">
              <p className="mt-3 text-[#4B5563]">
                Already have an account? <Link to="/login" className="font-semibold text-[#1976D2] hover:underline">Click here to log in</Link>
              </p>
            </div>

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

        /* ── LEFT ── */
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

        /* Blobs */
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

        /* Visual Container */
        .visual-container {
          position: relative;
          width: 280px;
          height: 280px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 40px;
        }

        /* Center Glass */
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

        /* Orbit Items */
        .orbit-item {
          position: absolute;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 18px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
          animation: floatIcon 6s infinite alternate ease-in-out;
        }

        .item-1 {
          top: 5%; left: 0%; width: 56px; height: 56px;
          background: linear-gradient(135deg, #F87171, #DC2626);
          --rot: -10;
        }
        .item-2 {
          top: 10%; right: 5%; width: 50px; height: 50px;
          background: linear-gradient(135deg, #34D399, #059669);
          --rot: 15;
          animation-delay: -1.5s;
        }
        .item-3 {
          bottom: 10%; left: 5%; width: 64px; height: 64px;
          background: linear-gradient(135deg, #60A5FA, #2563EB);
          --rot: -5;
          animation-delay: -3s;
        }
        .item-4 {
          bottom: 15%; right: 0%; width: 54px; height: 54px;
          background: linear-gradient(135deg, #FBBF24, #D97706);
          --rot: 10;
          animation-delay: -4.5s;
        }

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

        /* ── RIGHT ── */
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
          gap: 20px;
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

        .login-field input[type="text"],
        .login-field input[type="email"],
        .login-field input[type="password"] {
          width: 100%;
          padding: 12px 14px;
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
          
        .error-text {
          font-size: 12px;
          color: #EF4444;
          font-weight: 500;
          margin-top: 2px;
        }

        .password-wrap {
          position: relative;
        }

        .password-wrap input {
          padding-right: 40px;
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

        .password-criteria {
          background: #F9FAFB;
          border: 1px solid #E5E7EB;
          border-radius: 8px;
          padding: 16px;
          margin-top: -4px;
        }

        .criteria-title {
          font-size: 12px;
          font-weight: 600;
          color: #4B5563;
          margin: 0 0 10px 0;
        }

        .criteria-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .criteria-list li {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: #9CA3AF;
        }

        .criteria-list li.met {
          color: #059669;
          font-weight: 500;
        }

        .check-icon {
          color: #059669;
        }

        .dot {
          width: 4px;
          height: 4px;
          background: #D1D5DB;
          border-radius: 50%;
          margin-left: 5px;
          margin-right: 5px;
        }

        .submit-wrap {
          display: flex;
          justify-content: flex-end;
        }

        .submit-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 24px;
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

        .submit-btn:disabled {
          background: #93C5FD;
          cursor: not-allowed;
        }

        .submit-btn:hover:not(:disabled) {
          background: #1565C0;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(25, 118, 210, 0.2);
        }

        .login-footer {
          margin-top: 32px;
          font-size: 13px;
          color: #6B7280;
          text-align: center;
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
