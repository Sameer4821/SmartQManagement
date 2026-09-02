import { useState } from 'react';
import { X, User, Phone, Mail, Calendar, Heart, ShieldCheck, Check, Accessibility } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function EditProfileModal({ isOpen, onClose }) {
  const { state, setState } = useAppContext();
  const { updateUserMetadata } = useAuth();
  const current = state.patientInfo || {};

  const [form, setForm] = useState({
    name: current.name || '',
    phone: current.phone || '',
    email: current.email || '',
    age: current.age || '',
    gender: current.gender || 'not specified',
    emergencyContact: current.emergencyContact || '',
    emergencyPhone: current.emergencyPhone || '',
    assistanceNeeded: current.assistanceNeeded || 'none',
  });

  const [saving, setSaving] = useState(false);

  const set = (key) => (e) => setForm(prev => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error('Patient name is required');
      return;
    }

    setSaving(true);
    try {
      const updatedInfo = {
        ...current,
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        age: form.age ? Number(form.age) : current.age,
        gender: form.gender,
        emergencyContact: form.emergencyContact.trim(),
        emergencyPhone: form.emergencyPhone.trim(),
        assistanceNeeded: form.assistanceNeeded,
      };

      setState(prev => ({ ...prev, patientInfo: updatedInfo }));
      await updateUserMetadata({
        name: updatedInfo.name,
        phone: updatedInfo.phone,
        age: updatedInfo.age,
        gender: updatedInfo.gender,
        emergencyContact: updatedInfo.emergencyContact,
        emergencyPhone: updatedInfo.emergencyPhone,
        assistanceNeeded: updatedInfo.assistanceNeeded
      });

      toast.success('Patient details updated successfully!');
      onClose();
    } catch {
      toast.error('Failed to update details. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      backgroundColor: 'rgba(15, 23, 42, 0.6)',
      backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16
    }}>
      <div className="card animate-slide-up" style={{
        width: '100%', maxWidth: 500, maxHeight: '90vh', overflowY: 'auto',
        borderRadius: 24, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        border: '1px solid #e2e8f0', background: 'var(--white)'
      }}>

        {/* Modal Header */}
        <div style={{
          padding: '20px 24px', borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              background: '#eff6ff', color: '#0284c7',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <User size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 18, color: 'var(--slate)' }}>Edit Patient Profile</div>
              <div style={{ fontSize: 12, color: 'var(--slate-500)' }}>Update demographics & assistance preferences</div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'var(--slate-50)', border: '1px solid var(--border)',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--slate-500)'
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Name */}
          <div>
            <label className="label" style={{ fontSize: 13, fontWeight: 700, marginBottom: 6 }}>
              Full Name <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <User size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#0284c7' }} />
              <input
                className="input"
                style={{ paddingLeft: 40, borderRadius: 12, height: 44 }}
                value={form.name}
                onChange={set('name')}
                placeholder="Full name"
                required
              />
            </div>
          </div>

          {/* Phone & Email */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label className="label" style={{ fontSize: 13, fontWeight: 700, marginBottom: 6 }}>Phone</label>
              <div style={{ position: 'relative' }}>
                <Phone size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#0284c7' }} />
                <input
                  className="input"
                  style={{ paddingLeft: 36, borderRadius: 12, height: 44 }}
                  type="tel"
                  value={form.phone}
                  onChange={set('phone')}
                  placeholder="+91 XXXXX"
                />
              </div>
            </div>

            <div>
              <label className="label" style={{ fontSize: 13, fontWeight: 700, marginBottom: 6 }}>Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#0284c7' }} />
                <input
                  className="input"
                  style={{ paddingLeft: 36, borderRadius: 12, height: 44 }}
                  type="email"
                  value={form.email}
                  onChange={set('email')}
                  placeholder="name@email.com"
                />
              </div>
            </div>
          </div>

          {/* Age & Gender */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label className="label" style={{ fontSize: 13, fontWeight: 700, marginBottom: 6 }}>Age</label>
              <input
                className="input"
                type="number"
                min="0"
                max="120"
                style={{ borderRadius: 12, height: 44 }}
                value={form.age}
                onChange={set('age')}
                placeholder="e.g. 32"
              />
            </div>

            <div>
              <label className="label" style={{ fontSize: 13, fontWeight: 700, marginBottom: 6 }}>Gender</label>
              <select
                className="input"
                style={{ borderRadius: 12, height: 44 }}
                value={form.gender}
                onChange={set('gender')}
              >
                <option value="not specified">Not specified</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Accessibility Assistance */}
          <div>
            <label className="label" style={{ fontSize: 13, fontWeight: 700, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Accessibility size={15} color="#0284c7" /> Accessibility & Priority Assistance
            </label>
            <select
              className="input"
              style={{ borderRadius: 12, height: 44 }}
              value={form.assistanceNeeded}
              onChange={set('assistanceNeeded')}
            >
              <option value="none">Standard Lane (No assistance needed)</option>
              <option value="wheelchair">Wheelchair Assistance Required</option>
              <option value="hearing_speech">Hearing / Sign Language Support</option>
              <option value="visual">Visual Guidance & Braille Support</option>
              <option value="senior_mobility">Senior Citizen Mobility Escort</option>
            </select>
          </div>

          {/* Emergency Contact */}
          <div style={{ background: 'var(--slate-50)', padding: 14, borderRadius: 14, border: '1px solid var(--border)' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--slate-700)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Heart size={14} color="#ef4444" /> Emergency Contact (Optional)
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <input
                className="input"
                style={{ borderRadius: 10, height: 40, fontSize: 13 }}
                placeholder="Caregiver Name"
                value={form.emergencyContact}
                onChange={set('emergencyContact')}
              />
              <input
                className="input"
                style={{ borderRadius: 10, height: 40, fontSize: 13 }}
                placeholder="Caregiver Phone"
                value={form.emergencyPhone}
                onChange={set('emergencyPhone')}
              />
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline"
              style={{ flex: 1, height: 46, borderRadius: 12, fontWeight: 700 }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
              style={{ flex: 1, height: 46, borderRadius: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
            >
              <Check size={16} />
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
