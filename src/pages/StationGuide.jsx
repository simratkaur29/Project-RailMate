import { useState } from 'react';
import StationCard from '../components/StationCard';
import stationsData from '../data/stations';
import '../styles/community.css';

function StationGuide() {
  const [search, setSearch] = useState('');

  const filteredStations = stationsData.filter((station) =>
    station.name.toLowerCase().includes(search.toLowerCase()) ||
    station.code.toLowerCase().includes(search.toLowerCase()) ||
    station.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="station-page">
      <div className="page-header">
        <h1>🚉 Station Guide</h1>
        <p>Explore railway stations across India</p>
      </div>

      <div className="container">
        <div className="station-search">
          <input
            type="text"
            placeholder="🔍 Search by station name, code, or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <p style={{ color: 'var(--text-light)', marginBottom: '1rem' }}>
          Showing <strong>{filteredStations.length}</strong> station{filteredStations.length !== 1 ? 's' : ''}
        </p>

        <div className="station-grid">
          {filteredStations.length > 0 ? (
            filteredStations.map((station) => (
              <StationCard key={station.id} station={station} />
            ))
          ) : (
            <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
              <div className="icon">🚉</div>
              <h3>No stations found</h3>
              <p>Try a different search term.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default StationGuide;
