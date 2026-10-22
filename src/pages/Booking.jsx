import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/profile.css';

// Realistic standard catering fares (per passenger)
export const MEAL_PRICES = {
  breakfast: 120, // ₹120 per passenger
  lunch: 200,     // ₹200 per passenger
};

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
    meals: {
      breakfast: false,
      lunch: false,
    },
  });
  const [confirmed, setConfirmed] = useState(false);
  const [bookingData, setBookingData] = useState(null);

  if (!train) {
    return (
      <main className="booking-page">
        <div className="page-header">
          <h1>🎫 Book Your Ticket</h1>
          <p>Select a train first to proceed with booking</p>
        </div>
        <div className="container">
          <div className="empty-state">
            <div className="icon">🚆</div>
            <h3>No train selected</h3>
            <p>Please search for a train and click "Book Now" to proceed.</p>
            <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => navigate('/trains')}>
              Search Trains
            </button>
          </div>
        </div>
      </main>
    );
  }

  // Dynamic Fare Calculations
  const baseFare = train.price * form.passengers;
  const mealCostPerPassenger =
    (form.meals.breakfast ? MEAL_PRICES.breakfast : 0) +
    (form.meals.lunch ? MEAL_PRICES.lunch : 0);
  const totalMealFare = mealCostPerPassenger * form.passengers;
  const totalFare = baseFare + totalMealFare;

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

  const handleConfirm = (e) => {
    e.preventDefault();

    if (!form.passengerName.trim() || !form.date || !form.travelClass) {
      alert('Please fill in all required fields.');
      return;
    }

    if (!user) {
      alert('Please login to book tickets.');
      navigate('/login');
      return;
    }

    const booking = {
      id: 'RM' + Date.now().toString().slice(-8),
      trainName: train.name,
      trainNumber: train.number,
      source: train.source,
      destination: train.destination,
      date: form.date,
      passengerName: form.passengerName,
      travelClass: form.travelClass,
      seatPreference: form.seatPreference,
      passengers: form.passengers,
      baseFare,
      meals: {
        breakfast: form.meals.breakfast,
        lunch: form.meals.lunch,
      },
      mealFare: totalMealFare,
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
            <p style={{ color: 'var(--text-light)', marginBottom: '1rem' }}>Your train ticket has been booked. Have a safe journey!</p>
            <div className="booking-id">Booking ID: {bookingData.id}</div>

            <div className="booking-summary" style={{ textAlign: 'left', marginTop: '1.5rem' }}>
              <div className="summary-item"><label>Passenger</label><p>{bookingData.passengerName}</p></div>
              <div className="summary-item"><label>Train</label><p>{bookingData.trainName}</p></div>
              <div className="summary-item"><label>Train Number</label><p>#{bookingData.trainNumber}</p></div>
              <div className="summary-item"><label>Journey Date</label><p>{bookingData.date}</p></div>
              <div className="summary-item"><label>Source</label><p>{bookingData.source}</p></div>
              <div className="summary-item"><label>Destination</label><p>{bookingData.destination}</p></div>
              <div className="summary-item"><label>Class</label><p>{bookingData.travelClass}</p></div>
              <div className="summary-item"><label>Seat Preference</label><p>{bookingData.seatPreference}</p></div>
              <div className="summary-item"><label>Base Ticket Fare</label><p>₹{bookingData.baseFare || (train.price * bookingData.passengers)}</p></div>
              <div className="summary-item"><label>Meals Selected</label><p>{getMealsLabel(bookingData.meals)}</p></div>
              <div className="summary-item"><label>Meal Charges</label><p>₹{bookingData.mealFare || 0}</p></div>
              <div className="summary-item"><label>Total Paid Fare</label><p style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '1.1rem' }}>₹{bookingData.fare}</p></div>
            </div>

            <div style={{ marginTop: '2rem', display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button className="btn btn-primary" onClick={() => navigate('/my-bookings')}>View My Bookings</button>
              <button className="btn btn-outline" onClick={() => navigate('/trains')}>Book Another</button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="booking-page">
      <div className="page-header">
        <h1>🎫 Book Your Ticket</h1>
        <p>Complete your booking for {train.name}</p>
      </div>

      <div className="container booking-container">
        {/* Train Info */}
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

        {/* Booking Form */}
        <form onSubmit={handleConfirm}>
          <div className="booking-card card">
            <h3>👤 Passenger Details</h3>
            <div className="form-group">
              <label htmlFor="book-name">Passenger Name</label>
              <input id="book-name" type="text" value={form.passengerName} onChange={(e) => setForm({ ...form, passengerName: e.target.value })} required />
            </div>
            <div className="form-group">
              <label htmlFor="book-date">Journey Date</label>
              <input id="book-date" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label htmlFor="book-class">Class</label>
                <select id="book-class" value={form.travelClass} onChange={(e) => setForm({ ...form, travelClass: e.target.value })} required>
                  <option value="">Select Class</option>
                  {train.classes.map((cls) => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="book-seat">Seat Preference</label>
                <select id="book-seat" value={form.seatPreference} onChange={(e) => setForm({ ...form, seatPreference: e.target.value })}>
                  <option>No Preference</option>
                  <option>Lower Berth</option>
                  <option>Upper Berth</option>
                  <option>Window</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="book-count">Number of Passengers</label>
              <select id="book-count" value={form.passengers} onChange={(e) => setForm({ ...form, passengers: parseInt(e.target.value) })}>
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Food & Meal Options */}
          <div className="booking-card card">
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

          <div className="booking-card card">
            <h3>💰 Fare Summary & Payment</h3>
            <div className="booking-summary">
              <div className="summary-item">
                <label>Base Ticket Fare</label>
                <p>₹{train.price} × {form.passengers} = ₹{baseFare}</p>
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
                    ? `₹${mealCostPerPassenger} × ${form.passengers} = ₹${totalMealFare}`
                    : '₹0 (None)'}
                </p>
              </div>
            </div>

            <div className="booking-total">
              <span className="total-label">Total Fare (Tickets + Meals)</span>
              <span className="total-amount">₹{totalFare}</span>
            </div>

            <div
              style={{
                marginTop: '1.25rem',
                padding: '12px 14px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(29, 112, 162, 0.06)',
                border: '1px solid rgba(29, 112, 162, 0.2)',
                fontSize: '0.84rem',
                color: 'var(--text-light)',
              }}
            >
              <div style={{ fontWeight: 600, color: 'var(--primary)', marginBottom: '3px' }}>
                💳 Payment Simulation
              </div>
              Instant mock checkout. All ticket fares, catering additions, and passenger details are validated and saved securely upon confirmation.
            </div>

            <button type="submit" className="btn btn-accent" style={{ width: '100%', marginTop: '1rem', padding: '14px', fontSize: '1rem' }}>
              ✅ Confirm & Pay ₹{totalFare}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default Booking;
