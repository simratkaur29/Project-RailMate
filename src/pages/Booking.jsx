import { useState, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../store/userSlice';
import FormInput from '../components/FormInput';
import '../styles/profile.css';

HEAD
// Realistic standard catering fares (per passenger)
export const MEAL_PRICES = {
  breakfast: 120, // ₹120 per passenger
  lunch: 200,     // ₹200 per passenger
};

export const GST_RATE = 0.05; // 5% GST on railway services and catering

function Booking({ user }) {

function Booking() {
 main
  const location = useLocation();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const train = location.state?.train;

  const [form, setForm] = useState({
    passengerName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    journeyType: location.state?.journeyType || 'oneWay', // 'oneWay' or 'roundTrip'
    date: location.state?.date || '',
    returnDate: '',
    travelClass: '',
    seatPreference: 'No Preference',
    passengers: 1,
    meals: {
      breakfast: false,
      lunch: false,
    },
  });
 HEAD


 main
  const [errors, setErrors] = useState({});
  const [confirmed, setConfirmed] = useState(false);
  const [bookingData, setBookingData] = useState(null);

  // Focus management refs
  const nameRef = useRef(null);
  const dateRef = useRef(null);
  const classRef = useRef(null);

  if (!train) {
    return (
      <main className="booking-page">
        <div className="page-header">
          <h1>🎫 Book Your Ticket</h1>
          <p>Select a train first to proceed with booking.</p>
        </div>
        <div className="container">
          <div className="empty-state">
            <div className="icon">🚆</div>
            <h3>No train selected</h3>
            <p>Please search for a train and click "Book Now" to proceed.</p>
            <button
              className="btn btn-primary"
              style={{ marginTop: '1rem' }}
              onClick={() => navigate('/trains')}
            >
              Search Trains
            </button>
          </div>
        </div>
      </main>
    );
  }

  // Dynamic Fare & GST Calculations (accounting for journey type: one-way or round trip)
  const journeyMultiplier = form.journeyType === 'roundTrip' ? 2 : 1;
  const baseFare = train.price * form.passengers * journeyMultiplier;
  const mealCostPerPassenger =
    (form.meals.breakfast ? MEAL_PRICES.breakfast : 0) +
    (form.meals.lunch ? MEAL_PRICES.lunch : 0);
  const totalMealFare = mealCostPerPassenger * form.passengers * journeyMultiplier;
  const subtotal = baseFare + totalMealFare;
  const gstAmount = Math.round(subtotal * GST_RATE);
  const totalFare = subtotal + gstAmount;

 HEAD
  const handleMealToggle = (mealType) => {
    setForm((prev) => ({
      ...prev,
      meals: {
        ...prev.meals,
        [mealType]: !prev.meals[mealType],
      },
    }));
  };

  const getMealsLabel = (meals) => {
    if (!meals) return 'None';
    const items = [];
    if (meals.breakfast) items.push('Breakfast (₹' + MEAL_PRICES.breakfast + ')');
    if (meals.lunch) items.push('Lunch (₹' + MEAL_PRICES.lunch + ')');
    return items.length > 0 ? items.join(' + ') : 'None (No meals selected)';
  };

  // Field change handler that clears specific errors
  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));

  const validate = () => {
    const newErrors = {};

    if (!form.passengerName.trim()) {
      newErrors.passengerName = 'Passenger full name is required';
    } else if (form.passengerName.trim().length < 3) {
      newErrors.passengerName = 'Name must be at least 3 characters';
    }

    if (!form.date) {
      newErrors.date = 'Journey date is required';
    }

    if (!form.travelClass) {
      newErrors.travelClass = 'Please select a travel class';
    }

    return newErrors;
  };

  const handleConfirm = (e) => {
    e.preventDefault();

    // 1. Field-level validation
    const validationErrors = validate();
    setErrors(validationErrors);

    // 2. Focus management with refs: focus the first invalid field
    if (Object.keys(validationErrors).length > 0) {
      if (validationErrors.passengerName) {
        nameRef.current?.focus();
      } else if (validationErrors.date) {
        dateRef.current?.focus();
      } else if (validationErrors.travelClass) {
        classRef.current?.focus();
      }
      return;
main
    }
  };

  // Comprehensive Regex & Business Logic Validation
  const validateForm = () => {
    const newErrors = {};

    // 1. Passenger Name Regex: Only alphabetic characters and spaces (3-50 chars)
    const nameRegex = /^[A-Za-z\s]{3,50}$/;
    if (!form.passengerName.trim()) {
      newErrors.passengerName = 'Passenger name is required.';
    } else if (!nameRegex.test(form.passengerName.trim())) {
      newErrors.passengerName = 'Name must contain only alphabetic letters and spaces (3 to 50 characters).';
    }

    // 2. Indian Phone Number Regex: optional +91/91, exactly 10 digits starting with 6, 7, 8, or 9
    const phoneRegex = /^(?:(?:\+?91[\-\s]?)?[6-9]\d{9})$/;
    if (!form.phone.trim()) {
      newErrors.phone = 'Mobile phone number is required.';
    } else if (!phoneRegex.test(form.phone.trim().replace(/\s+/g, ''))) {
      newErrors.phone = 'Enter a valid 10-digit Indian phone number starting with 6, 7, 8, or 9.';
    }

    // 3. Email Address Regex: RFC 5322 compliant standard format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!form.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!emailRegex.test(form.email.trim())) {
      newErrors.email = 'Enter a valid email address (e.g. name@example.com).';
    }

    // 4. Outbound Journey Date Validation: must not be empty and cannot be in the past
    if (!form.date) {
      newErrors.date = 'Journey date is required.';
    } else {
      const today = new Date().toISOString().split('T')[0];
      if (form.date < today) {
        newErrors.date = 'Journey date cannot be in the past.';
      }
    }

    // 5. Return Date Validation (for Round Trip)
    if (form.journeyType === 'roundTrip') {
      if (!form.returnDate) {
        newErrors.returnDate = 'Return journey date is required for round trips.';
      } else if (form.returnDate < form.date) {
        newErrors.returnDate = 'Return date cannot be earlier than outbound journey date.';
      }
    }

    // 6. Travel Class Validation: required
    if (!form.travelClass) {
      newErrors.travelClass = 'Please select a travel class.';
    }

    return newErrors;
  };

  // Proceed to dedicated Payment page
  const handleProceedToPayment = (e) => {
    e.preventDefault();

    // 3. Login requirement check with non-blocking feedback
    if (!user) {
      setErrors({ auth: 'Please login or register to complete your ticket booking.' });
      return;
    }

HEAD
    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      // Focus first error field for accessibility
      const firstKey = Object.keys(validationErrors)[0];
      const el = document.getElementById(`book-${firstKey}`);
      if (el) el.focus();
      return;
    }

    // Normalize phone number to clean 10 digits
    const cleanPhone = form.phone.trim().replace(/\D/g, '').slice(-10);

    const bookingOrder = {

    // 4. Create confirmed booking
    const booking = {
      id: 'RM' + Date.now().toString().slice(-8),
 main
      trainName: train.name,
      trainNumber: train.number,
      source: train.source,
      destination: train.destination,
      departure: train.departure,
      arrival: train.arrival,
      duration: train.duration,
      trainPrice: train.price,
      journeyType: form.journeyType,
      journeyMultiplier,
      date: form.date,
 HEAD
      returnDate: form.journeyType === 'roundTrip' ? form.returnDate : null,
      passengerName: form.passengerName.trim(),
      email: form.email.trim(),
      phone: cleanPhone,

      passengerName: form.passengerName.trim(),
main
      travelClass: form.travelClass,
      seatPreference: form.seatPreference,
      passengers: form.passengers,
      baseFare,
      meals: form.meals,
      mealFare: totalMealFare,
      mealCostPerPassenger,
      subtotal,
      gstRate: GST_RATE,
      gstAmount,
      totalFare,
    };

    // Transition to dedicated Payment page
    navigate('/payment', { state: { bookingOrder } });
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  // Confirmation view
  if (confirmed && bookingData) {
    return (
      <main className="booking-page">
        <div className="page-header">
          <h1>✅ Booking Confirmed!</h1>
          <p>Your ticket has been booked successfully</p>
        </div>
        <div className="container booking-container">
          <div className="confirmation-card card">
            <div className="check-icon">✅</div>
            <h2>Booking Successful!</h2>
            <p style={{ color: 'var(--text-light)', marginBottom: '1rem' }}>
              Your train ticket has been booked. Have a safe journey!
            </p>
            <div className="booking-id">Booking ID: {bookingData.id}</div>

            <div className="booking-summary" style={{ textAlign: 'left', marginTop: '1.5rem' }}>
 HEAD
              <div className="summary-item"><label>Passenger</label><p>{bookingData.passengerName}</p></div>
              <div className="summary-item"><label>Contact</label><p>{bookingData.phone} | {bookingData.email}</p></div>
              <div className="summary-item"><label>Train</label><p>{bookingData.trainName}</p></div>
              <div className="summary-item"><label>Train Number</label><p>#{bookingData.trainNumber}</p></div>
              <div className="summary-item"><label>Journey Date</label><p>{bookingData.date}</p></div>
              <div className="summary-item"><label>Source</label><p>{bookingData.source}</p></div>
              <div className="summary-item"><label>Destination</label><p>{bookingData.destination}</p></div>
              <div className="summary-item"><label>Class</label><p>{bookingData.travelClass}</p></div>
              <div className="summary-item"><label>Seat Preference</label><p>{bookingData.seatPreference}</p></div>
              <div className="summary-item"><label>Base Ticket Fare</label><p>₹{bookingData.baseFare}</p></div>
              <div className="summary-item"><label>Meals Selected</label><p>{getMealsLabel(bookingData.meals)}</p></div>
              <div className="summary-item"><label>Meal Charges</label><p>₹{bookingData.mealFare || 0}</p></div>
              <div className="summary-item"><label>GST (5%)</label><p>₹{bookingData.gstAmount || 0}</p></div>
              <div className="summary-item"><label>Total Paid Fare</label><p style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '1.1rem' }}>₹{bookingData.fare}</p></div>

              <div className="summary-item">
                <label>Passenger</label>
                <p>{bookingData.passengerName}</p>
              </div>
              <div className="summary-item">
                <label>Train</label>
                <p>{bookingData.trainName}</p>
              </div>
              <div className="summary-item">
                <label>Train Number</label>
                <p>#{bookingData.trainNumber}</p>
              </div>
              <div className="summary-item">
                <label>Journey Date</label>
                <p>{bookingData.date}</p>
              </div>
              <div className="summary-item">
                <label>Source</label>
                <p>{bookingData.source}</p>
              </div>
              <div className="summary-item">
                <label>Destination</label>
                <p>{bookingData.destination}</p>
              </div>
              <div className="summary-item">
                <label>Class</label>
                <p>{bookingData.travelClass}</p>
              </div>
              <div className="summary-item">
                <label>Total Fare</label>
                <p>₹{bookingData.fare}</p>
              </div>
 main
            </div>

            <div style={{ marginTop: '2rem', display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button className="btn btn-primary" onClick={() => navigate('/my-bookings')}>
                View My Bookings
              </button>
              <button className="btn btn-outline" onClick={() => navigate('/trains')}>
                Book Another
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Booking Form View
  return (
    <main className="booking-page">
      <div className="page-header">
        <h1>🎫 Book Your Ticket</h1>
        <p>Complete your booking details for {train.name}</p>
      </div>

      <div className="container booking-container">
        {/* Train Info Card */}
        <div className="booking-card card">
          <h3>🚆 Train Information</h3>
          <div className="booking-summary">
            <div className="summary-item"><label>Train</label><p>{train.name}</p></div>
            <div className="summary-item"><label>Number</label><p>#{train.number}</p></div>
            <div className="summary-item"><label>Source</label><p>{train.source}</p></div>
            <div className="summary-item"><label>Destination</label><p>{train.destination}</p></div>
            <div className="summary-item"><label>Departure</label><p>{train.departure}</p></div>
            <div className="summary-item"><label>Arrival</label><p>{train.arrival}</p></div>
            <div className="summary-item"><label>Duration</label><p>{train.duration}</p></div>
            <div className="summary-item"><label>Base Fare (per person)</label><p>₹{train.price}</p></div>
          </div>
        </div>

HEAD
        {/* Booking Form with Validation */}
        <form onSubmit={handleProceedToPayment} noValidate>
          <div className="booking-card card">
            <h3>👤 Passenger & Contact Details</h3>
            <p style={{ color: 'var(--text-light)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              All fields are verified using standard Indian railway booking rules.
            </p>

            <div className="form-group">
              <label htmlFor="book-passengerName">Passenger Full Name *</label>
              <input
                id="book-passengerName"
                type="text"
                placeholder="e.g. Ramesh Kumar"
                value={form.passengerName}
                onChange={(e) => handleChange('passengerName', e.target.value)}
                style={{ borderColor: errors.passengerName ? 'var(--error)' : undefined }}
              />
              {errors.passengerName && <div className="form-error">{errors.passengerName}</div>}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label htmlFor="book-phone">Indian Mobile Number *</label>
                <input
                  id="book-phone"
                  type="tel"
                  placeholder="e.g. 9876543210 or +91 9876543210"
                  value={form.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  style={{ borderColor: errors.phone ? 'var(--error)' : undefined }}
                />
                {errors.phone && <div className="form-error">{errors.phone}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="book-email">Email Address *</label>
                <input
                  id="book-email"
                  type="email"
                  placeholder="e.g. ramesh@example.com"
                  value={form.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  style={{ borderColor: errors.email ? 'var(--error)' : undefined }}
                />
                {errors.email && <div className="form-error">{errors.email}</div>}
              </div>
            </div>

            {/* Journey Type Selector */}
            <div className="form-group">
              <label>Journey Type *</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '6px' }}>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '12px 14px',
                    border: form.journeyType === 'oneWay' ? '2px solid var(--secondary)' : '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)',
                    background: form.journeyType === 'oneWay' ? 'rgba(29, 112, 162, 0.08)' : 'var(--surface)',
                    cursor: 'pointer',
                    fontWeight: 600,
                    color: form.journeyType === 'oneWay' ? 'var(--primary)' : 'var(--text)',
                  }}
                >
                  <input
                    type="radio"
                    name="journeyType"
                    value="oneWay"
                    checked={form.journeyType === 'oneWay'}
                    onChange={() => handleChange('journeyType', 'oneWay')}
                  />
                  <span>➡️ One-Way Journey</span>
                </label>

                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '12px 14px',
                    border: form.journeyType === 'roundTrip' ? '2px solid var(--secondary)' : '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)',
                    background: form.journeyType === 'roundTrip' ? 'rgba(29, 112, 162, 0.08)' : 'var(--surface)',
                    cursor: 'pointer',
                    fontWeight: 600,
                    color: form.journeyType === 'roundTrip' ? 'var(--primary)' : 'var(--text)',
                  }}
                >
                  <input
                    type="radio"
                    name="journeyType"
                    value="roundTrip"
                    checked={form.journeyType === 'roundTrip'}
                    onChange={() => handleChange('journeyType', 'roundTrip')}
                  />
                  <span>🔄 Return / Round Trip (2 legs)</span>
                </label>
              </div>
            </div>

            {/* Journey Dates */}
            <div style={{ display: 'grid', gridTemplateColumns: form.journeyType === 'roundTrip' ? '1fr 1fr' : '1fr', gap: '14px' }}>
              <div className="form-group">
                <label htmlFor="book-date">Outbound Journey Date *</label>
                <input
                  id="book-date"
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={form.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                  style={{ borderColor: errors.date ? 'var(--error)' : undefined }}
                />
                {errors.date && <div className="form-error">{errors.date}</div>}
              </div>

              {form.journeyType === 'roundTrip' && (
                <div className="form-group">
                  <label htmlFor="book-returnDate">Return Journey Date *</label>
                  <input
                    id="book-returnDate"
                    type="date"
                    min={form.date || new Date().toISOString().split('T')[0]}
                    value={form.returnDate}
                    onChange={(e) => handleChange('returnDate', e.target.value)}
                    style={{ borderColor: errors.returnDate ? 'var(--error)' : undefined }}
                  />
                  {errors.returnDate && <div className="form-error">{errors.returnDate}</div>}
                </div>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label htmlFor="book-travelClass">Travel Class *</label>
                <select
                  id="book-travelClass"
                  value={form.travelClass}
                  onChange={(e) => handleChange('travelClass', e.target.value)}
                  style={{ borderColor: errors.travelClass ? 'var(--error)' : undefined }}
                >
                  <option value="">Select Class</option>
                  {train.classes.map((cls) => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </select>
                {errors.travelClass && <div className="form-error">{errors.travelClass}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="book-seatPreference">Seat / Berth Preference</label>
                <select
                  id="book-seatPreference"
                  value={form.seatPreference}
                  onChange={(e) => handleChange('seatPreference', e.target.value)}
                >
                  <option value="No Preference">No Preference</option>
                  <option value="Lower Berth">Lower Berth</option>
                  <option value="Upper Berth">Upper Berth</option>
                  <option value="Middle Berth">Middle Berth</option>
                  <option value="Side Lower">Side Lower</option>
                  <option value="Window">Window</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="book-count">Number of Passengers</label>
              <select
                id="book-count"
                value={form.passengers}
                onChange={(e) => handleChange('passengers', parseInt(e.target.value))}
              >
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n}>
                    {n} Passenger{n > 1 ? 's' : ''}
                  </option>
                ))}
              </select>

        {/* Authentication Notice Banner if not logged in */}
        {errors.auth && (
          <div
            className="card"
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              borderColor: 'var(--error, #ef4444)',
              padding: '1rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
            }}
          >
            <div>
              <strong style={{ color: 'var(--error, #ef4444)' }}>⚠️ Login Required</strong>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', marginTop: '2px' }}>
                {errors.auth}
              </p>
            </div>
            <Link to="/login" className="btn btn-primary btn-sm">
              Login Now →
            </Link>
          </div>
        )}

        {/* Booking Form */}
        <form onSubmit={handleConfirm} noValidate>
          <div className="booking-card card">
            <h3>👤 Passenger Details</h3>

            <FormInput
              ref={nameRef}
              id="book-name"
              label="Passenger Name"
              type="text"
              placeholder="e.g. Rahul Sharma"
              value={form.passengerName}
              onChange={(val) => handleChange('passengerName', val)}
              error={errors.passengerName}
              required
            />

            <FormInput
              ref={dateRef}
              id="book-date"
              label="Journey Date"
              type="date"
              value={form.date}
              onChange={(val) => handleChange('date', val)}
              error={errors.date}
              required
            />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
              <FormInput
                ref={classRef}
                id="book-class"
                label="Travel Class"
                value={form.travelClass}
                onChange={(val) => handleChange('travelClass', val)}
                error={errors.travelClass}
                required
                placeholder="Select Class"
                options={train.classes.map((cls) => ({ value: cls, label: cls }))}
              />

              <FormInput
                id="book-seat"
                label="Berth / Seat Preference"
                value={form.seatPreference}
                onChange={(val) => handleChange('seatPreference', val)}
                options={[
                  { value: 'No Preference', label: 'No Preference' },
                  { value: 'Lower Berth', label: 'Lower Berth' },
                  { value: 'Upper Berth', label: 'Upper Berth' },
                  { value: 'Window', label: 'Window' },
                ]}
              />
main
            </div>

            <FormInput
              id="book-count"
              label="Number of Passengers"
              value={form.passengers.toString()}
              onChange={(val) => handleChange('passengers', parseInt(val) || 1)}
              options={[1, 2, 3, 4, 5, 6].map((n) => ({
                value: n.toString(),
                label: `${n} Passenger${n > 1 ? 's' : ''}`,
              }))}
            />
          </div>

          {/* Food & Meal Options */}
          <div className="booking-card card">
HEAD
            <h3>🍽️ Food & Catering Options</h3>
            <p style={{ color: 'var(--text-light)', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
              Pre-book freshly prepared IRCTC catering meals. Choose breakfast, lunch, both, or neither. Meal charges are calculated per passenger.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
              {/* Breakfast Option */}
              <label
                htmlFor="meal-breakfast"
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  padding: '14px',
                  border: form.meals.breakfast ? '2px solid var(--secondary)' : '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  background: form.meals.breakfast ? 'rgba(29, 112, 162, 0.06)' : 'var(--surface)',
                  cursor: 'pointer',
                  transition: 'var(--transition)',
                }}
              >
                <input
                  id="meal-breakfast"
                  type="checkbox"
                  checked={form.meals.breakfast}
                  onChange={() => handleMealToggle('breakfast')}
                  style={{ width: '18px', height: '18px', marginTop: '2px', cursor: 'pointer' }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ color: 'var(--primary)', fontSize: '0.95rem' }}>🍳 Breakfast</strong>
                    <span style={{ fontWeight: 700, color: 'var(--secondary)' }}>₹{MEAL_PRICES.breakfast} / person</span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-light)', marginTop: '4px', margin: 0 }}>
                    Morning breakfast served with tea or coffee (veg cutlet / idli vada / poha)
                  </p>
                </div>
              </label>

              {/* Lunch Option */}
              <label
                htmlFor="meal-lunch"
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  padding: '14px',
                  border: form.meals.lunch ? '2px solid var(--secondary)' : '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  background: form.meals.lunch ? 'rgba(29, 112, 162, 0.06)' : 'var(--surface)',
                  cursor: 'pointer',
                  transition: 'var(--transition)',
                }}
              >
                <input
                  id="meal-lunch"
                  type="checkbox"
                  checked={form.meals.lunch}
                  onChange={() => handleMealToggle('lunch')}
                  style={{ width: '18px', height: '18px', marginTop: '2px', cursor: 'pointer' }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ color: 'var(--primary)', fontSize: '0.95rem' }}>🍱 Lunch / Dinner</strong>
                    <span style={{ fontWeight: 700, color: 'var(--secondary)' }}>₹{MEAL_PRICES.lunch} / person</span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-light)', marginTop: '4px', margin: 0 }}>
                    Standard North/South Indian Thali (dal, paneer/curry, rice, 3 rotis, curd, sweet)
                  </p>
                </div>
              </label>
            </div>

            <div style={{ marginTop: '14px', fontSize: '0.86rem', color: 'var(--text-muted)' }}>
              {form.meals.breakfast && form.meals.lunch ? (
                <span style={{ color: 'var(--success)', fontWeight: 600 }}>
                  ✓ Both Breakfast & Lunch selected (₹{MEAL_PRICES.breakfast + MEAL_PRICES.lunch} × {form.passengers} passenger{form.passengers > 1 ? 's' : ''} = ₹{totalMealFare})
                </span>
              ) : form.meals.breakfast ? (
                <span style={{ color: 'var(--primary)', fontWeight: 600 }}>
                  ✓ Breakfast selected (₹{MEAL_PRICES.breakfast} × {form.passengers} passenger{form.passengers > 1 ? 's' : ''} = ₹{totalMealFare})
                </span>
              ) : form.meals.lunch ? (
                <span style={{ color: 'var(--primary)', fontWeight: 600 }}>
                  ✓ Lunch selected (₹{MEAL_PRICES.lunch} × {form.passengers} passenger{form.passengers > 1 ? 's' : ''} = ₹{totalMealFare})
                </span>
              ) : (
                <span>ℹ️ No meals selected (opted out — ₹0 meal charge)</span>
              )}
            </div>
          </div>

          {/* Fare Summary & Navigation to Payment */}
          <div className="booking-card card">
            <h3>💰 Fare Summary & Taxes</h3>
            <div className="booking-summary">
              <div className="summary-item">
                <label>Journey Type</label>
                <p>{form.journeyType === 'roundTrip' ? '🔄 Round Trip (2 legs)' : '➡️ One-Way'}</p>
              </div>
              <div className="summary-item">
                <label>Base Ticket Fare</label>
                <p>
                  ₹{train.price} × {form.passengers} passenger{form.passengers > 1 ? 's' : ''}
                  {journeyMultiplier === 2 ? ' × 2 (Round Trip)' : ''} = ₹{baseFare}
                </p>
              </div>
              <div className="summary-item">
                <label>Travel Class</label>
                <p>{form.travelClass || 'Not selected'}</p>
              </div>
              <div className="summary-item">
                <label>Selected Meals</label>
                <p>{getMealsLabel(form.meals)}</p>
              </div>
              <div className="summary-item">
                <label>Meal Charges</label>
                <p>
                  {totalMealFare > 0
                    ? `₹${mealCostPerPassenger} × ${form.passengers} passenger${form.passengers > 1 ? 's' : ''}${journeyMultiplier === 2 ? ' × 2 legs' : ''} = ₹${totalMealFare}`
                    : '₹0 (None)'}
                </p>
              </div>
              <div className="summary-item">
                <label>Subtotal (Fare + Meals)</label>
                <p>₹{subtotal}</p>
              </div>
              <div className="summary-item">
                <label>GST (5% on taxable charges)</label>
                <p style={{ color: 'var(--secondary)', fontWeight: 600 }}>+ ₹{gstAmount}</p>
              </div>
            </div>


            <h3>💰 Fare Summary & Payment</h3>
            <div className="booking-summary">
              <div className="summary-item">
                <label>Base Fare</label>
                <p>₹{train.price} × {form.passengers}</p>
              </div>
              <div className="summary-item">
                <label>Class</label>
                <p>{form.travelClass || 'Not selected'}</p>
              </div>
            </div>

 main
            <div className="booking-total">
              <span className="total-label">Final Payable Total (Fare + Meals + GST)</span>
              <span className="total-amount">₹{totalFare}</span>
            </div>

