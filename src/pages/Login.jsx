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
    }
  };

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
    if (errors[field]) setErrors({ ...errors, [field]: '' });
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        <h2>🚆 Welcome Back</h2>
        <p className="auth-subtitle">Login to your RAILMATE account</p>

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
