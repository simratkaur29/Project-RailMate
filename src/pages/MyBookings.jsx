import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/profile.css';

function MyBookings({ user }) {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    const saved = JSON.parse(localStorage.getItem('railmate_bookings') || '[]');
    setBookings(saved);
  }, [user, navigate]);

  const handleCancel = (bookingId) => {
    const updated = bookings.map((b) =>
      b.id === bookingId ? { ...b, status: 'Cancelled' } : b
    );
    setBookings(updated);
    localStorage.setItem('railmate_bookings', JSON.stringify(updated));
  };

  if (!user) return null;

  return (
    <main className="bookings-page">
      <div className="page-header">
        <h1>🎫 My Bookings</h1>
        <p>View and manage your train bookings</p>
      </div>

      <div className="container">
        <div className="bookings-list">
          {bookings.length === 0 ? (
            <div className="empty-state">
              <div className="icon">🎫</div>
              <h3>No bookings yet</h3>
              <p>Search for trains and book your first ticket!</p>
              <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => navigate('/trains')}>
                Search Trains
              </button>
            </div>
          ) : (
            bookings.map((booking) => (
              <div key={booking.id} className="booking-item card">
                <div className="booking-item-header">
                  <div>
                    <div className="booking-train">{booking.trainName}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>#{booking.trainNumber}</div>
                  </div>
                  <span className={`badge ${booking.status === 'Confirmed' ? 'badge-success' : 'badge-error'}`}>
                    {booking.status}
                  </span>
                </div>

                <div className="booking-item-details">
                  <div className="detail"><label>Booking ID</label><p>{booking.id}</p></div>
                  <div className="detail"><label>Source</label><p>{booking.source}</p></div>
                  <div className="detail"><label>Destination</label><p>{booking.destination}</p></div>
                  <div className="detail"><label>Date</label><p>{booking.date}</p></div>
                  <div className="detail"><label>Passenger</label><p>{booking.passengerName}</p></div>
                  <div className="detail"><label>Class</label><p>{booking.travelClass}</p></div>
                  <div className="detail"><label>Fare</label><p>₹{booking.fare}</p></div>
                </div>

                <div className="booking-item-footer">
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Booked on: {booking.bookedOn}</span>
                  {booking.status === 'Confirmed' && (
                    <button className="btn btn-danger btn-sm" onClick={() => handleCancel(booking.id)}>
                      Cancel Booking
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}

export default MyBookings;
