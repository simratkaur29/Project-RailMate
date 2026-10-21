import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../store/userSlice';
import FormInput from '../components/FormInput';
import '../styles/profile.css';

function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});

  // Focus management refs
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const phoneRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Full name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Invalid email format (e.g. user@example.com)';
    if (!form.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^\d{10}$/.test(form.phone)) newErrors.phone = 'Phone must be exactly 10 digits';
    if (!form.password) newErrors.password = 'Password is required';
    else if (form.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    // Focus management: focus first invalid input field
    if (Object.keys(validationErrors).length > 0) {
      if (validationErrors.name) nameRef.current?.focus();
      else if (validationErrors.email) emailRef.current?.focus();
      else if (validationErrors.phone) phoneRef.current?.focus();
      else if (validationErrors.password) passwordRef.current?.focus();
      else if (validationErrors.confirmPassword) confirmPasswordRef.current?.focus();
      return;
    }

    const user = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      password: form.password,
    };
    localStorage.setItem('railmate_user', JSON.stringify(user));
    dispatch(login(user));
    navigate('/profile');
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        <h2>🚆 Create Account</h2>
        <p className="auth-subtitle">Join RAILMATE and start your journey</p>

        <form onSubmit={handleSubmit} noValidate>
          <FormInput
            ref={nameRef}
            id="reg-name"
            label="Full Name"
            type="text"
            placeholder="Enter your full name"
            value={form.name}
            onChange={(val) => handleChange('name', val)}
            error={errors.name}
            required
          />

          <FormInput
            ref={emailRef}
            id="reg-email"
            label="Email Address"
            type="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={(val) => handleChange('email', val)}
            error={errors.email}
            required
          />

          <FormInput
            ref={phoneRef}
            id="reg-phone"
            label="Phone Number"
            type="tel"
            placeholder="Enter 10-digit phone number"
            value={form.phone}
            onChange={(val) => handleChange('phone', val)}
            error={errors.phone}
            required
          />

          <FormInput
            ref={passwordRef}
            id="reg-password"
            label="Password"
            type="password"
            placeholder="Create a password (min 6 characters)"
            value={form.password}
            onChange={(val) => handleChange('password', val)}
            error={errors.password}
            required
          />

          <FormInput
            ref={confirmPasswordRef}
            id="reg-confirm"
            label="Confirm Password"
            type="password"
            placeholder="Confirm your password"
            value={form.confirmPassword}
            onChange={(val) => handleChange('confirmPassword', val)}
            error={errors.confirmPassword}
            required
          />

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
            Create Account
          </button>
        </form>

        <p className="auth-link">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </main>
  );
}

export default Register;
