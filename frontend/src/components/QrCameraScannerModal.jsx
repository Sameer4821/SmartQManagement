import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Camera, X, RefreshCw, Zap, CheckCircle2, AlertCircle, Keyboard, QrCode } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function QrCameraScannerModal({ isOpen, onClose, onScanSuccess }) {
  const { state: appState } = useAppContext();
  const isDark = appState.theme === 'dark';

  const [activeTab, setActiveTab] = useState('camera'); // 'camera' | 'manual'
  const [manualInput, setManualInput] = useState('');
  const [cameraError, setCameraError] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [cameras, setCameras] = useState([]);
  const [selectedCameraId, setSelectedCameraId] = useState('');
  const [lastScanned, setLastScanned] = useState(null);

  const scannerRef = useRef(null);
  const barcodeBufferRef = useRef('');
  const lastKeyTimeRef = useRef(Date.now());

  // Synthesized Web Audio confirmation chime
  const playBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1320, audioCtx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);
    } catch {
      // Audio context fallback
    }
  };

  const handleDetectedCode = (codeText) => {
    if (!codeText) return;
    const clean = codeText.trim();
    if (!clean) return;

    playBeep();
    setLastScanned(clean);
    onScanSuccess(clean);
  };

  // Hardware USB / Bluetooth barcode scanner listener
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      const now = Date.now();
      const diff = now - lastKeyTimeRef.current;
      lastKeyTimeRef.current = now;

      const isInputFocused = document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA';

      if (e.key === 'Enter') {
        if (barcodeBufferRef.current.length >= 3) {
          e.preventDefault();
          handleDetectedCode(barcodeBufferRef.current);
          barcodeBufferRef.current = '';
        }
        return;
      }

      if (diff < 60 || !isInputFocused) {
        if (e.key.length === 1) {
          barcodeBufferRef.current += e.key;
        }
      } else {
        barcodeBufferRef.current = e.key.length === 1 ? e.key : '';
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Start Camera
  const startCamera = async (cameraIdToUse = null) => {
    setCameraError('');
    setIsScanning(false);

    try {
      const devices = await Html5Qrcode.getCameras();
      if (!devices || devices.length === 0) {
        setCameraError('No camera devices detected on this device.');
        return;
      }

      setCameras(devices);
      const camId = cameraIdToUse || selectedCameraId || devices[0].id;
      setSelectedCameraId(camId);

      const html5QrCode = new Html5Qrcode('qr-reader-view');
      scannerRef.current = html5QrCode;

      const config = {
        fps: 15,
        qrbox: { width: 230, height: 230 },
        aspectRatio: 1.0,
      };

      await html5QrCode.start(
        camId,
        config,
        (decodedText) => {
          handleDetectedCode(decodedText);
        },
        () => {
          // Normal frame scan tick
        }
      );

      setIsScanning(true);
    } catch (err) {
      console.error('Camera start error:', err);
      setCameraError(err.message || 'Unable to access camera. Please check browser permissions.');
      setIsScanning(false);
    }
  };

  // Stop Camera
  const stopCamera = async () => {
    if (scannerRef.current) {
      try {
        if (scannerRef.current.isScanning) {
          await scannerRef.current.stop();
        }
        scannerRef.current.clear();
      } catch (err) {
        console.error('Camera stop error:', err);
      } finally {
        scannerRef.current = null;
        setIsScanning(false);
      }
    }
  };

  useEffect(() => {
    if (isOpen && activeTab === 'camera') {
      const timer = setTimeout(() => {
        startCamera();
      }, 150);
      return () => {
        clearTimeout(timer);
        stopCamera();
      };
    } else {
      stopCamera();
    }
  }, [isOpen, activeTab]);

  const handleCameraChange = async (e) => {
    const newId = e.target.value;
    setSelectedCameraId(newId);
    await stopCamera();
    startCamera(newId);
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualInput.trim()) return;
    handleDetectedCode(manualInput);
    setManualInput('');
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(5px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16
    }}>
      <div className="card animate-slide-up" style={{
        width: '100%', maxWidth: 460, borderRadius: 20, overflow: 'hidden',
        boxShadow: isDark ? '0 20px 40px rgba(0, 0, 0, 0.9)' : '0 20px 40px -10px rgba(0, 0, 0, 0.15)',
        border: isDark ? '1px solid #27272a' : '1px solid #e2e8f0',
        background: isDark ? '#09090b' : '#ffffff'
      }}>

        {/* Modal Header */}
        <div style={{
          padding: '18px 20px',
          borderBottom: isDark ? '1px solid #27272a' : '1px solid #f1f5f9',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: isDark ? '#000000' : '#ffffff'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              background: isDark ? '#082f49' : '#eff6ff',
              color: isDark ? '#38bdf8' : '#0284c7',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <QrCode size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 17, color: isDark ? '#ffffff' : '#0f172a' }}>Scan Patient QR</div>
              <div style={{ fontSize: 12, color: isDark ? '#a1a1aa' : '#64748b', marginTop: 1 }}>Live camera & hardware scanner</div>
            </div>
          </div>
          <button
            onClick={() => { stopCamera(); onClose(); }}
            style={{
              width: 32, height: 32, borderRadius: '50%',
              background: isDark ? '#18181b' : '#f8fafc',
              border: isDark ? '1px solid #27272a' : '1px solid #e2e8f0',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: isDark ? '#ffffff' : '#64748b', transition: 'all 0.15s ease'
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Segmented Tab Pill Controller */}
        <div style={{ padding: '16px 20px 0' }}>
          <div style={{
            display: 'flex',
            background: isDark ? '#000000' : '#f1f5f9',
            border: isDark ? '1px solid #27272a' : 'none',
            borderRadius: 12, padding: 4
          }}>
            <button
              type="button"
              onClick={() => setActiveTab('camera')}
              style={{
                flex: 1, padding: '9px 12px', border: 'none', borderRadius: 8,
                background: activeTab === 'camera' ? (isDark ? '#27272a' : '#ffffff') : 'transparent',
                fontWeight: 700, fontSize: 13,
                color: activeTab === 'camera' ? (isDark ? '#ffffff' : '#0284c7') : (isDark ? '#a1a1aa' : '#64748b'),
                boxShadow: activeTab === 'camera' ? '0 2px 6px rgba(0,0,0,0.1)' : 'none',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                transition: 'all 0.2s ease'
              }}
            >
              <Camera size={15} /> Live Camera
            </button>
            <button
              type="button"
              onClick={() => { stopCamera(); setActiveTab('manual'); }}
              style={{
                flex: 1, padding: '9px 12px', border: 'none', borderRadius: 8,
                background: activeTab === 'manual' ? (isDark ? '#27272a' : '#ffffff') : 'transparent',
                fontWeight: 700, fontSize: 13,
                color: activeTab === 'manual' ? (isDark ? '#ffffff' : '#0284c7') : (isDark ? '#a1a1aa' : '#64748b'),
                boxShadow: activeTab === 'manual' ? '0 2px 6px rgba(0,0,0,0.1)' : 'none',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                transition: 'all 0.2s ease'
              }}
            >
              <Keyboard size={15} /> Manual / USB Wedge
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div style={{ padding: '16px 20px 20px' }}>

          {activeTab === 'camera' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Camera viewfinder box */}
              <div style={{
                position: 'relative', width: '100%', minHeight: 270,
                backgroundColor: '#000000', borderRadius: 16, overflow: 'hidden',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: isDark ? '1px solid #27272a' : '1px solid #cbd5e1'
              }}>
                <div id="qr-reader-view" style={{ width: '100%' }} />

                {/* Laser scan animation overlay */}
                {isScanning && (
                  <div style={{
                    position: 'absolute', inset: 0, pointerEvents: 'none',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <div style={{
                      width: 210, height: 210, position: 'relative'
                    }}>
                      {/* 4 Clean Modern Corner Guides */}
                      <div style={{ position: 'absolute', top: 0, left: 0, width: 24, height: 24, borderTop: '3px solid #38bdf8', borderLeft: '3px solid #38bdf8', borderTopLeftRadius: 8 }} />
                      <div style={{ position: 'absolute', top: 0, right: 0, width: 24, height: 24, borderTop: '3px solid #38bdf8', borderRight: '3px solid #38bdf8', borderTopRightRadius: 8 }} />
                      <div style={{ position: 'absolute', bottom: 0, left: 0, width: 24, height: 24, borderBottom: '3px solid #38bdf8', borderLeft: '3px solid #38bdf8', borderBottomLeftRadius: 8 }} />
                      <div style={{ position: 'absolute', bottom: 0, right: 0, width: 24, height: 24, borderBottom: '3px solid #38bdf8', borderRight: '3px solid #38bdf8', borderBottomRightRadius: 8 }} />

                      {/* Animated laser scan line */}
                      <div style={{
                        position: 'absolute', left: 4, right: 4, height: 2,
                        backgroundColor: '#38bdf8', boxShadow: '0 0 10px #38bdf8',
                        animation: 'scannerLaser 2.2s ease-in-out infinite'
                      }} />
                    </div>
                  </div>
                )}

                {cameraError && (
                  <div style={{
                    position: 'absolute', inset: 0,
                    backgroundColor: isDark ? '#09090b' : '#ffffff',
                    padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center'
                  }}>
                    <div style={{ width: 48, height: 48, borderRadius: '50%', background: isDark ? '#450a0a' : '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                      <AlertCircle size={26} color="#ef4444" />
                    </div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: isDark ? '#ffffff' : '#1e293b', marginBottom: 4 }}>Camera Access Needed</div>
                    <div style={{ fontSize: 13, color: isDark ? '#a1a1aa' : '#64748b', maxWidth: 300, marginBottom: 16 }}>{cameraError}</div>
                    <button
                      className="btn btn-sky btn-sm"
                      onClick={() => startCamera()}
                      style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                    >
                      <RefreshCw size={14} /> Retry Camera
                    </button>
                  </div>
                )}
              </div>

              {/* Camera selector if multiple cameras exist */}
              {cameras.length > 1 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 12, color: isDark ? '#a1a1aa' : '#64748b', fontWeight: 600 }}>Camera:</span>
                  <select
                    className="input"
                    value={selectedCameraId}
                    onChange={handleCameraChange}
                    style={{ fontSize: 12, padding: '6px 10px', flex: 1 }}
                  >
                    {cameras.map((c) => (
                      <option key={c.id} value={c.id}>{c.label || `Camera ${c.id.substring(0, 5)}`}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Instruction alert */}
              <div style={{
                padding: '10px 14px', borderRadius: 10,
                backgroundColor: isDark ? '#082f49' : '#f0f9ff',
                border: isDark ? '1px solid #0369a1' : '1px solid #bae6fd',
                display: 'flex', alignItems: 'center', gap: 8, fontSize: 13,
                color: isDark ? '#7dd3fc' : '#0369a1'
              }}>
                <Zap size={16} color="#38bdf8" style={{ flexShrink: 0 }} />
                <span>Point camera directly at the patient's token QR code.</span>
              </div>
            </div>
          )}

          {activeTab === 'manual' && (
            <form onSubmit={handleManualSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{
                backgroundColor: isDark ? '#000000' : '#f8fafc',
                border: isDark ? '1px solid #27272a' : '1px solid #e2e8f0',
                borderRadius: 12, padding: 14, fontSize: 13,
                color: isDark ? '#d4d4d8' : '#475569'
              }}>
                <div style={{ fontWeight: 700, color: isDark ? '#38bdf8' : '#0284c7', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Zap size={16} /> Hardware Barcode / USB Scanner Ready
                </div>
                <span>If using a handheld USB/Bluetooth barcode scanner gun, pull the trigger on the barcode and it will auto-detect instantly.</span>
              </div>

              <div>
                <label className="label" style={{ fontSize: 13, marginBottom: 6, color: isDark ? '#ffffff' : '#334155' }}>
                  Or Enter Token ID Manually:
                </label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    className="input"
                    placeholder="e.g. GEN-001 or GEN-142030-001-ABC..."
                    value={manualInput}
                    onChange={e => setManualInput(e.target.value)}
                    autoFocus
                  />
                  <button type="submit" className="btn btn-primary" style={{ padding: '0 20px', fontWeight: 700 }}>
                    Verify
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Last scanned feedback banner */}
          {lastScanned && (
            <div style={{
              marginTop: 14, padding: '10px 14px', borderRadius: 10,
              backgroundColor: isDark ? '#052e16' : '#ecfdf5',
              border: isDark ? '1px solid #16a34a' : '1px solid #a7f3d0',
              display: 'flex', alignItems: 'center', gap: 8, fontSize: 13,
              color: isDark ? '#86efac' : '#065f46'
            }}>
              <CheckCircle2 size={16} color="#10b981" />
              <span>Scanned Code: <strong>{lastScanned}</strong></span>
            </div>
          )}

        </div>

      </div>

      <style>{`
        #qr-reader-view video {
          border-radius: 16px !important;
          object-fit: cover !important;
        }
        #qr-reader-view {
          border: none !important;
        }
        @keyframes scannerLaser {
          0% { top: 10%; opacity: 0.8; }
          50% { top: 90%; opacity: 1; }
          100% { top: 10%; opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}
