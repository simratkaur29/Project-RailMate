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

  // Date helper utilities
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getMaxDate = (daysAhead = 120) => {
    const max = new Date();
    max.setDate(max.getDate() + daysAhead);
    const year = max.getFullYear();
    const month = String(max.getMonth() + 1).padStart(2, '0');
    const day = String(max.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const minDate = getTodayDate();
  const maxDate = getMaxDate(120);

  // Validate initial date if received from navigation state
  const initialDateValid =
    initialState.date && initialState.date >= minDate ? initialState.date : '';

  const [source, setSource] = useState(initialState.source || '');
  const [destination, setDestination] = useState(initialState.destination || '');
  const [date, setDate] = useState(initialDateValid);
  const [dateError, setDateError] = useState('');
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

  // Map states, regions & codes across India to their cities
  const stateAliases = {
    punjab: ['amritsar', 'chandigarh', 'ludhiana', 'jalandhar', 'firozpur', 'punjab'],
    maharashtra: ['mumbai', 'pune', 'nagpur', 'csmt', 'bombay'],
    rajasthan: ['jaipur', 'udaipur', 'jodhpur', 'ajmer'],
    delhi: ['new delhi', 'delhi', 'ndls', 'dli', 'hazrat nizamuddin'],
    up: ['varanasi', 'agra', 'lucknow', 'kanpur', 'prayagraj', 'banaras', 'kashi', 'gorakhpur'],
    'uttar pradesh': ['varanasi', 'agra', 'lucknow', 'kanpur', 'prayagraj', 'banaras', 'kashi', 'gorakhpur'],
    karnataka: ['bangalore', 'bengaluru', 'mysore'],
    'tamil nadu': ['chennai', 'madras', 'coimbatore', 'madurai'],
    telangana: ['hyderabad', 'secunderabad'],
    bengal: ['kolkata', 'howrah', 'sealdah', 'calcutta'],
    'west bengal': ['kolkata', 'howrah', 'sealdah', 'calcutta'],
    bihar: ['patna', 'gaya'],
    goa: ['goa', 'madgaon', 'vasco'],
    kashmir: ['kashmir', 'srinagar', 'jammu', 'katra'],
    himachal: ['shimla', 'kalka', 'manali'],
    gujarat: ['ahmedabad', 'surat', 'vadodara'],
    kerala: ['kochi', 'cochin', 'thiruvananthapuram', 'trivandrum', 'ernakulam'],
    'madhya pradesh': ['bhopal', 'indore', 'gwalior', 'jabalpur'],
    mp: ['bhopal', 'indore', 'gwalior', 'jabalpur'],
    assam: ['guwahati', 'dibrugarh', 'silchar'],
    odisha: ['bhubaneswar', 'puri', 'cuttack'],
    'andhra pradesh': ['visakhapatnam', 'vijayawada', 'tirupati'],
    ap: ['visakhapatnam', 'vijayawada', 'tirupati'],
    jharkhand: ['ranchi', 'jamshedpur', 'dhanbad'],
    uttarakhand: ['dehradun', 'haridwar', 'rishikesh'],
  };

  // Station codes and common typo corrections
  const typoMap = {
    // Typos
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
    // Station codes
    ndls: 'new delhi',
    dli: 'new delhi',
    csmt: 'mumbai',
    mmct: 'mumbai',
    hwh: 'kolkata',
    sdah: 'kolkata',
    mas: 'chennai',
    sbc: 'bangalore',
    sc: 'hyderabad',
    adi: 'ahmedabad',
    lko: 'lucknow',
    bsb: 'varanasi',
    pnbe: 'patna',
    bpl: 'bhopal',
    bbs: 'bhubaneswar',
    ghy: 'guwahati',
    asr: 'amritsar',
    cdg: 'chandigarh',
    ldh: 'ludhiana',
    fzr: 'firozpur',
    ddn: 'dehradun',
    jat: 'kashmir',
    ers: 'kochi',
    udz: 'udaipur',
    agc: 'agra',
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
      if (cities.includes(q) && cities.some((c) => target.includes(c))) return true;
    }
    return false;
  };

  const performSearch = (src, dest) => {
    setSearchStatus('loading');

    const timer = setTimeout(() => {
      try {
        let results = trainsData;

        if (src.trim()) {
          const normSrc = normalizeQuery(src);
          results = results.filter(
            (t) =>
              matchesTerm(t.source, normSrc) ||
              (t.name && normalizeQuery(t.name).includes(normSrc))
          );
        }

        if (dest.trim()) {
          const normDest = normalizeQuery(dest);
          results = results.filter(
            (t) =>
              matchesTerm(t.destination, normDest) ||
              (t.name && normalizeQuery(t.name).includes(normDest))
          );
        }

        setFilteredTrains(results);

        if (results.length > 0) {
          setSearchStatus('success');
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
    }, 300);

    return () => clearTimeout(timer);
  };

  const handleDateChange = (val) => {
    setDate(val);
    if (!val) {
      setDateError('');
      return;
    }
    if (val < minDate) {
      setDateError('Journey date cannot be in the past. Please select today or a future date.');
    } else if (val > maxDate) {
      setDateError('Journey date cannot be more than 120 days in advance.');
    } else {
      setDateError('');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (date && date < minDate) {
      setDateError('Journey date cannot be in the past. Please select today or a future date.');
      return;
    }
    if (date && date > maxDate) {
      setDateError('Journey date cannot be more than 120 days in advance.');
      return;
    }
    setDateError('');
    performSearch(source, destination);
  };

  const handleReset = () => {
    setSource('');
    setDestination('');
    setDate('');
    setDateError('');
    setFilteredTrains(trainsData);
    setSearchStatus('success');
  };

  const popularStations = [
    'New Delhi', 'Mumbai', 'Kolkata', 'Chennai', 'Bangalore',
    'Hyderabad', 'Ahmedabad', 'Pune', 'Jaipur', 'Lucknow',
    'Varanasi', 'Patna', 'Bhopal', 'Bhubaneswar', 'Guwahati',
    'Amritsar', 'Chandigarh', 'Ludhiana', 'Agra', 'Goa',
    'Kochi', 'Nagpur', 'Visakhapatnam', 'Kanpur', 'Prayagraj',
    'Surat', 'Coimbatore', 'Thiruvananthapuram', 'Ranchi', 'Dehradun',
    'Shimla', 'Kashmir', 'Udaipur', 'Firozpur'
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
        <p>Find the perfect train for your journey across India with live platform guidance.</p>
      </div>

      <div className="container">
        <form className="trains-search-bar" onSubmit={handleSearch}>
          <div className="form-group">
            <label htmlFor="search-source">From Station / City</label>
            <input
              id="search-source"
              type="text"
              list="stations-list"
              placeholder="e.g. New Delhi or NDLS"
              value={source}
              onChange={(e) => setSource(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="search-dest">To Station / City / State</label>
            <input
              id="search-dest"
              type="text"
              list="stations-list"
              placeholder="e.g. Kolkata, Chennai, Mumbai..."
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
              min={minDate}
              max={maxDate}
              onChange={(e) => handleDateChange(e.target.value)}
              aria-invalid={!!dateError}
            />
            {dateError && (
              <div
                className="form-error"
                role="alert"
                style={{
                  fontSize: '0.8rem',
                  color: 'var(--error, #ef4444)',
                  marginTop: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <span>⚠️</span> {dateError}
              </div>
            )}
          </div>
          <button type="submit" className="btn btn-primary">🔍 Search</button>
          <button type="button" className="btn btn-outline" onClick={handleReset}>Reset</button>
        </form>

        <p className="train-result-count">
          Showing <strong>{filteredTrains.length}</strong> train{filteredTrains.length !== 1 ? 's' : ''} across India
        </p>

        <div className="trains-results">
          {filteredTrains.length > 0 ? (
            filteredTrains.map((train) => (
              <TrainCard key={train.id} train={train} selectedDate={date} />
            ))
          ) : (
            <div className="empty-state">
              <div className="icon">🔍</div>
              <h3>No trains found</h3>
              <p>Try searching by station name, city, state, or railway code (e.g., NDLS, HWH, CSMT, MAS).</p>
              <button
                type="button"
                className="btn btn-outline"
                style={{ marginTop: '1rem' }}
                onClick={handleReset}
              >
                Show All Trains
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default Trains;
