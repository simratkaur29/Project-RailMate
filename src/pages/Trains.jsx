import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import TrainCard from '../components/TrainCard';
import trainsData from '../data/trains';
import '../styles/trains.css';

function Trains() {
  const location = useLocation();
  const initialState = location.state || {};

  const [source, setSource] = useState(initialState.source || '');
  const [destination, setDestination] = useState(initialState.destination || '');
  const [date, setDate] = useState(initialState.date || '');
  const [filteredTrains, setFilteredTrains] = useState(trainsData);

  useEffect(() => {
    filterTrains();
  }, []);

  const filterTrains = () => {
    let results = trainsData;

    if (source.trim()) {
      results = results.filter((t) =>
        t.source.toLowerCase().includes(source.trim().toLowerCase())
      );
    }

    if (destination.trim()) {
      results = results.filter((t) =>
        t.destination.toLowerCase().includes(destination.trim().toLowerCase())
      );
    }

    setFilteredTrains(results);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    filterTrains();
  };

  const handleReset = () => {
    setSource('');
    setDestination('');
    setDate('');
    setFilteredTrains(trainsData);
  };

  return (
    <main className="trains-page">
      <div className="page-header">
        <h1>🔍 Search Trains</h1>
        <p>Find the perfect train for your journey.</p>
      </div>


      <div className="container">
        <form className="trains-search-bar" onSubmit={handleSearch}>
          <div className="form-group">
            <label htmlFor="search-source">From Station</label>
            <input
              id="search-source"
              type="text"
              placeholder="e.g. New Delhi"
              value={source}
              onChange={(e) => setSource(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="search-dest">To Station</label>
            <input
              id="search-dest"
              type="text"
              placeholder="e.g. Mumbai"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="search-date">Journey Date</label>
            <input
              id="search-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary">🔍 Search</button>
          <button type="button" className="btn btn-outline" onClick={handleReset}>Reset</button>
        </form>

        <p className="train-result-count">
          Showing <strong>{filteredTrains.length}</strong> Train{filteredTrains.length !== 1 ? 's' : ''}
        </p>

        <div className="trains-results">
          {filteredTrains.length > 0 ? (
            filteredTrains.map((train) => (
              <TrainCard key={train.id} train={train} />
            ))
          ) : (
            <div className="empty-state">
              <div className="icon">🔍</div>
              <h3>No trains found</h3>
              <p>Try changing your search criteria or reset filters.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default Trains;
