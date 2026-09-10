function StationCard({ station }) {
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
    </div>
  );
}

export default StationCard;
