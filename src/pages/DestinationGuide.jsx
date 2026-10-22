import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useJourney } from '../context/JourneyContext';
import AttractionCard from '../components/AttractionCard';
import destinations from '../data/destinations';
import '../styles/destination.css';

/**
 * DestinationGuide — Dynamic destination page using useParams().
 * Displays attractions (filterable), food, transport, travel tips,
 * and a "Build My Day Plan" itinerary generator.
 */
function DestinationGuide() {
  const { destinationName } = useParams();
  const navigate = useNavigate();
  const { addAttraction, removeAttraction, isAttractionSaved, journey } = useJourney();

  // Decode the URL parameter
  const decodedName = decodeURIComponent(destinationName || '');

  const regionMap = {
    maharashtra: 'Mumbai',
    rajasthan: 'Jaipur',
    up: 'Varanasi',
    'uttar pradesh': 'Varanasi',
    'tamil nadu': 'Chennai',
    karnataka: 'Bangalore',
    bengal: 'Kolkata',
    'west bengal': 'Kolkata',
    himachal: 'Shimla',
    'himachal pradesh': 'Shimla',
    jammu: 'Kashmir',
    'jammu and kashmir': 'Kashmir',
    gujarat: 'Ahmedabad',
    kerala: 'Kochi',
    bihar: 'Patna',
  };

  const rawKey = decodedName.trim().toLowerCase();
  const resolvedName = regionMap[rawKey] || decodedName;

  // Find matching destination (case-insensitive)
  const destination = destinations.find(
    (d) => d.name.toLowerCase() === rawKey || d.name.toLowerCase() === resolvedName.toLowerCase()
  );

  // ---- Local State ----
  const [activeCategory, setActiveCategory] = useState('All');
  const [itineraryDuration, setItineraryDuration] = useState('');
  const [loading, setLoading] = useState(true);

  // Simulate async loading for demonstration
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, [destinationName]);

  // Reset category filter when destination changes
  useEffect(() => {
    setActiveCategory('All');
    setItineraryDuration('');
  }, [destinationName]);

  // ---- Handle save/remove toggle ----
  const handleToggleSave = (attraction, destName) => {
    if (isAttractionSaved(attraction.id, destName)) {
      removeAttraction(attraction.id, destName);
    } else {
      addAttraction(attraction, destName);
    }
  };

  // ---- Categories for filter pills ----
  const categories = destination
    ? ['All', ...new Set(destination.attractions.map((a) => a.category))]
    : [];

  // ---- Filtered attractions ----
  const filteredAttractions = destination
    ? activeCategory === 'All'
      ? destination.attractions
      : destination.attractions.filter((a) => a.category === activeCategory)
    : [];

  // ---- Itinerary Generator ----
  const generateItinerary = () => {
    if (!destination || !itineraryDuration) return [];

    const countMap = { '4hours': 3, 'halfday': 5, 'fullday': 8 };
    const count = countMap[itineraryDuration] || 4;

    // Use user's interests to prioritize if available
    let pool = [...destination.attractions];
    if (journey.interests && journey.interests.length > 0) {
      const preferred = pool.filter((a) =>
        journey.interests.some((interest) =>
          a.category.toLowerCase().includes(interest.toLowerCase()) ||
          interest.toLowerCase().includes(a.category.toLowerCase())
        )
      );
      const others = pool.filter((a) => !preferred.includes(a));
      pool = [...preferred, ...others];
    }

    const selected = pool.slice(0, count);

    const timeSlots = {
      '4hours': ['9:00 AM', '10:30 AM', '12:00 PM'],
      halfday: ['9:00 AM', '10:30 AM', '12:00 PM', '1:30 PM', '3:00 PM'],
      fullday: [
        '8:00 AM', '9:30 AM', '11:00 AM', '12:30 PM',
        '2:00 PM', '3:30 PM', '5:00 PM', '6:30 PM',
      ],
    };

    const slots = timeSlots[itineraryDuration] || [];
    return selected.map((attraction, index) => ({
      time: slots[index] || `Activity ${index + 1}`,
      name: attraction.name,
      description: attraction.description,
    }));
  };

  const itinerary = generateItinerary();

  // ---- Loading State ----
  if (loading) {
    return (
      <main className="destination-page">
        <div className="destination-hero">
          <div className="container destination-hero-content">
            <div className="skeleton-line tall" style={{ margin: '0 auto', background: 'rgba(255,255,255,0.15)' }}></div>
            <div className="skeleton-line medium" style={{ margin: '0 auto', background: 'rgba(255,255,255,0.1)' }}></div>
          </div>
        </div>
        <div className="container" style={{ paddingTop: '2rem' }}>
          <div className="attractions-grid">
            {[1, 2, 3].map((n) => (
              <div key={n} className="skeleton-card">
                <div className="skeleton-line tall"></div>
                <div className="skeleton-line medium"></div>
                <div className="skeleton-line short"></div>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  // ---- Not Found State ----
  if (!destination) {
    return (
      <main className="destination-page">
        <div className="page-header">
          <h1>🗺️ Destination Guide</h1>
          <p>Explore your travel destination</p>
        </div>
        <div className="container">
          <div className="destination-not-found">
            <div className="nf-icon">🔍</div>
            <h2>Destination Not Found</h2>
            <p>
              We don&apos;t have a guide for &quot;{decodedName}&quot; yet. Please explore one of our available destinations below.
            </p>
            <div className="available-destinations">
              {destinations.map((d) => (
                <Link
                  key={d.name}
                  to={`/destination/${encodeURIComponent(d.name)}`}
                  className="btn btn-outline"
                >
                  {d.name}
                </Link>
              ))}
            </div>
            <div style={{ marginTop: '1.5rem' }}>
              <button className="btn btn-primary" onClick={() => navigate('/trains')}>
                🔍 Search Trains
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ---- Success State: Full Destination Guide ----
  return (
    <main className="destination-page">
      {/* Hero Section */}
      <div className="destination-hero">
        <div className="container destination-hero-content">
          <span className="destination-tagline">{destination.tagline}</span>
          <h1>
            Discover <span className="accent">{destination.name}</span>
          </h1>
          <p className="destination-desc">{destination.description}</p>
        </div>
      </div>

      <div className="container" style={{ paddingTop: '2rem' }}>
        {/* Demo Disclaimer */}
        <div className="demo-disclaimer">
          <span className="disclaimer-icon">ℹ️</span>
          <span>
            Destination information is sample data for demonstration purposes. Verify details before your visit.
          </span>
        </div>

        {/* Quick Actions */}
        <div className="dest-actions">
          <button
            className="btn btn-primary"
            onClick={() => navigate('/assistant')}
          >
            🤖 Travel Assistant
          </button>
          <button
            className="btn btn-outline"
            onClick={() => navigate('/stations')}
          >
            🚉 Station Guide
          </button>
          <button
            className="btn btn-outline"
            onClick={() => navigate('/my-trips')}
          >
            📋 View My Trip
          </button>
          {journey.selectedTrain && (
            <button
              className="btn btn-outline"
              onClick={() => navigate('/trains')}
            >
              🚆 Back to Trains
            </button>
          )}
        </div>

        {/* A. Places to Visit */}
        <section className="dest-section">
          <div className="dest-section-header">
            <span className="dest-section-icon">📍</span>
            <h2>Places to Visit</h2>
          </div>

          {/* Category Filter Pills */}
          <div className="category-filters">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`filter-pill ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="attractions-grid">
            {filteredAttractions.length > 0 ? (
              filteredAttractions.map((attraction) => (
                <AttractionCard
                  key={attraction.id}
                  attraction={attraction}
                  destinationName={destination.name}
                  isSaved={isAttractionSaved(attraction.id, destination.name)}
                  onToggleSave={handleToggleSave}
                />
              ))
            ) : (
              <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
                <div className="icon">🔍</div>
                <h3>No attractions in this category</h3>
                <p>Try selecting a different category.</p>
              </div>
            )}
          </div>
        </section>

        {/* B. Food and Local Cuisine */}
        <section className="dest-section">
          <div className="dest-section-header">
            <span className="dest-section-icon">🍽️</span>
            <h2>Food &amp; Local Cuisine</h2>
          </div>

          <div className="food-grid">
            {destination.food.map((item, index) => (
              <div key={index} className="food-card card">
                <span className="food-emoji">🍛</span>
                <div>
                  <h4>{item.name}</h4>
                  <p>{item.description}</p>
                  <span className="food-category">{item.category}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* C. Local Transportation */}
        <section className="dest-section">
          <div className="dest-section-header">
            <span className="dest-section-icon">🚌</span>
            <h2>Local Transportation</h2>
          </div>

          <div className="transport-grid">
            {destination.transportation.map((t, index) => (
              <div key={index} className="transport-card card">
                <h4>{t.mode}</h4>
                <p>{t.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* D. Travel Tips */}
        <section className="dest-section">
          <div className="dest-section-header">
            <span className="dest-section-icon">💡</span>
            <h2>Travel Tips for {destination.name}</h2>
          </div>

          <div className="tips-list">
            {destination.travelTips.map((tip, index) => (
              <div key={index} className="tip-item">
                <span className="tip-check">✓</span>
                <span>{tip}</span>
              </div>
            ))}
          </div>
        </section>

        {/* E. Build My Day Plan (Itinerary Generator) */}
        <section className="dest-section">
          <div className="itinerary-builder">
            <h3>🗓️ Build My Day Plan</h3>
            <p className="itinerary-subtitle">
              Select the time you have available and we&apos;ll suggest an itinerary using{' '}
              {destination.name}&apos;s attractions.
            </p>

            <div className="duration-selector">
              {[
                { key: '4hours', label: '⏱️ 4 Hours' },
                { key: 'halfday', label: '🌤️ Half Day' },
                { key: 'fullday', label: '☀️ Full Day' },
              ].map((opt) => (
                <button
                  key={opt.key}
                  className={`duration-btn ${itineraryDuration === opt.key ? 'active' : ''}`}
                  onClick={() => setItineraryDuration(opt.key)}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {itineraryDuration && itinerary.length > 0 && (
              <>
                <div className="demo-disclaimer" style={{ marginBottom: '1rem' }}>
                  <span className="disclaimer-icon">📌</span>
                  <span>
                    This is a suggested itinerary. Actual timings depend on your schedule and preferences.
                  </span>
                </div>
                <div className="itinerary-timeline">
                  {itinerary.map((item, index) => (
                    <div key={index} className="itinerary-item">
                      <div className="itinerary-time">{item.time}</div>
                      <h4>{item.name}</h4>
                      <p>{item.description}</p>
                    </div>
                  ))}
                </div>
              </>
            )}

            {itineraryDuration && itinerary.length === 0 && (
              <div className="empty-state">
                <p>Not enough attraction data to build an itinerary. Explore the attractions above manually.</p>
              </div>
            )}

            {!itineraryDuration && (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                Select a duration above to generate your suggested day plan.
              </p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

export default DestinationGuide;
