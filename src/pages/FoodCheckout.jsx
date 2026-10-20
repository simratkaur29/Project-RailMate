import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useFoodCart } from '../context/FoodCartContext';
import '../styles/stationbites.css';

/**
 * FoodCheckout — Frontend-only checkout form for demo orders.
 *
 * IMPORTANT: This is a DEMONSTRATION checkout. No real payment is processed,
 * no real order is placed, and no restaurant will receive this order.
 */
function FoodCheckout() {
  const navigate = useNavigate();
  const { cartItems, cartRestaurant, subtotal, itemCount, clearCart } = useFoodCart();

  // Form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [preference, setPreference] = useState('pickup');
  const [deliveryLocation, setDeliveryLocation] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [errors, setErrors] = useState({});

  // Redirect if cart is empty (and not showing confirmation for just-placed order)
  useEffect(() => {
    if (cartItems.length === 0 && !showConfirmation) {
      navigate('/station-bites/cart');
    }
  }, [cartItems.length, showConfirmation, navigate]);

  const validate = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required.';
    }

    if (!phone.trim()) {
      newErrors.phone = 'Contact number is required.';
    } else if (!/^[6-9]\d{9}$/.test(phone.trim())) {
      newErrors.phone = 'Enter a valid 10-digit Indian mobile number.';
    }

    if (preference === 'delivery' && !deliveryLocation.trim()) {
      newErrors.deliveryLocation = 'Delivery location is required.';
    }

    if (cartItems.length === 0) {
      newErrors.cart = 'Your cart is empty.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleShowConfirmation = (e) => {
    e.preventDefault();
    if (validate()) {
      setShowConfirmation(true);
    }
  };

  const handlePlaceOrder = () => {
    // Generate unique order ID
    const orderId = 'DEMO-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();

    const order = {
      id: orderId,
      date: new Date().toISOString(),
      restaurant: cartRestaurant?.name || 'Unknown Restaurant',
      restaurantId: cartRestaurant?.id || '',
      items: cartItems.map((ci) => ({
        id: ci.id,
        name: ci.name,
        price: ci.price,
        quantity: ci.quantity,
        vegetarian: ci.vegetarian,
      })),
      subtotal,
      customer: {
        name: name.trim(),
        phone: phone.trim(),
      },
      preference,
      deliveryLocation: preference === 'delivery' ? deliveryLocation.trim() : null,
      status: 'Demo Order Confirmed',
    };

    // Save to localStorage — append to existing orders
    try {
      const existing = JSON.parse(localStorage.getItem('railmate_food_orders') || '[]');
      if (!Array.isArray(existing)) {
        localStorage.setItem('railmate_food_orders', JSON.stringify([order]));
      } else {
        existing.unshift(order);
        localStorage.setItem('railmate_food_orders', JSON.stringify(existing));
      }
    } catch {
      localStorage.setItem('railmate_food_orders', JSON.stringify([order]));
    }

    // Clear cart
    clearCart();

    // Navigate to confirmation (using replace to prevent duplicate on back)
    navigate('/station-bites/orders', {
      replace: true,
      state: { justPlaced: orderId },
    });
  };

  if (cartItems.length === 0 && !showConfirmation) {
    return null; // useEffect will redirect
  }

  return (
    <main className="station-bites-page">
      <div className="page-header">
        <h1>Checkout</h1>
        <p>Review your demo order and provide your details</p>
      </div>

      <div className="container fco-content">
        <div className="sb-demo-notice">
          <strong>Demonstration Only:</strong> This is a simulated checkout. No real payment will be
          processed, no food will be delivered, and the restaurant will not receive your order.
        </div>

        <div className="fco-layout">
          {/* Checkout Form */}
          <form className="fco-form" onSubmit={handleShowConfirmation}>
            <h3>Your Details</h3>

            <div className="form-group">
              <label htmlFor="fco-name">Full Name *</label>
              <input
                id="fco-name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {errors.name && <p className="form-error">{errors.name}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="fco-phone">Contact Number *</label>
              <input
                id="fco-phone"
                type="tel"
                placeholder="10-digit mobile number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                maxLength={10}
              />
              {errors.phone && <p className="form-error">{errors.phone}</p>}
            </div>

            <div className="form-group">
              <label>Pickup / Delivery Preference</label>
              <div className="fco-radio-group">
                <label className="fco-radio">
                  <input
                    type="radio"
                    name="preference"
                    value="pickup"
                    checked={preference === 'pickup'}
                    onChange={(e) => setPreference(e.target.value)}
                  />
                  <span>Pickup from Restaurant</span>
                </label>
                <label className="fco-radio">
                  <input
                    type="radio"
                    name="preference"
                    value="delivery"
                    checked={preference === 'delivery'}
                    onChange={(e) => setPreference(e.target.value)}
                  />
                  <span>Delivery (Demo Only)</span>
                </label>
              </div>
            </div>

            {preference === 'pickup' && (
              <p className="fco-preference-note">
                <strong>Note:</strong> This is a simulated order. The restaurant will not
                prepare food for pickup.
              </p>
            )}

            {preference === 'delivery' && (
              <>
                <div className="form-group">
                  <label htmlFor="fco-delivery">Delivery Location *</label>
                  <input
                    id="fco-delivery"
                    type="text"
                    placeholder="e.g. Platform 3, Coach S5"
                    value={deliveryLocation}
                    onChange={(e) => setDeliveryLocation(e.target.value)}
                  />
                  {errors.deliveryLocation && (
                    <p className="form-error">{errors.deliveryLocation}</p>
                  )}
                </div>
                <p className="fco-preference-note">
                  <strong>Note:</strong> This is a demonstration. Actual delivery cannot be
                  arranged through this demo application.
                </p>
              </>
            )}

            {errors.cart && <p className="form-error">{errors.cart}</p>}

            <button type="submit" className="btn btn-accent fco-submit-btn">
              Review & Place Demo Order
            </button>
          </form>

          {/* Order Summary Sidebar */}
          <div className="fc-summary card">
            <h3>Order Summary</h3>
            <p className="fc-summary-restaurant">{cartRestaurant?.name}</p>
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
              <span>Total</span>
              <span>₹{subtotal}</span>
            </div>
            <p className="fc-summary-note">
              * No real payment will be charged.
            </p>
            <Link to="/station-bites/cart" className="btn btn-outline btn-sm" style={{ width: '100%', marginTop: '0.5rem' }}>
              ← Edit Cart
            </Link>
          </div>
        </div>
      </div>

      {/* Final Confirmation Modal */}
      {showConfirmation && (
        <div className="sb-modal-overlay" onClick={() => setShowConfirmation(false)}>
          <div className="sb-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Confirm Demo Order</h3>
            <p>
              <strong>Restaurant:</strong> {cartRestaurant?.name}<br />
              <strong>Items:</strong> {itemCount}<br />
              <strong>Total:</strong> ₹{subtotal}<br />
              <strong>Name:</strong> {name}<br />
              <strong>Phone:</strong> {phone}<br />
              <strong>Preference:</strong> {preference === 'pickup' ? 'Pickup' : 'Delivery'}
              {preference === 'delivery' && ` — ${deliveryLocation}`}
            </p>
            <div className="sb-demo-notice" style={{ marginTop: '1rem' }}>
              This is a demonstration order. The restaurant has not received your order,
              no payment has been processed, and no food delivery has been arranged.
            </div>
            <div className="sb-modal-actions">
              <button className="btn btn-outline btn-sm" onClick={() => setShowConfirmation(false)}>
                Go Back
              </button>
              <button className="btn btn-accent btn-sm" onClick={handlePlaceOrder}>
                Place Demo Order
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default FoodCheckout;
