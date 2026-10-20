import { forwardRef } from 'react';

/**
 * FormInput — Reusable validated form input component with ref forwarding.
 * Supports text, date, email, password, tel, and select inputs.
 */
const FormInput = forwardRef(function FormInput(
  {
    label,
    id,
    type = 'text',
    value,
    onChange,
    placeholder = '',
    error = '',
    required = false,
    options = null, // array of { value, label } for select inputs
    min,
    disabled = false,
  },
  ref
) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={`form-group ${error ? 'has-error' : ''}`}>
      {label && (
        <label htmlFor={inputId}>
          {label}
          {required && <span style={{ color: 'var(--error, #e53e3e)', marginLeft: 3 }}>*</span>}
        </label>
      )}

      {options ? (
        <select
          ref={ref}
          id={inputId}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          style={error ? { borderColor: 'var(--error, #e53e3e)' } : {}}
        >
          <option value="">{placeholder || 'Select an option'}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          ref={ref}
          id={inputId}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          min={min}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          style={error ? { borderColor: 'var(--error, #e53e3e)' } : {}}
        />
      )}

      {error && (
        <div
          className="form-error"
          id={`${inputId}-error`}
          role="alert"
          style={{
            color: 'var(--error, #e53e3e)',
            fontSize: '0.82rem',
            marginTop: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <span>⚠️</span> {error}
        </div>
      )}
    </div>
  );
});

export default FormInput;
