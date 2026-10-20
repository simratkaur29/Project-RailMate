import { useFoodCart } from '../context/FoodCartContext';

/**
 * FoodItemCard — Displays a single menu item with add-to-cart controls.
 * Used on the RestaurantMenu page.
 */
function FoodItemCard({ item, restaurant, onNeedsConfirmation }) {
  const { addItem, getItemQuantity, increaseQuantity, decreaseQuantity } = useFoodCart();

  const quantity = getItemQuantity(item.id);

  const handleAdd = () => {
    const result = addItem(item, restaurant);
    if (!result.success && result.needsConfirmation) {
      onNeedsConfirmation(item);
    }
  };

  return (
    <div className={`food-item-card card ${!item.available ? 'food-item-unavailable' : ''}`}>
      <div className="food-item-body">
        <div className="food-item-header">
          <h4 className="food-item-name">
            <span className={`food-veg-indicator ${item.vegetarian ? 'veg' : 'non-veg'}`} 
                  title={item.vegetarian ? 'Vegetarian' : 'Non-Vegetarian'}>
              ●
            </span>
            {item.name}
          </h4>
          <span className="food-item-price">₹{item.price}</span>
        </div>

        <p className="food-item-desc">{item.description}</p>

        {!item.available && (
          <span className="badge badge-error" style={{ marginTop: '6px', display: 'inline-block' }}>
            Currently Unavailable (Demo)
          </span>
        )}

        {item.available && (
          <div className="food-item-actions">
            {quantity === 0 ? (
              <button className="btn btn-accent btn-sm" onClick={handleAdd}>
                Add to Cart
              </button>
            ) : (
              <div className="food-item-qty">
                <button
                  className="qty-btn"
                  onClick={() => decreaseQuantity(item.id)}
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="qty-value">{quantity}</span>
                <button
                  className="qty-btn"
                  onClick={() => increaseQuantity(item.id)}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default FoodItemCard;
