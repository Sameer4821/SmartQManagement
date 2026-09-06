import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useTranslation } from '../hooks/useTranslation';
import EditProfileModal from '../components/EditProfileModal';
import Flaticon from '../components/Flaticon';

export default function MedicalServicesDashboardPage() {
  const navigate = useNavigate();
  const { state, setState } = useAppContext();
  const { t } = useTranslation();
  const [showEditModal, setShowEditModal] = useState(false);

  const patientInfo = state.patientInfo || { name: 'Patient Visitor', email: '', phone: '' };
  const isDark = state.theme === 'dark';

  useEffect(() => {
    if (!state.patientInfo) {
      setState(prev => ({
        ...prev,
        patientInfo: { name: 'Patient Visitor', email: '', phone: '' }
      }));
    }
  }, [state.patientInfo, setState]);

  const allTokens = state.tokens || [];
  const activePatientToken = allTokens.find(
    tok => (tok.patient?.email === patientInfo?.email || tok.patient?.phone === patientInfo?.phone) &&
           (tok.status === 'active' || tok.status === 'waiting' || tok.status === 'called')
  );

  const emergencyTokens = allTokens.filter(t => t.type === 'emergency' && (t.status === 'active' || t.status === 'waiting'));
  const remainingEmergency = Math.max(0, (state.maxEmergencyPerDay || 50) - emergencyTokens.length);

  return (
    <div style={{
      background: isDark ? '#09090b' : '#f8fafc',
      minHeight: 'calc(100vh - 64px)',
      padding: '24px 20px 48px',
      display: 'flex',
      flexDirection: 'column',
      gap: 20,
      maxWidth: 1280,
      margin: '0 auto',
      width: '100%',
      boxSizing: 'border-box'
    }}>

      {/* Edit Profile Modal */}
      {showEditModal && <EditProfileModal isOpen={showEditModal} onClose={() => setShowEditModal(false)} />}

      {/* ── Welcome & Active Token Banner ──── */}
      <div className="card animate-slide-up" style={{
        borderRadius: 18,
        background: isDark
          ? 'linear-gradient(145deg, #121215 0%, #18181b 100%)'
          : 'linear-gradient(145deg, #ffffff 0%, #f0f9ff 100%)',
        border: isDark ? '1px solid #27272a' : '1px solid #bae6fd',
        padding: '24px 28px',
        boxShadow: isDark ? '0 8px 24px rgba(0,0,0,0.5)' : '0 4px 16px rgba(2,132,199,0.06)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: isDark ? '#082f49' : '#e0f2fe',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: isDark ? '1px solid #0369a1' : '1px solid #bae6fd'
            }}>
              <Flaticon name="fi-sr-user" size={24} color="#0284c7" />
            </div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 800, color: isDark ? '#ffffff' : '#0f172a', letterSpacing: -0.4 }}>
                {t('pdWelcomeBack') || 'Welcome back'}, {patientInfo.name}
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 3, flexWrap: 'wrap', fontSize: 12, color: isDark ? '#a1a1aa' : '#64748b' }}>
                {patientInfo.email && <span>Email: {patientInfo.email}</span>}
                {patientInfo.phone && <span>Phone: {patientInfo.phone}</span>}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              className="btn btn-outline"
              onClick={() => setShowEditModal(true)}
              title="Edit Patient Details"
              style={{
                height: 40, padding: '0 14px', borderRadius: 10,
                fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6
              }}
            >
              <Flaticon name="fi-rr-edit" size={14} color={isDark ? '#ffffff' : '#0f172a'} />
              <span>Edit Details</span>
            </button>

            {/* Active Token Shortcut */}
            {activePatientToken && (
              <button
                onClick={() => {
                  setState(prev => ({ ...prev, currentToken: activePatientToken }));
                  navigate('/token');
                }}
                className="btn btn-primary"
                style={{
                  height: 40,
                  padding: '0 16px',
                  borderRadius: 10,
                  fontWeight: 700,
                  fontSize: 13,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                <Flaticon name="fi-rr-qrcode" size={16} color="#ffffff" />
                <span>View Token ({activePatientToken.id})</span>
                <ArrowRight size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Category Selection (3-Column Desktop Grid) ──── */}
      <div>
        <div style={{ fontSize: 16, fontWeight: 800, color: isDark ? '#ffffff' : '#0f172a', marginBottom: 12, letterSpacing: -0.3 }}>
          {t('pdSelectCategory') || 'Select Service Category & Queue Lane'}
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 16
        }}>
          {/* General Walk-in */}
          <div
            className="cat-card animate-slide-up"
            style={{
              borderRadius: 16, padding: 20,
              background: isDark ? '#121215' : '#ffffff',
              border: isDark ? '1px solid #27272a' : '1px solid #e2e8f0',
              borderLeft: '4px solid #0284c7',
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              cursor: 'pointer'
            }}
            onClick={() => navigate('/flow/common')}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ width: 42, height: 42, borderRadius: 10, background: isDark ? '#082f49' : '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Flaticon name="fi-rr-users-alt" size={20} color="#0284c7" />
                </div>
                <span className="badge badge-blue" style={{ fontSize: 11 }}>
                  Waiting: {allTokens.filter(t => t.type === 'common' && (t.status === 'active' || t.status === 'waiting')).length}
                </span>
              </div>
              <div style={{ fontSize: 17, fontWeight: 700, color: isDark ? '#ffffff' : '#0f172a', marginBottom: 4 }}>
                {t('pdCommon') || 'General Consultation'}
              </div>
              <div style={{ fontSize: 13, lineHeight: '19px', color: isDark ? '#a1a1aa' : '#64748b' }}>
                {t('pdCommonDesc') || 'Standard consultation queue for routine checkups, specialized department appointments, and general doctor visits.'}
              </div>
            </div>

            <button className="btn btn-primary btn-full" style={{ marginTop: 16, height: 38, borderRadius: 8, fontSize: 13 }}>
              {t('pdSelect') || 'Book General Token'}
            </button>
          </div>

          {/* Emergency Lane */}
          <div
            className="cat-card animate-slide-up"
            style={{
              borderRadius: 16, padding: 20,
              background: isDark ? '#121215' : '#ffffff',
              border: isDark ? '1px solid #27272a' : '1px solid #e2e8f0',
              borderLeft: '4px solid #ef4444',
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              cursor: remainingEmergency > 0 ? 'pointer' : 'not-allowed',
              opacity: remainingEmergency > 0 ? 1 : 0.6
            }}
            onClick={() => remainingEmergency > 0 && navigate('/flow/emergency')}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ width: 42, height: 42, borderRadius: 10, background: isDark ? '#450a0a' : '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Flaticon name="fi-sr-ambulance" size={20} color="#ef4444" />
                </div>
                <span className="badge badge-red" style={{ fontSize: 11 }}>
                  Slots: {remainingEmergency > 0 ? `${remainingEmergency} Left` : 'Full'}
                </span>
              </div>
              <div style={{ fontSize: 17, fontWeight: 700, color: isDark ? '#ffffff' : '#0f172a', marginBottom: 4 }}>
                {t('pdEmergency') || 'Emergency & Trauma'}
              </div>
              <div style={{ fontSize: 13, lineHeight: '19px', color: isDark ? '#a1a1aa' : '#64748b' }}>
                {t('pdEmergencyDesc') || 'Critical priority lane for trauma, cardiac conditions, acute pain, and immediate medical triage intervention.'}
              </div>
            </div>

            <button className="btn btn-danger btn-full" style={{ marginTop: 16, height: 38, borderRadius: 8, fontSize: 13 }}>
              {t('pdSelect') || 'Emergency Fast-Track'}
            </button>
          </div>

          {/* Accessibility / Priority */}
          <div
            className="cat-card animate-slide-up"
            style={{
              borderRadius: 16, padding: 20,
              background: isDark ? '#121215' : '#ffffff',
              border: isDark ? '1px solid #27272a' : '1px solid #e2e8f0',
              borderLeft: '4px solid #0d9488',
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              cursor: 'pointer'
            }}
            onClick={() => navigate('/flow/disabled')}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ width: 42, height: 42, borderRadius: 10, background: isDark ? '#042f2e' : '#f0fdfa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Flaticon name="fi-sr-wheelchair" size={20} color="#0d9488" />
                </div>
                <span className="badge badge-green" style={{ fontSize: 11 }}>
                  Waiting: {allTokens.filter(t => t.type === 'disabled' && (t.status === 'active' || t.status === 'waiting')).length}
                </span>
              </div>
              <div style={{ fontSize: 17, fontWeight: 700, color: isDark ? '#ffffff' : '#0f172a', marginBottom: 4 }}>
                {t('pdDisabled') || 'Accessibility & Priority Care'}
              </div>
              <div style={{ fontSize: 13, lineHeight: '19px', color: isDark ? '#a1a1aa' : '#64748b' }}>
                {t('pdDisabledDesc') || 'Dedicated queue equipped with wheelchair escorts, sign-language assistance, senior priority, and guided care.'}
              </div>
            </div>

            <button className="btn btn-green btn-full" style={{ marginTop: 16, height: 38, borderRadius: 8, fontSize: 13 }}>
              {t('pdSelect') || 'Request Accessibility Lane'}
            </button>
          </div>
        </div>
      </div>

      {/* ── Quick Navigation Cards (2-Column Desktop Grid) ──── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: 16
      }}>
        {/* Department Stats */}
        <div
          className="quick-card animate-slide-up"
          onClick={() => navigate('/department-stats')}
          style={{
            borderRadius: 16,
            padding: '16px 20px',
            background: isDark ? '#121215' : '#ffffff',
            border: isDark ? '1px solid #27272a' : '1px solid #e2e8f0'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: isDark ? '#082f49' : '#eff6ff',
              color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0
            }}>
              <Flaticon name="fi-rr-hospital" size={20} color="#0284c7" />
            </div>
            <div>
              <div style={{ color: '#0284c7', fontSize: 15, fontWeight: 700 }}>
                {t('pdDepartmentStats') || 'Hospital Capacity & Doctor Roster'}
              </div>
              <div style={{ fontSize: 12, color: isDark ? '#a1a1aa' : '#64748b', marginTop: 2 }}>
                Real-time doctor roster, wait times, and department loads
              </div>
            </div>
          </div>
          <ArrowRight size={18} color="#0284c7" />
        </div>

        {/* Live Queue Display */}
        <div
          className="quick-card animate-slide-up"
          onClick={() => navigate('/history')}
          style={{
            borderRadius: 16,
            padding: '16px 20px',
            background: isDark ? '#121215' : '#ffffff',
            border: isDark ? '1px solid #27272a' : '1px solid #e2e8f0'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: isDark ? '#052e16' : '#f0fdf4',
              color: '#10b981',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0
            }}>
              <Flaticon name="fi-rr-heart-rate" size={20} color="#10b981" />
            </div>
            <div>
              <div style={{ color: '#10b981', fontSize: 15, fontWeight: 700 }}>
                Live Hospital Queue Board
              </div>
              <div style={{ fontSize: 12, color: isDark ? '#a1a1aa' : '#64748b', marginTop: 2 }}>
                Real-time department monitors and upcoming queue status
              </div>
            </div>
          </div>
          <ArrowRight size={18} color="#10b981" />
        </div>
      </div>

    </div>
  );
}
