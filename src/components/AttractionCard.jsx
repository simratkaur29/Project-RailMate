/**
 * AttractionCard — Displays an attraction with name, description, category, and
 * an Add/Remove button for the My Trip feature.
 */
function AttractionCard({ attraction, destinationName, isSaved, onToggleSave }) {
  const categoryIcons = {
    'History and Heritage': '🏛️',
    Nature: '🌿',
    Shopping: '🛍️',
    'Family-Friendly': '👨‍👩‍👧‍👦',
  };

  const icon = categoryIcons[attraction.category] || '📍';
  const imageSrc = attraction.image || `/images/attractions/${attraction.id}.jpg`;

  return (
    <div className="attraction-card card">
      {imageSrc && (
        <div className="attraction-image-wrapper">
          <img
            src={imageSrc}
            alt={attraction.name}
            className="attraction-photo"
            loading="lazy"
            onError={(e) => {
              // Hide image if failed to load
              e.currentTarget.parentElement.style.display = 'none';
            }}
          />
        </div>
      )}
      <div className="attraction-card-header">
        <span className="attraction-icon">{icon}</span>
        <span className="badge badge-primary">{attraction.category}</span>
      </div>
      <h4 className="attraction-name">{attraction.name}</h4>
      <p className="attraction-desc">{attraction.description}</p>
      <button
        className={`btn btn-sm ${isSaved ? 'btn-danger' : 'btn-accent'}`}
        onClick={() => onToggleSave(attraction, destinationName)}
        aria-label={isSaved ? `Remove ${attraction.name} from trip` : `Add ${attraction.name} to trip`}
      >
        {isSaved ? '✕ Remove from Trip' : '＋ Add to My Trip'}
      </button>
    </div>
  );
}

export default AttractionCard;
