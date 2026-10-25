import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../store/userSlice';
import '../styles/profile.css';

function MyBookings({ user: propUser }) {
  const navigate = useNavigate();
  const reduxUser = useSelector(selectUser);
  const user = propUser !== undefined ? propUser : reduxUser;
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    const saved = JSON.parse(localStorage.getItem('railmate_bookings') || '[]');
    const userBookings = saved.filter(
      (b) => !b.userEmail || b.userEmail === user.email || b.email === user.email
    );
    setBookings(userBookings);
  }, [user, navigate]);

  const handleCancel = (bookingId) => {
    const allSaved = JSON.parse(localStorage.getItem('railmate_bookings') || '[]');
    const updated = allSaved.map((b) =>
      b.id === bookingId ? { ...b, status: 'Cancelled' } : b
    );
    localStorage.setItem('railmate_bookings', JSON.stringify(updated));
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'Cancelled' } : b))
    );
  };

  if (!user) return null;

  return (
    <main className="bookings-page">
      <div className="page-header">
        <h1>🎫 My Bookings</h1>
        <p>View and manage your one-way and round-trip train bookings</p>
      </div>

      <div className="container">
        <div className="bookings-list">
          {bookings.length === 0 ? (
            <div className="empty-state">
              <div className="icon">🎫</div>
              <h3>No bookings yet</h3>
              <p>Search for trains across India and book your journey!</p>
              <button
                className="btn btn-primary"
                style={{ marginTop: '1rem' }}
                onClick={() => navigate('/trains')}
              >
                Search Trains
              </button>
            </div>
          ) : (
            bookings.map((booking) => {
              const isRound = booking.tripType === 'roundTrip' && booking.returnTrain;

              return (
                <div key={booking.id} className="booking-item card">
                  <div className="booking-item-header">
                    <div>
                      <div className="booking-train">{booking.trainName}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        Train #{booking.trainNumber}
                        {isRound && (
                          <span style={{ marginLeft: '8px', color: 'var(--secondary)' }}>
                            • Return: {booking.returnTrain.trainName} (#{booking.returnTrain.trainNumber})
                          </span>
                        )}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span className={`badge ${isRound ? 'badge-accent' : 'badge-primary'}`}>
                        {isRound ? '🔄 Round Trip' : '➡️ One Way'}
                      </span>
                      <span className={`badge ${booking.status === 'Confirmed' ? 'badge-success' : 'badge-error'}`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>

                  {/* Booking Details */}
                  <div className="booking-item-details">
                    <div className="detail"><label>Booking ID</label><p>{booking.id}</p></div>
                    <div className="detail"><label>Source</label><p>{booking.source}</p></div>
                    <div className="detail"><label>Destination</label><p>{booking.destination}</p></div>
                    <div className="detail">
                      <label>Journey Type</label>
                      <p>{booking.journeyType === 'roundTrip' ? '🔄 Round Trip' : '➡️ One-Way'}</p>
                    </div>
                    <div className="detail">
                      <label>Date</label>
                      <p>
                        {booking.date}
                        {booking.returnDate ? ` (Return: ${booking.returnDate})` : ''}
                      </p>
                    </div>
                    <div className="detail"><label>Passenger</label><p>{booking.passengerName}</p></div>
                    <div className="detail"><label>Class</label><p>{booking.travelClass}</p></div>
                    {booking.baseFare && (
                      <div className="detail"><label>Base Fare</label><p>₹{booking.baseFare}</p></div>
                    )}
                    <div className="detail">
                      <label>Meals</label>
                      <p>
                        {booking.meals
                          ? [
                              booking.meals.breakfast ? 'Breakfast' : null,
                              booking.meals.lunch ? 'Lunch' : null,
                            ].filter(Boolean).join(', ') || 'None'
                          : 'None'}
                        {booking.mealFare > 0 ? ` (₹${booking.mealFare})` : ''}
                      </p>
                    </div>
                    {booking.gstAmount ? (
                      <div className="detail"><label>GST (5%)</label><p style={{ color: 'var(--secondary)' }}>+ ₹{booking.gstAmount}</p></div>
                    ) : null}
                    <div className="detail"><label>Total Paid</label><p style={{ fontWeight: 700, color: 'var(--primary)' }}>₹{booking.fare}</p></div>
                  </div>

                  {/* Return Journey Details (if Round Trip) */}
                  {isRound && (
                    <div
                      style={{
                        marginTop: '12px',
                        padding: '10px 14px',
                        borderRadius: '6px',
                        background: 'rgba(29, 112, 162, 0.05)',
                        border: '1px solid rgba(29, 112, 162, 0.15)',
                      }}
                    >
                      <div style={{ fontWeight: 600, color: 'var(--secondary)', fontSize: '0.88rem', marginBottom: '8px' }}>
                        🔄 Return Journey Details
                      </div>
                      <div className="booking-item-details">
                        <div className="detail">
                          <label>Return Train</label>
                          <p>{booking.returnTrain.trainName} (#{booking.returnTrain.trainNumber})</p>
                        </div>
                        <div className="detail">
                          <label>Return Route</label>
                          <p>{booking.returnTrain.source} → {booking.returnTrain.destination}</p>
                        </div>
                        <div className="detail">
                          <label>Return Date</label>
                          <p>{booking.returnDate || booking.returnTrain.date}</p>
                        </div>
                        <div className="detail">
                          <label>Timings</label>
                          <p>{booking.returnTrain.departure} → {booking.returnTrain.arrival}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="booking-item-footer">
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      Booked on: {booking.bookedOn}
                    </span>
                    {booking.status === 'Confirmed' && (
                      <button className="btn btn-danger btn-sm" onClick={() => handleCancel(booking.id)}>
                        Cancel Booking
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </main>
  );
}

export default MyBookings;
