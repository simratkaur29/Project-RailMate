import { useNavigate } from 'react-router-dom';
import { useJourney } from '../context/JourneyContext';

function TrainCard({ train, onBook }) {
  const navigate = useNavigate();
  const { setSelectedTrain } = useJourney();

  const handleBook = () => {
    if (onBook) {
      onBook(train);
    } else {
      setSelectedTrain(train);
      navigate('/booking', { state: { train } });
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

  return (
    <div className="train-card card">
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
          <div>
            <div className="time">{train.departure}</div>
            <div className="station">{train.source}</div>
          </div>
          <div style={{ textAlign: 'center', flex: 1, maxWidth: 160 }}>
            <div className="train-duration">{train.duration}</div>
            <div className="route-line"></div>
          </div>
          <div>
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
          <button className="btn btn-outline btn-sm" onClick={handleExplore}>
            🗺️ Explore Destination
          </button>
        </div>
      </div>
    </div>
  );
}

export default TrainCard;
