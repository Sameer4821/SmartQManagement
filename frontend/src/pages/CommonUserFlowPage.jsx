import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, CheckCircle, User, Circle, CircleDot,
  Activity, Users, Zap, Clock, Calendar
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useTranslation } from '../hooks/useTranslation';
import { queueApi } from '../api/index';
import { supabase } from '../api/supabaseClient';


const manualTimeSlots = [
  { time: '09:00', label: '9:00 AM - 10:00 AM', crowdLevel: 'Low', color: '#16a34a' },
  { time: '10:00', label: '10:00 AM - 11:00 AM', crowdLevel: 'Medium', color: '#ca8a04' },
  { time: '11:00', label: '11:00 AM - 12:00 PM', crowdLevel: 'High', color: '#dc2626' },
  { time: '14:00', label: '2:00 PM - 3:00 PM', crowdLevel: 'Low', color: '#16a34a' },
  { time: '15:00', label: '3:00 PM - 4:00 PM', crowdLevel: 'Medium', color: '#ca8a04' },
  { time: '16:00', label: '4:00 PM - 5:00 PM', crowdLevel: 'High', color: '#dc2626' },
];

export default function CommonUserFlowPage() {
  const navigate = useNavigate();
  const { state, setState, calculateOptimalTime } = useAppContext();
  const { t } = useTranslation();

  const [step, setStep] = useState('form'); // 'form' | 'scheduling' | 'timeSlot'
  const [formData, setFormData] = useState({
    name: state.patientInfo?.name || '',
    age: '',
    gender: 'male',
    primaryDepartment: '',
    assignedDoctor: '',
    schedulingMethod: 'auto',
    timeSlot: '',
    estimatedWait: 15,
    queuePosition: 1,
    optimalTime: null
  });
  const [loading, setLoading] = useState(false);

  const handleBack = () => {
    if (step === 'timeSlot') setStep('scheduling');
    else if (step === 'scheduling') setStep('form');
    else navigate('/dashboard');
  };

  useEffect(() => {
    if (formData.primaryDepartment) {
      const optimal = calculateOptimalTime(formData.primaryDepartment, formData.assignedDoctor);
      setFormData(prev => ({
        ...prev,
        estimatedWait: optimal.waitTime,
        queuePosition: optimal.position,
        optimalTime: optimal.time
      }));
    }
  }, [formData.primaryDepartment, formData.assignedDoctor, calculateOptimalTime]);

  const handleFormSubmit = (e) => {
    e?.preventDefault();
    if (!formData.age || !formData.gender || !formData.primaryDepartment) {
      alert('Please fill all required fields');
      return;
    }
    setStep('scheduling');
  };

  const patientName = formData.name || state.patientInfo?.name || 'Patient Visitor';
  const patientEmail = state.patientInfo?.email || '';
  const patientPhone = state.patientInfo?.phone || '';

  const generateToken = (dbSeq, dbTokenId) => {
    const now = new Date();
    const tokenNumber = dbSeq ? String(dbSeq).padStart(3, '0') : String(state.tokens.filter(t => t.type === 'common').length + 1).padStart(3, '0');
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const timeStr = now.toTimeString().slice(0, 8).replace(/:/g, '');
    const randomSuffix = Math.random().toString(36).substring(2, 5).toUpperCase();

    const tokenId = dbTokenId || `GEN-${timeStr}-${tokenNumber}-${randomSuffix}`;
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    const patientId = `PAT-${dateStr}-${tokenNumber}`;
    const allDepartmentNames = state.departments.map(d => d.name);

    const targetDept = state.departments.find(d => d.name === formData.primaryDepartment);
    const assignedDoc = targetDept?.doctors?.find(d => String(d.id) === String(formData.assignedDoctor)) || targetDept?.doctors?.[0];
    const doctorId = assignedDoc?.id || formData.assignedDoctor || 'DOC001';
    const doctorName = assignedDoc?.name || 'Dr. Ravi Sharma';

    return {
      id: tokenId,
      tokenNumber: parseInt(tokenNumber, 10) || 1,
      type: 'common',
      primaryDepartment: formData.primaryDepartment,
      doctor_id: doctorId,
      doctor_name: doctorName,
      scheduledTime: formData.schedulingMethod === 'auto' ? formData.optimalTime : new Date(),
      timestamp: now,
      patient: {
        name: patientName,
        email: patientEmail,
        phone: patientPhone,
        age: formData.age,
        gender: formData.gender,
        patientId: patientId
      },
      status: 'active',
      priority: 3,
      qrCode: tokenId,
      validUntil: endOfDay,
      createdAt: now,
      schedulingMethod: formData.schedulingMethod,
      estimatedWaitTime: formData.estimatedWait,
      positionInQueue: formData.queuePosition,
      visits: [],
      labTests: [],
      departmentAccess: allDepartmentNames
    };
  };

  const handleTokenGeneration = async () => {
    if (formData.schedulingMethod === 'manual' && !formData.timeSlot) {
      return;
    }
    setLoading(true);
    try {
      let dbSeq = null;
      let dbTokenId = null;
      try {
        const seqRes = await queueApi.getNextSequence('common');
        if (seqRes?.success) {
          dbSeq = seqRes.nextSeq;
          dbTokenId = seqRes.tokenId;
        }
      } catch (err) {
        console.warn('Sequence API fetch fallback:', err);
      }

      const newToken = generateToken(dbSeq, dbTokenId);
      const tokenPayload = {
        token_id: newToken.id,
        token_number: newToken.tokenNumber || 1,
        type: 'common',
        priority: 3,
        status: 'waiting',
        department_name: newToken.primaryDepartment,
        doctor_id: newToken.doctor_id,
        doctor_name: newToken.doctor_name,
        patient_name: newToken.patient.name,
        patient_phone: newToken.patient.phone || null,
        patient_email: newToken.patient.email || null,
        patient_age: parseInt(newToken.patient.age, 10) || null,
        patient_gender: newToken.patient.gender || 'not specified',
        scheduling_method: formData.schedulingMethod,
        scheduled_time: newToken.scheduledTime?.toISOString(),
        estimated_wait_minutes: formData.estimatedWait || 15,
        queue_position: formData.queuePosition || 1,
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
        currentView: 'token'
      }));
      navigate('/token');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const selectedDepartment = state.departments.find(d => d.name === formData.primaryDepartment);
  const availableDoctors = selectedDepartment?.doctors.filter(d => d.status === 'available') || [];
  const consultationDepartments = state.departments.filter(d => d.type === 'consultation');

  return (
    <div className="page" style={{ padding: '32px 24px 64px', maxWidth: 1440, margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>

      {/* ── 1. Top Header Card ─────────────────────────── */}
      <div className="card mb-4">
        <div className="card-header" style={{ padding: '16px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button
                onClick={handleBack}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center' }}
              >
                <ArrowLeft size={20} color="var(--slate)" />
              </button>
              <div>
                <div className="card-title" style={{ fontSize: 18 }}>{t('generalConsultation')}</div>
                <div className="card-description">{t('multiDeptTokenGen')}</div>
              </div>
            </div>
            <span className="badge badge-outline">
              {t('stepLbl')} {step === 'form' ? '1' : step === 'scheduling' ? '2' : '3'} {t('of3Lbl')}
            </span>
          </div>
        </div>
      </div>

      {/* ── 2. Patient Info Banner ─────────────────────── */}
      <div className="card mb-4" style={{ backgroundColor: '#eff6ff', borderColor: '#bfdbfe' }}>
        <div className="card-content" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <CheckCircle size={20} color="#2563eb" />
          <div>
            <div style={{ fontWeight: 600, color: '#1e40af', fontSize: 15 }}>{t('patientLbl')} {state.patientInfo.name}</div>
            <div style={{ fontSize: 13, color: '#1d4ed8' }}>{state.patientInfo.email} • {state.patientInfo.phone}</div>
          </div>
        </div>
      </div>

      {/* ── 3. Step: Form ──────────────────────────────── */}
      {step === 'form' && (
        <div className="card mb-4 animate-slide-up">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <User size={20} color="#0f172a" />
              <h2 className="card-title">{t('medicalInfo')}</h2>
            </div>
          </div>
          <div className="card-content" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="label">Name</label>
              <input
                className="input"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter patient name"
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="label">{t('ageLbl')}</label>
              <input
                className="input"
                type="number"
                value={formData.age}
                onChange={e => setFormData({ ...formData, age: parseInt(e.target.value) || '' })}
                placeholder={t('enterAge')}
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="label">{t('genderLbl')}</label>
              <div style={{ display: 'flex', gap: 20, marginTop: 8 }}>
                {['male', 'female', 'other'].map(option => {
                  const isSelected = formData.gender === option;
                  const RadioIcon = isSelected ? CircleDot : Circle;
                  return (
                    <div
                      key={option}
                      onClick={() => setFormData({ ...formData, gender: option })}
                      style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
                    >
                      <RadioIcon size={20} color={isSelected ? '#2563eb' : '#9ca3af'} />
                      <span style={{ fontSize: 15, color: '#475569', fontWeight: 500 }}>
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="label">{t('primaryDepartment')}</label>
              <select
                className="select"
                value={formData.primaryDepartment}
                onChange={e => setFormData({ ...formData, primaryDepartment: e.target.value, assignedDoctor: '' })}
              >
                <option value="">{t('selectPrimaryDept')}</option>
                {consultationDepartments.map(dept => (
                  <option key={dept.name} value={dept.name}>{dept.name}</option>
                ))}
              </select>
            </div>

            {selectedDepartment && (
              <div style={{ backgroundColor: '#ffffff', padding: 16, borderRadius: 16, border: '1px solid #e0f2fe' }}>
                <div style={{ fontWeight: 600, marginBottom: 8, color: '#0f172a' }}>{t('availableDoctors')}</div>

                <div
                  onClick={() => setFormData({ ...formData, assignedDoctor: '' })}
                  style={{
                    padding: 14, backgroundColor: '#ffffff', borderRadius: 12, border: `2px solid ${!formData.assignedDoctor ? '#0ea5e9' : '#e0f2fe'}`,
                    marginBottom: 10, display: 'flex', alignItems: 'center', cursor: 'pointer',
                    background: !formData.assignedDoctor ? '#e0f2fe' : '#ffffff'
                  }}
                >
                  <Users size={16} color="#4b5563" style={{ marginRight: 8 }} />
                  <span style={{ fontSize: 14, fontWeight: 500 }}>{t('anyAvailableDoc')}</span>
                </div>

                {availableDoctors.map(doc => {
                  const isDocSelected = formData.assignedDoctor === doc.id;
                  return (
                    <div
                      key={doc.id}
                      onClick={() => setFormData({ ...formData, assignedDoctor: doc.id })}
                      style={{
                        padding: 14, backgroundColor: '#ffffff', borderRadius: 12, border: `2px solid ${isDocSelected ? '#0ea5e9' : '#e0f2fe'}`,
                        marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer',
                        background: isDocSelected ? '#e0f2fe' : '#ffffff'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Activity size={16} color="#2563eb" />
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 14 }}>{doc.name}</div>
                          <div style={{ fontSize: 12, color: '#6b7280' }}>{doc.specialization}</div>
                        </div>
                      </div>
                      <span style={{ fontSize: 12, color: '#6b7280' }}>{doc.experience} {t('yExp')}</span>
                    </div>
                  );
                })}
              </div>
            )}

            <button
              className="btn btn-primary btn-full mt-2"
              onClick={handleFormSubmit}
            >
              {t('continueScheduling')}
            </button>
          </div>
        </div>
      )}

      {/* ── 4. Step: Scheduling Method ─────────────────── */}
      {step === 'scheduling' && (
        <div className="card mb-4 animate-slide-up">
          <div className="card-header">
            <h2 className="card-title">{t('schedulingMethod')}</h2>
          </div>
          <div className="card-content" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Auto scheduling */}
            <div
              onClick={() => {
                setFormData(prev => ({ ...prev, schedulingMethod: 'auto' }));
                setTimeout(handleTokenGeneration, 300);
              }}
              className="card"
              style={{ borderLeft: '6px solid #16a34a', cursor: 'pointer', padding: 20 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <Zap size={24} color="#16a34a" />
                <div>
                  <div style={{ fontWeight: 700, color: '#166534', fontSize: 16 }}>{t('autoScheduling')}</div>
                  <div style={{ fontSize: 13, color: '#6b7280' }}>{t('autoDesc')}</div>
                </div>
              </div>
            </div>

            {/* Manual scheduling */}
            <div
              onClick={() => {
                setFormData(prev => ({ ...prev, schedulingMethod: 'manual' }));
                setStep('timeSlot');
              }}
              className="card"
              style={{ borderLeft: '6px solid #2563eb', cursor: 'pointer', padding: 20 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <Clock size={24} color="#2563eb" />
                <div>
                  <div style={{ fontWeight: 700, color: '#1e40af', fontSize: 16 }}>{t('manualScheduling')}</div>
                  <div style={{ fontSize: 13, color: '#6b7280' }}>{t('manualDesc')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── 5. Step: Time Slot Selection ───────────────── */}
      {step === 'timeSlot' && (
        <div className="card mb-4 animate-slide-up">
          <div className="card-header">
            <h2 className="card-title">{t('timeSlotSelection')}</h2>
          </div>
          <div className="card-content" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {manualTimeSlots.map(slot => {
              const isSelected = formData.timeSlot === slot.time;
              return (
                <div
                  key={slot.time}
                  onClick={() => setFormData(prev => ({ ...prev, timeSlot: slot.time }))}
                  style={{
                    padding: 16, backgroundColor: isSelected ? '#f0fdfa' : '#ffffff',
                    borderRadius: 16, border: `2px solid ${isSelected ? '#0ea5e9' : '#e0f2fe'}`,
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer',
                    transition: 'all .18s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Calendar size={16} color="#6b7280" />
                    <span style={{ fontWeight: 600, fontSize: 14 }}>{slot.label}</span>
                  </div>
                  <span className="badge" style={{ backgroundColor: slot.color, color: '#ffffff', fontSize: 11 }}>
                    {slot.crowdLevel}
                  </span>
                </div>
              );
            })}

            <button
              className="btn btn-primary btn-full mt-4"
              onClick={handleTokenGeneration}
              disabled={!formData.timeSlot || loading}
            >
              {loading ? 'Booking...' : t('bookAppointment')}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
