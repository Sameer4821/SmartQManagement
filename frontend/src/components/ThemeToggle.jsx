import { Sun, Moon } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function ThemeToggle({ style = {}, className = '' }) {
  const { state, toggleTheme } = useAppContext();
  const isDark = state.theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`theme-toggle-btn ${className}`}
      aria-label="Toggle theme"
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      style={{
        width: 36,
        height: 36,
        borderRadius: 10,
        background: isDark ? '#09090b' : '#ffffff',
        border: isDark ? '1px solid #27272a' : '1px solid #e2e8f0',
        color: isDark ? '#facc15' : '#0284c7',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: isDark ? '0 1px 4px rgba(0,0,0,0.5)' : '0 1px 4px rgba(0,0,0,0.05)',
        transition: 'all 0.15s ease',
        flexShrink: 0,
        ...style
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = isDark ? '#3f3f46' : '#cbd5e1';
        e.currentTarget.style.transform = 'translateY(-1px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = isDark ? '#27272a' : '#e2e8f0';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
