import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/stationbites.css';

/**
 * MyOrders — Displays previous demo orders from localStorage.
 *
 * NOTE: All orders shown are DEMONSTRATION orders. No real restaurant
 * has received these orders and no real payment has been processed.
 */
function MyOrders() {
  const location = useLocation();
  const justPlacedId = location.state?.justPlaced || null;

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('railmate_food_orders') || '[]');
      if (Array.isArray(saved)) {
        setOrders(saved);
      }
    } catch {
      setOrders([]);
    }
  }, []);

  const handleCancelOrder = (orderId) => {
    setOrders((prev) => {
      const updated = prev.map((o) =>
        o.id === orderId ? { ...o, status: 'Cancelled (Demo)' } : o
      );
      localStorage.setItem('railmate_food_orders', JSON.stringify(updated));
      return updated;
    });
  };

  const formatDate = (isoString) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <main className="station-bites-page">
      <div className="page-header">
        <h1>My Orders</h1>
        <p>Your demo food order history</p>
      </div>

      <div className="container mo-content">
        {/* Confirmation banner for a just-placed order */}
        {justPlacedId && (
          <div className="mo-confirmation-banner">
            <div className="mo-confirmation-icon">✓</div>
            <h3>Demo Order Placed Successfully!</h3>
            <p>Your demo order <strong>{justPlacedId}</strong> has been created.</p>
            <div className="sb-demo-notice" style={{ marginTop: '1rem' }}>
              This is a demonstration order. The restaurant has not received your order,
              no payment has been processed, and no food delivery has been arranged.
            </div>
          </div>
        )}

        {orders.length === 0 ? (
          <div className="empty-state">
            <div className="icon">📋</div>
            <h3>No orders yet</h3>
            <p>Place a demo order from Station Bites to see it here.</p>
            <Link to="/station-bites" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              Browse Station Bites
            </Link>
          </div>
        ) : (
          <div className="mo-orders-list">
            {orders.map((order) => (
              <div
                key={order.id}
                className={`mo-order-card card ${order.id === justPlacedId ? 'mo-order-highlight' : ''}`}
              >
                <div className="mo-order-header">
                  <div>
                    <h3 className="mo-order-id">Order #{order.id}</h3>
                    <p className="mo-order-date">{formatDate(order.date)}</p>
                  </div>
                  <span className={`badge ${
                    order.status === 'Demo Order Confirmed' ? 'badge-success' :
                    order.status === 'Cancelled (Demo)' ? 'badge-error' : 'badge-primary'
                  }`}>
                    {order.status}
                  </span>
                </div>

                <div className="mo-order-restaurant">
                  <strong>{order.restaurant}</strong>
                  <span className="mo-order-preference badge badge-accent">
                    {order.preference === 'pickup' ? 'Pickup' : 'Delivery'}
                  </span>
                </div>

                <div className="mo-order-items">
                  {order.items.map((item) => (
                    <div key={item.id} className="mo-order-item">
                      <span>
                        <span className={`food-veg-indicator ${item.vegetarian ? 'veg' : 'non-veg'}`}>●</span>
                        {item.name} × {item.quantity}
                      </span>
                      <span>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="mo-order-footer">
                  <span className="mo-order-total">
                    Total: <strong>₹{order.subtotal}</strong>
                  </span>
                  {order.status === 'Demo Order Confirmed' && (
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => handleCancelOrder(order.id)}
                    >
                      Cancel (Demo)
                    </button>
                  )}
                </div>

                {order.status === 'Cancelled (Demo)' && (
                  <p className="mo-cancel-note">
                    This demo order has been cancelled locally. No real restaurant order was affected.
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default MyOrders;
