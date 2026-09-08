import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import TrainCard from '../components/TrainCard';
import ReviewCard from '../components/ReviewCard';
import trains from '../data/trains';
import reviewsData from '../data/reviews';
import tips from '../data/tips';
import '../styles/home.css';

function Home() {
  const navigate = useNavigate();
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    navigate('/trains', { state: { source, destination, date } });
  };

  const featuredTrains = trains.slice(0, 3);
  const previewTips = tips.beforeJourney.slice(0, 4);
  const previewReviews = reviewsData.slice(0, 3);

  return (
    <main>
      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-content">
          <h1>Your Smart <span className="accent">Railway</span> Travel Companion</h1>
          <p>Search trains, explore stations, get travel tips, and plan your perfect railway journey with RAILMATE.</p>

          <div className="search-form-container">
            <form className="search-form" onSubmit={handleSearch}>
              <div className="form-group">
                <label htmlFor="hero-source">From Station</label>
                <input
                  id="hero-source"
                  type="text"
                  placeholder="e.g. New Delhi"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="hero-dest">To Station</label>
                <input
                  id="hero-dest"
                  type="text"
                  placeholder="e.g. Mumbai"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="hero-date">Journey Date</label>
                <input
                  id="hero-date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-accent">🔍 Search Trains</button>
            </form>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title" style={{ textAlign: 'center' }}>Why Choose RAILMATE?</h2>
          <p className="section-subtitle" style={{ textAlign: 'center' }}>Everything you need for a smooth railway journey</p>

          <div className="features-grid">
            <div className="feature-card card">
              <div className="icon">🔍</div>
              <h3>Smart Train Search</h3>
              <p>Find the best trains between any two stations with real-time availability and pricing.</p>
            </div>
            <div className="feature-card card">
              <div className="icon">🗺️</div>
              <h3>Station Guide</h3>
              <p>Explore station facilities, platforms, nearby transport, and useful tips for every major station.</p>
            </div>
            <div className="feature-card card">
              <div className="icon">🤖</div>
              <h3>Smart Assistant</h3>
              <p>Get instant travel recommendations, packing checklists, and railway safety tips.</p>
            </div>
            <div className="feature-card card">
              <div className="icon">👥</div>
              <h3>Community</h3>
              <p>Join fellow travelers, share reviews, read tips, and stay updated with railway announcements.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Trains */}
      <section className="featured-section">
        <div className="container">
          <h2 className="section-title">Featured Trains</h2>
          <p className="section-subtitle">Popular trains across India</p>

          <div className="featured-grid">
            {featuredTrains.map((train) => (
              <TrainCard key={train.id} train={train} />
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link to="/trains" className="btn btn-primary">View All Trains →</Link>
          </div>
        </div>
      </section>

      {/* Travel Tips Preview */}
      <section className="tips-preview">
        <div className="container">
          <h2 className="section-title">Travel Tips</h2>
          <p className="section-subtitle">Essential tips for a comfortable railway journey</p>

          <div className="tips-grid">
            {previewTips.map((tip) => (
              <div key={tip.id} className="tip-preview-card card">
                <span className="icon">{tip.icon}</span>
                <div>
                  <h4>{tip.title}</h4>
                  <p>{tip.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link to="/tips" className="btn btn-outline">More Railway Tips →</Link>
          </div>
        </div>
      </section>

      {/* Community Preview */}
      <section className="community-preview">
        <div className="container">
          <h2 className="section-title">Traveler Reviews</h2>
          <p className="section-subtitle">What fellow travelers are saying</p>

          <div className="community-preview-grid">
            {previewReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link to="/community" className="btn btn-outline">Join the Community →</Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;
