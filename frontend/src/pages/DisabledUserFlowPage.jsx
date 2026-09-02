import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Accessibility, Eye, Ear, Brain,
  Circle, CircleDot, Activity
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { supabase } from '../api/supabaseClient';
import { queueApi } from '../api/index';


const disabilityTypes = [
  { value: 'mobility', label: 'Mobility Impairment', icon: Accessibility },
  { value: 'visual', label: 'Visual Impairment', icon: Eye },
  { value: 'hearing', label: 'Hearing Impairment', icon: Ear },
  { value: 'cognitive', label: 'Cognitive / Neurological', icon: Brain },
  { value: 'other', label: 'Other Special Need', icon: Activity },
];

const assistanceOptions = [
  'Wheelchair Assistance',
  'Sign Language Interpreter',
  'Guided Escort',
  'Priority Seating',
  'Low-Counter Service',
  'Large Print Documentation',
];

export default function DisabledUserFlowPage() {
  const navigate = useNavigate();
  const { state, setState } = useAppContext();

  const [formData, setFormData] = useState({
    name: state.patientInfo?.name || '',
    age: '',
    gender: 'male',
    primaryDepartment: '',
    disabilityType: '',
    disabilityDetails: '',
    assistanceNeeded: [],
    otherAssistance: '',
    urgency: 'normal',
    caregiverName: '',
    caregiverPhone: '',
  });
  const [loading, setLoading] = useState(false);

  const handleBack = () => navigate('/dashboard');

  const handleAssistanceChange = (opt, checked) => {
    setFormData(prev => ({
      ...prev,
      assistanceNeeded: checked
        ? [...prev.assistanceNeeded, opt]
        : prev.assistanceNeeded.filter(a => a !== opt),
    }));
  };

  const patientName = formData.name || state.patientInfo?.name || 'Accessibility Patient';
  const patientEmail = state.patientInfo?.email || '';
  const patientPhone = state.patientInfo?.phone || '';

  const generateDisabledToken = (dbSeq, dbTokenId) => {
    const now = new Date();
    const tokenNumber = dbSeq ? String(dbSeq).padStart(3, '0') : String(state.tokens.filter(t => t.type === 'disabled').length + 1).padStart(3, '0');
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const timeStr = now.toTimeString().slice(0, 8).replace(/:/g, '');
    const randomSuffix = Math.random().toString(36).substring(2, 5).toUpperCase();

    const tokenId = dbTokenId || `ACE-${timeStr}-${tokenNumber}-${randomSuffix}`;
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    const patientId = `PAT-${dateStr}-${tokenNumber}`;
    const allDepartmentNames = state.departments.map(d => d.name);

    const priority = formData.urgency === 'priority' ? 8 : 6;
    const allAssistanceNeeded = [...formData.assistanceNeeded];
    if (formData.otherAssistance.trim()) {
      allAssistanceNeeded.push(`Other: ${formData.otherAssistance.trim()}`);
    }

    const targetDept = state.departments.find(d => d.name === formData.primaryDepartment);
    const assignedDoc = targetDept?.doctors?.[0] || { id: 'DOC001', name: 'Dr. Ravi Sharma' };

    return {
      id: tokenId,
      tokenNumber: parseInt(tokenNumber, 10) || 1,
      type: 'disabled',
      primaryDepartment: formData.primaryDepartment,
      doctor_id: assignedDoc.id,
      doctor_name: assignedDoc.name,
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
      priority: priority,
      disabilityType: formData.disabilityType,
      assistanceNeeded: allAssistanceNeeded,
      qrCode: tokenId,
      validUntil: endOfDay,
      createdAt: now,
      schedulingMethod: 'manual',
      visits: [],
      labTests: [],
      departmentAccess: allDepartmentNames,
    };
  };

  const handleFormSubmit = async (e) => {
    e?.preventDefault();
    if (!formData.age || !formData.gender || !formData.primaryDepartment || !formData.disabilityType) {
      alert('Please fill all required fields');
      return;
    }
    if (formData.assistanceNeeded.length === 0 && formData.otherAssistance.trim() === '') {
      alert('Please select assistance needed');
      return;
    }

    setLoading(true);
    try {
      let dbSeq = null;
      let dbTokenId = null;
      try {
        const seqRes = await queueApi.getNextSequence('disabled');
        if (seqRes?.success) {
          dbSeq = seqRes.nextSeq;
          dbTokenId = seqRes.tokenId;
        }
      } catch (err) {
        console.warn('Accessibility sequence fetch fallback:', err);
      }

      const newToken = generateDisabledToken(dbSeq, dbTokenId);
      const tokenPayload = {
        token_id: newToken.id,
        token_number: newToken.tokenNumber,
        type: 'disabled',
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
        disability_type: formData.disabilityType,
        assistance_needed: newToken.assistanceNeeded,
        caregiver_name: formData.caregiverName || null,
        caregiver_phone: formData.caregiverPhone || null,
        scheduling_method: 'manual',
        scheduled_time: new Date().toISOString(),
        estimated_wait_minutes: 10,
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

      setState(prev => ({
        ...prev,
        patientInfo: prev.patientInfo || { name: patientName, email: patientEmail, phone: patientPhone },
        tokens: [...prev.tokens.filter(t => t.id !== newToken.id), newToken],
        currentToken: newToken,
        currentView: 'token',
      }));
      navigate('/token');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const consultationDepartments = state.departments.filter(d => d.type === 'consultation');

  return (
    <div className="page" style={{ padding: '32px 24px 64px', maxWidth: 1440, margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>

      {/* ── 1. Top Header Card ─────────────────────────── */}
      <div className="card mb-4" style={{ borderColor: 'var(--border)', borderWidth: 1 }}>
        <div className="card-header" style={{ padding: '16px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button onClick={handleBack} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center' }}>
                <ArrowLeft size={20} color="var(--sky-600)" />
              </button>
              <div>
                <div className="card-title" style={{ color: 'var(--sky-600)', fontSize: 18 }}>Accessibility Services</div>
                <div style={{ color: 'var(--slate-500)', fontSize: 13, fontWeight: 500 }}>Priority Care Lane</div>
              </div>
            </div>
              <Accessibility size={28} color="var(--sky-600)" />
          </div>
        </div>
      </div>

      {/* ── 2. Comprehensive Support Card ──────────────── */}
      <div className="card mb-4" style={{ backgroundColor: 'var(--slate-50)', borderLeft: '6px solid #0d9488' }}>
        <div className="card-content" style={{ padding: '16px 20px' }}>
          <div style={{ fontWeight: 700, color: 'var(--slate)', marginBottom: 4, fontSize: 15 }}>Comprehensive Support</div>
          <div style={{ fontSize: 13, color: 'var(--slate-500)', lineHeight: '20px' }}>
            We provide priority service and specialized physical and communication assistance for patients with disabilities.
          </div>
        </div>
      </div>

      {/* ── 3. Main Form Card ──────────────────────────── */}
      <div className="card mb-4 animate-slide-up">
        <div className="card-content" style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 18 }}>

          {/* Section: Medical Information */}
          <div style={{ fontSize: 16, fontWeight: 800, borderBottom: '1px solid var(--border)', paddingBottom: 8, color: 'var(--slate)' }}>
            Medical Information
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
                      <RadioIcon size={18} color={isSelected ? 'var(--sky-600)' : 'var(--slate-400)'} />
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
            <label className="label">Primary Department *</label>
            <select
              className="input"
              value={formData.primaryDepartment}
              onChange={e => setFormData({ ...formData, primaryDepartment: e.target.value })}
              required
            >
              <option value="">Select primary department</option>
              {consultationDepartments.map(dept => (
                <option key={dept.name} value={dept.name}>{dept.name}</option>
              ))}
            </select>
          </div>

          {/* Section: Accessibility Information */}
          <div style={{ fontSize: 16, fontWeight: 800, borderBottom: '1px solid var(--border)', paddingBottom: 8, color: 'var(--slate)', marginTop: 8 }}>
            Accessibility Information
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="label">Type of Accessibility Need *</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 8 }}>
              {disabilityTypes.map(type => {
                const Icon = type.icon;
                const isSelected = formData.disabilityType === type.value;
                return (
                  <div
                    key={type.value}
                    onClick={() => setFormData({ ...formData, disabilityType: type.value })}
                    style={{
                      padding: '12px 14px',
                      borderRadius: 14,
                      border: isSelected ? '2px solid var(--sky-600)' : '1px solid var(--border)',
                      backgroundColor: isSelected ? 'var(--slate-100)' : 'var(--slate-50)',
                      display: 'flex', alignItems: 'center', gap: 8,
                      cursor: 'pointer', transition: 'all 0.15s ease'
                    }}
                  >
                    <Icon size={18} color={isSelected ? 'var(--sky-600)' : 'var(--slate-400)'} />
                    <span style={{ fontSize: 13, color: 'var(--slate)', fontWeight: isSelected ? 700 : 500 }}>
                      {type.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="label">Specific Requirements / Notes</label>
            <textarea
              className="textarea"
              value={formData.disabilityDetails}
              onChange={e => setFormData({ ...formData, disabilityDetails: e.target.value })}
              placeholder="e.g. Needs wheelchair from gate, stretcher assistance, sign language..."
              rows={2}
            />
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="label">Priority Level</label>
            <div style={{ display: 'flex', gap: 20, marginTop: 6 }}>
              {[
                { value: 'normal', label: 'Standard Priority' },
                { value: 'priority', label: 'High Priority (Urgent Assistance)' },
              ].map(option => {
                const isSelected = formData.urgency === option.value;
                const RadioIcon = isSelected ? CircleDot : Circle;
                return (
                  <div
                    key={option.value}
                    onClick={() => setFormData({ ...formData, urgency: option.value })}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
                  >
                    <RadioIcon size={18} color={isSelected ? 'var(--sky-600)' : 'var(--slate-400)'} />
                    <span style={{ fontSize: 13, color: 'var(--slate)', fontWeight: isSelected ? 700 : 500 }}>
                      {option.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section: Assistance Needed */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="label">Assistance Needed *</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8 }}>
              {assistanceOptions.map(opt => {
                const checked = formData.assistanceNeeded.includes(opt);
                return (
                  <label
                    key={opt}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '10px 12px', borderRadius: 10,
                      border: checked ? '1px solid var(--sky-600)' : '1px solid var(--border)',
                      backgroundColor: checked ? 'var(--slate-100)' : 'var(--slate-50)',
                      cursor: 'pointer', fontSize: 12, fontWeight: checked ? 700 : 500, color: 'var(--slate)'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={e => handleAssistanceChange(opt, e.target.checked)}
                      style={{ accentColor: '#0284c7' }}
                    />
                    <span>{opt}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 6 }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="label">Caregiver Name</label>
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
            className="btn btn-primary btn-full"
            style={{ marginTop: 12, height: 48, borderRadius: 12, fontSize: 15, fontWeight: 700 }}
          >
            {loading ? 'Generating Priority Token...' : 'Generate Accessibility Token'}
          </button>

        </div>
      </div>

    </div>
  );
}
