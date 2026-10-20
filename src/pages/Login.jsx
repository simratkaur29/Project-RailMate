// Login Page - Member 3 (Palak)
import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FormInput from '../components/FormInput';
import '../styles/profile.css';

function Login({ onLogin }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});

  // Focus management refs
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const validate = () => {
    const newErrors = {};
    if (!form.email.trim()) newErrors.email = 'E-mail is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Invalid e-mail format (e.g. user@example.com)';
    if (!form.password) newErrors.password = 'Password is required';
    else if (form.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    // Focus management: focus first invalid input field
    if (Object.keys(validationErrors).length > 0) {
      if (validationErrors.email) {
        emailRef.current?.focus();
      } else if (validationErrors.password) {
        passwordRef.current?.focus();
      }
      return;
    }

    // Check localStorage for registered user
    const storedUser = localStorage.getItem('railmate_user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user.email === form.email && user.password === form.password) {
        onLogin(user);
        navigate('/profile');
        return;
      }
    }

    // Demo login - create a user if none exists
    const demoUser = {
      name: 'Demo User',
      email: form.email,
      phone: '9876543210',
      password: form.password,
    };
    localStorage.setItem('railmate_user', JSON.stringify(demoUser));
    onLogin(demoUser);
    navigate('/profile');
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        <h2>🚆 Welcome Back</h2>
        <p className="auth-subtitle">Login to your RAILMATE account</p>

        <form onSubmit={handleSubmit} noValidate>
          <FormInput
            ref={emailRef}
            id="login-email"
            label="Email Address"
            type="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={(val) => handleChange('email', val)}
            error={errors.email}
            required
          />

          <FormInput
            ref={passwordRef}
            id="login-password"
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={(val) => handleChange('password', val)}
            error={errors.password}
            required
          />

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
            Login
          </button>
        </form>

        <p className="auth-link">
          Don't have an account? <Link to="/register">Register Here</Link>
        </p>
      </div>
    </main>
  );
}

export default Login;
