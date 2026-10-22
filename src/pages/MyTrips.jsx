import { useNavigate } from 'react-router-dom';
import { useJourney } from '../context/JourneyContext';
import '../styles/mytrips.css';

/**
 * MyTrips — Connected travel dashboard showing the current journey,
 * saved attractions, travel checklist, and quick action buttons.
 */
function MyTrips() {
  const navigate = useNavigate();
  const {
    journey,
    savedAttractions,
    removeAttraction,
    checklist,
    toggleChecklistItem,
  } = useJourney();

  const hasJourney = journey.destination || journey.source || journey.selectedTrain;
  const hasSavedPlaces = savedAttractions.length > 0;
  const hasChecklist = checklist.length > 0;

  const categoryIcons = {
    'History and Heritage': '🏛️',
    Nature: '🌿',
    Shopping: '🛍️',
    'Family-Friendly': '👨‍👩‍👧‍👦',
  };

  return (
    <main className="mytrips-page">
      <div className="page-header">
        <h1>📋 My Trip</h1>
        <p>Your journey details, saved places, and travel checklist</p>
      </div>

      <div className="container mytrips-container">
        {/* A. Selected Journey */}
        <div className="trip-section-card card">
          <div className="trip-section-header">
            <span className="section-icon">🚆</span>
            <h3>Selected Journey</h3>
          </div>

          {hasJourney ? (
            <div className="journey-summary-grid">
              {journey.source && (
                <div className="journey-detail">
                  <label>From</label>
                  <p>{journey.source}</p>
                </div>
              )}
              {journey.destination && (
                <div className="journey-detail">
                  <label>To</label>
                  <p>{journey.destination}</p>
                </div>
              )}
              {journey.selectedTrain && (
                <div className="journey-detail">
                  <label>Train</label>
                  <p>{journey.selectedTrain.name}</p>
                </div>
              )}
              {journey.travelDate && (
                <div className="journey-detail">
                  <label>Travel Date</label>
                  <p>{journey.travelDate}</p>
                </div>
              )}
              {journey.arrivalTime && (
                <div className="journey-detail">
                  <label>Arrival</label>
                  <p>{journey.arrivalTime}</p>
                </div>
              )}
              {journey.travelPurpose && (
                <div className="journey-detail">
                  <label>Purpose</label>
                  <p>{journey.travelPurpose}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="trip-empty">
              <div className="empty-icon">🗺️</div>
              <p>No journey selected yet. Search for a train or use the Travel Assistant to set up your trip.</p>
              <button
                className="btn btn-primary"
                style={{ marginTop: '1rem' }}
                onClick={() => navigate('/trains')}
              >
                🔍 Search Trains
              </button>
            </div>
          )}
        </div>

        {/* B. Saved Places */}
        <div className="trip-section-card card">
          <div className="trip-section-header">
            <span className="section-icon">📍</span>
            <h3>Saved Places</h3>
            {hasSavedPlaces && (
              <span className="section-count">{savedAttractions.length} place{savedAttractions.length !== 1 ? 's' : ''}</span>
            )}
          </div>

          {hasSavedPlaces ? (
            <div className="saved-attractions-list">
              {savedAttractions.map((attraction) => (
                <div key={`${attraction.id}-${attraction.destination}`} className="saved-attraction-item card">
                  <img
                    src={attraction.image || `/images/attractions/${attraction.id}.jpg`}
                    alt={attraction.name}
                    className="sa-thumb"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const fallback = e.currentTarget.parentElement.querySelector('.sa-icon');
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                  <span className="sa-icon" style={{ display: 'none' }}>
                    {categoryIcons[attraction.category] || '📍'}
                  </span>
                  <div className="sa-info">
                    <h4>{attraction.name}</h4>
                    <div className="sa-meta">
                      <span>📍 {attraction.destination}</span>
                      <span>• {attraction.category}</span>
                    </div>
                  </div>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => removeAttraction(attraction.id, attraction.destination)}
                    aria-label={`Remove ${attraction.name}`}
                  >
                    ✕ Remove
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="trip-empty">
              <div className="empty-icon">📍</div>
              <p>No places saved yet. Explore a destination guide and add attractions to your trip.</p>
            </div>
          )}
        </div>

        {/* C. Travel Checklist */}
        <div className="trip-section-card card">
          <div className="trip-section-header">
            <span className="section-icon">✅</span>
            <h3>Travel Checklist</h3>
            {hasChecklist && (
              <span className="section-count">
                {checklist.filter((i) => i.checked).length}/{checklist.length} done
              </span>
            )}
          </div>

          {hasChecklist ? (
            <div className="checklist-list">
              {checklist.map((item) => (
                <div
                  key={item.id}
                  className={`checklist-item ${item.checked ? 'checked' : ''}`}
                  onClick={() => toggleChecklistItem(item.id)}
                  role="checkbox"
                  aria-checked={item.checked}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      toggleChecklistItem(item.id);
                    }
                  }}
                >
                  <span className="check-box">{item.checked ? '✓' : ''}</span>
                  <span className="check-text">{item.text}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="trip-empty">
              <div className="empty-icon">📝</div>
              <p>No checklist yet. Use the Travel Assistant to generate a personalized packing checklist.</p>
              <button
                className="btn btn-primary"
                style={{ marginTop: '1rem' }}
                onClick={() => navigate('/assistant')}
              >
                🤖 Open Travel Assistant
              </button>
            </div>
          )}
        </div>

        {/* D. Quick Actions */}
        <div className="trip-section-card card">
          <div className="trip-section-header">
            <span className="section-icon">⚡</span>
            <h3>Quick Actions</h3>
          </div>

          <div className="quick-actions">
            {journey.destination && (
              <button
                className="quick-action-btn"
                onClick={() => navigate(`/destination/${encodeURIComponent(journey.destination)}`)}
              >
                <span className="qa-icon">🗺️</span>
                <span className="qa-label">Explore Destination</span>
              </button>
            )}
            <button
              className="quick-action-btn"
              onClick={() => navigate('/assistant')}
            >
              <span className="qa-icon">🤖</span>
              <span className="qa-label">Travel Assistant</span>
            </button>
            <button
              className="quick-action-btn"
              onClick={() => navigate('/trains')}
            >
              <span className="qa-icon">🚆</span>
              <span className="qa-label">Search Trains</span>
            </button>
            <button
              className="quick-action-btn"
              onClick={() => navigate('/stations')}
            >
              <span className="qa-icon">🚉</span>
              <span className="qa-label">Station Guide</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default MyTrips;
