import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useTranslation } from '../hooks/useTranslation';
import Flaticon from '../components/Flaticon';
import logoImg from '../assets/icon.png';

export default function PatientPortalPage() {
  const { state } = useAppContext();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isDark = state.theme === 'dark';
  const isLarge = state.accessibilityMode === 'high-contrast';

  // Auto-redirect logged-in patients/staff to their respective dashboards
  useEffect(() => {
    if (state.staffInfo) {
      navigate('/staff/dashboard', { replace: true });
    } else if (state.patientInfo?.name && state.patientInfo.name !== 'Patient Visitor') {
      navigate('/dashboard', { replace: true });
    }
  }, [state.patientInfo, state.staffInfo, navigate]);

  const allTokens = state.tokens || [];
  const activeTokens = allTokens.filter(tok => tok.status === 'active' || tok.status === 'waiting' || tok.status === 'called');
  const departments = state.departments || [];

  const patientButtonText = t('lpContinue') !== 'lpContinue'
    ? t('lpContinue')
    : (t('continue') !== 'continue' ? t('continue') : 'Patient Check-In');

  const staffButtonText = t('continueStaff') !== 'continueStaff'
    ? t('continueStaff')
    : 'Continue as Doctor';

  return (
    <div style={{
      width: '100%',
      minHeight: 'calc(100vh - 64px)',
      backgroundColor: isDark ? '#09090b' : '#f8fafc',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '24px 20px 48px',
      boxSizing: 'border-box'
    }}>
      <div style={{ width: '100%', maxWidth: 1280, display: 'flex', flexDirection: 'column', gap: 28 }}>

        {/* ── 1. Hero Asymmetric Split Banner ─────── */}
        <div className="card animate-fade-in" style={{
          borderRadius: 20,
          padding: '36px 32px',
          background: isDark
            ? 'linear-gradient(145deg, #121215 0%, #18181b 100%)'
            : 'linear-gradient(145deg, #ffffff 0%, #f0f9ff 60%, #f0fdfa 100%)',
          border: isDark ? '1px solid #27272a' : '1px solid #e0f2fe',
          boxShadow: isDark ? '0 12px 32px rgba(0,0,0,0.6)' : '0 8px 24px rgba(2,132,199,0.06)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          alignItems: 'center',
          gap: 28
        }}>
          {/* Left Hero Stack (Max 4 elements) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* 1. Pill Badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '4px 12px',
              borderRadius: 20,
              backgroundColor: isDark ? '#082f49' : '#e0f2fe',
              color: isDark ? '#38bdf8' : '#0284c7',
              fontSize: 12,
              fontWeight: 700,
              width: 'fit-content'
            }}>
              <Flaticon name="fi-sr-shield-check" size={13} color={isDark ? '#38bdf8' : '#0284c7'} />
              <span>Smart Hospital Triage & Token Pass</span>
            </div>

            {/* 2. Headline (Max 2 lines) */}
            <h1 style={{
              fontSize: isLarge ? '34px' : '30px',
              fontWeight: 800,
              color: isDark ? '#ffffff' : '#0f172a',
              letterSpacing: -0.6,
              lineHeight: 1.18,
              margin: 0
            }}>
              Real-Time Hospital Queue Alert & Multi-Department Care
            </h1>

            {/* 3. Subtext (Concise) */}
            <p style={{
              fontSize: isLarge ? '16px' : '14px',
              color: isDark ? '#a1a1aa' : '#475569',
              lineHeight: 1.5,
              margin: 0,
              maxWidth: '56ch'
            }}>
              Skip crowded waiting rooms. Register in seconds, receive digital QR tokens, and get notified before consultation.
            </p>

            {/* 4. Action CTAs */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 4 }}>
              <button
                onClick={() => navigate('/register')}
                className="btn btn-primary"
                style={{
                  height: 46,
                  padding: '0 20px',
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  cursor: 'pointer'
                }}
              >
                <Flaticon name="fi-rr-qrcode" size={16} color="#ffffff" />
                <span>{patientButtonText}</span>
                <ArrowRight size={16} />
              </button>

              <button
                onClick={() => navigate('/staff/login')}
                className="btn btn-staff"
                style={{
                  height: 46,
                  padding: '0 18px',
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  cursor: 'pointer'
                }}
              >
                <Flaticon name="fi-sr-shield-check" size={16} color="#ffffff" />
                <span>{staffButtonText}</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Right Live Hospital Telemetry */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 16
          }}>
            <div style={{
              backgroundColor: isDark ? '#121215' : '#ffffff',
              padding: '20px',
              borderRadius: '20px',
              border: isDark ? '1px solid #27272a' : '1px solid #e2e8f0',
              boxShadow: isDark ? '0 8px 24px rgba(0,0,0,0.5)' : '0 4px 16px rgba(2,132,199,0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <img
                src={logoImg}
                alt="Hospital Logo"
                style={{
                  width: '96px',
                  height: '96px',
                  objectFit: 'contain'
                }}
              />
            </div>

            {/* Quick Live System Metrics */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 10,
              width: '100%',
              maxWidth: 380
            }}>
              <div style={{
                background: isDark ? '#121215' : '#ffffff',
                border: isDark ? '1px solid #27272a' : '1px solid #e2e8f0',
                padding: '10px 12px',
                borderRadius: 12,
                textAlign: 'center'
              }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#0284c7' }}>{departments.length || 5}</div>
                <div style={{ fontSize: 11, color: isDark ? '#a1a1aa' : '#64748b', fontWeight: 600, marginTop: 2 }}>Departments</div>
              </div>
              <div style={{
                background: isDark ? '#121215' : '#ffffff',
                border: isDark ? '1px solid #27272a' : '1px solid #e2e8f0',
                padding: '10px 12px',
                borderRadius: 12,
                textAlign: 'center'
              }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#10b981' }}>{activeTokens.length}</div>
                <div style={{ fontSize: 11, color: isDark ? '#a1a1aa' : '#64748b', fontWeight: 600, marginTop: 2 }}>In Queue</div>
              </div>
              <div style={{
                background: isDark ? '#121215' : '#ffffff',
                border: isDark ? '1px solid #27272a' : '1px solid #e2e8f0',
                padding: '10px 12px',
                borderRadius: 12,
                textAlign: 'center'
              }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#f59e0b' }}>&lt; 15m</div>
                <div style={{ fontSize: 11, color: isDark ? '#a1a1aa' : '#64748b', fontWeight: 600, marginTop: 2 }}>Avg Wait</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── 2. How SmartQueue Works (3-Step Rhythmic Grid) ─ */}
        <div>
          <div style={{
            fontSize: 18,
            fontWeight: 800,
            color: isDark ? '#ffffff' : '#0f172a',
            marginBottom: 16,
            letterSpacing: -0.4,
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}>
            <Flaticon name="fi-rr-heart-rate" size={18} color="#0284c7" />
            <span>How SmartQueue Management Works</span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 16
          }}>
            {/* Step 1 */}
            <div className="card animate-slide-up" style={{
              borderRadius: 16,
              padding: 20,
              background: isDark ? '#121215' : '#ffffff',
              border: isDark ? '1px solid #27272a' : '1px solid #e2e8f0',
              display: 'flex',
              flexDirection: 'column',
              gap: 12
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{
                  width: 42,
                  height: 42,
                  borderRadius: 10,
                  background: isDark ? '#082f49' : '#eff6ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Flaticon name="fi-rr-qrcode" size={20} color="#0284c7" />
                </div>
                <span style={{
                  fontSize: 11,
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: 6,
                  background: isDark ? '#27272a' : '#f1f5f9',
                  color: isDark ? '#93c5fd' : '#0284c7'
                }}>
                  Step 01
                </span>
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, color: isDark ? '#ffffff' : '#0f172a' }}>
                1. Check-In & Digital Token
              </div>
              <div style={{ fontSize: 13, lineHeight: '20px', color: isDark ? '#a1a1aa' : '#64748b' }}>
                Register or check in with your mobile number. Pick your department and doctor to generate an instant QR pass.
              </div>
            </div>

            {/* Step 2 */}
            <div className="card animate-slide-up" style={{
              borderRadius: 16,
              padding: 20,
              background: isDark ? '#121215' : '#ffffff',
              border: isDark ? '1px solid #27272a' : '1px solid #e2e8f0',
              display: 'flex',
              flexDirection: 'column',
              gap: 12
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{
                  width: 42,
                  height: 42,
                  borderRadius: 10,
                  background: isDark ? '#052e16' : '#f0fdf4',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Flaticon name="fi-rr-bell" size={20} color="#10b981" />
                </div>
                <span style={{
                  fontSize: 11,
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: 6,
                  background: isDark ? '#27272a' : '#f1f5f9',
                  color: isDark ? '#86efac' : '#10b981'
                }}>
                  Step 02
                </span>
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, color: isDark ? '#ffffff' : '#0f172a' }}>
                2. Live Queue & Proactive Alerts
              </div>
              <div style={{ fontSize: 13, lineHeight: '20px', color: isDark ? '#a1a1aa' : '#64748b' }}>
                Relax comfortably outside crowded areas. Track real-time progress or receive notifications when your turn is near.
              </div>
            </div>

            {/* Step 3 */}
            <div className="card animate-slide-up" style={{
              borderRadius: 16,
              padding: 20,
              background: isDark ? '#121215' : '#ffffff',
              border: isDark ? '1px solid #27272a' : '1px solid #e2e8f0',
              display: 'flex',
              flexDirection: 'column',
              gap: 12
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{
                  width: 42,
                  height: 42,
                  borderRadius: 10,
                  background: isDark ? '#3b0764' : '#faf5ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Flaticon name="fi-rr-stethoscope" size={20} color="#8b5cf6" />
                </div>
                <span style={{
                  fontSize: 11,
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: 6,
                  background: isDark ? '#27272a' : '#f1f5f9',
                  color: isDark ? '#d8b4fe' : '#8b5cf6'
                }}>
                  Step 03
                </span>
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, color: isDark ? '#ffffff' : '#0f172a' }}>
                3. QR Verification & Doctor Care
              </div>
              <div style={{ fontSize: 13, lineHeight: '20px', color: isDark ? '#a1a1aa' : '#64748b' }}>
                Present your QR pass at the doctor desk for instant verification, clinical diagnosis, and digital prescription.
              </div>
            </div>
          </div>
        </div>

        {/* ── 3. Quick Links Section (2-Column) ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 16
        }}>
          {/* Department Capacity */}
          <div
            className="quick-card animate-slide-up"
            onClick={() => navigate('/department-stats')}
            style={{
              borderRadius: 16,
              padding: '18px 20px',
              background: isDark ? '#121215' : '#ffffff',
              border: isDark ? '1px solid #27272a' : '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{
                width: 42,
                height: 42,
                borderRadius: 10,
                background: isDark ? '#082f49' : '#eff6ff',
                color: '#0284c7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Flaticon name="fi-rr-hospital" size={20} color="#0284c7" />
              </div>
              <div>
                <div style={{ color: '#0284c7', fontSize: 15, fontWeight: 700 }}>
                  Hospital Roster & Department Capacity
                </div>
                <div style={{ fontSize: 12, color: isDark ? '#a1a1aa' : '#64748b', marginTop: 2 }}>
                  View real-time doctor availability and department queue loads
                </div>
              </div>
            </div>
            <ArrowRight size={18} color="#0284c7" />
          </div>

          {/* Live Queue Board */}
          <div
            className="quick-card animate-slide-up"
            onClick={() => navigate('/history')}
            style={{
              borderRadius: 16,
              padding: '18px 20px',
              background: isDark ? '#121215' : '#ffffff',
              border: isDark ? '1px solid #27272a' : '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{
                width: 42,
                height: 42,
                borderRadius: 10,
                background: isDark ? '#052e16' : '#f0fdf4',
                color: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Flaticon name="fi-rr-heart-rate" size={20} color="#10b981" />
              </div>
              <div>
                <div style={{ color: '#10b981', fontSize: 15, fontWeight: 700 }}>
                  Live Hospital Queue Board
                </div>
                <div style={{ fontSize: 12, color: isDark ? '#a1a1aa' : '#64748b', marginTop: 2 }}>
                  Live display of current active tokens and consultations
                </div>
              </div>
            </div>
            <ArrowRight size={18} color="#10b981" />
          </div>
        </div>

      </div>
    </div>
  );
}
