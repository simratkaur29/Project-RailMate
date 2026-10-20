import { Link } from 'react-router-dom';

/**
 * RestaurantCard — Displays a restaurant summary in the Station Bites listing.
 * Reuses RailMate's existing .card class and design tokens.
 */
function RestaurantCard({ restaurant }) {
  const {
    id,
    name,
    cuisine,
    distance,
    vegetarian,
    priceRange,
    description,
    image,
  } = restaurant;

  return (
    <div className="restaurant-card card">
      <div className="restaurant-card-image">
        <img
          src={image}
          alt={`${name} — ${cuisine} restaurant`}
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'data:image/svg+xml,' + encodeURIComponent(
              `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="220" fill="%23f0f0f0"><rect width="400" height="220"/><text x="200" y="110" text-anchor="middle" fill="%23999" font-size="16" font-family="sans-serif">Image unavailable</text></svg>`
            );
          }}
        />
        {vegetarian && (
          <span className="restaurant-card-veg-badge badge badge-success">
            Pure Veg
          </span>
        )}
      </div>

      <div className="restaurant-card-body">
        <div className="restaurant-card-header">
          <h3 className="restaurant-card-name">{name}</h3>
          <span className="restaurant-card-cuisine badge badge-primary">{cuisine}</span>
        </div>

        <p className="restaurant-card-desc">{description}</p>

        <div className="restaurant-card-meta">
          <span className="restaurant-card-distance">
            📍 {distance != null ? `${distance} km` : 'Distance N/A'}
          </span>
          <span className="restaurant-card-price">{priceRange}</span>
        </div>

        <Link
          to={`/station-bites/restaurant/${id}`}
          className="btn btn-primary btn-sm restaurant-card-btn"
        >
          View Menu
        </Link>
      </div>
    </div>
  );
}

export default RestaurantCard;
