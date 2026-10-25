import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../store/userSlice';
import '../styles/profile.css';

function MyTrips({ user: propUser }) {
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
    // Filter trips for the logged-in user
    const userTrips = saved.filter(
      (b) => !b.userEmail || b.userEmail === user.email || b.email === user.email
    );
    setBookings(userTrips);
  }, [user, navigate]);

  if (!user) return null;

  const upcomingTrips = bookings.filter((b) => {
    if (b.status === 'Cancelled') return false;
    const tripDate = new Date(b.date);
    return tripDate >= new Date(new Date().toDateString());
  });

  const pastTrips = bookings.filter((b) => {
    const tripDate = new Date(b.date);
    return tripDate < new Date(new Date().toDateString()) || b.status === 'Cancelled';
  });

  return (
    <main className="trips-page">
      <div className="page-header">
        <h1>🗺️ My Trips</h1>
        <p>Track your upcoming and past railway journeys</p>
      </div>

      <div className="container">
        {/* Upcoming Trips */}
        <h2 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>🚆 Upcoming Trips</h2>
        <div className="bookings-list">
          {upcomingTrips.length === 0 ? (
            <div className="empty-state">
              <div className="icon">🗺️</div>
              <h3>No upcoming trips</h3>
              <p>Book a train to see your upcoming journeys here.</p>
              <button
                className="btn btn-primary"
                style={{ marginTop: '1rem' }}
                onClick={() => navigate('/trains')}
              >
                Search Trains
              </button>
            </div>
          ) : (
            upcomingTrips.map((trip) => (
              <div key={trip.id} className="booking-item card">
                <div className="booking-item-header">
                  <div>
                    <div className="booking-train">{trip.trainName}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      #{trip.trainNumber}
                    </div>
                  </div>
                  <span className="badge badge-success">Upcoming</span>
                </div>
                <div className="booking-item-details">
                  <div className="detail">
                    <label>From</label>
                    <p>{trip.source}</p>
                  </div>
                  <div className="detail">
                    <label>To</label>
                    <p>{trip.destination}</p>
                  </div>
                  <div className="detail">
                    <label>Date</label>
                    <p>{trip.date}</p>
                  </div>
                  <div className="detail">
                    <label>Class</label>
                    <p>{trip.travelClass}</p>
                  </div>
                  <div className="detail">
                    <label>Passenger</label>
                    <p>{trip.passengerName}</p>
                  </div>
                  <div className="detail">
                    <label>Fare</label>
                    <p>₹{trip.fare}</p>
                  </div>
                </div>
                <div className="booking-item-footer">
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    Booking ID: {trip.id}
                  </span>
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => navigate(`/destination/${trip.destination.toLowerCase()}`)}
                  >
                    📍 Destination Guide
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Past Trips */}
        <h2 style={{ color: 'var(--text-light)', margin: '2rem 0 1rem' }}>📜 Past Trips</h2>
        <div className="bookings-list">
          {pastTrips.length === 0 ? (
            <div className="empty-state">
              <div className="icon">📜</div>
              <p style={{ color: 'var(--text-muted)' }}>No past trips to show.</p>
            </div>
          ) : (
            pastTrips.map((trip) => (
              <div key={trip.id} className="booking-item card" style={{ opacity: 0.75 }}>
                <div className="booking-item-header">
                  <div>
                    <div className="booking-train">{trip.trainName}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      #{trip.trainNumber}
                    </div>
                  </div>
                  <span className={`badge ${trip.status === 'Cancelled' ? 'badge-error' : 'badge-success'}`}>
                    {trip.status === 'Cancelled' ? 'Cancelled' : 'Completed'}
                  </span>
                </div>
                <div className="booking-item-details">
                  <div className="detail">
                    <label>Route</label>
                    <p>{trip.source} → {trip.destination}</p>
                  </div>
                  <div className="detail">
                    <label>Date</label>
                    <p>{trip.date}</p>
                  </div>
                  <div className="detail">
                    <label>Fare</label>
                    <p>₹{trip.fare}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}

export default MyTrips;
