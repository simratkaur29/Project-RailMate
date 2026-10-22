import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import '../styles/profile.css';

// Realistic standard catering fares (per passenger)
export const MEAL_PRICES = {
  breakfast: 120,
  lunch: 200,
};

export const GST_RATE = 0.05;

function Booking({ user }) {
  const location = useLocation();
  const navigate = useNavigate();
  const train = location.state?.train;

  const [form, setForm] = useState({
    passengerName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    journeyType: location.state?.journeyType || 'oneWay',
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

  const [errors, setErrors] = useState({});
  const [confirmed, setConfirmed] = useState(false);
  const [bookingData, setBookingData] = useState(null);

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

  // Dynamic Fare & GST Calculations
  const journeyMultiplier = form.journeyType === 'roundTrip' ? 2 : 1;
  const baseFare = train.price * form.passengers * journeyMultiplier;
  const mealCostPerPassenger =
    (form.meals.breakfast ? MEAL_PRICES.breakfast : 0) +
    (form.meals.lunch ? MEAL_PRICES.lunch : 0);
  const totalMealFare = mealCostPerPassenger * form.passengers * journeyMultiplier;
  const subtotal = baseFare + totalMealFare;
  const gstAmount = Math.round(subtotal * GST_RATE);
  const totalFare = subtotal + gstAmount;

  const handleMealToggle = (mealType) => {
    setForm((prev) => ({
      ...prev,
      meals: { ...prev.meals, [mealType]: !prev.meals[mealType] },
    }));
  };

  const getMealsLabel = (meals) => {
    if (!meals) return 'None';
    const items = [];
    if (meals.breakfast) items.push('Breakfast (₹' + MEAL_PRICES.breakfast + ')');
    if (meals.lunch) items.push('Lunch (₹' + MEAL_PRICES.lunch + ')');
    return items.length > 0 ? items.join(' + ') : 'None (No meals selected)';
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  // Validation
  const validateForm = () => {
    const newErrors = {};

    const nameRegex = /^[A-Za-z\s]{3,50}$/;
    if (!form.passengerName.trim()) {
      newErrors.passengerName = 'Passenger name is required.';
    } else if (!nameRegex.test(form.passengerName.trim())) {
      newErrors.passengerName = 'Name must contain only letters and spaces (3-50 chars).';
    }

    const phoneRegex = /^(?:(?:\+?91[\-\s]?)?[6-9]\d{9})$/;
    if (!form.phone.trim()) {
      newErrors.phone = 'Mobile phone number is required.';
    } else if (!phoneRegex.test(form.phone.trim().replace(/\s+/g, ''))) {
      newErrors.phone = 'Enter a valid 10-digit Indian phone number.';
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!form.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!emailRegex.test(form.email.trim())) {
      newErrors.email = 'Enter a valid email address.';
    }

    if (!form.date) {
      newErrors.date = 'Journey date is required.';
    } else {
      const today = new Date().toISOString().split('T')[0];
      if (form.date < today) {
        newErrors.date = 'Journey date cannot be in the past.';
      }
    }

    if (form.journeyType === 'roundTrip') {
      if (!form.returnDate) {
        newErrors.returnDate = 'Return date is required for round trips.';
      } else if (form.returnDate < form.date) {
        newErrors.returnDate = 'Return date cannot be earlier than journey date.';
      }
    }

    if (!form.travelClass) {
      newErrors.travelClass = 'Please select a travel class.';
    }

    return newErrors;
  };

  const handleConfirm = (e) => {
    e.preventDefault();

    if (!user) {
      setErrors({ auth: 'Please login or register to complete your ticket booking.' });
      return;
    }

    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      const firstKey = Object.keys(validationErrors)[0];
      const el = document.getElementById(`book-${firstKey}`);
      if (el) el.focus();
      return;
    }

    const cleanPhone = form.phone.trim().replace(/\D/g, '').slice(-10);

    const booking = {
      id: 'RM' + Date.now().toString().slice(-8),
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
      returnDate: form.journeyType === 'roundTrip' ? form.returnDate : null,
      passengerName: form.passengerName.trim(),
      email: form.email.trim(),
      phone: cleanPhone,
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
      fare: totalFare,
      status: 'Confirmed',
      bookedOn: new Date().toISOString().split('T')[0],
    };

    const existingBookings = JSON.parse(localStorage.getItem('railmate_bookings') || '[]');
    existingBookings.push(booking);
    localStorage.setItem('railmate_bookings', JSON.stringify(existingBookings));

    setBookingData(booking);
    setConfirmed(true);
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
              <div className="summary-item"><label>Passenger</label><p>{bookingData.passengerName}</p></div>
              <div className="summary-item"><label>Contact</label><p>{bookingData.phone} | {bookingData.email}</p></div>
              <div className="summary-item"><label>Train</label><p>{bookingData.trainName}</p></div>
              <div className="summary-item"><label>Train Number</label><p>#{bookingData.trainNumber}</p></div>
              <div className="summary-item"><label>Journey Date</label><p>{bookingData.date}</p></div>
              {bookingData.returnDate && (
                <div className="summary-item"><label>Return Date</label><p>{bookingData.returnDate}</p></div>
              )}
              <div className="summary-item"><label>Source</label><p>{bookingData.source}</p></div>
              <div className="summary-item"><label>Destination</label><p>{bookingData.destination}</p></div>
              <div className="summary-item"><label>Class</label><p>{bookingData.travelClass}</p></div>
              <div className="summary-item"><label>Seat Preference</label><p>{bookingData.seatPreference}</p></div>
              <div className="summary-item"><label>Base Ticket Fare</label><p>₹{bookingData.baseFare}</p></div>
              <div className="summary-item"><label>Meals Selected</label><p>{getMealsLabel(bookingData.meals)}</p></div>
              <div className="summary-item"><label>Meal Charges</label><p>₹{bookingData.mealFare || 0}</p></div>
              <div className="summary-item"><label>GST (5%)</label><p>₹{bookingData.gstAmount || 0}</p></div>
              <div className="summary-item">
                <label>Total Paid Fare</label>
                <p style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '1.1rem' }}>₹{bookingData.fare}</p>
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

  // Booking Form
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

        {/* Auth notice */}
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
            <Link to="/login" className="btn btn-primary btn-sm">Login Now →</Link>
          </div>
        )}

        <form onSubmit={handleConfirm} noValidate>
          <div className="booking-card card">
            <h3>👤 Passenger & Contact Details</h3>

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
                  placeholder="e.g. 9876543210"
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

            {/* Journey Type */}
            <div className="form-group">
              <label>Journey Type *</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '6px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px', border: form.journeyType === 'oneWay' ? '2px solid var(--secondary)' : '1px solid var(--border)', borderRadius: 'var(--radius-sm)', background: form.journeyType === 'oneWay' ? 'rgba(29, 112, 162, 0.08)' : 'var(--surface)', cursor: 'pointer', fontWeight: 600 }}>
                  <input type="radio" name="journeyType" value="oneWay" checked={form.journeyType === 'oneWay'} onChange={() => handleChange('journeyType', 'oneWay')} />
                  <span>➡️ One-Way Journey</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px', border: form.journeyType === 'roundTrip' ? '2px solid var(--secondary)' : '1px solid var(--border)', borderRadius: 'var(--radius-sm)', background: form.journeyType === 'roundTrip' ? 'rgba(29, 112, 162, 0.08)' : 'var(--surface)', cursor: 'pointer', fontWeight: 600 }}>
                  <input type="radio" name="journeyType" value="roundTrip" checked={form.journeyType === 'roundTrip'} onChange={() => handleChange('journeyType', 'roundTrip')} />
                  <span>🔄 Round Trip</span>
                </label>
              </div>
            </div>

            {/* Dates */}
            <div style={{ display: 'grid', gridTemplateColumns: form.journeyType === 'roundTrip' ? '1fr 1fr' : '1fr', gap: '14px' }}>
              <div className="form-group">
                <label htmlFor="book-date">Journey Date *</label>
                <input id="book-date" type="date" min={new Date().toISOString().split('T')[0]} value={form.date} onChange={(e) => handleChange('date', e.target.value)} style={{ borderColor: errors.date ? 'var(--error)' : undefined }} />
                {errors.date && <div className="form-error">{errors.date}</div>}
              </div>
              {form.journeyType === 'roundTrip' && (
                <div className="form-group">
                  <label htmlFor="book-returnDate">Return Date *</label>
                  <input id="book-returnDate" type="date" min={form.date || new Date().toISOString().split('T')[0]} value={form.returnDate} onChange={(e) => handleChange('returnDate', e.target.value)} style={{ borderColor: errors.returnDate ? 'var(--error)' : undefined }} />
                  {errors.returnDate && <div className="form-error">{errors.returnDate}</div>}
                </div>
              )}
            </div>

            {/* Class & Seat */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label htmlFor="book-travelClass">Travel Class *</label>
                <select id="book-travelClass" value={form.travelClass} onChange={(e) => handleChange('travelClass', e.target.value)} style={{ borderColor: errors.travelClass ? 'var(--error)' : undefined }}>
                  <option value="">Select Class</option>
                  {train.classes.map((cls) => (<option key={cls} value={cls}>{cls}</option>))}
                </select>
                {errors.travelClass && <div className="form-error">{errors.travelClass}</div>}
              </div>
              <div className="form-group">
                <label htmlFor="book-seatPreference">Seat / Berth Preference</label>
                <select id="book-seatPreference" value={form.seatPreference} onChange={(e) => handleChange('seatPreference', e.target.value)}>
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
              <select id="book-count" value={form.passengers} onChange={(e) => handleChange('passengers', parseInt(e.target.value))}>
                {[1, 2, 3, 4, 5, 6].map((n) => (<option key={n} value={n}>{n} Passenger{n > 1 ? 's' : ''}</option>))}
              </select>
            </div>
          </div>

          {/* Meals */}
          <div className="booking-card card">
            <h3>🍽️ Food & Catering Options</h3>
            <p style={{ color: 'var(--text-light)', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
              Pre-book IRCTC catering meals. Charges calculated per passenger.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
              <label htmlFor="meal-breakfast" style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '14px', border: form.meals.breakfast ? '2px solid var(--secondary)' : '1px solid var(--border)', borderRadius: 'var(--radius-sm)', background: form.meals.breakfast ? 'rgba(29, 112, 162, 0.06)' : 'var(--surface)', cursor: 'pointer' }}>
                <input id="meal-breakfast" type="checkbox" checked={form.meals.breakfast} onChange={() => handleMealToggle('breakfast')} style={{ width: '18px', height: '18px', marginTop: '2px' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <strong style={{ color: 'var(--primary)' }}>🍳 Breakfast</strong>
                    <span style={{ fontWeight: 700, color: 'var(--secondary)' }}>₹{MEAL_PRICES.breakfast}/person</span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-light)', margin: 0 }}>Veg cutlet / idli vada / poha with tea</p>
                </div>
              </label>
              <label htmlFor="meal-lunch" style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '14px', border: form.meals.lunch ? '2px solid var(--secondary)' : '1px solid var(--border)', borderRadius: 'var(--radius-sm)', background: form.meals.lunch ? 'rgba(29, 112, 162, 0.06)' : 'var(--surface)', cursor: 'pointer' }}>
                <input id="meal-lunch" type="checkbox" checked={form.meals.lunch} onChange={() => handleMealToggle('lunch')} style={{ width: '18px', height: '18px', marginTop: '2px' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <strong style={{ color: 'var(--primary)' }}>🍱 Lunch / Dinner</strong>
                    <span style={{ fontWeight: 700, color: 'var(--secondary)' }}>₹{MEAL_PRICES.lunch}/person</span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-light)', margin: 0 }}>North/South Indian Thali</p>
                </div>
              </label>
            </div>
            <div style={{ marginTop: '14px', fontSize: '0.86rem' }}>
              {form.meals.breakfast && form.meals.lunch ? (
                <span style={{ color: 'var(--success)', fontWeight: 600 }}>✓ Both selected = ₹{totalMealFare}</span>
              ) : form.meals.breakfast ? (
                <span style={{ color: 'var(--primary)', fontWeight: 600 }}>✓ Breakfast = ₹{totalMealFare}</span>
              ) : form.meals.lunch ? (
                <span style={{ color: 'var(--primary)', fontWeight: 600 }}>✓ Lunch = ₹{totalMealFare}</span>
              ) : (
                <span style={{ color: 'var(--text-muted)' }}>ℹ️ No meals selected</span>
              )}
            </div>
          </div>

          {/* Fare Summary */}
          <div className="booking-card card">
            <h3>💰 Fare Summary & Taxes</h3>
            <div className="booking-summary">
              <div className="summary-item"><label>Journey Type</label><p>{form.journeyType === 'roundTrip' ? '🔄 Round Trip' : '➡️ One-Way'}</p></div>
              <div className="summary-item"><label>Base Fare</label><p>₹{train.price} × {form.passengers}{journeyMultiplier === 2 ? ' × 2' : ''} = ₹{baseFare}</p></div>
              <div className="summary-item"><label>Class</label><p>{form.travelClass || 'Not selected'}</p></div>
              <div className="summary-item"><label>Meals</label><p>{getMealsLabel(form.meals)}</p></div>
              <div className="summary-item"><label>Meal Charges</label><p>{totalMealFare > 0 ? `₹${totalMealFare}` : '₹0'}</p></div>
              <div className="summary-item"><label>Subtotal</label><p>₹{subtotal}</p></div>
              <div className="summary-item"><label>GST (5%)</label><p style={{ color: 'var(--secondary)', fontWeight: 600 }}>+ ₹{gstAmount}</p></div>
            </div>

            <div className="booking-total">
              <span className="total-label">Total Payable</span>
              <span className="total-amount">₹{totalFare}</span>
            </div>

            <div style={{ marginTop: '1.25rem', padding: '12px 14px', borderRadius: 'var(--radius-sm)', background: 'rgba(29, 112, 162, 0.06)', border: '1px solid rgba(29, 112, 162, 0.2)', fontSize: '0.84rem', color: 'var(--text-light)' }}>
              <div style={{ fontWeight: 600, color: 'var(--primary)', marginBottom: '3px' }}>💳 Simulated Demo Mode</div>
              No real payments are deducted. Booking is confirmed instantly.
            </div>

            <button type="submit" className="btn btn-accent" style={{ width: '100%', marginTop: '1rem', padding: '14px', fontSize: '1.05rem', fontWeight: 700 }}>
              ✅ Confirm & Book Ticket (₹{totalFare})
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default Booking;
