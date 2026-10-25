import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/profile.css';

function Login({ onLogin }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Invalid email format';
    if (!form.password) newErrors.password = 'Password is required';
    else if (form.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      // Retrieve registered users from localStorage
      const users = JSON.parse(localStorage.getItem('railmate_users') || '[]');
      const legacy = localStorage.getItem('railmate_user');
      if (legacy) {
        try {
          const parsed = JSON.parse(legacy);
          if (parsed?.email && !users.some((u) => u.email.toLowerCase() === parsed.email.toLowerCase())) {
            users.push(parsed);
            localStorage.setItem('railmate_users', JSON.stringify(users));
          }
        } catch {
          // ignore parsing error
        }
      }

      const inputEmail = form.email.trim().toLowerCase();
      const matchedUser = users.find((u) => u.email.toLowerCase() === inputEmail);

      if (!matchedUser) {
        setErrors({ general: 'No account found with this email. Please register first.' });
        return;
      }

      if (matchedUser.password !== form.password) {
        setErrors({ general: 'Incorrect password. Please try again.' });
        return;
      }

      // Valid credentials — log in
      localStorage.setItem('railmate_user', JSON.stringify(matchedUser));
      localStorage.setItem('railmate_logged_in', 'true');
      onLogin(matchedUser);
      navigate('/profile');
    }
  };

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
    const updatedErrors = { ...errors };
    if (updatedErrors[field]) delete updatedErrors[field];
    if (updatedErrors.general) delete updatedErrors.general;
    setErrors(updatedErrors);
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        <h2>🚆 Welcome Back</h2>
        <p className="auth-subtitle">Login to your RAILMATE account</p>

        {errors.general && (
          <div
            className="form-error"
            role="alert"
            style={{
              padding: '10px 14px',
              backgroundColor: 'rgba(229, 62, 62, 0.12)',
              border: '1px solid rgba(229, 62, 62, 0.35)',
              borderRadius: '6px',
              color: 'var(--error, #e53e3e)',
              marginBottom: '1rem',
              fontSize: '0.88rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>⚠️</span> {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="login-email">Email Address</label>
            <input
              id="login-email"
              type="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
            />
            {errors.email && <div className="form-error">{errors.email}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={(e) => handleChange('password', e.target.value)}
            />
            {errors.password && <div className="form-error">{errors.password}</div>}
          </div>

          <button type="submit" className="btn btn-primary">Login</button>
        </form>

        <p className="auth-link">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </main>
  );
}

export default Login;
