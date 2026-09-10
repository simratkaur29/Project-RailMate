import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
            <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => navigate('/trains')}>
              Search Trains
            </button>
          </div>
        </div>
      </main>
    );
  }

  const totalFare = train.price * form.passengers;

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
              <div className="summary-item"><label>Total Fare</label><p>₹{bookingData.fare}</p></div>
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

          <div className="booking-card card">
            <h3>💰 Fare Summary</h3>
            <div className="booking-summary">
              <div className="summary-item"><label>Base Fare</label><p>₹{train.price} × {form.passengers}</p></div>
              <div className="summary-item"><label>Class</label><p>{form.travelClass || 'Not selected'}</p></div>
            </div>
            <div className="booking-total">
              <span className="total-label">Total Fare</span>
              <span className="total-amount">₹{totalFare}</span>
            </div>
            <button type="submit" className="btn btn-accent" style={{ width: '100%', marginTop: '1rem', padding: '14px' }}>
              ✅ Confirm Booking
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default Booking;
