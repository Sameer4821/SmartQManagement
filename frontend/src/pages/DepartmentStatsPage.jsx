import { useNavigate } from 'react-router-dom';
import {
  Building, MapPin, Phone, Calendar,
  Stethoscope, Users, UserCheck, Clock, ShieldCheck, Mail
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useTranslation } from '../hooks/useTranslation';


const getDepartmentColor = (type) => {
  switch (type) {
    case 'emergency': return '#ef4444';
    case 'consultation': return '#0284c7';
    case 'diagnostic': return '#10b981';
    case 'pharmacy': return '#f59e0b';
    default: return '#6366f1';
  }
};

export default function DepartmentStatsPage() {
  const navigate = useNavigate();
  const { state } = useAppContext();
  const { t } = useTranslation();
  const isDark = state.theme === 'dark';

  const handleBack = () => navigate('/dashboard');

  return (
    <div className="page" style={{ padding: '32px 24px 64px', maxWidth: 1600, margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>

      {/* ── Section Title ─────────────────────────────── */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--slate)', letterSpacing: -0.5, marginBottom: 4 }}>
          {t('dsTitle') || 'Hospital Capacity & Doctors'}
        </h1>
        <p style={{ color: 'var(--slate-500)', fontSize: 14, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
          {t('dsSubtitle') || 'Live department roster and availability'}
          <span className="badge badge-solid-green" style={{ padding: '4px 10px', fontSize: 11 }}>● Live Roster</span>
        </p>
      </div>

      {/* ── Hospital Overview Dashboard Banner ─────────── */}
      <div className="card mb-4" style={{ borderRadius: 16, overflow: 'hidden' }}>
        <div className="card-header" style={{ padding: '16px 24px 12px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Building size={20} color="var(--sky-600)" />
            <h2 className="card-title" style={{ color: 'var(--sky-600)', fontSize: 16 }}>
              {t('dsHospitalInfo') || 'Hospital Overview & Quick Directory'}
            </h2>
          </div>
        </div>

        <div className="card-content" style={{ padding: '20px 24px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 20
          }}>
            {/* Campus & Location */}
            <div style={{
              background: 'var(--slate-50)', padding: 16, borderRadius: 12, border: '1px solid var(--border)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <MapPin size={18} color="#0284c7" />
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--slate)' }}>Campus Location</span>
              </div>
              <div style={{ fontSize: 13, color: 'var(--slate-500)', lineHeight: '20px' }}>
                Smart Queue Hospital Management<br />
                Sector 12, Medical Innovation District
              </div>
            </div>

            {/* Contact Information */}
            <div style={{
              background: 'var(--slate-50)', padding: 16, borderRadius: 12, border: '1px solid var(--border)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <Phone size={18} color="#10b981" />
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--slate)' }}>Contact & Helplines</span>
              </div>
              <div style={{ fontSize: 13, color: 'var(--slate-500)', lineHeight: '20px' }}>
                Reception: <strong>+91 1800-123-4567</strong><br />
                <span style={{ color: '#ef4444', fontWeight: 700 }}>Emergency Trauma: 108 / 1800-999-911</span>
              </div>
            </div>

            {/* Operating Hours */}
            <div style={{
              background: 'var(--slate-50)', padding: 16, borderRadius: 12, border: '1px solid var(--border)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <Calendar size={18} color="#f59e0b" />
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--slate)' }}>Operating Schedule</span>
              </div>
              <div style={{ fontSize: 13, color: 'var(--slate-500)', lineHeight: '20px' }}>
                OPD: Mon - Sat (8:00 AM - 8:00 PM)<br />
                <strong style={{ color: '#10b981' }}>Critical Care & Emergency: 24/7</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Wide Responsive Department Grid ────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: 20
      }}>
        {state.departments.map(dept => {
          const color = getDepartmentColor(dept.type);
          return (
            <div key={dept.name} className="card" style={{ borderRadius: 16, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                {/* Department Header */}
                <div className="card-header" style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Stethoscope size={20} color={color} />
                        <span style={{ fontSize: 17, fontWeight: 800, color: 'var(--slate)' }}>{dept.name}</span>
                      </div>
                      <span className="badge badge-outline" style={{ borderColor: color, color, marginTop: 6, textTransform: 'capitalize' }}>
                        {dept.type}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--slate-500)', fontSize: 12, fontWeight: 600 }}>
                      <Users size={16} color={color} />
                      <span>{dept.doctors.length} {dept.doctors.length === 1 ? 'Doctor' : 'Doctors'}</span>
                    </div>
                  </div>
                </div>

                <div className="card-content" style={{ padding: '16px 20px' }}>
                  {/* Services */}
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase', marginBottom: 8 }}>
                      Services Offered:
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {dept.services.map((service, index) => (
                        <span key={index} style={{
                          backgroundColor: 'var(--slate-50)',
                          border: '1px solid var(--border)',
                          padding: '4px 10px', borderRadius: 10,
                          fontSize: 12, fontWeight: 600, color: 'var(--slate)'
                        }}>
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Available Doctors */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10, fontSize: 12, fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase' }}>
                      <UserCheck size={16} color="var(--sky-600)" />
                      <span>Medical Staff ({dept.doctors.length})</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {dept.doctors.map(doctor => (
                        <div
                          key={doctor.id}
                          style={{
                            backgroundColor: 'var(--slate-50)',
                            padding: '12px 14px', borderRadius: 12,
                            border: '1px solid var(--border)',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{
                              width: 38, height: 38, borderRadius: 10,
                              backgroundColor: `${color}20`,
                              color: color,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              flexShrink: 0
                            }}>
                              <UserCheck size={19} />
                            </div>
                            <div>
                              <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--slate)' }}>{doctor.name}</div>
                              <div style={{ fontSize: 12, color: 'var(--slate-500)' }}>{doctor.specialization}</div>
                              <div style={{ fontSize: 11, color: 'var(--slate-400)' }}>{doctor.experience} yrs exp</div>
                            </div>
                          </div>
                          <span className={`badge ${doctor.status === 'available' ? 'badge-solid-green' : doctor.status === 'busy' ? 'badge-secondary' : 'badge-red'}`} style={{ fontSize: 11, flexShrink: 0 }}>
                            {doctor.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Department Footer Info */}
              <div style={{
                padding: '12px 20px',
                background: 'var(--slate-50)',
                borderTop: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                fontSize: 12, color: 'var(--slate-500)',
                borderRadius: '0 0 16px 16px'
              }}>
                <span>Avg Wait: <strong style={{ color: 'var(--slate)' }}>~{dept.averageWaitTime || 15}m</strong></span>
                <span style={{ color: 'var(--sky-600)', fontWeight: 700 }}>Floor: {dept.floor || 'Ground'}</span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
