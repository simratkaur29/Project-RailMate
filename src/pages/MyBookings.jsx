import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../store/userSlice';
import '../styles/profile.css';

function MyBookings() {
  const navigate = useNavigate();
  const user = useSelector(selectUser);
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
        <p>View and manage your one-way and round-trip train bookings</p>
      </div>

      <div className="container">
        <div className="bookings-list">
          {bookings.length === 0 ? (
            <div className="empty-state">
              <div className="icon">🎫</div>
              <h3>No bookings yet</h3>
              <p>Search for trains across India and book your journey! </p>
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
              const hasMultiplePassengers = Array.isArray(booking.passengers) && booking.passengers.length > 0;

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

HEAD
                <div className="booking-item-details">
                  <div className="detail"><label>Booking ID</label><p>{booking.id}</p></div>
                  {booking.pnr && (
                    <div className="detail"><label>PNR</label><p style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--secondary)' }}>{booking.pnr}</p></div>
                  )}
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
 HEAD
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

                  <div className="detail"><label>Platform</label><p>PF {booking.departurePlatform || '1'} (Sample)</p></div>
                  <div className="detail"><label>Fare</label><p>₹{booking.fare}</p></div>
 member2-trains
                </div>

                <div className="booking-item-footer">
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    Booked on: {booking.bookedOn} {booking.paymentMethod ? `• via ${booking.paymentMethod}` : ''}
                  </span>
                  {booking.status === 'Confirmed' && (
                    <button className="btn btn-danger btn-sm" onClick={() => handleCancel(booking.id)}>
                      Cancel Booking
                    </button>

                  {/* Onward Journey Details */}
                  <div className="booking-item-details">
                    <div className="detail"><label>Booking ID</label><p>{booking.id}</p></div>
                    <div className="detail"><label>Onward Route</label><p>{booking.source} → {booking.destination}</p></div>
                    <div className="detail"><label>Onward Date</label><p>{booking.date}</p></div>
                    <div className="detail"><label>Onward Platform</label><p>PF {booking.departurePlatform || '1'} (Sample)</p></div>
                    <div className="detail"><label>Class</label><p>{booking.travelClass}</p></div>
                    <div className="detail"><label>Total Fare</label><p>₹{booking.fare}</p></div>
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
                          <label>Return Platform</label>
                          <p>PF {booking.returnTrain.departurePlatform || '1'} (Sample)</p>
                        </div>
                        <div className="detail">
                          <label>Timings</label>
                          <p>{booking.returnTrain.departure} → {booking.returnTrain.arrival}</p>
                        </div>
                      </div>
                    </div>
member2-trains
                  )}

                  {/* Passenger Details Breakdown */}
                  <div
                    style={{
                      marginTop: '12px',
                      padding: '10px 14px',
                      background: 'var(--background)',
                      borderRadius: '6px',
                      border: '1px solid var(--border)',
                    }}
                  >
                    <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                      👥 Passenger Details ({hasMultiplePassengers ? booking.passengers.length : 1} Passenger{hasMultiplePassengers && booking.passengers.length > 1 ? 's' : ''})
                    </label>

                    {hasMultiplePassengers ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {booking.passengers.map((p, idx) => (
                          <div
                            key={idx}
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              fontSize: '0.88rem',
                              padding: '4px 0',
                              borderBottom: idx !== booking.passengers.length - 1 ? '1px dashed var(--border)' : 'none',
                            }}
                          >
                            <div>
                              <strong>#{idx + 1} {p.name}</strong>
                              <span style={{ color: 'var(--text-light)', marginLeft: '8px', fontSize: '0.82rem' }}>
                                ({p.age} yrs, {p.gender})
                              </span>
                            </div>
                            <span style={{ fontSize: '0.82rem', color: 'var(--primary)', fontWeight: 500 }}>
                              Berth: {p.berthPreference || 'No Preference'}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p style={{ margin: 0, fontSize: '0.92rem', fontWeight: 500 }}>
                        {booking.passengerName} {booking.seatPreference ? `• Berth: ${booking.seatPreference}` : ''}
                      </p>
                    )}
                  </div>

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
