// Shared Admin Components
import React from 'react';

// Modern Button Component
export const AdminButton = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  disabled = false, 
  loading = false,
  onClick,
  className = '',
  ...props 
}) => {
  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    border: 'none',
    borderRadius: '12px',
    fontWeight: '600',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    opacity: disabled || loading ? 0.7 : 1,
    textDecoration: 'none',
  };

  const variants = {
    primary: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: '#fff',
    },
    secondary: {
      background: '#f8fafc',
      color: '#475569',
      border: '2px solid #e2e8f0',
    },
    success: {
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      color: '#fff',
    },
    danger: {
      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      color: '#fff',
    },
    ghost: {
      background: 'transparent',
      color: '#475569',
      border: '2px solid transparent',
    }
  };

  const sizes = {
    small: { padding: '8px 16px', fontSize: '0.85rem' },
    medium: { padding: '12px 20px', fontSize: '0.9rem' },
    large: { padding: '16px 24px', fontSize: '1rem' },
  };

  const hoverStyles = {
    transform: disabled || loading ? 'none' : 'translateY(-2px)',
    boxShadow: disabled || loading ? 'none' : '0 8px 25px rgba(102, 126, 234, 0.3)',
  };

  return (
    <button
      style={{
        ...baseStyles,
        ...variants[variant],
        ...sizes[size],
      }}
      className={`admin-button ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      onMouseEnter={(e) => {
        if (!disabled && !loading) {
          Object.assign(e.target.style, hoverStyles);
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled && !loading) {
          e.target.style.transform = 'none';
          e.target.style.boxShadow = 'none';
        }
      }}
      {...props}
    >
      {loading && (
        <div
          style={{
            width: '16px',
            height: '16px',
            border: '2px solid rgba(255,255,255,0.3)',
            borderTop: '2px solid #fff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}
        />
      )}
      {children}
    </button>
  );
};

// Modern Card Component
export const AdminCard = ({ children, title, subtitle, className = '', ...props }) => {
  return (
    <div
      style={{
        background: '#fff',
        borderRadius: '20px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        overflow: 'hidden',
      }}
      className={`admin-card ${className}`}
      {...props}
    >
      {(title || subtitle) && (
        <div
          style={{
            padding: '24px 24px 16px',
            borderBottom: '1px solid #e2e8f0',
            background: 'linear-gradient(135deg, #f8fafc 0%, #fff 100%)',
          }}
        >
          {title && (
            <h3
              style={{
                margin: '0 0 4px 0',
                fontSize: '1.25rem',
                fontWeight: '700',
                color: '#1e293b',
                letterSpacing: '-0.5px',
              }}
            >
              {title}
            </h3>
          )}
          {subtitle && (
            <p
              style={{
                margin: '0',
                fontSize: '0.9rem',
                color: '#64748b',
                fontWeight: '500',
              }}
            >
              {subtitle}
            </p>
          )}
        </div>
      )}
      <div style={{ padding: '24px' }}>
        {children}
      </div>
    </div>
  );
};

// Modern Input Component
export const AdminInput = ({ 
  label, 
  error, 
  icon, 
  className = '', 
  ...props 
}) => {
  return (
    <div className={`admin-input-group ${className}`} style={{ marginBottom: '20px' }}>
      {label && (
        <label
          style={{
            display: 'block',
            fontSize: '0.9rem',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '8px',
          }}
        >
          {label}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        {icon && (
          <div
            style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#64748b',
              zIndex: 1,
            }}
          >
            {icon}
          </div>
        )}
        <input
          style={{
            width: '100%',
            padding: icon ? '14px 16px 14px 48px' : '14px 16px',
            border: `2px solid ${error ? '#ef4444' : '#e2e8f0'}`,
            borderRadius: '12px',
            fontSize: '0.95rem',
            transition: 'all 0.2s',
            background: '#f8fafc',
            boxSizing: 'border-box',
          }}
          onFocus={(e) => {
            e.target.style.borderColor = error ? '#ef4444' : '#667eea';
            e.target.style.background = '#fff';
            e.target.style.boxShadow = `0 0 0 3px rgba(${error ? '239, 68, 68' : '102, 126, 234'}, 0.1)`;
          }}
          onBlur={(e) => {
            e.target.style.borderColor = error ? '#ef4444' : '#e2e8f0';
            e.target.style.background = '#f8fafc';
            e.target.style.boxShadow = 'none';
          }}
          {...props}
        />
      </div>
      {error && (
        <div
          style={{
            marginTop: '6px',
            fontSize: '0.8rem',
            color: '#ef4444',
            fontWeight: '500',
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
};

// Loading Spinner Component
export const AdminSpinner = ({ size = 'medium', color = '#667eea' }) => {
  const sizes = {
    small: '20px',
    medium: '32px',
    large: '48px',
  };

  return (
    <div
      style={{
        width: sizes[size],
        height: sizes[size],
        border: `3px solid rgba(102, 126, 234, 0.2)`,
        borderTop: `3px solid ${color}`,
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
      }}
    />
  );
};

// Status Badge Component
export const AdminBadge = ({ children, variant = 'default', size = 'medium' }) => {
  const variants = {
    default: { background: '#f1f5f9', color: '#475569' },
    success: { background: '#dcfce7', color: '#166534' },
    warning: { background: '#fef3c7', color: '#92400e' },
    danger: { background: '#fef2f2', color: '#991b1b' },
    info: { background: '#dbeafe', color: '#1e40af' },
  };

  const sizes = {
    small: { padding: '2px 8px', fontSize: '0.75rem' },
    medium: { padding: '4px 12px', fontSize: '0.8rem' },
    large: { padding: '6px 16px', fontSize: '0.85rem' },
  };

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        borderRadius: '20px',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        ...variants[variant],
        ...sizes[size],
      }}
    >
      {children}
    </span>
  );
};

// Empty State Component
export const AdminEmptyState = ({ 
  icon, 
  title, 
  description, 
  action, 
  className = '' 
}) => {
  return (
    <div
      style={{
        textAlign: 'center',
        padding: '60px 20px',
        color: '#64748b',
      }}
      className={`admin-empty-state ${className}`}
    >
      {icon && (
        <div
          style={{
            width: '80px',
            height: '80px',
            margin: '0 auto 24px',
            background: '#f1f5f9',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#94a3b8',
          }}
        >
          {icon}
        </div>
      )}
      {title && (
        <h3
          style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#475569',
            marginBottom: '12px',
          }}
        >
          {title}
        </h3>
      )}
      {description && (
        <p
          style={{
            fontSize: '0.95rem',
            color: '#64748b',
            maxWidth: '400px',
            margin: '0 auto 24px',
            lineHeight: '1.5',
          }}
        >
          {description}
        </p>
      )}
      {action && action}
    </div>
  );
};

// Add global styles for animations
const globalStyles = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .admin-button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  }
  
  .admin-card {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .admin-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  }
`;

// Inject global styles
if (typeof document !== 'undefined' && !document.getElementById('admin-components-styles')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'admin-components-styles';
  styleSheet.textContent = globalStyles;
  document.head.appendChild(styleSheet);
}
