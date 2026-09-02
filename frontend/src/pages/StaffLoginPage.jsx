import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Eye, EyeOff, ArrowRight
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { staffApi } from '../api/index';
import Flaticon from '../components/Flaticon';

const DEMO_ACCOUNTS = [
  { id: 'DOC001', name: 'Dr. Ravi Sharma', role: 'doctor', dept: 'General Medicine', flaticon: 'fi-rr-stethoscope', color: '#0284c7' },
  { id: 'DOC-EMG-01', name: 'Dr. Kiran (Emergency)', role: 'doctor', dept: 'Emergency', flaticon: 'fi-sr-ambulance', color: '#ef4444' },
  { id: 'STAFF-ADMIN-01', name: 'System Admin', role: 'admin', dept: 'Reception', flaticon: 'fi-sr-shield-check', color: '#10b981' },
];

export default function StaffLoginPage() {
  const navigate = useNavigate();
  const { state: appState, setState } = useAppContext();
  const isDark = appState.theme === 'dark';

  const [staffId, setStaffId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const executeLogin = async (idToUse, passToUse, fallbackInfo = null) => {
    setLoading(true);
    setError('');
    try {
      const result = await staffApi.login(idToUse, passToUse);
      setState(prev => ({ ...prev, staffInfo: result.data }));
      navigate('/staff/dashboard');
    } catch (err) {
      if (fallbackInfo) {
        setState(prev => ({
          ...prev,
          staffInfo: {
            staff_id: fallbackInfo.id,
            full_name: fallbackInfo.name,
            name: fallbackInfo.name,
            role: fallbackInfo.role,
            department_name: fallbackInfo.dept,
            department: fallbackInfo.dept,
            is_active: true,
          }
        }));
        navigate('/staff/dashboard');
      } else {
        setError(err.message || 'Login failed. Please verify your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!staffId.trim() || !password.trim()) {
      setError('Both Staff ID and Password are required.');
      return;
    }
    executeLogin(staffId.trim(), password);
  };

  const handleQuickDemoLogin = (account) => {
    setStaffId(account.id);
    setPassword('admin123');
    executeLogin(account.id, 'admin123', account);
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 64px)',
      background: isDark ? '#09090b' : 'radial-gradient(circle at 10% 20%, #e0f2fe 0%, #f0fdfa 40%, #f8fafc 90%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 20px 48px',
      color: isDark ? '#ffffff' : '#0f172a'
    }}>

      {/* Top Back Navigation */}
      <div style={{ width: '100%', maxWidth: 440, marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button
          onClick={() => navigate('/')}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: isDark ? '#121215' : '#ffffff',
            border: isDark ? '1px solid #27272a' : '1px solid #e2e8f0',
            padding: '6px 14px', borderRadius: 8,
            cursor: 'pointer',
            color: '#0284c7',
            fontWeight: 700,
            fontSize: 12,
            transition: 'all 0.15s ease'
          }}
        >
          <ArrowLeft size={14} /> Back to Home
        </button>

        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: isDark ? '#121215' : '#ffffff',
          border: isDark ? '1px solid #27272a' : '1px solid #e2e8f0',
          padding: '5px 12px', borderRadius: 8,
          color: '#0284c7', fontSize: 12, fontWeight: 700
        }}>
          <Flaticon name="fi-sr-shield-check" size={13} color="#0284c7" />
          <span>Staff & Doctor Console</span>
        </div>
      </div>

      {/* Main Glass Card */}
      <div className="card animate-slide-up" style={{
        width: '100%', maxWidth: 440,
        borderRadius: 18,
        background: isDark ? '#121215' : '#ffffff',
        border: isDark ? '1px solid #27272a' : '1px solid #e2e8f0',
        boxShadow: isDark ? '0 16px 36px rgba(0,0,0,0.6)' : '0 8px 24px rgba(2, 132, 199, 0.08)',
        overflow: 'hidden'
      }}>

        {/* Card Header Branding */}
        <div style={{
          padding: '22px 24px 16px',
          textAlign: 'center',
          borderBottom: isDark ? '1px solid #27272a' : '1px solid #f1f5f9',
          background: isDark ? '#18181b' : '#f8fafc'
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: isDark ? '#18181b' : 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            border: isDark ? '1px solid #27272a' : 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 10px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
          }}>
            <Flaticon name="fi-sr-shield-check" size={22} color={isDark ? '#38bdf8' : '#ffffff'} />
          </div>

          <h2 style={{ fontSize: 19, fontWeight: 800, color: isDark ? '#ffffff' : '#0f172a', letterSpacing: -0.4, marginBottom: 2 }}>
            Staff & Doctor Login
          </h2>
          <p style={{ color: isDark ? '#a1a1aa' : '#64748b', fontSize: 12, margin: 0 }}>
            Authorized medical staff and hospital administration
          </p>
        </div>

        <div style={{ padding: '20px 24px 24px' }}>

          {/* Quick 1-Click Demo Testing */}
          <div style={{
            background: isDark ? '#18181b' : '#f8fafc',
            border: isDark ? '1px solid #27272a' : '1px dashed #cbd5e1',
            borderRadius: 12, padding: 12, marginBottom: 16
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 5,
              marginBottom: 8, color: '#0284c7', fontSize: 11, fontWeight: 800,
              textTransform: 'uppercase', letterSpacing: 0.5
            }}>
              <Flaticon name="fi-sr-bolt" size={13} color="#0284c7" /> 1-Click Demo Accounts
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.id}
                  type="button"
                  onClick={() => handleQuickDemoLogin(acc)}
                  disabled={loading}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '8px 12px', borderRadius: 8,
                    border: isDark ? '1px solid #27272a' : '1px solid #e2e8f0',
                    background: isDark ? '#121215' : '#ffffff',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: 6,
                      background: isDark ? '#18181b' : '#f1f5f9',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <Flaticon name={acc.flaticon} size={15} color={acc.color} />
                    </div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: isDark ? '#ffffff' : '#1e293b' }}>{acc.name}</div>
                      <div style={{ fontSize: 11, color: isDark ? '#a1a1aa' : '#64748b' }}>ID: <strong>{acc.id}</strong> ({acc.dept})</div>
                    </div>
                  </div>
                  <span style={{
                    fontSize: 11, fontWeight: 700, color: acc.color,
                    background: isDark ? '#18181b' : '#f8fafc',
                    padding: '3px 8px', borderRadius: 6,
                    border: isDark ? '1px solid #27272a' : '1px solid #e2e8f0'
                  }}>
                    Select
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '14px 0', color: isDark ? '#71717a' : '#94a3b8', fontSize: 11, fontWeight: 700 }}>
            <div style={{ flex: 1, height: 1, background: isDark ? '#27272a' : '#e2e8f0' }} />
            <span>OR ENTER CREDENTIALS</span>
            <div style={{ flex: 1, height: 1, background: isDark ? '#27272a' : '#e2e8f0' }} />
          </div>

          {error && (
            <div className="alert alert-error mb-4 animate-slide-up" style={{ borderRadius: 10, fontSize: 12 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label className="label" style={{ fontSize: 12, fontWeight: 700, color: isDark ? '#ffffff' : '#334155', marginBottom: 4 }}>
                Staff ID <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: isDark ? '#71717a' : '#94a3b8' }}>
                  <Flaticon name="fi-rr-key" size={15} color="#0284c7" />
                </div>
                <input
                  type="text"
                  className="input"
                  style={{
                    paddingLeft: 38, height: 42, borderRadius: 10, fontSize: 13,
                    border: isDark ? '1px solid #27272a' : '1px solid #cbd5e1',
                    background: isDark ? '#18181b' : '#f8fafc',
                    color: isDark ? '#ffffff' : '#0f172a'
                  }}
                  placeholder="e.g. DOC001 or DOC-EMG-01"
                  value={staffId}
                  onChange={e => setStaffId(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="label" style={{ fontSize: 12, fontWeight: 700, color: isDark ? '#ffffff' : '#334155', marginBottom: 4 }}>
                Password <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: isDark ? '#71717a' : '#94a3b8' }}>
                  <Flaticon name="fi-rr-lock" size={15} color="#0284c7" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input"
                  style={{
                    paddingLeft: 38, paddingRight: 38, height: 42, borderRadius: 10, fontSize: 13,
                    border: isDark ? '1px solid #27272a' : '1px solid #cbd5e1',
                    background: isDark ? '#18181b' : '#f8fafc',
                    color: isDark ? '#ffffff' : '#0f172a'
                  }}
                  placeholder="Enter staff password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 4
                  }}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-full"
              style={{
                marginTop: 2, height: 44, borderRadius: 10,
                fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
              }}
            >
              {loading ? (
                <span>Authenticating Staff...</span>
              ) : (
                <>
                  <Flaticon name="fi-sr-user-check" size={16} color="#ffffff" />
                  <span>Sign In as Staff</span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          <div style={{ marginTop: 14, textAlign: 'center', fontSize: 11, color: isDark ? '#71717a' : '#94a3b8' }}>
            Demo Password: <code style={{
              background: isDark ? '#18181b' : '#f1f5f9',
              padding: '2px 6px', borderRadius: 4,
              color: '#0284c7', fontWeight: 700
            }}>admin123</code>
          </div>

        </div>
      </div>

    </div>
  );
}
