import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, AlertTriangle, ShieldAlert, Circle, CircleDot, Activity, Info
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { supabase } from '../api/supabaseClient';
import { queueApi } from '../api/index';


const emergencyReasons = [
  'Trauma / Accident',
  'Chest Pain / Cardiac',
  'Severe Breathing Difficulty',
  'Unconsciousness / Stroke',
  'Severe Burn / Bleeding',
  'Other Critical Condition'
];

export default function EmergencyUserFlowPage() {
  const navigate = useNavigate();
  const { state, setState, sendEmergencyNotification } = useAppContext();

  const [formData, setFormData] = useState({
    name: state.patientInfo?.name || '',
    age: '',
    gender: 'male',
    primaryDepartment: 'Emergency',
    emergencyReason: '',
    severity: 'critical',
    hasDisability: false,
    disabilityType: 'mobility',
    caregiverName: '',
    caregiverPhone: '',
  });
  const [loading, setLoading] = useState(false);

  const handleBack = () => navigate('/dashboard');

  const emergencyTokens = (state.tokens || []).filter(t => t.type === 'emergency' && (t.status === 'active' || t.status === 'waiting'));
  const remainingEmergency = Math.max(0, (state.maxEmergencyPerDay || 50) - emergencyTokens.length);

  const patientName = formData.name || state.patientInfo?.name || 'Emergency Patient';
  const patientEmail = state.patientInfo?.email || '';
  const patientPhone = state.patientInfo?.phone || '';

  const generateEmergencyToken = (dbSeq, dbTokenId) => {
    const now = new Date();
    const tokenNumber = dbSeq ? String(dbSeq).padStart(3, '0') : String(emergencyTokens.length + 1).padStart(3, '0');
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const timeStr = now.toTimeString().slice(0, 8).replace(/:/g, '');
    const randomSuffix = Math.random().toString(36).substring(2, 5).toUpperCase();

    const tokenId = dbTokenId || `EME-${timeStr}-${tokenNumber}-${randomSuffix}`;
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    const patientId = `PAT-${dateStr}-${tokenNumber}`;
    const allDepartmentNames = state.departments.map(d => d.name);

    const targetDept = state.departments.find(d => d.name === formData.primaryDepartment || d.name === 'Emergency');
    const emergencyDoc = targetDept?.doctors?.[0] || { id: 'DOC-EMG-01', name: 'Dr. Kiran (Emergency)' };

    return {
      id: tokenId,
      tokenNumber: parseInt(tokenNumber, 10) || 1,
      type: 'emergency',
      primaryDepartment: formData.primaryDepartment,
      doctor_id: emergencyDoc.id,
      doctor_name: emergencyDoc.name,
      timestamp: now,
      patient: {
        name: patientName,
        email: patientEmail,
        phone: patientPhone,
        age: formData.age,
        gender: formData.gender,
        patientId: patientId,
      },
      status: 'active',
      priority: formData.severity === 'critical' ? 10 : 8,
      emergency_reason: formData.emergencyReason,
      severity: formData.severity,
      qrCode: tokenId,
      validUntil: endOfDay,
      createdAt: now,
      schedulingMethod: 'auto',
      visits: [],
      labTests: [],
      departmentAccess: allDepartmentNames,
    };
  };

  const handleFormSubmit = async (e) => {
    e?.preventDefault();
    if (!formData.age || !formData.gender || !formData.primaryDepartment || !formData.emergencyReason) {
      alert('Please fill all required fields');
      return;
    }
    if (remainingEmergency <= 0) {
      alert('Emergency limit reached');
      return;
    }

    setLoading(true);
    try {
      let dbSeq = null;
      let dbTokenId = null;
      try {
        const seqRes = await queueApi.getNextSequence('emergency');
        if (seqRes?.success) {
          dbSeq = seqRes.nextSeq;
          dbTokenId = seqRes.tokenId;
        }
      } catch (err) {
        console.warn('Emergency sequence fetch fallback:', err);
      }

      const newToken = generateEmergencyToken(dbSeq, dbTokenId);
      const tokenPayload = {
        token_id: newToken.id,
        token_number: newToken.tokenNumber,
        type: 'emergency',
        priority: newToken.priority,
        status: 'waiting',
        department_name: newToken.primaryDepartment,
        doctor_id: newToken.doctor_id,
        doctor_name: newToken.doctor_name,
        patient_name: newToken.patient.name,
        patient_phone: newToken.patient.phone || null,
        patient_email: newToken.patient.email || null,
        patient_age: parseInt(newToken.patient.age, 10) || null,
        patient_gender: newToken.patient.gender || 'not specified',
        emergency_reason: formData.emergencyReason,
        severity: formData.severity,
        disability_type: formData.hasDisability ? formData.disabilityType : null,
        assistance_needed: formData.hasDisability ? ['Wheelchair Assistance'] : [],
        caregiver_name: formData.caregiverName || null,
        caregiver_phone: formData.caregiverPhone || null,
        scheduling_method: 'auto',
        scheduled_time: new Date().toISOString(),
        estimated_wait_minutes: 5,
        queue_position: 1,
        qr_code_data: newToken.id,
        valid_until: newToken.validUntil.toISOString()
      };

      // 1. Save via Express API (guaranteed server admin access)
      try {
        await queueApi.insert(tokenPayload);
      } catch (apiErr) {
        console.warn('API queue insert fallback:', apiErr);
      }

      // 2. Direct Supabase insert
      try {
        await supabase.from('queue_tokens').insert([tokenPayload]);
      } catch (sbErr) {
        console.warn('Supabase direct insert fallback:', sbErr);
      }

      sendEmergencyNotification(newToken.primaryDepartment);

      setState(prev => ({
        ...prev,
        patientInfo: prev.patientInfo || { name: patientName, email: patientEmail, phone: patientPhone },
        tokens: [...prev.tokens.filter(t => t.id !== newToken.id), newToken],
        currentToken: newToken,
        currentView: 'token',
        emergencyCount: prev.emergencyCount + 1,
      }));
      navigate('/token');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page" style={{ padding: '32px 24px 64px', maxWidth: 1440, margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>

      {/* ── 1. Top Header Card ─────────────────────────── */}
      <div className="card mb-4" style={{ borderColor: '#ef4444', borderWidth: 1 }}>
        <div className="card-header" style={{ padding: '16px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button onClick={handleBack} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center' }}>
                <ArrowLeft size={20} color="#ef4444" />
              </button>
              <div>
                <div className="card-title" style={{ color: '#ef4444', fontSize: 18 }}>Emergency Lane</div>
                <div style={{ color: 'var(--slate-500)', fontSize: 13, fontWeight: 500 }}>Immediate Triage Consultation</div>
              </div>
            </div>
              <ShieldAlert size={28} color="#ef4444" />
          </div>
        </div>
      </div>

      {/* ── 2. Capacity Alert Card ─────────────────────── */}
      <div className="card mb-4" style={{ backgroundColor: 'var(--slate-50)', borderLeft: '6px solid #ef4444' }}>
        <div className="card-content" style={{ padding: '16px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 700, color: 'var(--slate)', fontSize: 15 }}>Emergency Triage Priority</div>
              <div style={{ fontSize: 13, color: 'var(--slate-500)', marginTop: 2 }}>
                Critical cases receive instant queue bypass and priority doctor assignment.
              </div>
            </div>
            <span className="badge badge-red" style={{ fontSize: 12, padding: '4px 10px' }}>
              {remainingEmergency} Slots Left
            </span>
          </div>
        </div>
      </div>

      {/* ── 3. Main Form Card ──────────────────────────── */}
      <div className="card mb-4 animate-slide-up">
        <div className="card-content" style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 18 }}>

          {/* Section: Medical Information */}
          <div style={{ fontSize: 16, fontWeight: 800, borderBottom: '1px solid var(--border)', paddingBottom: 8, color: 'var(--slate)' }}>
            Patient Information
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="label">Name</label>
            <input
              className="input"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="Patient Name"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="label">Age *</label>
              <input
                className="input"
                type="number"
                value={formData.age}
                onChange={e => setFormData({ ...formData, age: e.target.value })}
                placeholder="Age"
                min="0"
                max="120"
                required
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="label">Gender *</label>
              <div style={{ display: 'flex', gap: 12, marginTop: 10 }}>
                {['male', 'female', 'other'].map(g => {
                  const isSelected = formData.gender === g;
                  const RadioIcon = isSelected ? CircleDot : Circle;
                  return (
                    <div
                      key={g}
                      onClick={() => setFormData({ ...formData, gender: g })}
                      style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}
                    >
                      <RadioIcon size={18} color={isSelected ? '#ef4444' : 'var(--slate-400)'} />
                      <span style={{ fontSize: 13, textTransform: 'capitalize', color: 'var(--slate)', fontWeight: isSelected ? 700 : 400 }}>
                        {g}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="label">Emergency Department *</label>
            <select
              className="input"
              value={formData.primaryDepartment}
              onChange={e => setFormData({ ...formData, primaryDepartment: e.target.value })}
              required
            >
              {state.departments.map(dept => (
                <option key={dept.name} value={dept.name}>{dept.name}</option>
              ))}
            </select>
          </div>

          {/* Section: Triage details */}
          <div style={{ fontSize: 16, fontWeight: 800, borderBottom: '1px solid var(--border)', paddingBottom: 8, color: 'var(--slate)', marginTop: 8 }}>
            Triage & Critical Condition
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="label">Emergency Reason *</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8 }}>
              {emergencyReasons.map(r => {
                const isSelected = formData.emergencyReason === r;
                return (
                  <div
                    key={r}
                    onClick={() => setFormData({ ...formData, emergencyReason: r })}
                    style={{
                      padding: '10px 12px',
                      borderRadius: 12,
                      border: isSelected ? '2px solid #ef4444' : '1px solid var(--border)',
                      backgroundColor: isSelected ? 'var(--slate-100)' : 'var(--slate-50)',
                      cursor: 'pointer', fontSize: 12, fontWeight: isSelected ? 700 : 500, color: 'var(--slate)'
                    }}
                  >
                    {r}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="label">Severity Level</label>
            <div style={{ display: 'flex', gap: 16, marginTop: 6 }}>
              {[
                { value: 'critical', label: '🔴 Critical (Immediate)' },
                { value: 'urgent', label: '🟡 Urgent (< 10 mins)' },
              ].map(option => {
                const isSelected = formData.severity === option.value;
                const RadioIcon = isSelected ? CircleDot : Circle;
                return (
                  <div
                    key={option.value}
                    onClick={() => setFormData({ ...formData, severity: option.value })}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
                  >
                    <RadioIcon size={18} color={isSelected ? '#ef4444' : 'var(--slate-400)'} />
                    <span style={{ fontSize: 13, color: 'var(--slate)', fontWeight: isSelected ? 700 : 500 }}>
                      {option.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 6 }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="label">Caregiver / Accompanying Person</label>
              <input
                className="input"
                value={formData.caregiverName}
                onChange={e => setFormData({ ...formData, caregiverName: e.target.value })}
                placeholder="Caregiver name"
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="label">Caregiver Phone</label>
              <input
                className="input"
                type="tel"
                value={formData.caregiverPhone}
                onChange={e => setFormData({ ...formData, caregiverPhone: e.target.value })}
                placeholder="+91 XXXXX"
              />
            </div>
          </div>

          <button
            onClick={handleFormSubmit}
            disabled={loading}
            className="btn btn-full"
            style={{
              marginTop: 12, height: 48, borderRadius: 12, fontSize: 15, fontWeight: 700,
              background: '#ef4444', color: '#ffffff', border: 'none', cursor: 'pointer'
            }}
          >
            {loading ? 'Dispatching Emergency Token...' : 'Generate Emergency Priority Token'}
          </button>

        </div>
      </div>

    </div>
  );
}
