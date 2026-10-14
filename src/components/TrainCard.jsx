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

  return (
    <div className="train-card card">
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
