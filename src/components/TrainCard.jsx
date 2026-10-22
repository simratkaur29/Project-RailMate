import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useJourney } from '../context/JourneyContext';

function TrainCard({ train, onBook, selectedDate }) {
  const navigate = useNavigate();
  const { setSelectedTrain, journey } = useJourney();
  const [showDetails, setShowDetails] = useState(false);

  const handleBook = () => {
    if (onBook) {
      onBook(train);
    } else {
      setSelectedTrain(train);
      const effectiveDate = selectedDate || journey?.travelDate || '';
      navigate('/booking', { state: { train, date: effectiveDate } });
    }
  };

  const handleExplore = () => {
    setSelectedTrain(train);
    navigate(`/destination/${encodeURIComponent(train.destination)}`);
  };

  const getTrainImage = (t) => {
    if (t.image) return t.image;
    const name = (t.name || '').toLowerCase();
    if (name.includes('vande bharat')) return '/images/trains/vande-bharat.jpg';
    if (name.includes('rajdhani')) return '/images/trains/rajdhani.jpg';
    if (name.includes('shatabdi')) return '/images/trains/shatabdi.jpg';
    if (name.includes('punjab mail')) return '/images/trains/punjab-mail.jpg';
    if (name.includes('golden temple')) return '/images/trains/golden-temple-mail.jpg';
    if (name.includes('duronto')) return '/images/trains/duronto.jpg';
    if (name.includes('garib rath')) return '/images/trains/garib-rath.jpg';
    if (name.includes('tejas')) return '/images/trains/tejas.jpg';
    return '/images/trains/express.jpg';
  };

  const platformNum = train.departurePlatform || '1';

  return (
    <div className="train-card card">
      <div className="train-card-main">
        <div className="train-card-media">
          <img
            src={getTrainImage(train)}
            alt={train.name}
            className="train-card-thumb"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>

        <div className="train-card-info">
          <div className="train-name">{train.name}</div>
          <div className="train-number">#{train.number}</div>

          <div className="train-route">
            <div className="route-stop">
              <div className="time">{train.departure}</div>
              <div className="station">{train.source}</div>
              {/* Departure Platform on Search Results */}
              <div className="platform-tag" title="Expected departure platform (sample timetable data)">
                <span className="pf-badge">PF {platformNum}</span>
                <span className="sample-label">Sample Data</span>
              </div>
            </div>

            <div style={{ textAlign: 'center', flex: 1, maxWidth: 160 }}>
              <div className="train-duration">{train.duration}</div>
              <div className="route-line"></div>
            </div>

            <div className="route-stop">
              <div className="time">{train.arrival}</div>
              <div className="station">{train.destination}</div>
            </div>
          </div>

          <div className="train-card-classes">
            {train.classes.map((cls) => (
              <span key={cls} className="badge badge-primary">{cls}</span>
            ))}
          </div>
        </div>

        <div className="train-card-price">
          <div className="price-label">Starting From</div>
          <div className="price">₹{train.price}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 10 }}>
            <button className="btn btn-accent btn-sm" onClick={handleBook}>
              Book Now
            </button>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => setShowDetails((prev) => !prev)}
              aria-expanded={showDetails}
            >
              {showDetails ? 'Hide Details' : 'ℹ️ Train Details'}
            </button>
            <button className="btn btn-outline btn-sm" onClick={handleExplore}>
              🗺️ Explore Destination
            </button>
          </div>
        </div>
      </div>

      {/* Expandable Train Details Section */}
      {showDetails && (
        <div className="train-card-details-panel">
          <div className="details-header">
            <h4>🚆 Train & Platform Schedule Details</h4>
            <span className="details-train-code">Train #{train.number}</span>
          </div>

          <div className="details-grid">
            <div className="detail-col">
              <span className="detail-label">Departure Platform</span>
              <span className="detail-value platform-highlight">
                🚉 Platform {platformNum}
                <span className="sample-pill">Sample Data</span>
              </span>
              <small className="detail-hint">Expected at {train.source}</small>
            </div>

            <div className="detail-col">
              <span className="detail-label">Schedule & Timings</span>
              <span className="detail-value">
                {train.departure} → {train.arrival}
              </span>
              <small className="detail-hint">Total Journey: {train.duration}</small>
            </div>

            <div className="detail-col">
              <span className="detail-label">Travel Classes</span>
              <span className="detail-value">{train.classes.join(' • ')}</span>
              <small className="detail-hint">Standard dynamic pricing</small>
            </div>

            <div className="detail-col">
              <span className="detail-label">Starting Fare</span>
              <span className="detail-value">₹{train.price}</span>
              <small className="detail-hint">Per passenger</small>
            </div>
          </div>

          <div className="platform-disclaimer">
            ℹ️ <strong>Platform Information Note:</strong> Real-time platform tracking API is currently simulated with sample data. Platform {platformNum} is the standard scheduled platform for {train.name} (#{train.number}) at {train.source}. Please check station electronic displays or listen for platform announcements upon arrival.
          </div>
        </div>
      )}
    </div>
  );
}

export default TrainCard;
