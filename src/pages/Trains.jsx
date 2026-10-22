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

  // Map states & regions to their key cities and variations
  const stateAliases = {
    punjab: ['amritsar', 'chandigarh', 'ludhiana', 'jalandhar', 'firozpur', 'punjab'],
    maharashtra: ['mumbai', 'pune', 'nagpur', 'csmt', 'bombay'],
    rajasthan: ['jaipur', 'udaipur', 'jodhpur', 'ajmer'],
    delhi: ['new delhi', 'delhi', 'ndls', 'dli', 'hazrat nizamuddin'],
    up: ['varanasi', 'agra', 'lucknow', 'kanpur', 'prayagraj', 'banaras', 'kashi'],
    'uttar pradesh': ['varanasi', 'agra', 'lucknow', 'kanpur', 'prayagraj', 'banaras', 'kashi'],
    karnataka: ['bangalore', 'bengaluru', 'mysore'],
    'tamil nadu': ['chennai', 'madras', 'coimbatore'],
    telangana: ['hyderabad', 'secunderabad'],
    bengal: ['kolkata', 'howrah', 'calcutta'],
    'west bengal': ['kolkata', 'howrah', 'calcutta'],
    bihar: ['patna'],
    goa: ['goa', 'madgaon', 'vasco'],
    kashmir: ['kashmir', 'srinagar', 'jammu', 'katra'],
    himachal: ['shimla', 'kalka', 'manali'],
    gujarat: ['ahmedabad', 'surat', 'vadodara'],
    kerala: ['kochi', 'cochin', 'thiruvananthapuram', 'trivandrum'],
  };

  const typoMap = {
    mubai: 'mumbai',
    mumbay: 'mumbai',
    bombay: 'mumbai',
    pnjab: 'punjab',
    panjab: 'punjab',
    punajb: 'punjab',
    dehli: 'delhi',
    dilli: 'delhi',
    amritasr: 'amritsar',
    amristar: 'amritsar',
    chandhigarh: 'chandigarh',
    chandi: 'chandigarh',
    calcutta: 'kolkata',
    benglore: 'bangalore',
    bengaluru: 'bangalore',
    channai: 'chennai',
    madras: 'chennai',
  };

  const normalizeQuery = (text) => {
    const clean = (text || '').trim().toLowerCase();
    return typoMap[clean] || clean;
  };

  const matchesTerm = (fieldValue, query) => {
    if (!query) return true;
    const q = normalizeQuery(query);
    const target = (fieldValue || '').toLowerCase();

    if (target.includes(q)) return true;
    if (stateAliases[q] && stateAliases[q].some((alias) => target.includes(alias))) return true;

    for (const [state, cities] of Object.entries(stateAliases)) {
      if (cities.includes(q) && target.includes(state)) return true;
    }
    return false;
  };

  const [searchNotice, setSearchNotice] = useState('');

  const performSearch = (src, dest) => {
    setSearchStatus('loading');
    setSearchNotice('');

    const timer = setTimeout(() => {
      try {
        let results = trainsData;
        const normSrc = normalizeQuery(src);
        const normDest = normalizeQuery(dest);

        if (src.trim()) {
          results = results.filter(
            (t) =>
              matchesTerm(t.source, normSrc) ||
              (t.name && normalizeQuery(t.name).includes(normSrc))
          );
        }

        if (dest.trim()) {
          results = results.filter(
            (t) =>
              matchesTerm(t.destination, normDest) ||
              (t.name && normalizeQuery(t.name).includes(normDest))
          );
        }

        // Fallback 1: If no direct pair match, show all trains arriving at destination
        if (results.length === 0 && dest.trim()) {
          const destMatches = trainsData.filter(
            (t) =>
              matchesTerm(t.destination, normDest) ||
              (t.name && normalizeQuery(t.name).includes(normDest))
          );
          if (destMatches.length > 0) {
            results = destMatches;
            setSearchNotice(
              `Showing available express trains heading to ${dest.trim()}${src.trim() ? ` (travel from ${src.trim()} connects via these services)` : ''}:`
            );
          }
        }

        // Fallback 2: If still no match and source given, show trains from source
        if (results.length === 0 && src.trim()) {
          const srcMatches = trainsData.filter(
            (t) =>
              matchesTerm(t.source, normSrc) ||
              (t.name && normalizeQuery(t.name).includes(normSrc))
          );
          if (srcMatches.length > 0) {
            results = srcMatches;
            setSearchNotice(
              `Showing available outbound trains departing from ${src.trim()}:`
            );
          }
        }

        // Fallback 3: If still no match, show all network trains
        if (results.length === 0) {
          results = trainsData;
          setSearchNotice(
            `No direct trains found between ${src.trim()} and ${dest.trim()}. Showing all available trains across our network:`
          );
        }

        setFilteredTrains(results);
        setSearchStatus('success');
        if (dest.trim()) {
          updateJourney({
            source: src.trim(),
            destination: dest.trim(),
            travelDate: date,
          });
        }
      } catch {
        setSearchStatus('error');
      }
    }, 300);

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
    setSearchNotice('');
    setFilteredTrains(trainsData);
    setSearchStatus('success');
  };

  const handleRetry = () => {
    performSearch(source, destination);
  };

  const popularStations = [
    'New Delhi', 'Mumbai', 'Punjab', 'Amritsar', 'Chandigarh',
    'Agra', 'Goa', 'Jaipur', 'Varanasi', 'Kolkata',
    'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Kashmir',
    'Shimla', 'Kochi', 'Udaipur', 'Ahmedabad', 'Patna'
  ];

  return (
    <main className="trains-page">
      <datalist id="stations-list">
        {popularStations.map((st) => (
          <option key={st} value={st} />
        ))}
      </datalist>

      <div className="page-header">
        <h1>🔍 Search Trains</h1>
        <p>Find the perfect train for your journey across India.</p>
      </div>

      <div className="container">
        <form className="trains-search-bar" onSubmit={handleSearch}>
          <div className="form-group">
            <label htmlFor="search-source">From Station / City</label>
            <input
              id="search-source"
              type="text"
              list="stations-list"
              placeholder="e.g. Mumbai"
              value={source}
              onChange={(e) => setSource(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="search-dest">To Station / State</label>
            <input
              id="search-dest"
              type="text"
              list="stations-list"
              placeholder="e.g. Punjab"
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
