import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useJourney } from '../context/JourneyContext';
import TrainCard from '../components/TrainCard';
import trainsData from '../data/trains';
import '../styles/trains.css';

function Trains() {
  const location = useLocation();
  const navigate = useNavigate();
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

  const initialReturnDateValid =
    initialState.returnDate && initialState.returnDate >= (initialDateValid || minDate)
      ? initialState.returnDate
      : '';

  const [tripType, setTripType] = useState(initialState.tripType || 'oneWay');
  const [source, setSource] = useState(initialState.source || '');
  const [destination, setDestination] = useState(initialState.destination || '');
  const [date, setDate] = useState(initialDateValid);
  const [dateError, setDateError] = useState('');
  const [returnDate, setReturnDate] = useState(initialReturnDateValid);
  const [returnDateError, setReturnDateError] = useState('');

  // Results & Tabs state
  const [filteredTrains, setFilteredTrains] = useState([]);
  const [returnTrains, setReturnTrains] = useState([]);
  const [activeTab, setActiveTab] = useState('onward'); // 'onward' | 'return'
  const [selectedOnwardTrain, setSelectedOnwardTrain] = useState(null);
  const [selectedReturnTrain, setSelectedReturnTrain] = useState(null);

  // Async state: idle | loading | success | empty | error
  const [searchStatus, setSearchStatus] = useState('idle');

  // Initial load
  useEffect(() => {
    if (initialState.source || initialState.destination) {
      performSearch(initialState.source || '', initialState.destination || '', tripType);
    } else {
      setFilteredTrains(trainsData);
      setReturnTrains([]);
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

  const [searchNotice, setSearchNotice] = useState('');

  const performSearch = (src, dest, currentTripType = tripType) => {
    setSearchStatus('loading');
    setSearchNotice('');

    const timer = setTimeout(() => {
      try {
        const normSrc = normalizeQuery(src);
        const normDest = normalizeQuery(dest);
        let onwardResults = trainsData;
        let returnResults = trainsData;

        // Onward Search
        if (src.trim()) {
          onwardResults = onwardResults.filter(
            (t) =>
              matchesTerm(t.source, normSrc) ||
              (t.name && normalizeQuery(t.name).includes(normSrc))
          );
        }

        if (dest.trim()) {
          onwardResults = onwardResults.filter(
            (t) =>
              matchesTerm(t.destination, normDest) ||
              (t.name && normalizeQuery(t.name).includes(normDest))
          );
        }

        // Fallback 1: If no direct pair match, show all trains arriving at destination
        if (onwardResults.length === 0 && dest.trim()) {
          const destMatches = trainsData.filter(
            (t) =>
              matchesTerm(t.destination, normDest) ||
              (t.name && normalizeQuery(t.name).includes(normDest))
          );
          if (destMatches.length > 0) {
            onwardResults = destMatches;
            setSearchNotice(
              `Showing available express trains heading to ${dest.trim()}${src.trim() ? ` (travel from ${src.trim()} connects via these services)` : ''}:`
            );
          }
        }

        // Fallback 2: If still no match and source given, show trains from source
        if (onwardResults.length === 0 && src.trim()) {
          const srcMatches = trainsData.filter(
            (t) =>
              matchesTerm(t.source, normSrc) ||
              (t.name && normalizeQuery(t.name).includes(normSrc))
          );
          if (srcMatches.length > 0) {
            onwardResults = srcMatches;
            setSearchNotice(
              `Showing available outbound trains departing from ${src.trim()}:`
            );
          }
        }

        // Fallback 3: If still no match, show all network trains
        if (onwardResults.length === 0) {
          onwardResults = trainsData;
          setSearchNotice(
            `No direct trains found between ${src.trim()} and ${dest.trim()}. Showing all available trains across our network:`
          );
        }

        // Return Search (source and destination inverted)
        if (currentTripType === 'roundTrip') {
          if (dest.trim()) {
            returnResults = returnResults.filter(
              (t) =>
                matchesTerm(t.source, normDest) ||
                (t.name && normalizeQuery(t.name).includes(normDest))
            );
          }
          if (src.trim()) {
            returnResults = returnResults.filter(
              (t) =>
                matchesTerm(t.destination, normSrc) ||
                (t.name && normalizeQuery(t.name).includes(normSrc))
            );
          }
        } else {
          returnResults = [];
        }

        setFilteredTrains(onwardResults);
        setReturnTrains(returnResults);
        setSearchStatus('success');

        if (dest.trim()) {
          updateJourney({
            source: src.trim(),
            destination: dest.trim(),
            tripType: currentTripType,
            travelDate: date,
            returnDate: currentTripType === 'roundTrip' ? returnDate : '',
          });
        }
      } catch {
        setSearchStatus('error');
      }
    }, 300);

    return () => clearTimeout(timer);
  };

  const minReturnDate = date || minDate;

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

    if (returnDate && val > returnDate) {
      setReturnDateError('Return date cannot be earlier than the onward journey date.');
    } else if (returnDate && val <= returnDate) {
      setReturnDateError('');
    }
  };

  const handleReturnDateChange = (val) => {
    setReturnDate(val);
    if (!val) {
      setReturnDateError('');
      return;
    }
    if (val < minReturnDate) {
      setReturnDateError('Return date cannot be earlier than the onward journey date.');
    } else if (val > maxDate) {
      setReturnDateError('Return date cannot be more than 120 days in advance.');
    } else {
      setReturnDateError('');
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
    if (tripType === 'roundTrip') {
      if (!returnDate) {
        setReturnDateError('Please select a return journey date.');
        return;
      }
      if (returnDate < minReturnDate) {
        setReturnDateError('Return date cannot be earlier than the onward journey date.');
        return;
      }
    }
    setDateError('');
    setReturnDateError('');
    performSearch(source, destination, tripType);
  };

  const handleReset = () => {
    setTripType('oneWay');
    setSource('');
    setDestination('');
    setDate('');
    setReturnDate('');
    setDateError('');
    setReturnDateError('');
    setSelectedOnwardTrain(null);
    setSelectedReturnTrain(null);
    setActiveTab('onward');
    setSearchNotice('');
    setFilteredTrains(trainsData);
    setReturnTrains([]);
    setSearchStatus('success');
  };

  const handleProceedRoundTrip = () => {
    if (!selectedOnwardTrain) {
      alert('Please select an onward train first.');
      setActiveTab('onward');
      return;
    }
    navigate('/booking', {
      state: {
        train: selectedOnwardTrain,
        returnTrain: selectedReturnTrain || null,
        tripType: 'roundTrip',
        date,
        returnDate,
      },
    });
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
        <p>Find the perfect train for your journey across India with return booking and platform guidance.</p>
      </div>

      <div className="container">
        {/* Search Bar Form */}
        <form className="trains-search-bar" onSubmit={handleSearch}>
          {/* Trip Type Selector */}
          <div className="trip-type-selector-bar" style={{ width: '100%', marginBottom: '12px' }}>
            <div style={{ display: 'inline-flex', gap: '8px', background: 'var(--background)', padding: '4px', borderRadius: '24px' }}>
              <button
                type="button"
                className={`btn btn-sm ${tripType === 'oneWay' ? 'btn-primary' : 'btn-outline'}`}
                style={{ borderRadius: '20px', padding: '6px 20px', border: 'none' }}
                onClick={() => {
                  setTripType('oneWay');
                  setReturnDateError('');
                  if (source || destination) performSearch(source, destination, 'oneWay');
                }}
              >
                ➡️ One Way
              </button>
              <button
                type="button"
                className={`btn btn-sm ${tripType === 'roundTrip' ? 'btn-primary' : 'btn-outline'}`}
                style={{ borderRadius: '20px', padding: '6px 20px', border: 'none' }}
                onClick={() => {
                  setTripType('roundTrip');
                  if (source || destination) performSearch(source, destination, 'roundTrip');
                }}
              >
                🔄 Round Trip
              </button>
            </div>
          </div>

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
            <label htmlFor="search-dest">To Station / City</label>
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
            <label htmlFor="search-date">
              {tripType === 'roundTrip' ? 'Onward Journey Date' : 'Journey Date'}
            </label>
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

          {/* Return Date Input for Round Trips */}
          {tripType === 'roundTrip' && (
            <div className="form-group">
              <label htmlFor="search-return-date">Return Journey Date</label>
              <input
                id="search-return-date"
                type="date"
                value={returnDate}
                min={minReturnDate}
                max={maxDate}
                onChange={(e) => handleReturnDateChange(e.target.value)}
                aria-invalid={!!returnDateError}
              />
              {returnDateError && (
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
                  <span>⚠️</span> {returnDateError}
                </div>
              )}
            </div>
          )}

          <button type="submit" className="btn btn-primary">
            🔍 {tripType === 'roundTrip' ? 'Search Round-Trip' : 'Search Trains'}
          </button>
          <button type="button" className="btn btn-outline" onClick={handleReset}>
            Reset
          </button>
        </form>

        {/* Round Trip Selection Status Bar */}
        {tripType === 'roundTrip' && (
          <div
            className="round-trip-banner card"
            style={{
              padding: '1rem 1.25rem',
              marginBottom: '1.5rem',
              background: 'rgba(18, 53, 91, 0.04)',
              border: '1px solid rgba(18, 53, 91, 0.15)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                  1. Onward Train:
                </span>
                <div style={{ fontWeight: 600, color: selectedOnwardTrain ? 'var(--primary)' : 'var(--text-light)', fontSize: '0.92rem' }}>
                  {selectedOnwardTrain ? (
                    <span>🚆 {selectedOnwardTrain.name} (#{selectedOnwardTrain.number}) • ₹{selectedOnwardTrain.price}</span>
                  ) : (
                    <span style={{ fontStyle: 'italic' }}>Please select an onward train below</span>
                  )}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                  2. Return Train:
                </span>
                <div style={{ fontWeight: 600, color: selectedReturnTrain ? 'var(--secondary)' : 'var(--text-light)', fontSize: '0.92rem' }}>
                  {selectedReturnTrain ? (
                    <span>🔄 {selectedReturnTrain.name} (#{selectedReturnTrain.number}) • ₹{selectedReturnTrain.price}</span>
                  ) : (
                    <span style={{ fontStyle: 'italic' }}>Select a return train or add on booking page</span>
                  )}
                </div>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-accent btn-sm"
              style={{ padding: '8px 20px', fontWeight: 700 }}
              onClick={handleProceedRoundTrip}
              disabled={!selectedOnwardTrain}
            >
              {selectedOnwardTrain && selectedReturnTrain
                ? `🎫 Book Both Journeys (₹${selectedOnwardTrain.price + selectedReturnTrain.price}) →`
                : selectedOnwardTrain
                ? '🎫 Proceed with Selected Onward →'
                : 'Select Onward Train First'}
            </button>
          </div>
        )}

        {/* Tab Switcher for Round Trips */}
        {tripType === 'roundTrip' && (
          <div className="tab-nav" style={{ marginBottom: '1.25rem' }}>
            <button
              type="button"
              className={`tab-btn ${activeTab === 'onward' ? 'active' : ''}`}
              onClick={() => setActiveTab('onward')}
            >
              🚆 1. Onward Trains ({source || 'Origin'} → {destination || 'Destination'}) ({filteredTrains.length})
              {selectedOnwardTrain && <span style={{ marginLeft: '6px', color: 'var(--success)' }}>✓</span>}
            </button>
            <button
              type="button"
              className={`tab-btn ${activeTab === 'return' ? 'active' : ''}`}
              onClick={() => setActiveTab('return')}
            >
              🔄 2. Return Trains ({destination || 'Destination'} → {source || 'Origin'}) ({returnTrains.length})
              {selectedReturnTrain && <span style={{ marginLeft: '6px', color: 'var(--success)' }}>✓</span>}
            </button>
          </div>
        )}

        {/* Results Counter */}
        <p className="train-result-count">
          {tripType === 'roundTrip' ? (
            activeTab === 'onward' ? (
              <span>Showing <strong>{filteredTrains.length}</strong> onward train{filteredTrains.length !== 1 ? 's' : ''}</span>
            ) : (
              <span>Showing <strong>{returnTrains.length}</strong> return train{returnTrains.length !== 1 ? 's' : ''}</span>
            )
          ) : (
            <span>Showing <strong>{filteredTrains.length}</strong> train{filteredTrains.length !== 1 ? 's' : ''} across India</span>
          )}
        </p>

        {/* Train Results List */}
        <div className="trains-results">
          {tripType === 'roundTrip' ? (
            activeTab === 'onward' ? (
              filteredTrains.length > 0 ? (
                filteredTrains.map((train) => (
                  <TrainCard
                    key={train.id}
                    train={train}
                    selectedDate={date}
                    isRoundTrip={true}
                    returnDate={returnDate}
                    returnTrain={selectedReturnTrain}
                    isSelected={selectedOnwardTrain?.id === train.id}
                    selectLabel="Select as Onward"
                    onSelect={(t) => {
                      setSelectedOnwardTrain(t);
                      if (!selectedReturnTrain && returnTrains.length > 0) {
                        setActiveTab('return');
                      }
                    }}
                  />
                ))
              ) : (
                <div className="empty-state">
                  <div className="icon">🔍</div>
                  <h3>No onward trains found</h3>
                  <p>Try different source or destination stations across India.</p>
                </div>
              )
            ) : returnTrains.length > 0 ? (
              returnTrains.map((train) => (
                <TrainCard
                  key={train.id}
                  train={train}
                  selectedDate={returnDate}
                  isRoundTrip={true}
                  returnDate={returnDate}
                  isSelected={selectedReturnTrain?.id === train.id}
                  selectLabel="Select as Return"
                  onSelect={(t) => setSelectedReturnTrain(t)}
                />
              ))
            ) : (
              <div className="empty-state">
                <div className="icon">🔄</div>
                <h3>No return trains found for this corridor</h3>
                <p>Try searching for a major junction or proceed to booking to customize your return journey.</p>
              </div>
            )
          ) : filteredTrains.length > 0 ? (
            filteredTrains.map((train) => (
              <TrainCard
                key={train.id}
                train={train}
                selectedDate={date}
                isRoundTrip={false}
              />
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
