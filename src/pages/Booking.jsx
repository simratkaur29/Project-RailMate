import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../store/userSlice';
import FormInput from '../components/FormInput';
import { BERTH_OPTIONS, GENDER_OPTIONS } from '../context/JourneyContext';
import trainsData from '../data/trains';
import '../styles/profile.css';

function Booking() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useSelector(selectUser);

  const train = location.state?.train;
  const initialTripType = location.state?.tripType || (location.state?.returnDate || location.state?.returnTrain ? 'roundTrip' : 'oneWay');
  const initialReturnTrain = location.state?.returnTrain || null;

  // Date helper utilities
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getMaxDate = (daysAhead = 120) => {
    const max = new Date();
    max.setDate(max.getDate() + daysAhead);
    const year = max.getFullYear();
    const month = String(max.getMonth() + 1).padStart(2, '0');
    const day = String(max.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const minDate = getTodayDate();
  const maxDate = getMaxDate(120);

  const initialOnwardDate =
    location.state?.date && location.state.date >= minDate ? location.state.date : '';

  const initialReturnDate =
    location.state?.returnDate && location.state.returnDate >= (initialOnwardDate || minDate)
      ? location.state.returnDate
      : '';

  // Booking & Form States
  const [tripType, setTripType] = useState(initialTripType);
  const [returnTrain, setReturnTrain] = useState(initialReturnTrain);

  const [form, setForm] = useState({
    date: initialOnwardDate,
    returnDate: initialReturnDate,
    travelClass: '',
    passengersCount: 1,
    passengers: [
      {
        name: user?.name || '',
        age: '',
        gender: 'Male',
        berthPreference: 'No Preference',
      },
    ],
  });

  const [errors, setErrors] = useState({});
  const [confirmed, setConfirmed] = useState(false);
  const [bookingData, setBookingData] = useState(null);

  // Focus management refs
  const firstPassengerNameRef = useRef(null);
  const dateRef = useRef(null);
  const returnDateRef = useRef(null);
  const classRef = useRef(null);

  // Find matching return trains if in round-trip mode
  const availableReturnTrains = train
    ? trainsData.filter(
        (t) =>
          t.source.toLowerCase().includes(train.destination.toLowerCase()) &&
          t.destination.toLowerCase().includes(train.source.toLowerCase())
      )
    : [];

  // Auto-select first return train if none is selected yet and round-trip is active
  useEffect(() => {
    if (tripType === 'roundTrip' && !returnTrain && availableReturnTrains.length > 0) {
      setReturnTrain(availableReturnTrains[0]);
    }
  }, [tripType, availableReturnTrains, returnTrain]);

  if (!train) {
    return (
      <main className="booking-page">
        <div className="page-header">
          <h1>🎫 Book Your Ticket</h1>
          <p>Select a train first to proceed with booking.</p>
        </div>
        <div className="container">
          <div className="empty-state">
            <div className="icon">🚆</div>
            <h3>No train selected</h3>
            <p>Please search for a train and click "Book Now" to proceed.</p>
            <button
              className="btn btn-primary"
              style={{ marginTop: '1rem' }}
              onClick={() => navigate('/trains')}
            >
              Search Trains
            </button>
          </div>
        </div>
      </main>
    );
  }

  // Passenger count change handler
  const handlePassengerCountChange = (count) => {
    const newCount = Math.max(1, Math.min(6, parseInt(count, 10) || 1));
    setForm((prev) => {
      const currentPassengers = [...prev.passengers];
      if (newCount > currentPassengers.length) {
        for (let i = currentPassengers.length; i < newCount; i++) {
          currentPassengers.push({
            name: '',
            age: '',
            gender: 'Male',
            berthPreference: 'No Preference',
          });
        }
      } else if (newCount < currentPassengers.length) {
        currentPassengers.splice(newCount);
      }
      return {
        ...prev,
        passengersCount: newCount,
        passengers: currentPassengers,
      };
    });
  };

  // Specific passenger field update
  const handlePassengerFieldChange = (index, field, value) => {
    setForm((prev) => {
      const updated = [...prev.passengers];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, passengers: updated };
    });

    // Clear error for that specific passenger field
    const errorKey = `passenger_${index}_${field}`;
    if (errors[errorKey]) {
      setErrors((prev) => ({ ...prev, [errorKey]: '' }));
    }
  };

  // Date handlers
  const minReturnDate = form.date || minDate;

  const handleDateChange = (val) => {
    setForm((prev) => ({ ...prev, date: val }));
    if (errors.date) setErrors((prev) => ({ ...prev, date: '' }));

    if (form.returnDate && val > form.returnDate) {
      setErrors((prev) => ({
        ...prev,
        returnDate: 'Return date cannot be earlier than onward journey date.',
      }));
    } else {
      setErrors((prev) => ({ ...prev, returnDate: '' }));
    }
  };

  const handleReturnDateChange = (val) => {
    setForm((prev) => ({ ...prev, returnDate: val }));
    if (errors.returnDate) setErrors((prev) => ({ ...prev, returnDate: '' }));
  };

  // Fare Calculations
  const onwardFarePerPerson = train.price;
  const returnFarePerPerson = tripType === 'roundTrip' && returnTrain ? returnTrain.price : 0;
  const totalPerPerson = onwardFarePerPerson + returnFarePerPerson;
  const totalFare = totalPerPerson * form.passengers.length;

  // Validation
  const validate = () => {
    const newErrors = {};

    // 1. Onward Date validation
    if (!form.date) {
      newErrors.date = 'Journey date is required';
    } else if (form.date < minDate) {
      newErrors.date = 'Journey date cannot be in the past. Please select today or a future date.';
    } else if (form.date > maxDate) {
      newErrors.date = 'Journey date cannot be more than 120 days in advance.';
    }

    // 2. Return Date validation (if round trip)
    if (tripType === 'roundTrip') {
      if (!form.returnDate) {
        newErrors.returnDate = 'Return journey date is required for round trips';
      } else if (form.returnDate < (form.date || minDate)) {
        newErrors.returnDate = 'Return date cannot be earlier than the onward journey date';
      } else if (form.returnDate > maxDate) {
        newErrors.returnDate = 'Return date cannot be more than 120 days in advance.';
      }

      if (!returnTrain) {
        newErrors.returnTrain = 'Please select a return train for the return journey.';
      }
    }

    // 3. Travel Class validation
    if (!form.travelClass) {
      newErrors.travelClass = 'Please select a travel class';
    }

    // 4. Passenger validation for each passenger
    form.passengers.forEach((p, idx) => {
      const pNum = idx + 1;
      // Name
      if (!p.name || !p.name.trim()) {
        newErrors[`passenger_${idx}_name`] = `Passenger ${pNum}: Full name is required`;
      } else if (p.name.trim().length < 3) {
        newErrors[`passenger_${idx}_name`] = `Passenger ${pNum}: Name must be at least 3 characters`;
      } else if (!/^[a-zA-Z\s.'-]+$/.test(p.name.trim())) {
        newErrors[`passenger_${idx}_name`] = `Passenger ${pNum}: Name must contain only letters and spaces`;
      }

      // Age
      if (!p.age || p.age.toString().trim() === '') {
        newErrors[`passenger_${idx}_age`] = `Passenger ${pNum}: Age is required`;
      } else {
        const ageNum = parseInt(p.age, 10);
        if (isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
          newErrors[`passenger_${idx}_age`] = `Passenger ${pNum}: Enter a valid age between 1 and 120`;
        }
      }

      // Gender
      if (!p.gender) {
        newErrors[`passenger_${idx}_gender`] = `Passenger ${pNum}: Gender is required`;
      }
    });

    return newErrors;
  };

  const handleConfirm = (e) => {
    e.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      if (validationErrors.date) {
        dateRef.current?.focus();
      } else if (validationErrors.returnDate) {
        returnDateRef.current?.focus();
      } else if (validationErrors.travelClass) {
        classRef.current?.focus();
      } else if (validationErrors[`passenger_0_name`]) {
        firstPassengerNameRef.current?.focus();
      }
      return;
    }

    // Login check
    if (!user) {
      setErrors({ auth: 'Please login or register to complete your ticket booking.' });
      return;
    }

    // Build confirmed booking object
    const booking = {
      id: 'RM' + Date.now().toString().slice(-8),
      tripType: tripType,
      // Onward Journey Details
      trainName: train.name,
      trainNumber: train.number,
      source: train.source,
      destination: train.destination,
      departure: train.departure,
      arrival: train.arrival,
      duration: train.duration,
      departurePlatform: train.departurePlatform || '1',
      date: form.date,
      // Return Journey Details (if round trip)
      returnTrain:
        tripType === 'roundTrip' && returnTrain
          ? {
              trainName: returnTrain.name,
              trainNumber: returnTrain.number,
              source: returnTrain.source,
              destination: returnTrain.destination,
              departure: returnTrain.departure,
              arrival: returnTrain.arrival,
              duration: returnTrain.duration,
              departurePlatform: returnTrain.departurePlatform || '1',
              price: returnTrain.price,
              date: form.returnDate,
            }
          : null,
      returnDate: tripType === 'roundTrip' ? form.returnDate : null,
      // Passenger Details
      passengerName: form.passengers[0].name.trim(), // Primary passenger for backward compatibility
      passengers: form.passengers.map((p) => ({
        name: p.name.trim(),
        age: parseInt(p.age, 10),
        gender: p.gender,
        berthPreference: p.berthPreference || 'No Preference',
      })),
      passengersCount: form.passengers.length,
      travelClass: form.travelClass,
      fare: totalFare,
      status: 'Confirmed',
      bookedOn: new Date().toISOString().split('T')[0],
    };

    // Save to localStorage
    const existingBookings = JSON.parse(localStorage.getItem('railmate_bookings') || '[]');
    existingBookings.push(booking);
    localStorage.setItem('railmate_bookings', JSON.stringify(existingBookings));

    setBookingData(booking);
    setConfirmed(true);
  };

  // ----------------------------------------------------
  // Confirmation Screen View
  // ----------------------------------------------------
  if (confirmed && bookingData) {
    const isRound = bookingData.tripType === 'roundTrip';

    return (
      <main className="booking-page">
        <div className="page-header">
          <h1>✅ Booking Confirmed!</h1>
          <p>Your {isRound ? 'round-trip' : 'one-way'} train ticket has been booked successfully.</p>
        </div>
        <div className="container booking-container">
          <div className="confirmation-card card">
            <div className="check-icon">✅</div>
            <h2>Booking Successful!</h2>
            <p style={{ color: 'var(--text-light)', marginBottom: '1rem' }}>
              Your ticket is confirmed. Have a safe and pleasant journey!
            </p>
            <div className="booking-id">Booking ID: {bookingData.id}</div>
            <div style={{ marginBottom: '1rem' }}>
              <span className={`badge ${isRound ? 'badge-accent' : 'badge-primary'}`}>
                {isRound ? '🔄 Round Trip Booking' : '➡️ One Way Booking'}
              </span>
            </div>

            {/* Onward Journey Summary */}
            <div className="booking-summary-section card" style={{ textAlign: 'left', padding: '1.25rem', marginBottom: '1.25rem', background: 'var(--background)' }}>
              <h4 style={{ color: 'var(--primary)', marginBottom: '10px' }}>
                🚆 Onward Journey: {bookingData.source} → {bookingData.destination}
              </h4>
              <div className="booking-summary">
                <div className="summary-item"><label>Train</label><p>{bookingData.trainName}</p></div>
                <div className="summary-item"><label>Train Number</label><p>#{bookingData.trainNumber}</p></div>
                <div className="summary-item"><label>Journey Date</label><p>{bookingData.date}</p></div>
                <div className="summary-item"><label>Departure Platform</label><p>Platform {bookingData.departurePlatform} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>(Sample Data)</span></p></div>
                <div className="summary-item"><label>Departure</label><p>{bookingData.departure}</p></div>
                <div className="summary-item"><label>Arrival</label><p>{bookingData.arrival}</p></div>
              </div>
            </div>

            {/* Return Journey Summary (if round trip) */}
            {isRound && bookingData.returnTrain && (
              <div className="booking-summary-section card" style={{ textAlign: 'left', padding: '1.25rem', marginBottom: '1.25rem', background: 'rgba(29, 112, 162, 0.05)', border: '1px solid rgba(29, 112, 162, 0.2)' }}>
                <h4 style={{ color: 'var(--secondary)', marginBottom: '10px' }}>
                  🔄 Return Journey: {bookingData.returnTrain.source} → {bookingData.returnTrain.destination}
                </h4>
                <div className="booking-summary">
                  <div className="summary-item"><label>Return Train</label><p>{bookingData.returnTrain.trainName}</p></div>
                  <div className="summary-item"><label>Train Number</label><p>#{bookingData.returnTrain.trainNumber}</p></div>
                  <div className="summary-item"><label>Return Date</label><p>{bookingData.returnDate}</p></div>
                  <div className="summary-item"><label>Departure Platform</label><p>Platform {bookingData.returnTrain.departurePlatform} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>(Sample Data)</span></p></div>
                  <div className="summary-item"><label>Departure</label><p>{bookingData.returnTrain.departure}</p></div>
                  <div className="summary-item"><label>Arrival</label><p>{bookingData.returnTrain.arrival}</p></div>
                </div>
              </div>
            )}

            {/* Passenger Details Summary */}
            <div className="card" style={{ textAlign: 'left', padding: '1.25rem', marginBottom: '1.25rem' }}>
              <h4 style={{ color: 'var(--primary)', marginBottom: '10px' }}>
                👥 Passenger Details ({bookingData.passengers.length} Passenger{bookingData.passengers.length > 1 ? 's' : ''})
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {bookingData.passengers.map((p, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '8px 12px',
                      background: 'var(--background)',
                      borderRadius: '6px',
                      fontSize: '0.9rem',
                    }}
                  >
                    <div>
                      <strong>#{idx + 1} {p.name}</strong>
                      <span style={{ color: 'var(--text-light)', marginLeft: '8px', fontSize: '0.85rem' }}>
                        ({p.age} yrs, {p.gender})
                      </span>
                    </div>
                    <span className="badge badge-primary">Berth: {p.berthPreference}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Fare Summary */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'rgba(18, 53, 91, 0.05)', borderRadius: '8px', marginBottom: '1.5rem' }}>
              <div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block' }}>Travel Class</span>
                <strong>{bookingData.travelClass}</strong>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block' }}>Total Paid Fare</span>
                <strong style={{ fontSize: '1.4rem', color: 'var(--primary)' }}>₹{bookingData.fare}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="btn btn-primary" onClick={() => navigate('/my-bookings')}>
                View My Bookings
              </button>
              <button className="btn btn-outline" onClick={() => navigate('/trains')}>
                Book Another Train
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ----------------------------------------------------
  // Booking Form View
  // ----------------------------------------------------
  return (
    <main className="booking-page">
      <div className="page-header">
        <h1>🎫 Book Your Ticket</h1>
        <p>Complete your booking for {train.name}</p>
      </div>

      <div className="container booking-container">
        {/* Trip Type Selector Toggle on Booking Page */}
        <div className="card" style={{ padding: '1rem 1.25rem', marginBottom: '1.5rem' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
            Trip Selection Mode
          </label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              className={`btn btn-sm ${tripType === 'oneWay' ? 'btn-primary' : 'btn-outline'}`}
              style={{ borderRadius: '20px', padding: '6px 20px' }}
              onClick={() => {
                setTripType('oneWay');
                setErrors((prev) => ({ ...prev, returnDate: '', returnTrain: '' }));
              }}
            >
              ➡️ One Way
            </button>
            <button
              type="button"
              className={`btn btn-sm ${tripType === 'roundTrip' ? 'btn-primary' : 'btn-outline'}`}
              style={{ borderRadius: '20px', padding: '6px 20px' }}
              onClick={() => setTripType('roundTrip')}
            >
              🔄 Round Trip
            </button>
          </div>
        </div>

        {/* 1. Onward Train Info Card */}
        <div className="booking-card card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
            <h3 style={{ margin: 0, border: 'none', padding: 0 }}>🚆 Onward Train Information</h3>
            <span className="badge badge-primary">Onward Route</span>
          </div>

          <div className="booking-summary">
            <div className="summary-item"><label>Train</label><p>{train.name}</p></div>
            <div className="summary-item"><label>Number</label><p>#{train.number}</p></div>
            <div className="summary-item"><label>Source</label><p>{train.source}</p></div>
            <div className="summary-item"><label>Destination</label><p>{train.destination}</p></div>
            <div className="summary-item">
              <label>Departure Platform</label>
              <p>
                Platform {train.departurePlatform || '1'}{' '}
                <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>(Sample Data)</span>
              </p>
            </div>
            <div className="summary-item"><label>Departure</label><p>{train.departure}</p></div>
            <div className="summary-item"><label>Arrival</label><p>{train.arrival}</p></div>
            <div className="summary-item"><label>Duration</label><p>{train.duration}</p></div>
            <div className="summary-item"><label>Base Price</label><p>₹{train.price} / person</p></div>
          </div>
        </div>

        {/* 2. Return Train Info Card (if Round Trip) */}
        {tripType === 'roundTrip' && (
          <div className="booking-card card" style={{ border: '1px solid rgba(29, 112, 162, 0.3)', background: 'rgba(29, 112, 162, 0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
              <h3 style={{ margin: 0, border: 'none', padding: 0, color: 'var(--secondary)' }}>
                🔄 Return Train Information
              </h3>
              <span className="badge badge-accent">Return Route</span>
            </div>

            {availableReturnTrains.length > 0 ? (
              <div>
                <label htmlFor="return-train-select" style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: '6px' }}>
                  Select Return Train ({train.destination} → {train.source})
                </label>
                <select
                  id="return-train-select"
                  value={returnTrain?.id || ''}
                  onChange={(e) => {
                    const selected = availableReturnTrains.find((t) => t.id === parseInt(e.target.value, 10));
                    setReturnTrain(selected || null);
                    if (errors.returnTrain) setErrors((prev) => ({ ...prev, returnTrain: '' }));
                  }}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', marginBottom: '14px', background: 'var(--surface)' }}
                >
                  {availableReturnTrains.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} (#{t.number}) • Dep: {t.departure} • PF {t.departurePlatform} • ₹{t.price}
                    </option>
                  ))}
                </select>

                {returnTrain && (
                  <div className="booking-summary" style={{ marginTop: '10px' }}>
                    <div className="summary-item"><label>Return Train</label><p>{returnTrain.name}</p></div>
                    <div className="summary-item"><label>Number</label><p>#{returnTrain.number}</p></div>
                    <div className="summary-item"><label>Source</label><p>{returnTrain.source}</p></div>
                    <div className="summary-item"><label>Destination</label><p>{returnTrain.destination}</p></div>
                    <div className="summary-item">
                      <label>Departure Platform</label>
                      <p>
                        Platform {returnTrain.departurePlatform || '1'}{' '}
                        <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>(Sample Data)</span>
                      </p>
                    </div>
                    <div className="summary-item"><label>Departure</label><p>{returnTrain.departure}</p></div>
                    <div className="summary-item"><label>Arrival</label><p>{returnTrain.arrival}</p></div>
                    <div className="summary-item"><label>Return Fare</label><p>₹{returnTrain.price} / person</p></div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>
                <p>No direct return trains cataloged for {train.destination} → {train.source}.</p>
                <p style={{ marginTop: '4px', fontSize: '0.85rem' }}>You may book this as a One-Way journey or browse connecting trains.</p>
              </div>
            )}

            {errors.returnTrain && (
              <div className="form-error" role="alert" style={{ marginTop: '8px' }}>
                ⚠️ {errors.returnTrain}
              </div>
            )}
          </div>
        )}

        {/* Authentication Notice Banner if not logged in */}
        {errors.auth && (
          <div
            className="card"
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              borderColor: 'var(--error, #ef4444)',
              padding: '1rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              marginBottom: '1.5rem',
            }}
          >
            <div>
              <strong style={{ color: 'var(--error, #ef4444)' }}>⚠️ Login Required</strong>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', marginTop: '2px' }}>
                {errors.auth}
              </p>
            </div>
            <Link to="/login" className="btn btn-primary btn-sm">
              Login Now →
            </Link>
          </div>
        )}

        {/* Booking Form */}
        <form onSubmit={handleConfirm} noValidate>
          {/* Journey Dates & Travel Class */}
          <div className="booking-card card">
            <h3>📅 Journey Schedule & Class</h3>

            <div style={{ display: 'grid', gridTemplateColumns: tripType === 'roundTrip' ? '1fr 1fr' : '1fr', gap: '14px' }}>
              <FormInput
                ref={dateRef}
                id="book-onward-date"
                label={tripType === 'roundTrip' ? 'Onward Journey Date' : 'Journey Date'}
                type="date"
                value={form.date}
                min={minDate}
                max={maxDate}
                onChange={handleDateChange}
                error={errors.date}
                required
              />

              {tripType === 'roundTrip' && (
                <FormInput
                  ref={returnDateRef}
                  id="book-return-date"
                  label="Return Journey Date"
                  type="date"
                  value={form.returnDate}
                  min={minReturnDate}
                  max={maxDate}
                  onChange={handleReturnDateChange}
                  error={errors.returnDate}
                  required
                />
              )}
            </div>

            <div style={{ marginTop: '8px' }}>
              <FormInput
                ref={classRef}
                id="book-class"
                label="Travel Class"
                value={form.travelClass}
                onChange={(val) => {
                  setForm((prev) => ({ ...prev, travelClass: val }));
                  if (errors.travelClass) setErrors((prev) => ({ ...prev, travelClass: '' }));
                }}
                error={errors.travelClass}
                required
                placeholder="Select Class"
                options={train.classes.map((cls) => ({ value: cls, label: cls }))}
              />
            </div>
          </div>

          {/* Multiple Passenger Details Card */}
          <div className="booking-card card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
              <h3 style={{ margin: 0, border: 'none', padding: 0 }}>👥 Passenger Details</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <label htmlFor="passenger-count-select" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-light)', margin: 0 }}>
                  Passengers:
                </label>
                <select
                  id="passenger-count-select"
                  value={form.passengersCount}
                  onChange={(e) => handlePassengerCountChange(e.target.value)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border)',
                    fontWeight: 600,
                    background: 'var(--surface)',
                  }}
                >
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'Passenger' : 'Passengers'}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Dynamic Form per Passenger */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {form.passengers.map((passenger, index) => (
                <div
                  key={index}
                  className="card"
                  style={{
                    padding: '1.25rem',
                    background: 'var(--background)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h4 style={{ margin: 0, color: 'var(--primary)', fontSize: '0.98rem' }}>
                      👤 Passenger {index + 1} {index === 0 && <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>(Primary)</span>}
                    </h4>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Required</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                    <FormInput
                      ref={index === 0 ? firstPassengerNameRef : undefined}
                      id={`book-passenger-${index}-name`}
                      label="Full Name"
                      type="text"
                      placeholder="e.g. Rahul Sharma"
                      value={passenger.name}
                      onChange={(val) => handlePassengerFieldChange(index, 'name', val)}
                      error={errors[`passenger_${index}_name`]}
                      required
                    />

                    <FormInput
                      id={`book-passenger-${index}-age`}
                      label="Age"
                      type="number"
                      placeholder="e.g. 28"
                      min="1"
                      max="120"
                      value={passenger.age}
                      onChange={(val) => handlePassengerFieldChange(index, 'age', val)}
                      error={errors[`passenger_${index}_age`]}
                      required
                    />

                    <FormInput
                      id={`book-passenger-${index}-gender`}
                      label="Gender"
                      value={passenger.gender}
                      onChange={(val) => handlePassengerFieldChange(index, 'gender', val)}
                      options={GENDER_OPTIONS}
                      error={errors[`passenger_${index}_gender`]}
                      required
                    />

                    <FormInput
                      id={`book-passenger-${index}-berth`}
                      label="Berth Preference"
                      value={passenger.berthPreference}
                      onChange={(val) => handlePassengerFieldChange(index, 'berthPreference', val)}
                      options={BERTH_OPTIONS}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fare Summary & Booking Confirmation */}
          <div className="booking-card card">
            <h3>💰 Fare Summary & Total</h3>
            <div className="booking-summary">
              <div className="summary-item">
                <label>Onward Base Fare</label>
                <p>₹{onwardFarePerPerson} × {form.passengers.length} = ₹{onwardFarePerPerson * form.passengers.length}</p>
              </div>

              {tripType === 'roundTrip' && (
                <div className="summary-item">
                  <label>Return Base Fare</label>
                  <p>
                    {returnTrain
                      ? `₹${returnTrain.price} × ${form.passengers.length} = ₹${returnTrain.price * form.passengers.length}`
                      : 'Return train not selected'}
                  </p>
                </div>
              )}

              <div className="summary-item">
                <label>Total Passengers</label>
                <p>{form.passengers.length} Passenger{form.passengers.length > 1 ? 's' : ''}</p>
              </div>

              <div className="summary-item">
                <label>Class</label>
                <p>{form.travelClass || 'Not selected'}</p>
              </div>
            </div>

            <div className="booking-total">
              <span className="total-label">Total Booking Fare ({tripType === 'roundTrip' ? 'Round Trip' : 'One Way'})</span>
              <span className="total-amount">₹{totalFare}</span>
            </div>

            {/* Simulated Payment Notice */}
            <div
              style={{
                marginTop: '1.25rem',
                padding: '12px 14px',
                borderRadius: '8px',
                background: 'rgba(59, 130, 246, 0.08)',
                border: '1px solid rgba(59, 130, 246, 0.25)',
                fontSize: '0.84rem',
                color: 'var(--text-light)',
              }}
            >
              <div style={{ fontWeight: 600, color: 'var(--primary)', marginBottom: '4px' }}>
                💳 Payment Mode: Simulated Instant Confirmation
              </div>
              Demo platform: no real charges are deducted. All passenger berth preferences and round-trip journeys are confirmed and saved to your account.
            </div>

            <button
              type="submit"
              className="btn btn-accent"
              style={{ width: '100%', marginTop: '1.25rem', padding: '14px', fontSize: '1.05rem', fontWeight: 700 }}
            >
              ✅ Confirm & Book {tripType === 'roundTrip' ? 'Round-Trip' : ''} Ticket (₹{totalFare})
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default Booking;
