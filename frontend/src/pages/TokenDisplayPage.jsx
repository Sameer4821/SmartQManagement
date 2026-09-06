import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Info
} from 'lucide-react';
import QRCode from 'qrcode';
import html2canvas from 'html2canvas';
import { useAppContext } from '../context/AppContext';
import { useTranslation } from '../hooks/useTranslation';
import Flaticon from '../components/Flaticon';

export default function TokenDisplayPage() {
  const navigate = useNavigate();
  const { state } = useAppContext();
  const { t } = useTranslation();
  const isDark = state.theme === 'dark';
  const token = state.currentToken || state.tokens[state.tokens.length - 1];

  const tokenRef = useRef(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState('');

  const getDoctorName = () => {
    if (token?.doctor_name) return token.doctor_name;
    if (token?.doctorName) return token.doctorName;
    if (token?.assignedDoctor) return token.assignedDoctor;
    const dept = state.departments?.find(d => d.name === (token.primaryDepartment || token.department_name));
    if (dept && dept.doctors && dept.doctors.length > 0) {
      const doc = dept.doctors.find(d => String(d.id) === String(token?.doctor_id));
      if (doc) return doc.name;
      return dept.doctors[0].name;
    }
    return 'Dr. On-Duty Specialist';
  };

  useEffect(() => {
    if (token) {
      const updateTimeLeft = () => {
        const now = Date.now();
        const expiry = new Date(token.validUntil || Date.now() + 24 * 60 * 60 * 1000).getTime();
        setTimeLeft(Math.max(0, expiry - now));
      };
      updateTimeLeft();
      const interval = setInterval(updateTimeLeft, 1000);
      return () => clearInterval(interval);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      QRCode.toDataURL(token.qrCode || token.id, {
        width: 180,
        margin: 1,
        color: { dark: '#000000', light: '#ffffff' }
      })
        .then(url => setQrDataUrl(url))
        .catch(err => console.error(err));
    }
  }, [token]);

  const handleShare = async () => {
    if (!token) return;
    const shareText = `Hospital Token ID: ${token.id}\nPatient: ${token.patient?.name}\nDept: ${token.primaryDepartment || token.department_name}\nDoctor: ${getDoctorName()}`;
    if (navigator.share) {
      try { await navigator.share({ title: 'Hospital Token', text: shareText }); } catch (e) {}
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Token details copied to clipboard!');
    }
  };

  const handleDownload = async () => {
    if (!tokenRef.current) return;
    try {
      setIsDownloading(true);
      setTimeout(async () => {
        try {
          const canvas = await html2canvas(tokenRef.current, { scale: 2, backgroundColor: '#ffffff' });
          const uri = canvas.toDataURL('image/png');
          const link = document.createElement('a');
          link.href = uri;
          link.download = `Medical_Token_${token.id}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } catch (err) {
          console.error(err);
        } finally {
          setIsDownloading(false);
        }
      }, 100);
    } catch (err) {
      setIsDownloading(false);
    }
  };

  if (!token) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 64px)', padding: 24 }}>
        <p style={{ color: isDark ? '#a1a1aa' : '#64748b', fontSize: 15 }}>{t('noTokenFound') || 'No active token found.'}</p>
        <button className="btn btn-primary" style={{ marginTop: 14 }} onClick={() => navigate('/dashboard')}>
          {t('backToDashboard') || 'Back to Dashboard'}
        </button>
      </div>
    );
  }

  const deptTokens = (state.tokens || []).filter(t =>
    (t.primaryDepartment || t.department_name) === (token.primaryDepartment || token.department_name) &&
    (t.status === 'active' || t.status === 'waiting' || t.status === 'called' || t.status === 'in_consultation')
  );

  const currentlyServing = deptTokens.find(t => t.status === 'called' || t.status === 'in_consultation') || deptTokens[0] || null;
  const myIndex = deptTokens.findIndex(t => t.id === token.id);
  const patientsAhead = Math.max(0, myIndex);
  const isCurrentlyServingMe = currentlyServing?.id === token.id;

  const validityProgress = timeLeft > 0 ? (timeLeft / (24 * 60 * 60 * 1000)) * 100 : 0;
  const hoursLeft = Math.floor(timeLeft / 3600000);
  const minsLeft = Math.floor((timeLeft % 3600000) / 60000);

  const formatToken = (id) => {
    if (!id) return '---';
    const parts = String(id).split('-');
    if (parts.length >= 3) return `${parts[0]}-${parts[2]}`;
    return String(id);
  };

  return (
    <div style={{
      background: isDark ? '#09090b' : '#f8fafc',
      minHeight: 'calc(100vh - 64px)',
      padding: '24px 20px 48px',
      maxWidth: 1280,
      margin: '0 auto',
      width: '100%',
      boxSizing: 'border-box'
    }}>

      {/* ── Top Header ─────────────────────────────────── */}
      <div className="card mb-4 animate-slide-up" style={{
        borderRadius: 16,
        padding: '14px 20px',
        background: isDark ? '#121215' : '#ffffff',
        border: isDark ? '1px solid #27272a' : '1px solid #e2e8f0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={() => navigate('/dashboard')}
              style={{
                background: isDark ? '#18181b' : '#f1f5f9',
                border: isDark ? '1px solid #27272a' : '1px solid #e2e8f0',
                color: '#0284c7',
                width: 36, height: 36, borderRadius: 8,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <ArrowLeft size={16} />
            </button>
            <div>
              <div style={{ fontSize: 17, fontWeight: 800, color: isDark ? '#ffffff' : '#0f172a' }}>
                Active Queue Token & Digital Pass
              </div>
              <div style={{ fontSize: 12, color: isDark ? '#a1a1aa' : '#64748b', marginTop: 1 }}>
                {token.primaryDepartment || token.department_name} (Token #{formatToken(token.id)})
              </div>
            </div>
          </div>

          <span className="badge badge-green" style={{ fontSize: 11 }}>
            Active Token
          </span>
        </div>
      </div>

      {/* ── Responsive 2-Column Layout ─────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: 20,
        alignItems: 'start'
      }}>

        {/* ── Left Column: Live Queue Status & Countdown ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Live Queue Hero Card */}
          <div className="card animate-slide-up" style={{
            background: isCurrentlyServingMe
              ? (isDark ? '#042f2e' : '#f0fdf4')
              : 'linear-gradient(135deg, #0284c7 0%, #1e40af 100%)',
            color: isCurrentlyServingMe ? (isDark ? '#5eead4' : '#166534') : '#ffffff',
            borderRadius: 16,
            border: isCurrentlyServingMe ? '2px solid #10b981' : (isDark ? '1px solid #27272a' : 'none'),
            boxShadow: '0 8px 24px rgba(2, 132, 199, 0.2)',
            overflow: 'hidden'
          }}>
            <div style={{ padding: '22px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: isCurrentlyServingMe ? '#16a34a' : '#38bdf8',
                    display: 'inline-block'
                  }} />
                  <span style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5, opacity: 0.9 }}>
                    {isCurrentlyServingMe ? 'CURRENTLY IN CONSULTATION' : 'LIVE QUEUE STATUS'}
                  </span>
                </div>
                <span style={{
                  fontSize: 11, fontWeight: 700,
                  background: isCurrentlyServingMe ? (isDark ? '#115e59' : '#dcfce7') : 'rgba(255, 255, 255, 0.2)',
                  color: isCurrentlyServingMe ? (isDark ? '#5eead4' : '#15803d') : '#ffffff',
                  padding: '3px 10px', borderRadius: 12
                }}>
                  {token.primaryDepartment || token.department_name}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '10px 0' }}>
                <div>
                  <div style={{ fontSize: 12, opacity: 0.85 }}>Now Serving in Room:</div>
                  <div style={{ fontSize: 26, fontWeight: 900, letterSpacing: -0.4, marginTop: 2 }}>
                    {currentlyServing ? formatToken(currentlyServing.id) : 'Waiting'}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 12, opacity: 0.85 }}>Your Token / Position:</div>
                  <div style={{ fontSize: 26, fontWeight: 900, letterSpacing: -0.4, marginTop: 2 }}>
                    {formatToken(token.id)} <span style={{ fontSize: 14, fontWeight: 700 }}>({isCurrentlyServingMe ? 'Serving' : `#${patientsAhead + 1}`})</span>
                  </div>
                </div>
              </div>

              <div style={{
                marginTop: 14, paddingTop: 12,
                borderTop: isCurrentlyServingMe ? (isDark ? '1px solid #115e59' : '1px solid #bbf7d0') : '1px solid rgba(255, 255, 255, 0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13
              }}>
                <div>
                  {isCurrentlyServingMe
                    ? 'Your token is called. Please enter the doctor consultation room.'
                    : `${patientsAhead} patient${patientsAhead !== 1 ? 's' : ''} ahead of you (~${(patientsAhead + 1) * 10} mins estimated wait)`}
                </div>
              </div>
            </div>
          </div>

          {/* Validity countdown bar */}
          <div className="card" style={{
            borderRadius: 16,
            background: isDark ? '#121215' : '#ffffff',
            border: isDark ? '1px solid #27272a' : '1px solid #e2e8f0',
            padding: '14px 18px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontWeight: 700, color: isDark ? '#ffffff' : '#0f172a', fontSize: 12 }}>Token Validity Window</span>
              <span style={{ color: isDark ? '#a1a1aa' : '#64748b', fontSize: 12 }}>
                {hoursLeft}h {minsLeft}m remaining today
              </span>
            </div>
            <div className="progress-track" style={{ height: 6, borderRadius: 3, background: isDark ? '#27272a' : '#e2e8f0' }}>
              <div className="progress-fill" style={{ width: `${validityProgress}%`, background: '#0284c7', height: '100%', borderRadius: 3 }} />
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <button
              onClick={handleShare}
              className="btn btn-outline"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, height: 42, borderRadius: 10, fontWeight: 700, fontSize: 13 }}
            >
              <Flaticon name="fi-rr-share" size={14} />
              <span>Share Pass</span>
            </button>

            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, height: 42, borderRadius: 10, fontWeight: 700, fontSize: 13 }}
            >
              <Flaticon name="fi-rr-download" size={14} color="#ffffff" />
              <span>{isDownloading ? 'Preparing...' : 'Download Pass'}</span>
            </button>
          </div>
        </div>

        {/* ── Right Column: Printable / Scan Token Card ──── */}
        <div className="card animate-slide-up" style={{
          borderRadius: 16,
          overflow: 'hidden',
          background: isDark ? '#121215' : '#ffffff',
          border: isDark ? '1px solid #27272a' : '1px solid #e2e8f0'
        }}>
          <div style={{ padding: 18 }}>
            <div
              ref={tokenRef}
              style={{
                display: 'flex', flexDirection: 'column', gap: 14,
                backgroundColor: isDownloading ? '#ffffff' : 'transparent',
                color: isDownloading ? '#0f172a' : (isDark ? '#ffffff' : '#0f172a'),
                padding: isDownloading ? 18 : 0,
                borderRadius: isDownloading ? 14 : 0,
                border: isDownloading ? '1px solid #e2e8f0' : 'none'
              }}
            >
              {isDownloading && (
                <div style={{ textAlign: 'center', paddingBottom: 14, borderBottom: '1px solid #f1f5f9' }}>
                  <Flaticon name="fi-rr-hospital" size={28} color="#0284c7" style={{ margin: '0 auto 6px' }} />
                  <div style={{ fontSize: 18, fontWeight: 800, color: '#0f172a' }}>Smart Queue Hospital</div>
                  <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>Official Patient Queue Token</div>
                </div>
              )}

              {/* Details Boxes */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10 }}>
                {/* Patient Details Box */}
                <div style={{
                  padding: 12, borderRadius: 10,
                  background: isDownloading ? '#f8fafc' : (isDark ? '#18181b' : '#f8fafc'),
                  border: isDownloading ? '1px solid #e2e8f0' : (isDark ? '1px solid #27272a' : '1px solid #e2e8f0'),
                }}>
                  <div style={{
                    fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5,
                    color: '#0284c7', marginBottom: 6
                  }}>
                    Patient Details
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div style={{ fontSize: 12, display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: isDark ? '#a1a1aa' : '#64748b' }}>Name:</span>
                      <strong style={{ color: isDark ? '#ffffff' : '#0f172a' }}>{token.patient?.name || 'Walk-in Patient'}</strong>
                    </div>
                    <div style={{ fontSize: 12, display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: isDark ? '#a1a1aa' : '#64748b' }}>Phone:</span>
                      <span style={{ color: isDark ? '#ffffff' : '#0f172a' }}>{token.patient?.phone || 'N/A'}</span>
                    </div>
                    <div style={{ fontSize: 12, display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: isDark ? '#a1a1aa' : '#64748b' }}>Age / Sex:</span>
                      <span style={{ color: isDark ? '#ffffff' : '#0f172a' }}>
                        {token.patient?.age ? `${token.patient.age} yrs` : 'N/A'} / {token.patient?.gender || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Service Details Box */}
                <div style={{
                  padding: 12, borderRadius: 10,
                  background: isDownloading ? '#f8fafc' : (isDark ? '#18181b' : '#f8fafc'),
                  border: isDownloading ? '1px solid #e2e8f0' : (isDark ? '1px solid #27272a' : '1px solid #e2e8f0'),
                }}>
                  <div style={{
                    fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5,
                    color: '#0284c7', marginBottom: 6
                  }}>
                    Doctor & Service
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div style={{ fontSize: 12, display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: isDark ? '#a1a1aa' : '#64748b' }}>Token ID:</span>
                      <strong style={{ color: '#0284c7' }}>{token.id}</strong>
                    </div>
                    <div style={{ fontSize: 12, display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: isDark ? '#a1a1aa' : '#64748b' }}>Dept:</span>
                      <strong style={{ color: isDark ? '#ffffff' : '#0f172a' }}>{token.primaryDepartment || token.department_name}</strong>
                    </div>
                    <div style={{ fontSize: 12, display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: isDark ? '#a1a1aa' : '#64748b' }}>Doctor:</span>
                      <strong style={{ color: '#0284c7', fontWeight: 800 }}>{getDoctorName()}</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* QR Verification Box */}
              <div style={{
                padding: 14, borderRadius: 12, textAlign: 'center',
                background: isDownloading ? '#f8fafc' : (isDark ? '#18181b' : '#f8fafc'),
                border: isDownloading ? '1px solid #e2e8f0' : (isDark ? '1px solid #27272a' : '1px solid #e2e8f0'),
              }}>
                <div style={{
                  fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5,
                  color: '#0284c7', marginBottom: 6
                }}>
                  QR Verification Code
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '6px 0' }}>
                  {qrDataUrl ? (
                    <div style={{ padding: 6, background: '#ffffff', borderRadius: 10, border: '1px solid #cbd5e1' }}>
                      <img src={qrDataUrl} alt="Token QR Code" style={{ width: 130, height: 130, display: 'block' }} />
                    </div>
                  ) : (
                    <div style={{ width: 130, height: 130, background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading QR</div>
                  )}
                  <div style={{ marginTop: 6, fontWeight: 800, color: isDark ? '#ffffff' : '#0f172a', fontSize: 16 }}>{formatToken(token.id)}</div>
                </div>

                <div style={{
                  backgroundColor: isDark ? '#082f49' : '#f0f9ff',
                  padding: '8px 12px', borderRadius: 8,
                  display: 'flex', alignItems: 'center', gap: 6,
                  border: isDark ? '1px solid #0369a1' : '1px solid #bae6fd',
                  textAlign: 'left', marginTop: 6
                }}>
                  <Info size={14} color={isDark ? '#38bdf8' : '#0284c7'} style={{ flexShrink: 0 }} />
                  <span style={{ color: isDark ? '#7dd3fc' : '#0369a1', fontSize: 11 }}>
                    Present this QR pass to <strong>{getDoctorName()}</strong> or at the reception desk for instant check-in.
                  </span>
                </div>
              </div>

              {isDownloading && (
                <div style={{ textAlign: 'center', marginTop: 8, fontSize: 11, color: '#94a3b8' }}>
                  Generated on {new Date().toLocaleString()}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
