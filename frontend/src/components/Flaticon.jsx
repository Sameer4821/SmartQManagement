export default function Flaticon({ name, size = 18, color, style = {}, className = '' }) {
  // Normalize icon class name (ensure fi prefix exists)
  const iconClass = name.startsWith('fi-') ? `fi ${name}` : name;

  return (
    <i
      className={`${iconClass} ${className}`}
      style={{
        fontSize: typeof size === 'number' ? `${size}px` : size,
        color: color || 'inherit',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        lineHeight: 1,
        verticalAlign: 'middle',
        ...style
      }}
    />
  );
}
