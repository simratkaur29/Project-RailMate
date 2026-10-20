import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import FoodItemCard from '../components/FoodItemCard';
import { useFoodCart } from '../context/FoodCartContext';
import { getRestaurantById } from '../services/foodService';
import '../styles/stationbites.css';

/**
 * RestaurantMenu — Displays a restaurant's details and menu.
 * Accessed via /station-bites/restaurant/:restaurantId
 *
 * NOTE: All menu items, prices, and availability shown are SAMPLE DATA.
 */
function RestaurantMenu() {
  const { restaurantId } = useParams();
  const restaurant = getRestaurantById(restaurantId);
  const { itemCount, forceAddItem } = useFoodCart();

  // Menu filters
  const [menuFilter, setMenuFilter] = useState('all');
  const [dishSearch, setDishSearch] = useState('');

  // Confirmation modal state
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingItem, setPendingItem] = useState(null);

  if (!restaurant) {
    return (
      <main className="station-bites-page">
        <div className="page-header">
          <h1>Restaurant Not Found</h1>
          <p>The restaurant you're looking for doesn't exist in our demo data.</p>
        </div>
        <div className="container" style={{ textAlign: 'center', padding: '3rem 0' }}>
          <Link to="/station-bites" className="btn btn-primary">
            ← Back to Station Bites
          </Link>
        </div>
      </main>
    );
  }

  const handleNeedsConfirmation = (item) => {
    setPendingItem(item);
    setShowConfirmation(true);
  };

  const handleConfirmSwitch = () => {
    if (pendingItem) {
      forceAddItem(pendingItem, restaurant);
    }
    setShowConfirmation(false);
    setPendingItem(null);
  };

  const handleCancelSwitch = () => {
    setShowConfirmation(false);
    setPendingItem(null);
  };

  // Filter menu items
  let filteredMenu = restaurant.menu;

  if (menuFilter === 'veg') {
    filteredMenu = filteredMenu.filter((item) => item.vegetarian);
  } else if (menuFilter === 'non-veg') {
    filteredMenu = filteredMenu.filter((item) => !item.vegetarian);
  }

  if (dishSearch.trim()) {
    const term = dishSearch.toLowerCase();
    filteredMenu = filteredMenu.filter(
      (item) =>
        item.name.toLowerCase().includes(term) ||
        item.description.toLowerCase().includes(term)
    );
  }

  const hasNonVeg = restaurant.menu.some((item) => !item.vegetarian);

  return (
    <main className="station-bites-page">
      {/* Restaurant Header */}
      <section className="rm-hero">
        <div className="rm-hero-image">
          <img
            src={restaurant.image}
            alt={`${restaurant.name} — ${restaurant.cuisine} restaurant`}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'data:image/svg+xml,' + encodeURIComponent(
                `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="300" fill="%23f0f0f0"><rect width="1200" height="300"/><text x="600" y="150" text-anchor="middle" fill="%23999" font-size="20" font-family="sans-serif">Image unavailable</text></svg>`
              );
            }}
          />
          <div className="rm-hero-overlay">
            <div className="container">
              <Link to="/station-bites" className="rm-back-link">← Back to Station Bites</Link>
              <h1>{restaurant.name}</h1>
              <div className="rm-hero-meta">
                <span className="badge badge-primary">{restaurant.cuisine}</span>
                {restaurant.vegetarian && <span className="badge badge-success">Pure Veg</span>}
                <span className="rm-hero-price">{restaurant.priceRange}</span>
              </div>
              <p className="rm-hero-desc">{restaurant.description}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="container rm-content">
        {/* Demo Notice */}
        <div className="sb-demo-notice">
          <strong>Demo Menu:</strong> Items, prices, and availability below are sample data
          for demonstration purposes only. This is not a live menu.
        </div>

        {/* Menu Filters */}
        <div className="rm-filters">
          <div className="tab-nav">
            <button
              className={`tab-btn ${menuFilter === 'all' ? 'active' : ''}`}
              onClick={() => setMenuFilter('all')}
            >
              All Items
            </button>
            <button
              className={`tab-btn ${menuFilter === 'veg' ? 'active' : ''}`}
              onClick={() => setMenuFilter('veg')}
            >
              🟢 Vegetarian
            </button>
            {hasNonVeg && (
              <button
                className={`tab-btn ${menuFilter === 'non-veg' ? 'active' : ''}`}
                onClick={() => setMenuFilter('non-veg')}
              >
                🔴 Non-Vegetarian
              </button>
            )}
          </div>

          <div className="form-group rm-dish-search">
            <input
              type="text"
              placeholder="Search dishes…"
              value={dishSearch}
              onChange={(e) => setDishSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Menu Items */}
        {filteredMenu.length > 0 ? (
          <div className="rm-menu-grid">
            {filteredMenu.map((item) => (
              <FoodItemCard
                key={item.id}
                item={item}
                restaurant={restaurant}
                onNeedsConfirmation={handleNeedsConfirmation}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="icon">🍽️</div>
            <h3>No dishes found</h3>
            <p>Try adjusting your search or filter.</p>
          </div>
        )}
      </div>

      {/* Restaurant Switch Confirmation Modal */}
      {showConfirmation && (
        <div className="sb-modal-overlay" onClick={handleCancelSwitch}>
          <div className="sb-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Switch Restaurant?</h3>
            <p>
              Your cart contains items from a different restaurant. To add items
              from <strong>{restaurant.name}</strong>, your current cart will be cleared.
            </p>
            <div className="sb-modal-actions">
              <button className="btn btn-outline btn-sm" onClick={handleCancelSwitch}>
                Cancel
              </button>
              <button className="btn btn-accent btn-sm" onClick={handleConfirmSwitch}>
                Clear Cart & Add
              </button>
            </div>
          </div>
        </div>
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

export default RestaurantMenu;
