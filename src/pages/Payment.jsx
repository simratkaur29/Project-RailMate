import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/profile.css';
import '../styles/payment.css';

/**
 * Payment Page — Dedicated checkout flow for RailMate.
 * Displays booking order summary, itemized fare with GST, payment methods,
 * simulated gateway processing, and final booking confirmation receipt.
 */
function Payment({ user }) {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingOrder = location.state?.bookingOrder;

  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [upiId, setUpiId] = useState('');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: bookingOrder?.passengerName || '',
    expiry: '',
    cvv: '',
  });
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [selectedWallet, setSelectedWallet] = useState('Paytm');
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // If no active booking order, show fallback
  if (!bookingOrder) {
    return (
      <main className="payment-page">
        <div className="page-header">
          <h1>💳 Payment Gateway</h1>
          <p>No active booking pending payment</p>
        </div>
        <div className="container payment-container">
          <div className="empty-state card" style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
            <div className="icon" style={{ fontSize: '3rem' }}>🎫</div>
            <h3>No Booking Selected</h3>
            <p style={{ color: 'var(--text-light)', marginTop: '8px' }}>
              Please select a train and fill in passenger details before proceeding to payment.
            </p>
            <button
              className="btn btn-primary"
              style={{ marginTop: '1.5rem' }}
              onClick={() => navigate('/trains')}
            >
              🔍 Search Trains
            </button>
          </div>
        </div>
      </main>
    );
  }

  // Format Card Number input with spaces every 4 digits
  const handleCardNumberChange = (val) => {
    const raw = val.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardDetails({ ...cardDetails, number: formatted });
    if (errors.cardNumber) setErrors({ ...errors, cardNumber: '' });
  };

  // Format Card Expiry MM/YY
  const handleCardExpiryChange = (val) => {
    let clean = val.replace(/\D/g, '').slice(0, 4);
    if (clean.length > 2) {
      clean = clean.slice(0, 2) + '/' + clean.slice(2);
    }
    setCardDetails({ ...cardDetails, expiry: clean });
    if (errors.cardExpiry) setErrors({ ...errors, cardExpiry: '' });
  };

  // Validate payment inputs based on selected method
  const validatePaymentInputs = () => {
    const newErrors = {};

    if (paymentMethod === 'upi') {
      const upiRegex = /^[\w.-]+@[\w.-]+$/;
      if (!upiId.trim()) {
        newErrors.upiId = 'UPI ID is required (e.g. yourname@oksbi).';
      } else if (!upiRegex.test(upiId.trim())) {
        newErrors.upiId = 'Enter a valid UPI Virtual Payment Address (e.g. username@bank).';
      }
    } else if (paymentMethod === 'card') {
      const cleanNumber = cardDetails.number.replace(/\s/g, '');
      if (!cleanNumber) {
        newErrors.cardNumber = 'Card number is required.';
      } else if (!/^\d{16}$/.test(cleanNumber)) {
        newErrors.cardNumber = 'Card number must be exactly 16 digits.';
      }

      if (!cardDetails.name.trim()) {
        newErrors.cardName = 'Cardholder name is required.';
      } else if (!/^[A-Za-z\s]{3,50}$/.test(cardDetails.name.trim())) {
        newErrors.cardName = 'Enter a valid cardholder name (letters only).';
      }

      if (!cardDetails.expiry) {
        newErrors.cardExpiry = 'Expiry date (MM/YY) is required.';
      } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardDetails.expiry)) {
        newErrors.cardExpiry = 'Enter a valid expiry date in MM/YY format.';
      }

      if (!cardDetails.cvv) {
        newErrors.cardCvv = 'CVV is required.';
      } else if (!/^\d{3}$/.test(cardDetails.cvv)) {
        newErrors.cardCvv = 'CVV must be 3 digits.';
      }
    }

    return newErrors;
  };

  // Process payment simulation
  const handlePayNow = (e) => {
    e.preventDefault();

    const validationErrors = validatePaymentInputs();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsProcessing(true);

    // Simulate payment gateway delay (1.2 seconds)
    setTimeout(() => {
      const bookingId = 'RM' + Date.now().toString().slice(-8);
      const pnr = '248' + Math.floor(1000000 + Math.random() * 9000000);
      const transactionId = 'TXN' + Math.floor(1000000000 + Math.random() * 9000000000);

      const confirmedData = {
        id: bookingId,
        pnr: pnr,
        transactionId: transactionId,
        trainName: bookingOrder.trainName,
        trainNumber: bookingOrder.trainNumber,
        source: bookingOrder.source,
        destination: bookingOrder.destination,
        departure: bookingOrder.departure,
        arrival: bookingOrder.arrival,
        duration: bookingOrder.duration,
        journeyType: bookingOrder.journeyType || 'oneWay',
        returnDate: bookingOrder.returnDate || null,
        journeyMultiplier: bookingOrder.journeyMultiplier || 1,
        date: bookingOrder.date,
        passengerName: bookingOrder.passengerName,
        email: bookingOrder.email,
        phone: bookingOrder.phone,
        travelClass: bookingOrder.travelClass,
        seatPreference: bookingOrder.seatPreference,
        passengers: bookingOrder.passengers,
        baseFare: bookingOrder.baseFare,
        meals: bookingOrder.meals,
        mealFare: bookingOrder.mealFare,
        subtotal: bookingOrder.subtotal,
        gstRate: bookingOrder.gstRate,
        gstAmount: bookingOrder.gstAmount,
        fare: bookingOrder.totalFare,
        paymentMethod:
          paymentMethod === 'upi'
            ? `UPI (${upiId.trim()})`
            : paymentMethod === 'card'
            ? `Card (ending in ${cardDetails.number.replace(/\s/g, '').slice(-4)})`
            : paymentMethod === 'netbanking'
            ? `Net Banking (${selectedBank})`
            : `Wallet (${selectedWallet})`,
        userEmail: user?.email || bookingOrder.email || '',
        status: 'Confirmed',
        bookedOn: new Date().toISOString().split('T')[0],
        bookedAt: new Date().toLocaleTimeString(),
      };

      // Persist to localStorage
      const existingBookings = JSON.parse(localStorage.getItem('railmate_bookings') || '[]');
      existingBookings.push(confirmedData);
      localStorage.setItem('railmate_bookings', JSON.stringify(existingBookings));

      setIsProcessing(false);
      setConfirmedBooking(confirmedData);
    }, 1200);
  };

  // Helper for meals label
  const getMealsDisplay = (meals) => {
    if (!meals) return 'None';
    const items = [];
    if (meals.breakfast) items.push('Breakfast (₹120/person)');
    if (meals.lunch) items.push('Lunch (₹200/person)');
    return items.length > 0 ? items.join(' + ') : 'None (No meals selected)';
  };

  // Confirmed Payment Screen
  if (confirmedBooking) {
    return (
      <main className="payment-page">
        <div className="page-header no-print">
          <h1>✅ Payment Successful</h1>
          <p>Your railway ticket is confirmed and issued</p>
        </div>

        <div className="container payment-container">
          <div className="payment-success-card">
            <div className="success-badge-header">
              <div className="success-circle">✓</div>
              <h2 style={{ color: 'var(--primary)', marginBottom: '4px' }}>Ticket Booked & Paid!</h2>
              <p style={{ color: 'var(--text-light)', fontSize: '0.92rem' }}>
                Payment of <strong>₹{confirmedBooking.fare}</strong> has been received via {confirmedBooking.paymentMethod}.
              </p>
            </div>

            <div className="pnr-box">
              <div className="pnr-item">
                <span>PNR Number</span>
                <strong>{confirmedBooking.pnr}</strong>
              </div>
              <div className="pnr-item">
                <span>Booking ID</span>
                <strong>{confirmedBooking.id}</strong>
              </div>
              <div className="pnr-item">
                <span>Transaction Ref</span>
                <strong>{confirmedBooking.transactionId}</strong>
              </div>
            </div>

            <table className="receipt-table">
              <tbody>
                <tr>
                  <th>Train</th>
                  <td>{confirmedBooking.trainName} (#{confirmedBooking.trainNumber})</td>
                </tr>
                <tr>
                  <th>Route</th>
                  <td>{confirmedBooking.source} ➔ {confirmedBooking.destination}</td>
                </tr>
                <tr>
                  <th>Journey Type</th>
                  <td>
                    {confirmedBooking.journeyType === 'roundTrip'
                      ? '🔄 Round Trip / Return Journey (2 legs)'
                      : '➡️ One-Way Journey'}
                  </td>
                </tr>
                <tr>
                  <th>Journey Date</th>
                  <td>
                    {confirmedBooking.date}
                    {confirmedBooking.returnDate ? ` (Return: ${confirmedBooking.returnDate})` : ''}
                  </td>
                </tr>
                <tr>
                  <th>Passenger</th>
                  <td>{confirmedBooking.passengerName} ({confirmedBooking.passengers} Passenger{confirmedBooking.passengers > 1 ? 's' : ''})</td>
                </tr>
                <tr>
                  <th>Contact</th>
                  <td>{confirmedBooking.phone} | {confirmedBooking.email}</td>
                </tr>
                <tr>
                  <th>Class / Seat</th>
                  <td>{confirmedBooking.travelClass} ({confirmedBooking.seatPreference})</td>
                </tr>
                <tr>
                  <th>Selected Meals</th>
                  <td>{getMealsDisplay(confirmedBooking.meals)}</td>
                </tr>
                <tr>
                  <th>Base Ticket Fare</th>
                  <td>₹{confirmedBooking.baseFare}</td>
                </tr>
                {confirmedBooking.mealFare > 0 && (
                  <tr>
                    <th>Meal Charges</th>
                    <td>₹{confirmedBooking.mealFare}</td>
                  </tr>
                )}
                <tr>
                  <th>Subtotal (Fare + Meals)</th>
                  <td>₹{confirmedBooking.subtotal}</td>
                </tr>
                <tr>
                  <th style={{ color: 'var(--secondary)' }}>GST (5% on applicable charges)</th>
                  <td style={{ color: 'var(--secondary)' }}>+ ₹{confirmedBooking.gstAmount}</td>
                </tr>
                <tr style={{ background: 'rgba(29, 112, 162, 0.08)', fontWeight: 700 }}>
                  <th style={{ fontSize: '1rem', color: 'var(--primary)' }}>Total Amount Paid</th>
                  <td style={{ fontSize: '1.15rem', color: 'var(--primary)' }}>₹{confirmedBooking.fare}</td>
                </tr>
              </tbody>
            </table>

            <div className="no-print" style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '1.75rem' }}>
              <button
                className="btn btn-outline"
                onClick={() => window.print()}
              >
                🖨️ Print / Save Receipt
              </button>
              <button
                className="btn btn-primary"
                onClick={() => navigate('/my-bookings')}
              >
                🎫 View in My Bookings
              </button>
              <button
                className="btn btn-outline"
                onClick={() => navigate('/trains')}
              >
                🚆 Book Another Train
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Active Payment Form
  return (
    <main className="payment-page">
      {/* Simulation processing spinner overlay */}
      {isProcessing && (
        <div className="processing-overlay">
          <div className="processing-box">
            <div className="payment-spinner"></div>
            <h3 style={{ color: 'var(--primary)', marginBottom: '8px' }}>Processing Payment...</h3>
            <p style={{ color: 'var(--text-light)', fontSize: '0.88rem' }}>
              Securely communicating with bank gateway and confirming your ticket reservation.
            </p>
          </div>
        </div>
      )}

      <div className="page-header">
        <h1>💳 Payment & Checkout</h1>
        <p>Complete your payment securely to confirm ticket reservation</p>
      </div>

      <div className="container payment-container">
        {/* Stepper Bar */}
        <div className="booking-stepper">
          <div className="step-item completed">
            <span className="step-circle">✓</span>
            <span>1. Passenger & Meals</span>
          </div>
          <span className="step-arrow">➔</span>
          <div className="step-item active">
            <span className="step-circle">2</span>
            <span>2. Payment & GST</span>
          </div>
          <span className="step-arrow">➔</span>
          <div className="step-item">
            <span className="step-circle">3</span>
            <span>3. Confirmation</span>
          </div>
        </div>

        <div className="payment-grid">
          {/* Left Column: Journey Details & Payment Method */}
          <div>
            {/* Journey Summary Card */}
            <div className="payment-card">
              <div className="payment-card-title">
                <span>🚆</span>
                <span>Journey & Passenger Summary</span>
              </div>
              <div className="booking-summary" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
                <div className="summary-item">
                  <label>Train</label>
                  <p>{bookingOrder.trainName} (#{bookingOrder.trainNumber})</p>
                </div>
                <div className="summary-item">
                  <label>Route</label>
                  <p>{bookingOrder.source} ➔ {bookingOrder.destination}</p>
                </div>
                <div className="summary-item">
                  <label>Journey Type</label>
                  <p>{bookingOrder.journeyType === 'roundTrip' ? '🔄 Round Trip' : '➡️ One-Way'}</p>
                </div>
                <div className="summary-item">
                  <label>Journey Date(s)</label>
                  <p>
                    {bookingOrder.date}
                    {bookingOrder.journeyType === 'roundTrip' && bookingOrder.returnDate
                      ? ` (Return: ${bookingOrder.returnDate})`
                      : ''}
                  </p>
                </div>
                <div className="summary-item">
                  <label>Class & Seat</label>
                  <p>{bookingOrder.travelClass} ({bookingOrder.seatPreference})</p>
                </div>
                <div className="summary-item">
                  <label>Passenger Name</label>
                  <p>{bookingOrder.passengerName}</p>
                </div>
                <div className="summary-item">
                  <label>Contact Details</label>
                  <p>{bookingOrder.phone}</p>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{bookingOrder.email}</p>
                </div>
                <div className="summary-item">
                  <label>Meals Selected</label>
                  <p>{getMealsDisplay(bookingOrder.meals)}</p>
                </div>
                <div className="summary-item">
                  <label>Passengers</label>
                  <p>{bookingOrder.passengers} Passenger{bookingOrder.passengers > 1 ? 's' : ''}</p>
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="payment-card">
              <div className="payment-card-title">
                <span>💳</span>
                <span>Select Payment Method</span>
              </div>

              <div className="payment-methods-grid">
                <button
                  type="button"
                  className={`payment-method-btn ${paymentMethod === 'upi' ? 'selected' : ''}`}
                  onClick={() => {
                    setPaymentMethod('upi');
                    setErrors({});
                  }}
                >
                  <span className="pm-icon">⚡</span>
                  <div>
                    <div>UPI / QR Code</div>
                    <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>GPay, PhonePe, Paytm, BHIM</small>
                  </div>
                </button>

                <button
                  type="button"
                  className={`payment-method-btn ${paymentMethod === 'card' ? 'selected' : ''}`}
                  onClick={() => {
                    setPaymentMethod('card');
                    setErrors({});
                  }}
                >
                  <span className="pm-icon">💳</span>
                  <div>
                    <div>Credit / Debit Card</div>
                    <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Visa, MasterCard, RuPay</small>
                  </div>
                </button>

                <button
                  type="button"
                  className={`payment-method-btn ${paymentMethod === 'netbanking' ? 'selected' : ''}`}
                  onClick={() => {
                    setPaymentMethod('netbanking');
                    setErrors({});
                  }}
                >
                  <span className="pm-icon">🏦</span>
                  <div>
                    <div>Net Banking</div>
                    <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>SBI, HDFC, ICICI, Axis</small>
                  </div>
                </button>

                <button
                  type="button"
                  className={`payment-method-btn ${paymentMethod === 'wallets' ? 'selected' : ''}`}
                  onClick={() => {
                    setPaymentMethod('wallets');
                    setErrors({});
                  }}
                >
                  <span className="pm-icon">👛</span>
                  <div>
                    <div>Digital Wallets</div>
                    <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Paytm, Amazon Pay, Mobikwik</small>
                  </div>
                </button>
              </div>

              {/* Dynamic Payment Method Content */}
              <div className="payment-method-content">
                {paymentMethod === 'upi' && (
                  <div>
                    <h4 style={{ color: 'var(--primary)', marginBottom: '8px', fontSize: '0.95rem' }}>
                      Pay via UPI Virtual Payment Address (VPA)
                    </h4>
                    <div className="form-group" style={{ marginBottom: '12px' }}>
                      <label htmlFor="upi-id">UPI ID / VPA</label>
                      <input
                        id="upi-id"
                        type="text"
                        placeholder="e.g. mobile@paytm or username@oksbi"
                        value={upiId}
                        onChange={(e) => {
                          setUpiId(e.target.value);
                          if (errors.upiId) setErrors({ ...errors, upiId: '' });
                        }}
                      />
                      {errors.upiId && <div className="form-error">{errors.upiId}</div>}
                    </div>

                    <div style={{ textAlign: 'center', marginTop: '16px' }}>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                        — OR SCAN DYNAMIC QR CODE —
                      </div>
                      <div className="qr-box">
                        <div className="qr-code-mock"></div>
                        <span style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 600 }}>
                          Scan with any UPI App
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'card' && (
                  <div>
                    <h4 style={{ color: 'var(--primary)', marginBottom: '12px', fontSize: '0.95rem' }}>
                      Enter Card Details
                    </h4>
                    <div className="form-group">
                      <label htmlFor="card-number">Card Number</label>
                      <input
                        id="card-number"
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        value={cardDetails.number}
                        onChange={(e) => handleCardNumberChange(e.target.value)}
                        maxLength={19}
                      />
                      {errors.cardNumber && <div className="form-error">{errors.cardNumber}</div>}
                    </div>

                    <div className="form-group">
                      <label htmlFor="card-name">Cardholder Name</label>
                      <input
                        id="card-name"
                        type="text"
                        placeholder="Name on card"
                        value={cardDetails.name}
                        onChange={(e) => {
                          setCardDetails({ ...cardDetails, name: e.target.value });
                          if (errors.cardName) setErrors({ ...errors, cardName: '' });
                        }}
                      />
                      {errors.cardName && <div className="form-error">{errors.cardName}</div>}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div className="form-group">
                        <label htmlFor="card-expiry">Expiry (MM/YY)</label>
                        <input
                          id="card-expiry"
                          type="text"
                          placeholder="MM/YY"
                          value={cardDetails.expiry}
                          onChange={(e) => handleCardExpiryChange(e.target.value)}
                          maxLength={5}
                        />
                        {errors.cardExpiry && <div className="form-error">{errors.cardExpiry}</div>}
                      </div>

                      <div className="form-group">
                        <label htmlFor="card-cvv">CVV</label>
                        <input
                          id="card-cvv"
                          type="password"
                          placeholder="123"
                          value={cardDetails.cvv}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '').slice(0, 3);
                            setCardDetails({ ...cardDetails, cvv: val });
                            if (errors.cardCvv) setErrors({ ...errors, cardCvv: '' });
                          }}
                          maxLength={3}
                        />
                        {errors.cardCvv && <div className="form-error">{errors.cardCvv}</div>}
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'netbanking' && (
                  <div>
                    <h4 style={{ color: 'var(--primary)', marginBottom: '8px', fontSize: '0.95rem' }}>
                      Select Your Bank
                    </h4>
                    <div className="form-group">
                      <label htmlFor="bank-select">Popular Indian Banks</label>
                      <select
                        id="bank-select"
                        value={selectedBank}
                        onChange={(e) => setSelectedBank(e.target.value)}
                      >
                        <option value="State Bank of India">State Bank of India (SBI)</option>
                        <option value="HDFC Bank">HDFC Bank</option>
                        <option value="ICICI Bank">ICICI Bank</option>
                        <option value="Axis Bank">Axis Bank</option>
                        <option value="Punjab National Bank">Punjab National Bank (PNB)</option>
                        <option value="Bank of Baroda">Bank of Baroda</option>
                        <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                      </select>
                    </div>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-light)', marginTop: '8px' }}>
                      You will be securely redirected to your bank's authentication gateway to complete the payment.
                    </p>
                  </div>
                )}

                {paymentMethod === 'wallets' && (
                  <div>
                    <h4 style={{ color: 'var(--primary)', marginBottom: '8px', fontSize: '0.95rem' }}>
                      Choose Digital Wallet
                    </h4>
                    <div className="form-group">
                      <label htmlFor="wallet-select">Supported Wallets</label>
                      <select
                        id="wallet-select"
                        value={selectedWallet}
                        onChange={(e) => setSelectedWallet(e.target.value)}
                      >
                        <option value="Paytm Wallet">Paytm Wallet</option>
                        <option value="Amazon Pay">Amazon Pay</option>
                        <option value="PhonePe Wallet">PhonePe Wallet</option>
                        <option value="MobiKwik">MobiKwik</option>
                      </select>
                    </div>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-light)', marginTop: '8px' }}>
                      Ensure sufficient balance in your wallet before proceeding with simulated payment.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Itemized Fare Card with GST */}
          <div>
            <div className="fare-breakdown-card">
              <div className="payment-card-title">
                <span>🧾</span>
                <span>Itemized Fare & GST</span>
              </div>

              <div className="fare-row">
                <span>Base Ticket Fare</span>
                <span>
                  ₹{bookingOrder.trainPrice} × {bookingOrder.passengers} passenger{bookingOrder.passengers > 1 ? 's' : ''}
                  {bookingOrder.journeyMultiplier === 2 ? ' × 2 (Round Trip)' : ''}
                </span>
              </div>
              <div className="fare-row" style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '-4px' }}>
                <span>Total Ticket Fare</span>
                <span>₹{bookingOrder.baseFare}</span>
              </div>

              <div className="fare-row" style={{ marginTop: '6px' }}>
                <div>
                  <div>Catering / Food Addons</div>
                  <small style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    {getMealsDisplay(bookingOrder.meals)}
                    {bookingOrder.mealFare > 0 && bookingOrder.journeyMultiplier === 2 ? ' (for 2 legs)' : ''}
                  </small>
                </div>
                <span>
                  {bookingOrder.mealFare > 0
                    ? `₹${bookingOrder.mealFare}`
                    : '₹0 (None)'}
                </span>
              </div>

              <div className="fare-row subtotal-row">
                <span>Subtotal (Tickets + Meals)</span>
                <span>₹{bookingOrder.subtotal}</span>
              </div>

              {/* GST Calculation Display */}
              <div className="fare-row gst-row">
                <div>
                  <div>Goods & Services Tax (GST)</div>
                  <small style={{ fontSize: '0.74rem', opacity: 0.85 }}>5% on railway passenger & catering charges</small>
                </div>
                <span>+ ₹{bookingOrder.gstAmount}</span>
              </div>

              {/* Total Row */}
              <div className="fare-row total-row">
                <span>Total Payable</span>
                <span className="total-price">₹{bookingOrder.totalFare}</span>
              </div>

              <div className="security-badge">
                <span style={{ fontSize: '1.2rem' }}>🔒</span>
                <div>
                  <strong>IRCTC Simulation Gateway</strong>
                  <div style={{ fontSize: '0.76rem', opacity: 0.9 }}>256-Bit SSL Encrypted & PCI-DSS Compliant</div>
                </div>
              </div>

              <button
                type="button"
                className="btn btn-accent"
                style={{ width: '100%', marginTop: '1.25rem', padding: '14px', fontSize: '1.05rem', fontWeight: 700 }}
                onClick={handlePayNow}
              >
                ✅ Pay ₹{bookingOrder.totalFare} Securely
              </button>

              <button
                type="button"
                className="btn btn-outline"
                style={{ width: '100%', marginTop: '8px', padding: '10px', fontSize: '0.9rem' }}
                onClick={() => navigate(-1)}
              >
                ← Back to Booking Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Payment;
