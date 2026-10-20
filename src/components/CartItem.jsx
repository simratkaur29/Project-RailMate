import { useFoodCart } from '../context/FoodCartContext';

/**
 * CartItem — Displays a single cart line item with quantity controls.
 * Used on the FoodCart page.
 */
function CartItem({ item }) {
  const { increaseQuantity, decreaseQuantity, removeItem } = useFoodCart();

  const lineTotal = item.price * item.quantity;

  return (
    <div className="cart-item card">
      <div className="cart-item-info">
        <div className="cart-item-header">
          <h4 className="cart-item-name">
            <span className={`food-veg-indicator ${item.vegetarian ? 'veg' : 'non-veg'}`}
                  title={item.vegetarian ? 'Vegetarian' : 'Non-Vegetarian'}>
              ●
            </span>
            {item.name}
          </h4>
          <button
            className="cart-item-remove"
            onClick={() => removeItem(item.id)}
            aria-label={`Remove ${item.name} from cart`}
            title="Remove item"
          >
            ✕
          </button>
        </div>

        <p className="cart-item-price-unit">₹{item.price} each</p>

        <div className="cart-item-controls">
          <div className="food-item-qty">
            <button
              className="qty-btn"
              onClick={() => decreaseQuantity(item.id)}
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="qty-value">{item.quantity}</span>
            <button
              className="qty-btn"
              onClick={() => increaseQuantity(item.id)}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
          <span className="cart-item-total">₹{lineTotal}</span>
        </div>
      </div>
    </div>
  );
}

export default CartItem;
