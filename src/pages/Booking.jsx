import { useState, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import FormInput from '../components/FormInput';
import '../styles/profile.css';

function Booking({ user }) {
  const location = useLocation();
  const navigate = useNavigate();
  const train = location.state?.train;

  const [form, setForm] = useState({
    passengerName: user?.name || '',
    date: '',
    travelClass: '',
    seatPreference: 'No Preference',
    passengers: 1,
  });

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

  const totalFare = train.price * form.passengers;

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
    }

    // 3. Login requirement check with non-blocking feedback
    if (!user) {
      setErrors({ auth: 'Please login or register to complete your ticket booking.' });
      return;
    }

    // 4. Create confirmed booking
    const booking = {
      id: 'RM' + Date.now().toString().slice(-8),
      trainName: train.name,
      trainNumber: train.number,
      source: train.source,
      destination: train.destination,
      date: form.date,
      passengerName: form.passengerName.trim(),
      travelClass: form.travelClass,
      seatPreference: form.seatPreference,
      passengers: form.passengers,
      fare: totalFare,
      status: 'Confirmed',
      bookedOn: new Date().toISOString().split('T')[0],
    };

    // Save to localStorage
    const existingBookings = JSON.parse(localStorage.getItem('railmate_bookings') || '[]');
    existingBookings.push(booking);
    localStorage.setItem('railmate_bookings', JSON.stringify(existingBookings));

    setBookingData(booking);
    setConfirmed(true);
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
        <p>Complete your booking for {train.name}</p>
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
            <div className="summary-item"><label>Price (per person)</label><p>₹{train.price}</p></div>
          </div>
        </div>

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

          <div className="booking-card card">
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

            <div className="booking-total">
              <span className="total-label">Total Fare</span>
              <span className="total-amount">₹{totalFare}</span>
            </div>

            {/* Payment Investigation Note: Requirements studied before real payment integration */}
            <div
              style={{
                marginTop: '1.25rem',
                padding: '12px 14px',
                borderRadius: '8px',
                background: 'rgba(59, 130, 246, 0.08)',
                border: '1px solid rgba(59, 130, 246, 0.25)',
                fontSize: '0.84rem',
                color: 'var(--text-light)',
              }}
            >
              <div style={{ fontWeight: 600, color: 'var(--primary)', marginBottom: '4px' }}>
                💳 Payment Gateway Note (Simulated Demo Mode)
              </div>
              No real payments are deducted. Payment gateway requirements (webhook verification, tokenization & PCI-DSS compliance) have been investigated for future gateway integration.
            </div>

            <button
              type="submit"
              className="btn btn-accent"
              style={{ width: '100%', marginTop: '1rem', padding: '14px', fontSize: '1rem' }}
            >
              ✅ Confirm & Book Ticket (₹{totalFare})
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default Booking;
