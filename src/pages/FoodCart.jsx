import { Link } from 'react-router-dom';
import CartItem from '../components/CartItem';
import { useFoodCart } from '../context/FoodCartContext';
import '../styles/stationbites.css';

/**
 * FoodCart — Displays the current cart contents with totals.
 *
 * NOTE: This is a demonstration feature. No real order will be placed.
 */
function FoodCart() {
  const { cartItems, cartRestaurant, subtotal, itemCount, clearCart } = useFoodCart();

  if (cartItems.length === 0) {
    return (
      <main className="station-bites-page">
        <div className="page-header">
          <h1>Your Cart</h1>
          <p>Your food cart is empty</p>
        </div>
        <div className="container" style={{ textAlign: 'center', padding: '3rem 0' }}>
          <div className="empty-state">
            <div className="icon">🛒</div>
            <h3>Nothing in your cart yet</h3>
            <p>Browse restaurants near your station and add delicious items!</p>
            <Link to="/station-bites" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              Browse Station Bites
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="station-bites-page">
      <div className="page-header">
        <h1>Your Cart</h1>
        <p>{itemCount} item{itemCount !== 1 ? 's' : ''} from {cartRestaurant?.name || 'Restaurant'}</p>
      </div>

      <div className="container fc-content">
        <div className="fc-layout">
          {/* Cart Items */}
          <div className="fc-items">
            <div className="fc-restaurant-header">
              <h3>
                Items from <span style={{ color: 'var(--secondary)' }}>{cartRestaurant?.name}</span>
              </h3>
              <Link
                to={`/station-bites/restaurant/${cartRestaurant?.id}`}
                className="btn btn-outline btn-sm"
              >
                + Add More
              </Link>
            </div>

            {cartItems.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}

            <button className="btn btn-danger btn-sm fc-clear-btn" onClick={clearCart}>
              Clear Cart
            </button>
          </div>

          {/* Order Summary */}
          <div className="fc-summary card">
            <h3>Order Summary</h3>
            <div className="fc-summary-lines">
              {cartItems.map((item) => (
                <div key={item.id} className="fc-summary-line">
                  <span>{item.name} × {item.quantity}</span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
            <div className="fc-summary-divider"></div>
            <div className="fc-summary-total">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            <p className="fc-summary-note">
              * No additional taxes or delivery fees are applied in this demo.
            </p>
            <Link to="/station-bites/checkout" className="btn btn-accent fc-checkout-btn">
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default FoodCart;
