import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../hooks/useTranslation';
import { languages } from '../translations/translations';
import ThemeToggle from './ThemeToggle';
import Flaticon from './Flaticon';
import logoImg from '../assets/icon-combined.png';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state, setState } = useAppContext();
  const { signOut } = useAuth();
  const { t } = useTranslation();

  const isDark = state.theme === 'dark';
  const isLarge = state.accessibilityMode === 'high-contrast';

  const handleLanguageChange = (e) => {
    setState(prev => ({ ...prev, language: e.target.value }));
  };

  const handleAccessibilityToggle = () => {
    setState(prev => ({
      ...prev,
      accessibilityMode: prev.accessibilityMode === 'high-contrast' ? 'normal' : 'high-contrast'
    }));
  };

  const handleLogout = async () => {
    await signOut();
    setState(prev => ({ ...prev, patientInfo: null, staffInfo: null }));
    navigate('/');
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      width: '100%',
      backgroundColor: isDark ? 'rgba(9, 9, 11, 0.92)' : 'rgba(255, 255, 255, 0.92)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: isDark ? '1px solid #27272a' : '1px solid #e2e8f0',
      boxShadow: isDark ? '0 4px 20px rgba(0, 0, 0, 0.5)' : '0 2px 10px rgba(15, 23, 42, 0.03)',
      transition: 'all 0.16s ease',
      height: 64,
      display: 'flex',
      alignItems: 'center'
    }}>
      <div style={{
        width: '100%',
        maxWidth: 1440,
        margin: '0 auto',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16
      }}>

        {/* ── Left: Brand & Hospital Identity ──────────────── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              cursor: 'pointer'
            }}
          >
            <img
              src={logoImg}
              alt="SmartQueue Management Logo"
              style={{
                height: 60,
                width: 'auto',
                maxWidth: 220,
                objectFit: 'contain',
                display: 'block'
              }}
            />
          </Link>
        </div>

        {/* ── Right: Triage Shortcut, Lang, Theme & Auth ─ */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>

          {/* Language Selector */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: isDark ? '#18181b' : '#f8fafc',
            border: isDark ? '1px solid #27272a' : '1px solid #e2e8f0',
            borderRadius: 8,
            padding: '3px 8px',
            height: 34
          }}>
            <Flaticon name="fi-rr-globe" size={14} color="#0284c7" style={{ marginRight: 6 }} />
            <select
              value={state.language || 'en'}
              onChange={handleLanguageChange}
              style={{
                border: 'none',
                backgroundColor: 'transparent',
                fontSize: 12,
                fontWeight: 600,
                color: isDark ? '#ffffff' : '#334155',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              {Object.entries(languages).map(([code, name]) => (
                <option key={code} value={code} style={{ background: isDark ? '#18181b' : '#ffffff' }}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          {/* Accessibility Toggle */}
          <button
            onClick={handleAccessibilityToggle}
            title="Toggle Accessibility High Contrast"
            style={{
              height: 34,
              padding: '0 10px',
              borderRadius: 8,
              border: isDark ? '1px solid #27272a' : '1px solid #e2e8f0',
              backgroundColor: isDark ? '#18181b' : '#f8fafc',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              color: isDark ? '#ffffff' : '#334155',
              fontSize: 12,
              fontWeight: 600
            }}
          >
            <Flaticon name="fi-rr-text" size={13} color="#0284c7" />
            <span>{isLarge ? 'A+' : 'A'}</span>
          </button>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* User / Staff Navigation */}
          {state.staffInfo ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Link
                to="/staff/dashboard"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 12px',
                  borderRadius: 8,
                  backgroundColor: '#059669',
                  color: '#ffffff',
                  fontSize: 12,
                  fontWeight: 700,
                  textDecoration: 'none'
                }}
              >
                <Flaticon name="fi-sr-shield-check" size={13} color="#ffffff" />
                <span>{state.staffInfo.name || 'Doctor Console'}</span>
              </Link>
              <button
                onClick={handleLogout}
                title="Logout"
                style={{
                  height: 34,
                  padding: '0 8px',
                  borderRadius: 8,
                  border: isDark ? '1px solid #7f1d1d' : '1px solid #fecaca',
                  backgroundColor: isDark ? '#450a0a' : '#fef2f2',
                  color: '#ef4444',
                  cursor: 'pointer',
                  fontSize: 12,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <Flaticon name="fi-rr-sign-out-alt" size={13} color="#ef4444" />
              </button>
            </div>
          ) : state.patientInfo?.name && state.patientInfo.name !== 'Patient Visitor' ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Link
                to="/dashboard"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 12px',
                  borderRadius: 8,
                  backgroundColor: isDark ? '#082f49' : '#f0f9ff',
                  border: isDark ? '1px solid #0369a1' : '1px solid #bae6fd',
                  color: '#0284c7',
                  fontSize: 12,
                  fontWeight: 700,
                  textDecoration: 'none'
                }}
              >
                <Flaticon name="fi-sr-user" size={13} color="#0284c7" />
                <span>{state.patientInfo.name}</span>
              </Link>
              <button
                onClick={handleLogout}
                title="Sign Out"
                style={{
                  height: 34,
                  padding: '0 10px',
                  borderRadius: 8,
                  border: isDark ? '1px solid #7f1d1d' : '1px solid #fecaca',
                  backgroundColor: isDark ? '#450a0a' : '#fef2f2',
                  color: '#ef4444',
                  cursor: 'pointer',
                  fontSize: 12,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4
                }}
              >
                <Flaticon name="fi-rr-sign-out-alt" size={12} color="#ef4444" />
                <span>Exit</span>
              </button>
            </div>
          ) : (
            <Link
              to="/staff/login"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 14px',
                borderRadius: 8,
                backgroundColor: isDark ? '#18181b' : '#ffffff',
                border: isDark ? '1px solid #27272a' : '1px solid #cbd5e1',
                color: isDark ? '#ffffff' : '#334155',
                fontSize: 12,
                fontWeight: 700,
                textDecoration: 'none',
                boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
              }}
            >
              <Flaticon name="fi-sr-shield-check" size={13} color="#0284c7" />
              <span>Staff Login</span>
            </Link>
          )}

        </div>

      </div>
    </header>
  );
}
