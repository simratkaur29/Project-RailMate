import { useState } from 'react';
import { Link } from 'react-router-dom';
import RestaurantCard from '../components/RestaurantCard';
import { useFoodCart } from '../context/FoodCartContext';
import { getAllStations, getStationById, searchRestaurants, getAllCuisines } from '../services/foodService';
import '../styles/stationbites.css';

/**
 * StationBites — Landing page for the Station Bites food discovery feature.
 *
 * NOTE: All restaurant data shown is SAMPLE / DEMONSTRATION data.
 * Distances displayed are straight-line distances calculated from
 * coordinates stored in the demonstration dataset.
 */
function StationBites() {
  const stations = getAllStations();
  const cuisines = getAllCuisines();
  const { itemCount } = useFoodCart();

  // Search state
  const [selectedStation, setSelectedStation] = useState('');
  const [radius, setRadius] = useState(2);
  const [useLocation, setUseLocation] = useState(false);
  const [userCoords, setUserCoords] = useState(null);
  const [locationStatus, setLocationStatus] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  // Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [cuisineFilter, setCuisineFilter] = useState('all');
  const [vegOnly, setVegOnly] = useState(false);
  const [priceFilter, setPriceFilter] = useState('all');
  const [sortBy, setSortBy] = useState('distance');

  // Results
  const [results, setResults] = useState([]);

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('Geolocation is not supported by your browser.');
      return;
    }

    setLocationStatus('Detecting your location…');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserCoords({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
        setUseLocation(true);
        setSelectedStation('');
        setLocationStatus('Location detected successfully!');
      },
      (error) => {
        setUseLocation(false);
        setUserCoords(null);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationStatus('Location permission denied. Please select a station manually.');
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationStatus('Location information unavailable. Please select a station manually.');
            break;
          case error.TIMEOUT:
            setLocationStatus('Location request timed out. Please select a station manually.');
            break;
          default:
            setLocationStatus('Unable to detect location. Please select a station manually.');
        }
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
    );
  };

  const handleStationChange = (e) => {
    setSelectedStation(e.target.value);
    if (e.target.value) {
      setUseLocation(false);
      setUserCoords(null);
      setLocationStatus('');
    }
  };

  const handleSearch = () => {
    let lat, lon;

    if (useLocation && userCoords) {
      lat = userCoords.lat;
      lon = userCoords.lon;
    } else if (selectedStation) {
      const station = getStationById(selectedStation);
      if (station) {
        lat = station.latitude;
        lon = station.longitude;
      }
    }

    if (lat == null || lon == null) {
      setLocationStatus('Please select a station or use your location to search.');
      return;
    }

    const found = searchRestaurants(lat, lon, radius, {
      search: searchTerm,
      cuisine: cuisineFilter,
      vegetarian: vegOnly,
      priceRange: priceFilter,
      sort: sortBy,
    });

    setResults(found);
    setHasSearched(true);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setCuisineFilter('all');
    setVegOnly(false);
    setPriceFilter('all');
    setSortBy('distance');
  };

  // Re-filter when filters change (if already searched)
  const applyFilters = () => {
    if (!hasSearched) return;
    handleSearch();
  };

  return (
    <main className="station-bites-page">
      {/* Hero */}
      <section className="sb-hero">
        <div className="container sb-hero-content">
          <h1>Good Food, Closer to Your <span className="accent">Journey</span></h1>
          <p>Discover food outlets around your railway station.</p>

          <div className="sb-search-panel">
            <div className="sb-search-row">
              <div className="form-group">
                <label htmlFor="sb-station">Select Station</label>
                <select
                  id="sb-station"
                  value={selectedStation}
                  onChange={handleStationChange}
                  disabled={useLocation}
                >
                  <option value="">— Choose a station —</option>
                  {stations.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="sb-radius">Search Radius</label>
                <select
                  id="sb-radius"
                  value={radius}
                  onChange={(e) => setRadius(Number(e.target.value))}
                >
                  <option value={1}>1 km</option>
                  <option value={2}>2 km</option>
                </select>
              </div>

              <button
                type="button"
                className={`btn ${useLocation ? 'btn-success' : 'btn-outline'} sb-location-btn`}
                onClick={handleUseLocation}
                style={!useLocation ? { color: 'white', borderColor: 'rgba(255,255,255,0.4)' } : {}}
              >
                📍 {useLocation ? 'Location Set' : 'Use My Location'}
              </button>

              <button className="btn btn-accent" onClick={handleSearch}>
                🔍 Find Food Nearby
              </button>
            </div>

            {locationStatus && (
              <p className="sb-location-status">{locationStatus}</p>
            )}
          </div>
        </div>
      </section>

      {/* Demo Notice */}
      <div className="container">
        <div className="sb-demo-notice">
          <strong>Demo Notice:</strong> All restaurants, menus, and prices shown below are sample data
          for demonstration purposes. Distances are straight-line distances calculated from
          coordinates in the sample dataset.
        </div>
      </div>

      {/* Filters & Results */}
      {hasSearched && (
        <section className="sb-results-section">
          <div className="container">
            {/* Filters */}
            <div className="sb-filters">
              <div className="sb-filters-row">
                <div className="form-group">
                  <label htmlFor="sb-search">Search</label>
                  <input
                    id="sb-search"
                    type="text"
                    placeholder="Restaurant name…"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="sb-cuisine">Cuisine</label>
                  <select
                    id="sb-cuisine"
                    value={cuisineFilter}
                    onChange={(e) => setCuisineFilter(e.target.value)}
                  >
                    <option value="all">All Cuisines</option>
                    {cuisines.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="sb-price">Price Range</label>
                  <select
                    id="sb-price"
                    value={priceFilter}
                    onChange={(e) => setPriceFilter(e.target.value)}
                  >
                    <option value="all">All Prices</option>
                    <option value="budget">Budget (≤ ₹100)</option>
                    <option value="mid">Mid-Range (₹100–₹200)</option>
                    <option value="premium">Premium ({'>'}₹200)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="sb-sort">Sort By</label>
                  <select
                    id="sb-sort"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="distance">Nearest First</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                </div>

                <label className="sb-veg-toggle">
                  <input
                    type="checkbox"
                    checked={vegOnly}
                    onChange={(e) => setVegOnly(e.target.checked)}
                  />
                  <span>Veg Only</span>
                </label>
              </div>

              <div className="sb-filters-actions">
                <button className="btn btn-primary btn-sm" onClick={applyFilters}>
                  Apply Filters
                </button>
                <button className="btn btn-outline btn-sm" onClick={() => { resetFilters(); }}>
                  Reset Filters
                </button>
              </div>
            </div>

            {/* Results count */}
            <p className="sb-result-count">
              {results.length} restaurant{results.length !== 1 ? 's' : ''} found
              {useLocation ? ' near your location' : selectedStation ? ` near ${getStationById(selectedStation)?.name}` : ''}
              {' '}within {radius} km
            </p>

            {/* Restaurant Grid */}
            {results.length > 0 ? (
              <div className="sb-restaurant-grid">
                {results.map((r) => (
                  <RestaurantCard key={r.id} restaurant={r} />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="icon">🍽️</div>
                <h3>No restaurants found</h3>
                <p>Try adjusting your filters, selecting a different station, or increasing the search radius.</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Cart FAB */}
      {itemCount > 0 && (
        <Link to="/station-bites/cart" className="sb-cart-fab" aria-label="View Cart">
          🛒 <span className="sb-cart-fab-count">{itemCount}</span>
        </Link>
      )}
    </main>
  );
}

export default StationBites;
