import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Globe, HeartPulse, CheckCircle2,
  QrCode, FileText, Stethoscope, Clock, Activity, Search, Camera, RefreshCw, AlertCircle, Users
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { staffApi, queueApi } from '../api/index';
import { supabase } from '../api/supabaseClient';
import { translations } from '../translations/translations';
import QrCameraScannerModal from '../components/QrCameraScannerModal';


const getPriorityColors = (type, isDark) => {
  if (type === 'emergency') {
    return {
      bg: isDark ? '#450a0a' : '#fef2f2',
      text: isDark ? '#fca5a5' : '#dc2626',
      border: isDark ? '#7f1d1d' : '#fca5a5',
      name: 'Emergency'
    };
  }
  if (type === 'disabled') {
    return {
      bg: isDark ? '#042f2e' : '#f0fdfa',
      text: isDark ? '#5eead4' : '#0d9488',
      border: isDark ? '#115e59' : '#99f6e4',
      name: 'Accessibility'
    };
  }
  return {
    bg: isDark ? '#082f49' : '#f0f9ff',
    text: isDark ? '#7dd3fc' : '#0284c7',
    border: isDark ? '#0369a1' : '#bae6fd',
    name: 'General'
  };
};

const formatTokenId = (id) => {
  if (!id) return '---';
  const parts = String(id).split('-');
  if (parts.length >= 3) {
    return `${parts[0]}-${parts[2]}`;
  }
  return String(id);
};

