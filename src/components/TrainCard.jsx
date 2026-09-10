import { useNavigate } from 'react-router-dom';

function TrainCard({ train, onBook }) {
  const navigate = useNavigate();

  const handleBook = () => {
    if (onBook) {
      onBook(train);
    } else {
      navigate('/booking', { state: { train } });
    }
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
        <button className="btn btn-accent" onClick={handleBook} style={{ marginTop: 10 }}>
          Book now
        </button>
      </div>
    </div>
  );
}

export default TrainCard;
