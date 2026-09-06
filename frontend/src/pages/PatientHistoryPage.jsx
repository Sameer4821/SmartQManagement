import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Clock, Users, Activity, QrCode,
  Radio, CheckCircle2, Stethoscope, AlertTriangle, ArrowRight, Shield, RefreshCw, UserCheck
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';


export default function PatientHistoryPage() {
  const navigate = useNavigate();
  const { state } = useAppContext();
  const isDark = state.theme === 'dark';

  const [selectedDept, setSelectedDept] = useState('all');

  const patientEmail = state.patientInfo?.email?.trim()?.toLowerCase();
  const patientPhone = state.patientInfo?.phone?.trim();

  // Find this patient's active tokens
  const myActiveTokens = (state.tokens || []).filter(tok => {
    const isMyToken = (patientEmail && tok.patient?.email?.trim()?.toLowerCase() === patientEmail) ||
                      (patientPhone && tok.patient?.phone?.trim() === patientPhone);
    const isActive = tok.status === 'active' || tok.status === 'waiting' || tok.status === 'called' || tok.status === 'in_consultation';
    return isMyToken && isActive;
  });

  // Get all active tokens in the hospital queue
  const allActiveTokens = (state.tokens || []).filter(tok =>
    tok.status === 'active' || tok.status === 'waiting' || tok.status === 'called' || tok.status === 'in_consultation'
  );

  // Departments list
  const departments = state.departments || [];

  const getDeptQueueInfo = (deptName) => {
    const deptTokens = allActiveTokens.filter(t => (t.primaryDepartment || t.department_name) === deptName);
    const inConsultation = deptTokens.find(t => t.status === 'called' || t.status === 'in_consultation') || deptTokens[0] || null;
    const waitingTokens = deptTokens.filter(t => t.id !== inConsultation?.id);
    return {
      totalWaiting: deptTokens.length,
      currentServingToken: inConsultation,
      upcomingTokens: waitingTokens
    };
  };

  const formatToken = (id) => {
    if (!id) return '---';
    const parts = String(id).split('-');
    if (parts.length >= 3) return `${parts[0]}-${parts[2]}`;
    return String(id);
  };

  return (
    <div className="page" style={{ padding: '32px 24px 64px', maxWidth: 1600, margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>



      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--slate)', letterSpacing: -0.5, marginBottom: 4 }}>
          Live Hospital Queue Board
        </h1>
        <p style={{ color: 'var(--slate-500)', fontSize: 14, margin: 0 }}>
          Real-time square department monitors showing active tokens currently in consultation & next in line
        </p>
      </div>

      {/* ── 1. Patient's Personal Active Tokens ─────────── */}
      {myActiveTokens.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <div style={{
            fontSize: 13, fontWeight: 800, color: 'var(--sky-600)',
            textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12,
            display: 'flex', alignItems: 'center', gap: 6
          }}>
            <Radio size={16} /> Your Active Queue Tokens ({myActiveTokens.length})
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 16
          }}>
            {myActiveTokens.map((myTok, i) => {
              const deptName = myTok.primaryDepartment || myTok.department_name;
              const deptInfo = getDeptQueueInfo(deptName);
              const isCurrentlyServing = deptInfo.currentServingToken?.id === myTok.id;
              const myIndexInDept = allActiveTokens
                .filter(t => (t.primaryDepartment || t.department_name) === deptName)
                .findIndex(t => t.id === myTok.id);
              const patientsAhead = Math.max(0, myIndexInDept);

              return (
                <div
                  key={myTok.id || i}
                  className="card animate-slide-up"
                  style={{
                    border: isCurrentlyServing ? '2px solid #10b981' : '2px solid var(--sky-600)',
                    background: isCurrentlyServing ? (isDark ? '#042f2e' : '#f0fdf4') : (isDark ? '#082f49' : '#f0f9ff'),
                    borderRadius: 20,
                    padding: 20,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 8px 20px -5px rgba(2, 132, 199, 0.15)'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                      <span style={{ fontSize: 14, fontWeight: 800, color: isCurrentlyServing ? (isDark ? '#5eead4' : '#166534') : (isDark ? '#7dd3fc' : '#0369a1') }}>
                        {deptName}
                      </span>
                      {isCurrentlyServing ? (
                        <span className="badge badge-solid-green" style={{ fontSize: 10, padding: '3px 8px', animation: 'pulse 1.5s infinite' }}>
                          NOW CALLING
                        </span>
                      ) : (
                        <span className="badge badge-blue" style={{ fontSize: 10, padding: '3px 8px' }}>
                          {patientsAhead} Ahead
                        </span>
                      )}
                    </div>

                    <div style={{
                      textAlign: 'center',
                      background: 'var(--card-bg)',
                      borderRadius: 14,
                      padding: '16px 12px',
                      border: '1px solid var(--border)',
                      marginBottom: 14
                    }}>
                      <div style={{ fontSize: 11, color: 'var(--slate-500)', fontWeight: 700, textTransform: 'uppercase' }}>Your Token ID</div>
                      <div style={{ fontSize: 26, fontWeight: 900, color: isCurrentlyServing ? '#16a34a' : 'var(--sky-600)', letterSpacing: 0.5, margin: '4px 0' }}>
                        {formatToken(myTok.id)}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--slate-500)', fontWeight: 500 }}>
                        {myTok.doctor_name ? `Assigned: ${myTok.doctor_name}` : `Full ID: ${myTok.id}`}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: 12 }}>
                    <div style={{ fontSize: 12, color: 'var(--slate-500)' }}>
                      {isCurrentlyServing ? '🟢 Enter Room Now' : `⏱️ ~${(patientsAhead + 1) * 10}m Wait`}
                    </div>
                    <button
                      onClick={() => navigate('/token')}
                      style={{
                        background: 'none', border: 'none', color: 'var(--sky-600)',
                        fontWeight: 700, fontSize: 12, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: 4
                      }}
                    >
                      View QR <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── 2. All Departments (Square Boxed Side by Side Grid) ── */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--slate)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Department Live Queues
          </div>
          <span style={{ fontSize: 12, color: 'var(--slate-500)', fontWeight: 700 }}>
            {allActiveTokens.length} Active Patients Waiting
          </span>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 12, marginBottom: 16 }}>
          <button
            onClick={() => setSelectedDept('all')}
            style={{
              padding: '7px 16px', borderRadius: 20,
              background: selectedDept === 'all' ? '#0284c7' : 'var(--card-bg)',
              border: selectedDept === 'all' ? '1px solid #0284c7' : '1px solid var(--border)',
              color: selectedDept === 'all' ? '#ffffff' : 'var(--slate)',
              fontWeight: 700, fontSize: 12, cursor: 'pointer', whiteSpace: 'nowrap',
              boxShadow: selectedDept === 'all' ? '0 2px 8px rgba(2, 132, 199, 0.2)' : 'none'
            }}
          >
            All Departments ({departments.length})
          </button>
          {departments.map(d => {
            const count = allActiveTokens.filter(t => (t.primaryDepartment || t.department_name) === d.name).length;
            const isSelected = selectedDept === d.name;
            return (
              <button
                key={d.name}
                onClick={() => setSelectedDept(d.name)}
                style={{
                  padding: '7px 16px', borderRadius: 20,
                  background: isSelected ? '#0284c7' : 'var(--card-bg)',
                  border: isSelected ? '1px solid #0284c7' : '1px solid var(--border)',
                  color: isSelected ? '#ffffff' : 'var(--slate)',
                  fontWeight: 700, fontSize: 12, cursor: 'pointer', whiteSpace: 'nowrap',
                  boxShadow: isSelected ? '0 2px 8px rgba(2, 132, 199, 0.2)' : 'none'
                }}
              >
                {d.name} ({count})
              </button>
            );
          })}
        </div>

        {/* ── SQUARE BOXED SIDE BY SIDE GRID ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))',
          gap: 18
        }}>
          {departments
            .filter(d => selectedDept === 'all' || d.name === selectedDept)
            .map((dept, index) => {
              const info = getDeptQueueInfo(dept.name);
              const isServing = Boolean(info.currentServingToken);
              const onDutyDoctor = dept.doctors?.[0]?.name || 'Dr. On Duty';

              return (
                <div
                  key={dept.name || index}
                  className="card animate-slide-up"
                  style={{
                    borderRadius: 20,
                    border: '1px solid var(--border)',
                    background: 'var(--card-bg)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.04)',
                    overflow: 'hidden',
                    transition: 'all 0.2s ease'
                  }}
                >

                  {/* Top Square Box Header */}
                  <div style={{
                    padding: '16px 18px',
                    background: isDark ? '#000000' : 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)',
                    borderBottom: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: 10,
                        background: isDark ? '#082f49' : '#eff6ff', color: isDark ? '#38bdf8' : '#0284c7',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                        <Stethoscope size={20} />
                      </div>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--slate)' }}>{dept.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--slate-500)' }}>Doctor: {onDutyDoctor}</div>
                      </div>
                    </div>

                    <span className={`badge ${info.totalWaiting > 0 ? 'badge-blue' : 'badge-secondary'}`} style={{ fontSize: 11 }}>
                      {info.totalWaiting} in Queue
                    </span>
                  </div>

                  {/* Center Square Hero: NOW SERVING */}
                  <div style={{ padding: '16px 18px 14px' }}>
                    <div style={{
                      borderRadius: 14,
                      padding: '16px 14px',
                      background: isServing ? (isDark ? '#052e16' : '#f0fdf4') : 'var(--slate-50)',
                      border: isServing ? (isDark ? '1.5px solid #16a34a' : '1.5px solid #86efac') : '1px dashed var(--border)',
                      textAlign: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minHeight: 100
                    }}>
                      <div style={{
                        fontSize: 11, fontWeight: 800,
                        color: isServing ? (isDark ? '#86efac' : '#16a34a') : 'var(--slate-500)',
                        textTransform: 'uppercase', letterSpacing: 0.5,
                        display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4
                      }}>
                        {isServing && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#16a34a', display: 'inline-block', animation: 'pulse 1.5s infinite' }} />}
                        {isServing ? 'Now Serving in Room' : 'Counter Idle'}
                      </div>

                      {isServing ? (
                        <>
                          <div style={{ fontSize: 24, fontWeight: 900, color: isDark ? '#86efac' : '#166534', letterSpacing: 0.5 }}>
                            {formatToken(info.currentServingToken.id)}
                          </div>
                          <div style={{ fontSize: 12, color: 'var(--slate)', fontWeight: 600, marginTop: 2 }}>
                            Patient: {info.currentServingToken.patient?.name || 'Walk-in'}
                          </div>
                        </>
                      ) : (
                        <div style={{ fontSize: 13, color: 'var(--slate-500)', fontStyle: 'italic' }}>
                          No patients in consultation
                        </div>
                      )}
                    </div>

                    {/* Next In Line Box */}
                    <div style={{ marginTop: 14 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--slate-500)', marginBottom: 8, textTransform: 'uppercase' }}>
                        Next In Line:
                      </div>

                      {info.upcomingTokens.length > 0 ? (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                          {info.upcomingTokens.slice(0, 4).map((upTok, upIdx) => (
                            <div
                              key={upTok.id || upIdx}
                              style={{
                                display: 'flex', alignItems: 'center', gap: 4,
                                padding: '4px 8px', borderRadius: 8,
                                background: 'var(--slate-50)', border: '1px solid var(--border)',
                                fontSize: 11, fontWeight: 600, color: 'var(--slate)'
                              }}
                            >
                              <span style={{ color: 'var(--slate-500)' }}>#{upIdx + 2}</span>
                              <span style={{ color: 'var(--sky-600)', fontWeight: 700 }}>{formatToken(upTok.id)}</span>
                            </div>
                          ))}
                          {info.upcomingTokens.length > 4 && (
                            <span style={{ fontSize: 11, color: 'var(--slate-500)', alignSelf: 'center', fontWeight: 600 }}>
                              +{info.upcomingTokens.length - 4} more
                            </span>
                          )}
                        </div>
                      ) : (
                        <div style={{ fontSize: 12, color: 'var(--slate-500)', fontStyle: 'italic' }}>
                          No upcoming tokens waiting
                        </div>
                      )}
                    </div>

                  </div>

                  {/* Card Bottom Footer */}
                  <div style={{
                    padding: '10px 18px',
                    background: 'var(--slate-50)',
                    borderTop: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: 12,
                    color: 'var(--slate-500)'
                  }}>
                    <span>Est. Wait: <strong>~{dept.averageWaitTime || 15}m</strong></span>
                    <span style={{ color: 'var(--sky-600)', fontWeight: 600 }}>Room {dept.room || '101'}</span>
                  </div>

                </div>
              );
            })}
        </div>
      </div>

    </div>
  );
}