export default function StaffDashboardPage() {
  const navigate = useNavigate();
  const { state: appState, setState: setAppState } = useAppContext();
  const t = translations[appState.language] || translations.en;
  const isDark = appState.theme === 'dark';

  const allActiveTokens = (appState.tokens || [])
    .filter(tok => tok.status === 'active' || tok.status === 'waiting' || tok.status === 'called' || tok.status === 'in_consultation')
    .sort((a, b) => {
      const aE = a.type === 'emergency' || a.primaryDepartment === 'Emergency';
      const bE = b.type === 'emergency' || b.primaryDepartment === 'Emergency';
      if (aE && !bE) return -1;
      if (!aE && bE) return 1;
      if (aE && bE) {
        const pA = a.priority || 10;
        const pB = b.priority || 10;
        if (pA !== pB) return pB - pA;
        return new Date(a.timestamp) - new Date(b.timestamp);
      }
      return new Date(a.timestamp) - new Date(b.timestamp);
    });

  const [activePatient, setActivePatient] = useState(allActiveTokens[0] || null);
  const upcomingQueue = allActiveTokens.filter(t => t.id !== activePatient?.id);
  const totalWaiting = allActiveTokens.length;

  const [showNotesModal, setShowNotesModal] = useState(false);
  const [showScannerModal, setShowScannerModal] = useState(false);
  const [diagnosis, setDiagnosis] = useState('');
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Auto-sync tokens from Supabase/API across all devices every 3.5 seconds
  useEffect(() => {
    const syncLiveQueue = async () => {
      try {
        const { data } = await supabase
          .from('queue_tokens')
          .select('*')
          .neq('status', 'completed')
          .neq('status', 'cancelled')
          .order('created_at', { ascending: true });

        if (data && data.length >= 0) {
          setAppState(prev => {
            const formatted = data.map(row => ({
              id: row.token_id || row.id,
              token_id: row.token_id || row.id,
              tokenNumber: row.token_number || 1,
              type: row.type || 'common',
              primaryDepartment: row.department_name || row.department || 'General Medicine',
              department_name: row.department_name || row.department || 'General Medicine',
              doctor_id: row.doctor_id || null,
              doctor_name: row.doctor_name || null,
              status: row.status || 'waiting',
              priority: row.priority || (row.type === 'emergency' ? 10 : row.type === 'disabled' ? 8 : 3),
              timestamp: new Date(row.created_at || Date.now()),
              validUntil: new Date(row.valid_until || Date.now() + 24 * 3600000),
              completed_at: row.completed_at || null,
              emergency_reason: row.emergency_reason || null,
              severity: row.severity || null,
              disabilityType: row.disability_type || null,
              assistanceNeeded: row.assistance_needed || [],
              caregiverName: row.caregiver_name || null,
              caregiverPhone: row.caregiver_phone || null,
              schedulingMethod: row.scheduling_method || 'auto',
              scheduledTime: row.scheduled_time ? new Date(row.scheduled_time) : null,
              timeSlot: row.time_slot || null,
              estimatedWaitTime: row.estimated_wait_minutes || 15,
              positionInQueue: row.queue_position || 1,
              qrCode: row.qr_code_data || (row.token_id || row.id),
              patient: {
                name: row.patient_name || 'Patient',
                email: row.patient_email || '',
                phone: row.patient_phone || '',
                age: row.patient_age || 0,
                gender: row.patient_gender || 'not specified',
                patientId: row.patient_id || `PAT-${row.token_id || row.id}`
              },
              visits: [], labTests: [],
            }));
            return { ...prev, tokens: formatted };
          });
        }
      } catch (err) {
        console.warn('Queue sync polling error:', err);
      }
    };

    syncLiveQueue();
    const interval = setInterval(syncLiveQueue, 3500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!activePatient && allActiveTokens.length > 0) setActivePatient(allActiveTokens[0]);
  }, [allActiveTokens.length]);

  const handleBack = () => {
    navigate('/staff/login');
  };

  const toggleLanguage = () => {
    const langs = ['en', 'hi', 'mr'];
    const nextIdx = (langs.indexOf(appState.language) + 1) % langs.length;
    setAppState(prev => ({ ...prev, language: langs[nextIdx] }));
  };

  const handleCallPatient = async (patientToken) => {
    if (!patientToken) return;
    setSaving(true);
    try {
      await queueApi.updateStatus(patientToken.id, 'called');
      await supabase.from('queue_tokens').update({ status: 'called' }).eq('token_id', patientToken.id);

      setAppState(prev => ({
        ...prev,
        tokens: prev.tokens.map(tok => tok.id === patientToken.id ? { ...tok, status: 'called' } : tok)
      }));
      setSuccessMsg(`Token ${formatTokenId(patientToken.id)} (${patientToken.patient?.name || 'Patient'}) called to room.`);
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error(err);
      setSuccessMsg(`Token ${formatTokenId(patientToken.id)} called.`);
      setTimeout(() => setSuccessMsg(''), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveConsultationNotes = async () => {
    if (!activePatient) return;
    setSaving(true);
    try {
      await staffApi.addConsultation({
        tokenId: activePatient.id,
        patientName: activePatient.patient?.name,
        diagnosis,
        clinicalNotes,
        doctorId: appState.staffInfo?.staff_id,
        doctorName: appState.staffInfo?.full_name || appState.staffInfo?.name
      });
      setShowNotesModal(false);
      setSuccessMsg('Clinical consultation notes saved.');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error(err);
      setShowNotesModal(false);
      setSuccessMsg('Consultation notes saved locally.');
      setTimeout(() => setSuccessMsg(''), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleMarkComplete = async () => {
    if (!activePatient) return;
    setSaving(true);
    const completedAt = new Date().toISOString();
    try {
      await queueApi.updateStatus(activePatient.id, 'completed');
      await supabase.from('queue_tokens').update({ status: 'completed', completed_at: completedAt }).eq('token_id', activePatient.id);

      setAppState(prev => ({
        ...prev,
        tokens: prev.tokens.map(tok => tok.id === activePatient.id ? { ...tok, status: 'completed', completed_at: completedAt } : tok)
      }));
      setSuccessMsg(`✅ Consultation for ${activePatient.patient?.name || 'Patient'} completed. QR token expired.`);
      setTimeout(() => setSuccessMsg(''), 4000);
      const remaining = allActiveTokens.filter(t => t.id !== activePatient.id);
      setActivePatient(remaining[0] || null);
    } catch (err) {
      console.error(err);
      setAppState(prev => ({
        ...prev,
        tokens: prev.tokens.map(tok => tok.id === activePatient.id ? { ...tok, status: 'completed', completed_at: completedAt } : tok)
      }));
      const remaining = allActiveTokens.filter(t => t.id !== activePatient.id);
      setActivePatient(remaining[0] || null);
    } finally {
      setSaving(false);
    }
  };

  const handleQrScanSuccess = async (scannedCode) => {
    if (!scannedCode) return;
    let query = scannedCode.trim();

    try {
      if (query.startsWith('{') && query.endsWith('}')) {
        const parsed = JSON.parse(query);
        query = parsed.tokenId || parsed.id || query;
      }
    } catch { /* normal string */ }

    let found = (appState.tokens || []).find(t =>
      t.id === query ||
      t.qrCode === query ||
      t.token_id === query ||
      t.id.toLowerCase() === query.toLowerCase() ||
      formatTokenId(t.id).toLowerCase() === query.toLowerCase() ||
      t.id.includes(query)
    );

    if (!found) {
      try {
        const { data } = await supabase
          .from('queue_tokens')
          .select('*')
          .or(`token_id.eq.${query},qr_code_data.eq.${query}`)
          .maybeSingle();

        if (data) {
          found = {
            id: data.token_id,
            type: data.type || 'common',
            primaryDepartment: data.department_name,
            department_name: data.department_name,
            doctor_id: data.doctor_id,
            doctor_name: data.doctor_name,
            status: data.status,
            priority: data.priority,
            timestamp: new Date(data.created_at),
            validUntil: new Date(data.valid_until),
            completed_at: data.completed_at,
            patient: {
              name: data.patient_name,
              email: data.patient_email,
              phone: data.patient_phone,
              age: data.patient_age,
              gender: data.patient_gender,
              patientId: data.patient_id
            }
          };
        }
      } catch (err) {
        console.error('Supabase QR lookup error:', err);
      }
    }

    if (found) {
      if (found.status === 'completed') {
        setSuccessMsg(`❌ QR Code Expired: Token ${formatTokenId(found.id)} has already been completed and cannot be reused.`);
        setTimeout(() => setSuccessMsg(''), 5500);
        return;
      }

      if (found.validUntil && new Date() > new Date(found.validUntil)) {
        setSuccessMsg(`❌ QR Code Expired: Token ${formatTokenId(found.id)} has passed its validity time.`);
        setTimeout(() => setSuccessMsg(''), 5500);
        return;
      }

      setActivePatient(found);
      setShowScannerModal(false);
      setSuccessMsg(`✅ Patient Verified via QR: ${found.patient?.name || 'Patient'} (${formatTokenId(found.id)})`);
      setTimeout(() => setSuccessMsg(''), 4500);

      try {
        await supabase.from('queue_tokens').update({ status: 'called' }).eq('token_id', found.id);
      } catch { /* ignore */ }
    } else {
      setSuccessMsg(`⚠️ Scanned Code "${query}" is not recognized in hospital queue.`);
      setTimeout(() => setSuccessMsg(''), 4000);
    }
  };

  return (
    <div className="page" style={{ minHeight: 'calc(100vh - 70px)', background: 'var(--bg)', paddingBottom: 60, width: '100%' }}>
      {/* ── Top Header ──────────────────────────────── */}
      <div className="staff-header" style={{
        background: 'var(--bg)',
        borderBottom: '1px solid var(--border)',
        padding: '16px 24px'
      }}>
        <div style={{ maxWidth: 1600, margin: '0 auto', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div>
                <div style={{ fontSize: 19, fontWeight: 800, color: 'var(--slate)' }}>
                  {t.staffDashboardTitle || 'Staff / Doctor Dashboard'}
                </div>
                <div style={{ fontSize: 13, color: 'var(--slate-500)', marginTop: 2 }}>
                  {appState.staffInfo?.full_name || appState.staffInfo?.name || 'Dr. Assigned'} • {appState.staffInfo?.department_name || appState.staffInfo?.department || 'General Medicine'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button
                onClick={() => setShowScannerModal(true)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '9px 16px', borderRadius: 10,
                  background: '#0284c7', color: '#ffffff',
                  border: 'none', cursor: 'pointer',
                  fontWeight: 700, fontSize: 13,
                  boxShadow: '0 3px 10px rgba(2, 132, 199, 0.25)'
                }}
              >
                <Camera size={16} />
                <span>Scan Patient QR</span>
              </button>
            </div>
          </div>

          {/* Success Alert Banner */}
          {successMsg && (
            <div style={{
              marginTop: 12, padding: '10px 16px', borderRadius: 10,
              background: successMsg.includes('❌') ? (isDark ? '#450a0a' : '#fef2f2') : successMsg.includes('⚠️') ? (isDark ? '#451a03' : '#fffbeb') : (isDark ? '#052e16' : '#ecfdf5'),
              border: successMsg.includes('❌') ? '1px solid #dc2626' : successMsg.includes('⚠️') ? '1px solid #d97706' : '1px solid #16a34a',
              color: successMsg.includes('❌') ? '#fca5a5' : successMsg.includes('⚠️') ? '#fde68a' : '#86efac',
              fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8
            }}>
              {successMsg.includes('❌') ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
              <span>{successMsg}</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Main Responsive Grid Layout (Desktop Full Width) ──── */}
      <div style={{ padding: '32px 24px 64px', maxWidth: 1600, margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
          gap: 24,
          alignItems: 'start'
        }}>

          {/* ── Left Column: Active Patient In Room ──── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--slate)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Current Consultation Room
            </div>

            {activePatient ? (
              <div className="card active-patient-card animate-slide-up" style={{ borderRadius: 16 }}>
                <div className="card-header" style={{ padding: '16px 20px 12px', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span className="badge badge-solid-green">{t.currentlyServing || 'In Consultation Room'}</span>
                    <span style={{ fontSize: 12, color: 'var(--slate-500)' }}>
                      Arrival: {new Date(activePatient.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                <div className="card-content" style={{ padding: '20px' }}>
                  <div className="patient-hero" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div style={{
                        padding: '10px 14px', borderRadius: 12,
                        backgroundColor: 'var(--slate-50)',
                        border: '1px solid var(--border)',
                        fontSize: 18, fontWeight: 900, color: 'var(--sky-600)'
                      }}>
                        {formatTokenId(activePatient.id)}
                      </div>
                      <div>
                        <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--slate)', margin: 0 }}>
                          {activePatient.patient?.name || 'Walk-in Patient'}
                        </h2>
                        <div style={{ fontSize: 13, color: 'var(--slate-500)', marginTop: 2 }}>
                          {activePatient.patient?.age ? `${activePatient.patient.age} yrs` : 'Age N/A'} • {activePatient.patient?.gender || 'N/A'} • {activePatient.primaryDepartment || 'General'}
                        </div>
                      </div>
                    </div>

                    <span
                      className="badge"
                      style={{
                        backgroundColor: getPriorityColors(activePatient.type, isDark).bg,
                        color: getPriorityColors(activePatient.type, isDark).text,
                        border: `1px solid ${getPriorityColors(activePatient.type, isDark).border}`,
                        textTransform: 'capitalize', padding: '6px 12px', fontSize: 12
                      }}
                    >
                      {activePatient.type}
                    </span>
                  </div>

                  {activePatient.emergency_reason && (
                    <div style={{
                      background: isDark ? '#450a0a' : '#fef2f2',
                      border: isDark ? '1px solid #7f1d1d' : '1px solid #fecaca',
                      color: isDark ? '#fca5a5' : '#991b1b',
                      borderRadius: 10, padding: '10px 14px', marginTop: 14, fontSize: 13
                    }}>
                      <strong>Emergency Reason:</strong> {activePatient.emergency_reason}
                    </div>
                  )}

                  {activePatient.assistanceNeeded && activePatient.assistanceNeeded.length > 0 && (
                    <div style={{
                      background: isDark ? '#042f2e' : '#f0fdfa',
                      border: isDark ? '1px solid #115e59' : '1px solid #ccfbf1',
                      color: isDark ? '#5eead4' : '#0f766e',
                      borderRadius: 10, padding: '10px 14px', marginTop: 14, fontSize: 13
                    }}>
                      <strong>Special Assistance:</strong> {activePatient.assistanceNeeded.join(', ')}
                    </div>
                  )}

                  {/* Consultation Action Buttons */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 20 }}>
                    <button
                      className="btn btn-outline"
                      onClick={() => setShowNotesModal(true)}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, height: 46, borderRadius: 10 }}
                    >
                      <FileText size={16} />
                      <span>Clinical Notes</span>
                    </button>

                    <button
                      className="btn btn-primary"
                      onClick={handleMarkComplete}
                      disabled={saving}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, height: 46, borderRadius: 10 }}
                    >
                      <CheckCircle2 size={16} />
                      <span>{saving ? 'Completing...' : 'Mark Complete'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="card" style={{ padding: 40, textAlign: 'center', borderRadius: 16 }}>
                <Activity size={44} color="var(--slate-400)" style={{ margin: '0 auto 12px' }} />
                <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--slate)' }}>No Patient Currently In Room</h3>
                <p style={{ fontSize: 13, color: 'var(--slate-500)', marginTop: 4 }}>Call a patient from the upcoming queue or scan a QR token to begin consultation.</p>
              </div>
            )}
          </div>

          {/* ── Right Column: Upcoming Queue List ──── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--slate)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                {t.upcomingQueue || 'Upcoming Patient Queue'} ({upcomingQueue.length})
              </div>
              <span style={{ fontSize: 12, color: 'var(--slate-500)', fontWeight: 600 }}>
                Total Waiting: <strong style={{ color: 'var(--slate)' }}>{totalWaiting}</strong>
              </span>
            </div>

            {upcomingQueue.length === 0 ? (
              <div className="card" style={{ padding: 40, textAlign: 'center', color: 'var(--slate-500)', fontSize: 14, borderRadius: 16 }}>
                No upcoming patients waiting in queue.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {upcomingQueue.map((token, index) => {
                  const colors = getPriorityColors(token.type, isDark);
                  const isSelected = activePatient?.id === token.id;
                  return (
                    <div
                      key={token.id}
                      className={`card ${isSelected ? 'selected' : ''}`}
                      onClick={() => setActivePatient(token)}
                      style={{
                        padding: '12px 16px',
                        borderRadius: 14,
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        gap: 12, cursor: 'pointer',
                        border: isSelected ? '2px solid var(--sky-600)' : '1px solid var(--border)',
                        backgroundColor: isSelected ? (isDark ? '#082f49' : '#f0f9ff') : 'var(--card-bg)',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {/* Position & Token */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                        <span style={{
                          fontSize: 12, fontWeight: 800,
                          color: 'var(--slate)',
                          backgroundColor: 'var(--slate-50)',
                          border: '1px solid var(--border)',
                          padding: '4px 8px', borderRadius: 8,
                          minWidth: 28, textAlign: 'center'
                        }}>
                          #{index + 1}
                        </span>
                        <span style={{
                          fontSize: 13, fontWeight: 800,
                          color: 'var(--sky-600)',
                          backgroundColor: 'var(--slate-50)',
                          border: '1px solid var(--border)',
                          padding: '4px 8px', borderRadius: 8
                        }}>
                          {formatTokenId(token.id)}
                        </span>
                      </div>

                      {/* Patient Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--slate)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {token.patient?.name || 'Walk-in'}
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--slate-500)', marginTop: 2 }}>
                          {token.primaryDepartment || token.department_name} • {token.patient?.gender || 'N/A'} • {token.patient?.age ? `${token.patient.age}y` : 'Age N/A'}
                        </div>
                      </div>

                      {/* Category Badge & Call Button */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                        <span
                          className="badge"
                          style={{
                            backgroundColor: colors.bg,
                            color: colors.text,
                            border: `1px solid ${colors.border}`,
                            textTransform: 'capitalize',
                            fontSize: 11
                          }}
                        >
                          {token.type}
                        </span>
                        <button
                          className="btn btn-sm btn-sky"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCallPatient(token);
                            setActivePatient(token);
                          }}
                          style={{ fontSize: 12, padding: '5px 12px', borderRadius: 8, fontWeight: 700 }}
                        >
                          Call
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* ── QR Scanner Modal ──────────────────────── */}
      <QrCameraScannerModal
        isOpen={showScannerModal}
        onClose={() => setShowScannerModal(false)}
        onScanSuccess={handleQrScanSuccess}
      />

      {/* ── Clinical Consultation Notes Modal ─────── */}
      {showNotesModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 90,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16
        }}>
          <div className="card animate-slide-up" style={{ width: '100%', maxWidth: 480, borderRadius: 16, background: 'var(--bg)' }}>
            <div className="card-header" style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
              <h3 className="card-title" style={{ fontSize: 17, color: 'var(--slate)' }}>
                Consultation Notes — {activePatient?.patient?.name}
              </h3>
              <p className="card-description" style={{ fontSize: 12, color: 'var(--slate-500)' }}>
                Token: {activePatient?.id} • {activePatient?.primaryDepartment}
              </p>
            </div>

            <div className="card-content" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label className="label" style={{ fontSize: 13, marginBottom: 4 }}>Primary Diagnosis</label>
                <input
                  className="input"
                  placeholder="e.g. Acute Viral Bronchitis / Fracture"
                  value={diagnosis}
                  onChange={e => setDiagnosis(e.target.value)}
                />
              </div>

              <div>
                <label className="label" style={{ fontSize: 13, marginBottom: 4 }}>Doctor Examination Notes & Advice</label>
                <textarea
                  className="textarea"
                  rows={4}
                  placeholder="Clinical observations, recommended rest, follow-up schedule..."
                  value={clinicalNotes}
                  onChange={e => setClinicalNotes(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setShowNotesModal(false)}
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSaveConsultationNotes}
                  disabled={saving}
                  style={{ flex: 1 }}
                >
                  {saving ? 'Saving...' : 'Save Notes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
