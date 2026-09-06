import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Eye, EyeOff, ArrowRight, Send, RefreshCw
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import Flaticon from '../components/Flaticon';

export default function PatientRegistrationPage() {
  const navigate = useNavigate();
  const { state, setState } = useAppContext();
  const { user, session, signUp, signIn, resendVerification } = useAuth();
  const isDark = state.theme === 'dark';

  // Modes: 'register' | 'login' | 'check-email'
  const [mode, setMode] = useState('register');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  const [form, setForm] = useState({ name: '', phone: '', email: '', password: '' });

  const set = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));

  // Auto-redirect if email link was clicked and session is established
  useEffect(() => {
    if (session && user?.email_confirmed_at) {
      const patientName = user.user_metadata?.name || form.name || user.email.split('@')[0];
      const patientPhone = user.user_metadata?.phone || form.phone;
      setState(prev => ({
        ...prev,
        patientInfo: {
          name: patientName,
          email: user.email,
          phone: patientPhone
        }
      }));
      navigate('/dashboard');
    }
  }, [session, user]);

  // Cooldown countdown timer for resending link
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    try {
      const { data, error: err } = await signUp(form.email, form.password, {
        name: form.name,
        phone: form.phone
      });

      if (err) {
        setError(err.message || 'Registration failed.');
        return;
      }

      // If email confirmation is required (Supabase email link sent)
      if (data?.user && (!data.user.email_confirmed_at || !data.session)) {
        setMode('check-email');
        setSuccessMsg(`We sent a verification link to ${form.email}`);
        setResendCooldown(45);
      } else {
        // Direct entry
        setState(prev => ({
          ...prev,
          patientInfo: {
            name: form.name,
            email: form.email,
            phone: form.phone
          }
        }));
        navigate('/dashboard');
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!form.email.trim() || !form.password.trim()) {
      setError('Please enter your email and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await signIn(form.email, form.password);

      if (res.requiresVerification) {
        setMode('check-email');
        setError('');
        setSuccessMsg('Your email is not verified yet. We have sent an activation link to your email.');
        await resendVerification(form.email);
        setResendCooldown(45);
        return;
      }

      if (res.error) {
        setError(res.error.message || 'Invalid email or password.');
        return;
      }

      const patientName = res.data?.user?.user_metadata?.name || form.email.split('@')[0];
      const patientPhone = res.data?.user?.user_metadata?.phone || form.phone;

      setState(prev => ({
        ...prev,
        patientInfo: {
          name: patientName,
          email: form.email,
          phone: patientPhone
        }
      }));
      navigate('/dashboard');
    } catch {
      setError('Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendLink = async () => {
    if (resendCooldown > 0 || !form.email) return;
    setError('');
    setLoading(true);
    try {
      const { error: err } = await resendVerification(form.email);
      if (err) {
        setError(err.message || 'Failed to resend verification link.');
      } else {
        setSuccessMsg(`A new verification link has been sent to ${form.email}`);
        setResendCooldown(60);
      }
    } catch {
      setError('Failed to resend email link.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = () => {
    setState(prev => ({
      ...prev,
      patientInfo: {
        name: 'Guest Patient',
        email: '',
        phone: ''
      }
    }));
    navigate('/dashboard');
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 64px)',
      background: isDark ? '#09090b' : 'radial-gradient(circle at 10% 20%, #e0f2fe 0%, #f0fdfa 40%, #f8fafc 90%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '24px 20px 48px',
      boxSizing: 'border-box',
      color: isDark ? '#ffffff' : '#0f172a'
    }}>

      {/* Top Navigation */}
      <div style={{ width: '100%', maxWidth: 1040, marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button
          onClick={() => {
            if (mode === 'check-email') {
              setMode('register');
            } else {
              navigate('/');
            }
          }}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: isDark ? '#121215' : '#ffffff',
            border: isDark ? '1px solid #27272a' : '1px solid #e2e8f0',
            padding: '6px 14px', borderRadius: 8,
            cursor: 'pointer',
            color: '#0284c7',
            fontWeight: 700,
            fontSize: 12,
            boxShadow: isDark ? 'none' : '0 1px 3px rgba(0,0,0,0.04)',
            transition: 'all 0.15s ease'
          }}
        >
          <ArrowLeft size={14} /> {mode === 'check-email' ? 'Back to Form' : 'Back to Home'}
        </button>

        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: isDark ? '#121215' : '#ffffff',
          border: isDark ? '1px solid #27272a' : '1px solid #e2e8f0',
          padding: '5px 12px', borderRadius: 8,
          color: '#0284c7', fontSize: 12, fontWeight: 700
        }}>
          <Flaticon name="fi-sr-shield-check" size={13} color="#0284c7" />
          <span>Patient Identity & Token Portal</span>
        </div>
      </div>

      {/* Main 2-Column Responsive Layout */}
      <div style={{
        width: '100%', maxWidth: 1040,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: 20,
        alignItems: 'start'
      }}>

        {/* Left Informational Showcase */}
        <div className="card animate-fade-in" style={{
          padding: '28px 24px',
          borderRadius: 18,
          background: isDark
            ? 'linear-gradient(145deg, #121215 0%, #18181b 100%)'
            : 'linear-gradient(145deg, #ffffff 0%, #f0f9ff 100%)',
          border: isDark ? '1px solid #27272a' : '1px solid #bae6fd',
          boxShadow: isDark ? '0 12px 30px rgba(0,0,0,0.5)' : '0 8px 24px rgba(14,165,233,0.08)',
          display: 'flex',
          flexDirection: 'column',
          gap: 18
        }}>
          <div>
            <span style={{
              fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5,
              color: '#0284c7', background: isDark ? '#082f49' : '#e0f2fe',
              padding: '3px 8px', borderRadius: 6
            }}>
              Smart Patient Check-in
            </span>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: isDark ? '#ffffff' : '#0f172a', letterSpacing: -0.4, marginTop: 8, marginBottom: 4 }}>
              Hospital Queue & Fast-Track Triage
            </h2>
            <p style={{ fontSize: 13, color: isDark ? '#a1a1aa' : '#64748b', lineHeight: 1.5, margin: 0 }}>
              Create an account or sign in to save your medical history, manage current appointment tokens, and receive live SMS or email alerts when your turn approaches.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: 8, background: isDark ? '#082f49' : '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Flaticon name="fi-sr-heart" size={16} color="#0284c7" />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: isDark ? '#ffffff' : '#1e293b' }}>Multi-Department Routing</div>
                <div style={{ fontSize: 12, color: isDark ? '#a1a1aa' : '#64748b', marginTop: 1 }}>General, Emergency, Pediatrics, Cardiology, Orthopedics, and Accessibility lanes.</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: 8, background: isDark ? '#052e16' : '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Flaticon name="fi-sr-check-circle" size={16} color="#16a34a" />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: isDark ? '#ffffff' : '#1e293b' }}>Live Queue Synchronization</div>
                <div style={{ fontSize: 12, color: isDark ? '#a1a1aa' : '#64748b', marginTop: 1 }}>Real-time wait estimations and doctor room assignment alerts.</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: 8, background: isDark ? '#042f2e' : '#ccfbf1', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Flaticon name="fi-sr-bolt" size={16} color="#0d9488" />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: isDark ? '#ffffff' : '#1e293b' }}>1-Click Instant Guest Access</div>
                <div style={{ fontSize: 12, color: isDark ? '#a1a1aa' : '#64748b', marginTop: 1 }}>Visiting without an email? You can check in instantly as a guest.</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Main Form Card */}
        <div className="card animate-slide-up" style={{
          width: '100%',
          borderRadius: 18,
          background: isDark ? '#121215' : '#ffffff',
          border: isDark ? '1px solid #27272a' : '1px solid #e2e8f0',
          boxShadow: isDark ? '0 16px 36px rgba(0,0,0,0.6)' : '0 8px 24px rgba(2, 132, 199, 0.08)',
          overflow: 'hidden'
        }}>

          {/* Card Header Branding */}
          <div style={{
            padding: '20px 24px 14px',
            textAlign: 'center',
            borderBottom: isDark ? '1px solid #27272a' : '1px solid #f1f5f9',
            background: isDark ? '#18181b' : '#f8fafc'
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: mode === 'check-email'
                ? 'linear-gradient(135deg, #0d9488 0%, #0284c7 100%)'
                : 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 10px',
              boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)'
            }}>
              {mode === 'check-email' ? <Flaticon name="fi-sr-envelope" size={22} color="#ffffff" /> : <Flaticon name="fi-sr-heart" size={22} color="#ffffff" />}
            </div>

            <h2 style={{ fontSize: 19, fontWeight: 800, color: isDark ? '#ffffff' : '#0f172a', letterSpacing: -0.4, marginBottom: 2 }}>
              {mode === 'check-email'
                ? 'Check Your Email'
                : mode === 'register'
                ? 'Patient Registration'
                : 'Patient Sign In'}
            </h2>
            <p style={{ color: isDark ? '#a1a1aa' : '#64748b', fontSize: 12, margin: 0 }}>
              {mode === 'check-email'
                ? 'We sent an activation link to verify your email address'
                : mode === 'register'
                ? 'Register with verified email to manage hospital queues and visits'
                : 'Sign in to access your verified medical visits and active tokens'}
            </p>
          </div>

          <div style={{ padding: '18px 24px 24px' }}>

            {/* Segmented Tab Switcher */}
            {mode !== 'check-email' && (
              <div style={{
                display: 'flex',
                background: isDark ? '#18181b' : '#f1f5f9',
                borderRadius: 10,
                padding: 3,
                marginBottom: 16
              }}>
                <button
                  type="button"
                  onClick={() => { setMode('register'); setError(''); setSuccessMsg(''); }}
                  style={{
                    flex: 1, padding: '8px 12px', border: 'none', borderRadius: 8,
                    background: mode === 'register' ? (isDark ? '#27272a' : '#ffffff') : 'transparent',
                    fontWeight: 700, fontSize: 12,
                    color: mode === 'register' ? '#0284c7' : (isDark ? '#a1a1aa' : '#64748b'),
                    boxShadow: mode === 'register' ? '0 1px 4px rgba(0,0,0,0.06)' : 'none',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Flaticon name="fi-rr-user-add" size={13} color={mode === 'register' ? '#0284c7' : '#64748b'} /> Create Account
                </button>
                <button
                  type="button"
                  onClick={() => { setMode('login'); setError(''); setSuccessMsg(''); }}
                  style={{
                    flex: 1, padding: '8px 12px', border: 'none', borderRadius: 8,
                    background: mode === 'login' ? (isDark ? '#27272a' : '#ffffff') : 'transparent',
                    fontWeight: 700, fontSize: 12,
                    color: mode === 'login' ? '#0284c7' : (isDark ? '#a1a1aa' : '#64748b'),
                    boxShadow: mode === 'login' ? '0 1px 4px rgba(0,0,0,0.06)' : 'none',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Flaticon name="fi-rr-sign-in-alt" size={13} color={mode === 'login' ? '#0284c7' : '#64748b'} /> Sign In
                </button>
              </div>
            )}

            {error && (
              <div className="alert alert-error mb-4 animate-slide-up" style={{ borderRadius: 10, fontSize: 12 }}>
                {error}
              </div>
            )}

            {successMsg && (
              <div className="alert alert-success mb-4 animate-slide-up" style={{ borderRadius: 10, fontSize: 12 }}>
                {successMsg}
              </div>
            )}

            {/* ── 1. CHECK EMAIL VERIFICATION LINK SCREEN ── */}
            {mode === 'check-email' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, textAlign: 'center' }}>
                <div style={{
                  background: isDark ? '#042f2e' : '#f0fdfa',
                  border: isDark ? '1px solid #0f766e' : '1px solid #99f6e4',
                  borderRadius: 14, padding: '16px 14px'
                }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: isDark ? '#0f766e' : '#ccfbf1', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' }}>
                    <Send size={18} color={isDark ? '#5eead4' : '#0d9488'} />
                  </div>
                  <div style={{ fontSize: 12, color: isDark ? '#5eead4' : '#0f766e', fontWeight: 600, marginBottom: 2 }}>
                    Verification Link Sent To:
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: isDark ? '#ffffff' : '#134e4a' }}>
                    {form.email}
                  </div>
                  <div style={{ fontSize: 12, color: isDark ? '#a1a1aa' : '#64748b', marginTop: 8, lineHeight: 1.45 }}>
                    Please check your inbox (and spam folder) and click the <strong>Confirm Email</strong> link to activate your hospital patient account.
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <button
                    type="button"
                    onClick={handleResendLink}
                    disabled={resendCooldown > 0 || loading}
                    className="btn btn-full"
                    style={{
                      height: 42, borderRadius: 10, fontSize: 13, fontWeight: 700,
                      background: resendCooldown > 0 ? (isDark ? '#27272a' : '#f1f5f9') : '#0284c7',
                      color: resendCooldown > 0 ? '#94a3b8' : '#ffffff',
                      border: 'none', cursor: resendCooldown > 0 ? 'default' : 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
                    }}
                  >
                    <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                    <span>{resendCooldown > 0 ? `Resend Link in ${resendCooldown}s` : 'Resend Verification Link'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    style={{
                      height: 40, borderRadius: 10,
                      background: 'transparent',
                      border: isDark ? '1px solid #27272a' : '1px solid #e2e8f0',
                      color: isDark ? '#ffffff' : '#334155',
                      fontSize: 13, fontWeight: 700, cursor: 'pointer'
                    }}
                  >
                    Back to Sign In
                  </button>
                </div>
              </div>
            ) : (
              /* ── 2. REGISTER / LOGIN FORM ── */
              <form onSubmit={mode === 'register' ? handleRegister : handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {mode === 'register' && (
                  <>
                    <div>
                      <label className="label" style={{ fontSize: 12, fontWeight: 700, color: isDark ? '#ffffff' : '#334155', marginBottom: 4 }}>
                        Full Name <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <div style={{ position: 'relative' }}>
                        <Flaticon name="fi-rr-user" size={15} color="#0284c7" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                        <input
                          className="input"
                          style={{
                            paddingLeft: 38, borderRadius: 10, height: 42, fontSize: 13,
                            border: isDark ? '1px solid #27272a' : '1px solid #cbd5e1',
                            background: isDark ? '#18181b' : '#f8fafc',
                            color: isDark ? '#ffffff' : '#0f172a'
                          }}
                          placeholder="e.g. Sameer Kumar"
                          value={form.name}
                          onChange={set('name')}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="label" style={{ fontSize: 12, fontWeight: 700, color: isDark ? '#ffffff' : '#334155', marginBottom: 4 }}>
                        Phone Number
                      </label>
                      <div style={{ position: 'relative' }}>
                        <Flaticon name="fi-rr-phone-call" size={15} color="#0284c7" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                        <input
                          className="input"
                          style={{
                            paddingLeft: 38, borderRadius: 10, height: 42, fontSize: 13,
                            border: isDark ? '1px solid #27272a' : '1px solid #cbd5e1',
                            background: isDark ? '#18181b' : '#f8fafc',
                            color: isDark ? '#ffffff' : '#0f172a'
                          }}
                          type="tel"
                          placeholder="+91 98765 43210"
                          value={form.phone}
                          onChange={set('phone')}
                        />
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <label className="label" style={{ fontSize: 12, fontWeight: 700, color: isDark ? '#ffffff' : '#334155', marginBottom: 4 }}>
                    Email Address <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Flaticon name="fi-rr-envelope" size={15} color="#0284c7" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      className="input"
                      style={{
                        paddingLeft: 38, borderRadius: 10, height: 42, fontSize: 13,
                        border: isDark ? '1px solid #27272a' : '1px solid #cbd5e1',
                        background: isDark ? '#18181b' : '#f8fafc',
                        color: isDark ? '#ffffff' : '#0f172a'
                      }}
                      type="email"
                      placeholder="patient@example.com"
                      value={form.email}
                      onChange={set('email')}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="label" style={{ fontSize: 12, fontWeight: 700, color: isDark ? '#ffffff' : '#334155', marginBottom: 4 }}>
                    Password <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Flaticon name="fi-rr-lock" size={15} color="#0284c7" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      className="input"
                      style={{
                        paddingLeft: 38, paddingRight: 38, borderRadius: 10, height: 42, fontSize: 13,
                        border: isDark ? '1px solid #27272a' : '1px solid #cbd5e1',
                        background: isDark ? '#18181b' : '#f8fafc',
                        color: isDark ? '#ffffff' : '#0f172a'
                      }}
                      type={showPassword ? 'text' : 'password'}
                      placeholder={mode === 'register' ? 'Min 6 characters' : 'Enter your password'}
                      value={form.password}
                      onChange={set('password')}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(v => !v)}
                      style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="btn btn-full"
                  disabled={loading}
                  style={{
                    height: 44, borderRadius: 10, fontSize: 14, fontWeight: 700,
                    background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
                    color: '#ffffff', border: 'none', cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(2, 132, 199, 0.28)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    marginTop: 2
                  }}
                >
                  {loading ? (
                    'Processing...'
                  ) : mode === 'register' ? (
                    <><span>Register & Send Link</span> <ArrowRight size={15} /></>
                  ) : (
                    <><span>Sign In</span> <ArrowRight size={15} /></>
                  )}
                </button>
              </form>
            )}

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '16px 0 14px', color: isDark ? '#a1a1aa' : '#94a3b8', fontSize: 11, fontWeight: 700 }}>
              <div style={{ flex: 1, height: 1, background: isDark ? '#27272a' : '#e2e8f0' }} />
              <span>OR GUEST CHECK-IN</span>
              <div style={{ flex: 1, height: 1, background: isDark ? '#27272a' : '#e2e8f0' }} />
            </div>

            {/* Quick Guest Access Button */}
            <button
              type="button"
              onClick={handleGuestLogin}
              style={{
                width: '100%', height: 42, borderRadius: 10,
                border: isDark ? '1px dashed #3f3f46' : '1px dashed #cbd5e1',
                background: isDark ? '#18181b' : '#f8fafc',
                cursor: 'pointer',
                color: isDark ? '#ffffff' : '#334155',
                fontSize: 13,
                fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
              }}
            >
              <Flaticon name="fi-sr-bolt" size={14} color="#0284c7" />
              <span>Continue as Guest Patient</span>
            </button>

            {/* Features Footer */}
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6,
              marginTop: 16, paddingTop: 12, borderTop: isDark ? '1px solid #27272a' : '1px solid #f1f5f9'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: isDark ? '#a1a1aa' : '#64748b' }}>
                <Flaticon name="fi-sr-check-circle" size={12} color="#10b981" />
                <span>Verified Patient Records</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: isDark ? '#a1a1aa' : '#64748b' }}>
                <Flaticon name="fi-sr-check-circle" size={12} color="#10b981" />
                <span>Multi-Dept Token Sync</span>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
