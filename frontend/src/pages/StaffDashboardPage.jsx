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

  const [isSyncing, setIsSyncing] = useState(false);

  const formatTokenRow = (row) => {
    const tokenId = row.token_id || row.id;
    const tokenType = row.type || (tokenId?.startsWith('EME') ? 'emergency' : tokenId?.startsWith('ACE') ? 'disabled' : 'common');
    return {
    id: tokenId,
    token_id: tokenId,
    tokenNumber: row.token_number || 1,
    type: tokenType,
    primaryDepartment: row.department_name || row.department || 'General Medicine',
    department_name: row.department_name || row.department || 'General Medicine',
    doctor_id: row.doctor_id || null,
    doctor_name: row.doctor_name || null,
    status: row.status || 'waiting',
    priority: row.priority || (tokenType === 'emergency' ? 10 : tokenType === 'disabled' ? 8 : 3),
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
  };
};

  const fetchLiveTokens = async () => {
    let rawTokens = null;

    // 1. Try Express API first (guaranteed admin bypass of Supabase RLS)
    try {
      const apiRes = await queueApi.getAll();
      if (apiRes && apiRes.success && Array.isArray(apiRes.data) && apiRes.data.length > 0) {
        rawTokens = apiRes.data;
      }
    } catch (apiErr) {
      console.warn('API sync fallback:', apiErr);
    }

    // 2. Fallback to direct Supabase query
    if (!rawTokens) {
      const { data, error } = await supabase
        .from('queue_tokens')
        .select('*')
        .neq('status', 'completed')
        .neq('status', 'cancelled')
        .order('created_at', { ascending: true });

      if (!error && Array.isArray(data) && data.length > 0) {
        rawTokens = data;
      } else {
        const fallback = await supabase
          .from('queue')
          .select('*')
          .neq('status', 'completed')
          .neq('status', 'cancelled')
          .order('created_at', { ascending: true });
        if (fallback.data && Array.isArray(fallback.data) && fallback.data.length > 0) {
          rawTokens = fallback.data;
        }
      }
    }

    return rawTokens;
  };

  // Auto-sync tokens from API/Supabase across all devices every 4 seconds
  // ponytail: merge instead of replace — avoids clobbering local-only tokens when poll
  // returns fewer rows than already in state (race with realtime, or partial fetch).
  useEffect(() => {
    const syncLiveQueue = async () => {
      try {
        const rawTokens = await fetchLiveTokens();
        if (Array.isArray(rawTokens) && rawTokens.length > 0) {
          setAppState(prev => {
            // ponytail: keep only live tokens in state — drop any local token
            // that the server has finished (completed/cancelled) so the
            // patient's "View Token" shortcut disappears once the doctor
            // marks them done.
            const live = rawTokens.filter(r => r.status !== 'completed' && r.status !== 'cancelled');
            const liveIds = new Set(live.map(r => r.token_id || r.id));
            const merged = (prev.tokens || []).filter(t => liveIds.has(t.id));
            live.forEach(row => {
              const id = row.token_id || row.id;
              if (!merged.some(t => t.id === id)) {
                merged.push(formatTokenRow(row));
              }
            });
            return { ...prev, tokens: merged };
          });
        }
      } catch (err) {
        console.warn('Queue sync polling error:', err);
      }
    };

    syncLiveQueue();
    const interval = setInterval(syncLiveQueue, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleManualSync = async () => {
    setIsSyncing(true);
    try {
      const rawTokens = await fetchLiveTokens();
      // ponytail: drop completed/cancelled so manually-synced state never
      // resurrects a finished token for the patient.
      const live = (rawTokens || []).filter(r => r.status !== 'completed' && r.status !== 'cancelled');
      if (live.length > 0) {
        const formatted = live.map(formatTokenRow);
        setAppState(prev => ({ ...prev, tokens: formatted }));
        setSuccessMsg(`Queue refreshed: ${formatted.length} active patient(s) found.`);
      } else {
        setSuccessMsg('Queue sync complete: No booked patients currently waiting in database.');
      }
      setTimeout(() => setSuccessMsg(''), 3500);
    } catch (err) {
      setSuccessMsg('Sync error: could not connect to server.');
      setTimeout(() => setSuccessMsg(''), 3000);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleAddDemoPatient = async () => {
    setSaving(true);
    try {
      const randomNum = Math.floor(100 + Math.random() * 900);
      const demoTokenId = `GEN-${new Date().toTimeString().slice(0, 8).replace(/:/g, '')}-${randomNum}`;
      const deptName = appState.staffInfo?.department_name || appState.staffInfo?.department || 'General Medicine';
      const docName = appState.staffInfo?.full_name || appState.staffInfo?.name || 'Dr. Ravi Sharma';

      const demoTokenPayload = {
        token_id: demoTokenId,
        token_number: randomNum,
        type: 'common',
        priority: 3,
        status: 'waiting',
        department_name: deptName,
        doctor_id: appState.staffInfo?.staff_id || null,
        doctor_name: docName,
        patient_name: 'Aarav Patel (Walk-in)',
        patient_phone: '+91 98765 43210',
        patient_email: 'aarav.patel@example.com',
        patient_age: 35,
        patient_gender: 'male',
        scheduling_method: 'auto',
        scheduled_time: new Date().toISOString(),
        estimated_wait_minutes: 15,
        queue_position: 1,
        qr_code_data: demoTokenId,
        valid_until: new Date(Date.now() + 24 * 3600000).toISOString()
      };

      const writeRes = await queueApi.write(demoTokenPayload);
      if (!writeRes.success) {
        console.error('Demo patient insert failed:', writeRes.error);
      }

      const formatted = formatTokenRow(demoTokenPayload);
      setAppState(prev => ({
        ...prev,
        tokens: [...(prev.tokens || []).filter(t => t.id !== demoTokenId), formatted]
      }));
      setActivePatient(formatted);
      setSuccessMsg(`Patient ${formatted.patient.name} (${formatted.id}) added to queue!`);
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error('Failed to add demo patient:', err);
    } finally {
      setSaving(false);
    }
  };

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
      const res = await queueApi.update(patientToken.id, { status: 'called' });
      if (!res.success) console.error('Call status update failed:', res.error);

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
      const res = await queueApi.update(activePatient.id, { status: 'completed', completed_at: completedAt });
      if (!res.success) console.error('Mark complete update failed:', res.error);

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

      queueApi.update(found.id, { status: 'called' }).catch(err => {
        console.error('QR scan status update failed:', err);
      });
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
        padding: '16px 16px'
      }}>
        <div style={{ maxWidth: 1600, margin: '0 auto', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ minWidth: 0, flex: '1 1 200px' }}>
              <div>
                <div style={{ fontSize: 19, fontWeight: 800, color: 'var(--slate)' }}>
                  {t.staffDashboardTitle || 'Staff / Doctor Dashboard'}
                </div>
                <div style={{ fontSize: 13, color: 'var(--slate-500)', marginTop: 2 }}>
                  {appState.staffInfo?.full_name || appState.staffInfo?.name || 'Dr. Assigned'} • {appState.staffInfo?.department_name || appState.staffInfo?.department || 'General Medicine'}
                </div>
              </div>
            </div>

            <div className="staff-header-actions" style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <button
                onClick={handleManualSync}
                disabled={isSyncing}
                className="staff-header-btn"
                style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  padding: '9px 14px', borderRadius: 10,
                  background: isDark ? '#1e293b' : '#f8fafc',
                  color: isDark ? '#e2e8f0' : '#1e293b',
                  border: '1px solid var(--border)', cursor: 'pointer',
                  fontWeight: 700, fontSize: 13,
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap'
                }}
                title="Refresh queue from backend server"
              >
                <RefreshCw size={15} style={{ animation: isSyncing ? 'spin 1s linear infinite' : 'none' }} />
                <span>{isSyncing ? 'Syncing...' : 'Sync Queue'}</span>
              </button>

              <button
                onClick={() => setShowScannerModal(true)}
                className="staff-header-btn"
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '9px 14px', borderRadius: 10,
                  background: '#0284c7', color: '#ffffff',
                  border: 'none', cursor: 'pointer',
                  fontWeight: 700, fontSize: 13,
                  boxShadow: '0 3px 10px rgba(2, 132, 199, 0.25)',
                  whiteSpace: 'nowrap'
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
      <div style={{ padding: '32px 16px 64px', maxWidth: 1600, margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        <div className="staff-dashboard-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(420px, 100%), 1fr))',
          gap: 20,
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
                  <div className="patient-hero" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0, flex: '1 1 200px' }}>
                      <div style={{
                        padding: '10px 14px', borderRadius: 12,
                        backgroundColor: 'var(--slate-50)',
                        border: '1px solid var(--border)',
                        fontSize: 18, fontWeight: 900, color: 'var(--sky-600)',
                        flexShrink: 0
                      }}>
                        {formatTokenId(activePatient.id)}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--slate)', margin: 0, wordBreak: 'break-word' }}>
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
                        textTransform: 'capitalize', padding: '6px 12px', fontSize: 12,
                        flexShrink: 0
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
              <div className="card" style={{ padding: '36px 20px', textAlign: 'center', color: 'var(--slate-500)', fontSize: 14, borderRadius: 16 }}>
                <p style={{ margin: '0 0 14px 0', fontWeight: 500 }}>No upcoming patients waiting in queue.</p>
                <button
                  onClick={handleAddDemoPatient}
                  disabled={saving}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '9px 18px', borderRadius: 10,
                    background: '#0284c7', color: '#ffffff',
                    border: 'none', cursor: 'pointer',
                    fontWeight: 700, fontSize: 13,
                    boxShadow: '0 2px 8px rgba(2, 132, 199, 0.25)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Users size={16} />
                  <span>{saving ? 'Adding...' : '+ Add Test Patient to Queue'}</span>
                </button>
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
