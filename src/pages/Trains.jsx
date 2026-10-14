import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useJourney } from '../context/JourneyContext';
import TrainCard from '../components/TrainCard';
import trainsData from '../data/trains';
import '../styles/trains.css';

function Trains() {
  const location = useLocation();
  const initialState = location.state || {};
  const { updateJourney } = useJourney();

  const [source, setSource] = useState(initialState.source || '');
  const [destination, setDestination] = useState(initialState.destination || '');
  const [date, setDate] = useState(initialState.date || '');
  const [filteredTrains, setFilteredTrains] = useState([]);

  // Async state: idle | loading | success | empty | error
  const [searchStatus, setSearchStatus] = useState('idle');

  // Initial load
  useEffect(() => {
    if (initialState.source || initialState.destination) {
      performSearch(initialState.source || '', initialState.destination || '');
    } else {
      setFilteredTrains(trainsData);
      setSearchStatus('success');
    }
  }, []);

  const performSearch = (src, dest) => {
    setSearchStatus('loading');

    // Simulate async operation with local data (short delay for demonstration)
    const timer = setTimeout(() => {
      try {
        let results = trainsData;

        if (src.trim()) {
          results = results.filter((t) =>
            t.source.toLowerCase().includes(src.trim().toLowerCase())
          );
        }

        if (dest.trim()) {
          results = results.filter((t) =>
            t.destination.toLowerCase().includes(dest.trim().toLowerCase())
          );
        }

        setFilteredTrains(results);

        if (results.length > 0) {
          setSearchStatus('success');
          // Update journey context with search parameters
          if (dest.trim()) {
            updateJourney({
              source: src.trim(),
              destination: dest.trim(),
              travelDate: date,
            });
          }
        } else {
          setSearchStatus('empty');
        }
      } catch {
        setSearchStatus('error');
      }
    }, 500);

    return () => clearTimeout(timer);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    performSearch(source, destination);
  };

  const handleReset = () => {
    setSource('');
    setDestination('');
    setDate('');
    setFilteredTrains(trainsData);
    setSearchStatus('success');
  };

  const handleRetry = () => {
    performSearch(source, destination);
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
          Showing <strong>{filteredTrains.length}</strong> train{filteredTrains.length !== 1 ? 's' : ''}
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
