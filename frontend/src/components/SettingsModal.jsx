import { useState } from 'react';
import { Settings as SettingsIcon, Palette, Sun, Moon, Globe, Accessibility, Monitor, X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useTranslation } from '../hooks/useTranslation';

export default function SettingsModal({ onClose }) {
  const { state, setState } = useAppContext();
  const { t } = useTranslation();

  const handleThemeChange = (newTheme) => {
    setState(prev => ({ ...prev, theme: newTheme }));
  };

  const handleLanguageChange = (language) => {
    setState(prev => ({ ...prev, language }));
  };

  const handleAccessibilityChange = (mode) => {
    setState(prev => ({ ...prev, accessibilityMode: mode }));
  };

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'mr', name: 'मराठी', flag: '🇮🇳' },
    { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
    { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
    { code: 'bn', name: 'বাংলা', flag: '🇮🇳' }
  ];

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      backgroundColor: 'rgba(15, 23, 42, 0.6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
      backdropFilter: 'blur(4px)'
    }}>
      <div className="card animate-slide-up" style={{ width: '100%', maxWidth: 540, maxHeight: '90vh', overflowY: 'auto' }}>
        {/* Header */}
        <div style={{ backgroundColor: '#2563eb', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#ffffff' }}>
            <SettingsIcon size={20} />
            <span style={{ fontSize: 18, fontWeight: 700 }}>{t('settingsTitle') || 'Settings'}</span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#ffffff', fontSize: 24, cursor: 'pointer', lineHeight: 1 }}>
            <X size={20} />
          </button>
        </div>

        <div className="card-content" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Theme section */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Palette size={16} color="#2563eb" />
              <span style={{ fontWeight: 700, color: '#1e293b', fontSize: 15 }}>{t('themeSettings') || 'Theme Settings'}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div
                onClick={() => handleThemeChange('medical')}
                style={{
                  padding: 16, borderRadius: 12, border: `2px solid ${state.theme === 'medical' ? '#2563eb' : '#e2e8f0'}`,
                  backgroundColor: state.theme === 'medical' ? '#eff6ff' : '#ffffff',
                  cursor: 'pointer', textAlign: 'center', transition: 'all .18s ease'
                }}
              >
                <div style={{ width: 40, height: 40, borderRadius: 10, background: '#3b82f6', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' }}>
                  <Sun size={20} />
                </div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{t('lightTheme') || 'Light Theme'}</div>
                {state.theme === 'medical' && <span className="badge badge-blue" style={{ marginTop: 6 }}>{t('active') || 'Active'}</span>}
              </div>

              <div
                onClick={() => handleThemeChange('dark')}
                style={{
                  padding: 16, borderRadius: 12, border: `2px solid ${state.theme === 'dark' ? '#2563eb' : '#e2e8f0'}`,
                  backgroundColor: state.theme === 'dark' ? '#eff6ff' : '#ffffff',
                  cursor: 'pointer', textAlign: 'center', transition: 'all .18s ease'
                }}
              >
                <div style={{ width: 40, height: 40, borderRadius: 10, background: '#1f2937', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' }}>
                  <Moon size={20} />
                </div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{t('darkTheme') || 'Dark Theme'}</div>
                {state.theme === 'dark' && <span className="badge badge-blue" style={{ marginTop: 6 }}>{t('active') || 'Active'}</span>}
              </div>
            </div>
          </div>

          <div style={{ height: 1, background: '#e2e8f0' }} />

          {/* Language section */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Globe size={16} color="#2563eb" />
              <span style={{ fontWeight: 700, color: '#1e293b', fontSize: 15 }}>{t('languageSettings') || 'Language Settings'}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {languages.map(lang => (
                <button
                  key={lang.code}
                  className={`btn btn-sm ${state.language === lang.code ? 'btn-primary' : 'btn-outline'}`}
                  style={{ justifyContent: 'center', padding: '10px' }}
                  onClick={() => handleLanguageChange(lang.code)}
                >
                  {lang.flag} {lang.name}
                </button>
              ))}
            </div>
          </div>

          <div style={{ height: 1, background: '#e2e8f0' }} />

          {/* Accessibility section */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Accessibility size={16} color="#2563eb" />
              <span style={{ fontWeight: 700, color: '#1e293b', fontSize: 15 }}>{t('accessibilitySettings') || 'Accessibility Settings'}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { mode: 'normal', title: t('normalMode') || 'Normal Mode', desc: t('standardDisplay') || 'Standard display settings' },
                { mode: 'high-contrast', title: t('highContrastMode') || 'High Contrast Mode', desc: t('enhancedContrast') || 'Enhanced contrast for better readability' },
                { mode: 'voice-assist', title: t('voiceAssistant') || 'Voice Assistant', desc: t('audioGuidance') || 'Audio guidance and announcements' }
              ].map(opt => (
                <div key={opt.mode} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, color: '#0f172a' }}>{opt.title}</div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>{opt.desc}</div>
                  </div>
                  <input
                    type="radio"
                    name="accessibility"
                    checked={state.accessibilityMode === opt.mode}
                    onChange={() => handleAccessibilityChange(opt.mode)}
                    style={{ width: 18, height: 18, cursor: 'pointer', accentColor: '#2563eb' }}
                  />
                </div>
              ))}
            </div>
          </div>

          <div style={{ height: 1, background: '#e2e8f0' }} />

          {/* System info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Monitor size={16} color="#2563eb" />
              <span style={{ fontWeight: 700, color: '#1e293b', fontSize: 15 }}>{t('systemInformation') || 'System Information'}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, background: '#f8fafc', padding: 12, borderRadius: 8 }}>
              <div>
                <div style={{ fontSize: 12, color: '#64748b' }}>Current Theme</div>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{state.theme === 'medical' ? 'Light' : 'Dark'}</div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: '#64748b' }}>Language</div>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{languages.find(l => l.code === state.language)?.name || 'English'}</div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: '#64748b' }}>Accessibility</div>
                <div style={{ fontWeight: 600, fontSize: 13, textTransform: 'capitalize' }}>{state.accessibilityMode?.replace('-', ' ')}</div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: '#64748b' }}>Active Tokens</div>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{state.tokens?.length || 0}</div>
              </div>
            </div>
          </div>

          <button className="btn btn-outline btn-full" onClick={onClose} style={{ marginTop: 8 }}>
            Close Settings
          </button>
        </div>
      </div>
    </div>
  );
}
