import { useNavigate } from 'react-router-dom';

function StationCard({ station }) {
  const navigate = useNavigate();

  const handleSearchTrains = () => {
    navigate('/trains', { state: { source: station.city } });
  };

  const handleExploreCity = () => {
    navigate(`/destination/${encodeURIComponent(station.city)}`);
  };

  return (
    <div className="station-card card">
      <div className="station-header">
        <div>
          <div className="station-name">{station.name}</div>
          <div className="station-city">📍 {station.city}</div>
        </div>
        <span className="station-code">{station.code}</span>
      </div>

      <div className="station-platforms">
        🚉 {station.platforms} Platforms
      </div>

      <div className="facilities">
        {station.facilities.map((facility) => (
          <span key={facility} className="facility-tag">{facility}</span>
        ))}
      </div>

      <div className="station-transport">
        <strong>Nearby transport:</strong> {station.nearbyTransport.join(', ')}
      </div>

      <div className="station-tips">
        💡 {station.tips}
      </div>

      <div className="station-actions" style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
        <button className="btn btn-primary btn-sm" onClick={handleSearchTrains}>
          🔍 Search Trains
        </button>
        <button className="btn btn-outline btn-sm" onClick={handleExploreCity}>
          🗺️ Explore City
        </button>
      </div>
    </div>
  );
}

export default StationCard;