HEAD

            {/* Payment Investigation Note: Requirements studied before real payment integration */}
 main
            <div
              style={{
                marginTop: '1.25rem',
                padding: '12px 14px',
 HEAD
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(29, 112, 162, 0.06)',
                border: '1px solid rgba(29, 112, 162, 0.2)',

                borderRadius: '8px',
                background: 'rgba(59, 130, 246, 0.08)',
                border: '1px solid rgba(59, 130, 246, 0.25)',
 main
                fontSize: '0.84rem',
                color: 'var(--text-light)',
              }}
            >
HEAD
              <div style={{ fontWeight: 600, color: 'var(--primary)', marginBottom: '3px' }}>
                🔒 Step 1 of 2: Passenger Details Complete
              </div>
              Clicking below validates all required fields with strict format checks and takes you to the secure payment checkout page.

              <div style={{ fontWeight: 600, color: 'var(--primary)', marginBottom: '4px' }}>
                💳 Payment Gateway Note (Simulated Demo Mode)
              </div>
              No real payments are deducted. Payment gateway requirements (webhook verification, tokenization & PCI-DSS compliance) have been investigated for future gateway integration.
main
            </div>

            <button
              type="submit"
              className="btn btn-accent"
HEAD
              style={{ width: '100%', marginTop: '1rem', padding: '14px', fontSize: '1.05rem', fontWeight: 700 }}
            >
              💳 Proceed to Payment (₹{totalFare}) ➔

              style={{ width: '100%', marginTop: '1rem', padding: '14px', fontSize: '1rem' }}
            >
              ✅ Confirm & Book Ticket (₹{totalFare})
main
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default Booking;
