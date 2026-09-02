// Shared UI Components — Pure HTML/CSS (no React Native)
// All components follow the design system in index.css

export function Button({ children, variant = 'primary', size = '', className = '', disabled, onClick, type = 'button', ...props }) {
  const cls = ['btn', `btn-${variant}`, size ? `btn-${size}` : '', className].filter(Boolean).join(' ');
  return (
    <button type={type} className={cls} disabled={disabled} onClick={onClick} {...props}>
      {children}
    </button>
  );
}

export function Card({ children, className = '', ...props }) {
  return <div className={`card ${className}`} {...props}>{children}</div>;
}
export function CardHeader({ children, className = '' }) {
  return <div className={`card-header ${className}`}>{children}</div>;
}
export function CardContent({ children, className = '' }) {
  return <div className={`card-content ${className}`}>{children}</div>;
}
export function CardFooter({ children, className = '' }) {
  return <div className={`card-footer ${className}`}>{children}</div>;
}
export function CardTitle({ children, className = '' }) {
  return <h2 className={`card-title ${className}`}>{children}</h2>;
}
export function CardDescription({ children, className = '' }) {
  return <p className={`card-description ${className}`}>{children}</p>;
}

export function Input({ className = '', ...props }) {
  return <input className={`input ${className}`} {...props} />;
}

export function Textarea({ className = '', ...props }) {
  return <textarea className={`textarea ${className}`} {...props} />;
}

export function Label({ children, className = '', ...props }) {
  return <label className={`label ${className}`} {...props}>{children}</label>;
}

export function Select({ children, className = '', ...props }) {
  return <select className={`select ${className}`} {...props}>{children}</select>;
}

export function Badge({ children, variant = 'primary', className = '' }) {
  return <span className={`badge badge-${variant} ${className}`}>{children}</span>;
}

export function Progress({ value = 0, className = '' }) {
  return (
    <div className={`progress-track ${className}`}>
      <div className="progress-fill" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  );
}

export function Spinner({ size = '' }) {
  return <div className={`spinner ${size ? `spinner-${size}` : ''}`} />;
}

export function Alert({ children, type = 'info', className = '' }) {
  return <div className={`alert alert-${type} ${className}`}>{children}</div>;
}

export function Divider({ text, className = '' }) {
  if (text) return <div className={`divider-text ${className}`}>{text}</div>;
  return <hr className={`divider ${className}`} />;
}

export function Switch({ checked, onChange, id }) {
  return (
    <label className="switch" htmlFor={id}>
      <input type="checkbox" id={id} checked={checked} onChange={e => onChange(e.target.checked)} />
      <span className="switch-slider" />
    </label>
  );
}

export function Tabs({ tabs, active, onChange }) {
  return (
    <div className="tabs-list">
      {tabs.map(tab => (
        <button
          key={tab.value}
          className={`tab-trigger ${active === tab.value ? 'active' : ''}`}
          onClick={() => onChange(tab.value)}
        >
          {tab.icon && tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
}
