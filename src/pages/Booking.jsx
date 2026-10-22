import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../store/userSlice';
import FormInput from '../components/FormInput';
import { BERTH_OPTIONS, GENDER_OPTIONS } from '../context/JourneyContext';
import trainsData from '../data/trains';
import '../styles/profile.css';

HEAD
// Realistic standard catering fares (per passenger)
export const MEAL_PRICES = {
  breakfast: 120, // ₹120 per passenger
  lunch: 200,     // ₹200 per passenger
};

export const GST_RATE = 0.05; // 5% GST on railway services and catering

function Booking({ user }) {

function Booking() {
 main
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
HEAD
    passengerName: user?.name || '',
 HEAD
    email: user?.email || '',
    phone: user?.phone || '',
    journeyType: location.state?.journeyType || 'oneWay', // 'oneWay' or 'roundTrip'
    date: location.state?.date || '',
    returnDate: '',

    date: initialDate,
member2-trains
    travelClass: '',
    seatPreference: 'No Preference',
    passengers: 1,
    meals: {
      breakfast: false,
      lunch: false,
    },

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
member2-trains
  });
 HEAD


 main
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

HEAD
  // Dynamic Fare & GST Calculations (accounting for journey type: one-way or round trip)
  const journeyMultiplier = form.journeyType === 'roundTrip' ? 2 : 1;
  const baseFare = train.price * form.passengers * journeyMultiplier;
  const mealCostPerPassenger =
    (form.meals.breakfast ? MEAL_PRICES.breakfast : 0) +
    (form.meals.lunch ? MEAL_PRICES.lunch : 0);
  const totalMealFare = mealCostPerPassenger * form.passengers * journeyMultiplier;
  const subtotal = baseFare + totalMealFare;
  const gstAmount = Math.round(subtotal * GST_RATE);
  const totalFare = subtotal + gstAmount;

 HEAD
  const handleMealToggle = (mealType) => {
    setForm((prev) => ({
      ...prev,
      meals: {
        ...prev.meals,
        [mealType]: !prev.meals[mealType],
      },
    }));
  };

  const getMealsLabel = (meals) => {
    if (!meals) return 'None';
    const items = [];
    if (meals.breakfast) items.push('Breakfast (₹' + MEAL_PRICES.breakfast + ')');
    if (meals.lunch) items.push('Lunch (₹' + MEAL_PRICES.lunch + ')');
    return items.length > 0 ? items.join(' + ') : 'None (No meals selected)';
  };

  // Field change handler that clears specific errors
  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));

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
 member2-trains

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
main
    }
  };

  // Comprehensive Regex & Business Logic Validation
  const validateForm = () => {
    const newErrors = {};

    // 1. Passenger Name Regex: Only alphabetic characters and spaces (3-50 chars)
    const nameRegex = /^[A-Za-z\s]{3,50}$/;
    if (!form.passengerName.trim()) {
      newErrors.passengerName = 'Passenger name is required.';
    } else if (!nameRegex.test(form.passengerName.trim())) {
      newErrors.passengerName = 'Name must contain only alphabetic letters and spaces (3 to 50 characters).';
    }

    // 2. Indian Phone Number Regex: optional +91/91, exactly 10 digits starting with 6, 7, 8, or 9
    const phoneRegex = /^(?:(?:\+?91[\-\s]?)?[6-9]\d{9})$/;
    if (!form.phone.trim()) {
      newErrors.phone = 'Mobile phone number is required.';
    } else if (!phoneRegex.test(form.phone.trim().replace(/\s+/g, ''))) {
      newErrors.phone = 'Enter a valid 10-digit Indian phone number starting with 6, 7, 8, or 9.';
    }

    // 3. Email Address Regex: RFC 5322 compliant standard format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!form.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!emailRegex.test(form.email.trim())) {
      newErrors.email = 'Enter a valid email address (e.g. name@example.com).';
    }

    // 4. Outbound Journey Date Validation: must not be empty and cannot be in the past
    if (!form.date) {
      newErrors.date = 'Journey date is required.';
    } else {
      const today = new Date().toISOString().split('T')[0];
      if (form.date < today) {
        newErrors.date = 'Journey date cannot be in the past.';
      }
    }

    // 5. Return Date Validation (for Round Trip)
    if (form.journeyType === 'roundTrip') {
      if (!form.returnDate) {
        newErrors.returnDate = 'Return journey date is required for round trips.';
      } else if (form.returnDate < form.date) {
        newErrors.returnDate = 'Return date cannot be earlier than outbound journey date.';
      }
    }

    // 6. Travel Class Validation: required
    if (!form.travelClass) {
      newErrors.travelClass = 'Please select a travel class.';
    }

    return newErrors;
  };

  // Proceed to dedicated Payment page
  const handleProceedToPayment = (e) => {
    e.preventDefault();

    // Login check
    if (!user) {
      setErrors({ auth: 'Please login or register to complete your ticket booking.' });
      return;
    }

 HEAD
HEAD
    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      // Focus first error field for accessibility
      const firstKey = Object.keys(validationErrors)[0];
      const el = document.getElementById(`book-${firstKey}`);
      if (el) el.focus();
      return;
    }

    // Normalize phone number to clean 10 digits
    const cleanPhone = form.phone.trim().replace(/\D/g, '').slice(-10);

    const bookingOrder = {

    // 4. Create confirmed booking
    const booking = {
      id: 'RM' + Date.now().toString().slice(-8),
 main

    // Build confirmed booking object
    const booking = {
      id: 'RM' + Date.now().toString().slice(-8),
      tripType: tripType,
      // Onward Journey Details
 member2-trains
      trainName: train.name,
      trainNumber: train.number,
      source: train.source,
      destination: train.destination,
 HEAD
 HEAD
      departure: train.departure,
      arrival: train.arrival,
      duration: train.duration,
      trainPrice: train.price,
      journeyType: form.journeyType,
      journeyMultiplier,


      departure: train.departure,
      arrival: train.arrival,
      duration: train.duration,
 member2-trains
      departurePlatform: train.departurePlatform || '1',
 member2-trains
      date: form.date,
 HEAD
 HEAD
      returnDate: form.journeyType === 'roundTrip' ? form.returnDate : null,
      passengerName: form.passengerName.trim(),
      email: form.email.trim(),
      phone: cleanPhone,

      passengerName: form.passengerName.trim(),
main
      travelClass: form.travelClass,
      seatPreference: form.seatPreference,
      passengers: form.passengers,
      baseFare,
      meals: form.meals,
      mealFare: totalMealFare,
      mealCostPerPassenger,
      subtotal,
      gstRate: GST_RATE,
      gstAmount,
      totalFare,

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
 member2-trains
    };

    // Transition to dedicated Payment page
    navigate('/payment', { state: { bookingOrder } });
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

 HEAD
            <div className="booking-summary" style={{ textAlign: 'left', marginTop: '1.5rem' }}>
 HEAD
              <div className="summary-item"><label>Passenger</label><p>{bookingData.passengerName}</p></div>
              <div className="summary-item"><label>Contact</label><p>{bookingData.phone} | {bookingData.email}</p></div>
              <div className="summary-item"><label>Train</label><p>{bookingData.trainName}</p></div>
              <div className="summary-item"><label>Train Number</label><p>#{bookingData.trainNumber}</p></div>
              <div className="summary-item"><label>Journey Date</label><p>{bookingData.date}</p></div>
              <div className="summary-item"><label>Source</label><p>{bookingData.source}</p></div>
              <div className="summary-item"><label>Destination</label><p>{bookingData.destination}</p></div>
              <div className="summary-item"><label>Class</label><p>{bookingData.travelClass}</p></div>
              <div className="summary-item"><label>Seat Preference</label><p>{bookingData.seatPreference}</p></div>
              <div className="summary-item"><label>Base Ticket Fare</label><p>₹{bookingData.baseFare}</p></div>
              <div className="summary-item"><label>Meals Selected</label><p>{getMealsLabel(bookingData.meals)}</p></div>
              <div className="summary-item"><label>Meal Charges</label><p>₹{bookingData.mealFare || 0}</p></div>
              <div className="summary-item"><label>GST (5%)</label><p>₹{bookingData.gstAmount || 0}</p></div>
              <div className="summary-item"><label>Total Paid Fare</label><p style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '1.1rem' }}>₹{bookingData.fare}</p></div>

              <div className="summary-item">
                <label>Passenger</label>
                <p>{bookingData.passengerName}</p>
              </div>
              <div className="summary-item">
                <label>Train</label>
                <p>{bookingData.trainName}</p>
              </div>
              <div className="summary-item">
                <label>Train Number</label>
                <p>#{bookingData.trainNumber}</p>
              </div>
              <div className="summary-item">
                <label>Journey Date</label>
                <p>{bookingData.date}</p>
              </div>
              <div className="summary-item">
                <label>Source</label>
                <p>{bookingData.source}</p>
              </div>
              <div className="summary-item">
                <label>Destination</label>
                <p>{bookingData.destination}</p>
              </div>
              <div className="summary-item">
                <label>Departure Platform</label>
                <p>Platform {bookingData.departurePlatform || train.departurePlatform || '1'} (Sample Data)</p>
              </div>
              <div className="summary-item">
                <label>Class</label>
                <p>{bookingData.travelClass}</p>
              </div>
              <div className="summary-item">
                <label>Total Fare</label>
                <p>₹{bookingData.fare}</p>

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
member2-trains
              </div>
 main
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
        <p>Complete your booking details for {train.name}</p>
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
 HEAD
            <div className="summary-item"><label>Base Fare (per person)</label><p>₹{train.price}</p></div>
          </div>
        </div>

HEAD
        {/* Booking Form with Validation */}
        <form onSubmit={handleProceedToPayment} noValidate>
          <div className="booking-card card">
            <h3>👤 Passenger & Contact Details</h3>
            <p style={{ color: 'var(--text-light)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              All fields are verified using standard Indian railway booking rules.
            </p>

            <div className="form-group">
              <label htmlFor="book-passengerName">Passenger Full Name *</label>
              <input
                id="book-passengerName"
                type="text"
                placeholder="e.g. Ramesh Kumar"
                value={form.passengerName}
                onChange={(e) => handleChange('passengerName', e.target.value)}
                style={{ borderColor: errors.passengerName ? 'var(--error)' : undefined }}
              />
              {errors.passengerName && <div className="form-error">{errors.passengerName}</div>}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label htmlFor="book-phone">Indian Mobile Number *</label>
                <input
                  id="book-phone"
                  type="tel"
                  placeholder="e.g. 9876543210 or +91 9876543210"
                  value={form.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  style={{ borderColor: errors.phone ? 'var(--error)' : undefined }}
                />
                {errors.phone && <div className="form-error">{errors.phone}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="book-email">Email Address *</label>
                <input
                  id="book-email"
                  type="email"
                  placeholder="e.g. ramesh@example.com"
                  value={form.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  style={{ borderColor: errors.email ? 'var(--error)' : undefined }}
                />
                {errors.email && <div className="form-error">{errors.email}</div>}
              </div>
            </div>

            {/* Journey Type Selector */}
            <div className="form-group">
              <label>Journey Type *</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '6px' }}>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '12px 14px',
                    border: form.journeyType === 'oneWay' ? '2px solid var(--secondary)' : '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)',
                    background: form.journeyType === 'oneWay' ? 'rgba(29, 112, 162, 0.08)' : 'var(--surface)',
                    cursor: 'pointer',
                    fontWeight: 600,
                    color: form.journeyType === 'oneWay' ? 'var(--primary)' : 'var(--text)',
                  }}
                >
                  <input
                    type="radio"
                    name="journeyType"
                    value="oneWay"
                    checked={form.journeyType === 'oneWay'}
                    onChange={() => handleChange('journeyType', 'oneWay')}
                  />
                  <span>➡️ One-Way Journey</span>
                </label>

                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '12px 14px',
                    border: form.journeyType === 'roundTrip' ? '2px solid var(--secondary)' : '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)',
                    background: form.journeyType === 'roundTrip' ? 'rgba(29, 112, 162, 0.08)' : 'var(--surface)',
                    cursor: 'pointer',
                    fontWeight: 600,
                    color: form.journeyType === 'roundTrip' ? 'var(--primary)' : 'var(--text)',
                  }}
                >
                  <input
                    type="radio"
                    name="journeyType"
                    value="roundTrip"
                    checked={form.journeyType === 'roundTrip'}
                    onChange={() => handleChange('journeyType', 'roundTrip')}
                  />
                  <span>🔄 Return / Round Trip (2 legs)</span>
                </label>
              </div>
            </div>

            {/* Journey Dates */}
            <div style={{ display: 'grid', gridTemplateColumns: form.journeyType === 'roundTrip' ? '1fr 1fr' : '1fr', gap: '14px' }}>
              <div className="form-group">
                <label htmlFor="book-date">Outbound Journey Date *</label>
                <input
                  id="book-date"
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={form.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                  style={{ borderColor: errors.date ? 'var(--error)' : undefined }}
                />
                {errors.date && <div className="form-error">{errors.date}</div>}
              </div>

              {form.journeyType === 'roundTrip' && (
                <div className="form-group">
                  <label htmlFor="book-returnDate">Return Journey Date *</label>
                  <input
                    id="book-returnDate"
                    type="date"
                    min={form.date || new Date().toISOString().split('T')[0]}
                    value={form.returnDate}
                    onChange={(e) => handleChange('returnDate', e.target.value)}
                    style={{ borderColor: errors.returnDate ? 'var(--error)' : undefined }}
                  />
                  {errors.returnDate && <div className="form-error">{errors.returnDate}</div>}
                </div>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label htmlFor="book-travelClass">Travel Class *</label>
                <select
                  id="book-travelClass"
                  value={form.travelClass}
                  onChange={(e) => handleChange('travelClass', e.target.value)}
                  style={{ borderColor: errors.travelClass ? 'var(--error)' : undefined }}
                >
                  <option value="">Select Class</option>
                  {train.classes.map((cls) => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </select>
                {errors.travelClass && <div className="form-error">{errors.travelClass}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="book-seatPreference">Seat / Berth Preference</label>
                <select
                  id="book-seatPreference"
                  value={form.seatPreference}
                  onChange={(e) => handleChange('seatPreference', e.target.value)}
                >
                  <option value="No Preference">No Preference</option>
                  <option value="Lower Berth">Lower Berth</option>
                  <option value="Upper Berth">Upper Berth</option>
                  <option value="Middle Berth">Middle Berth</option>
                  <option value="Side Lower">Side Lower</option>
                  <option value="Window">Window</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="book-count">Number of Passengers</label>
              <select
                id="book-count"
                value={form.passengers}
                onChange={(e) => handleChange('passengers', parseInt(e.target.value))}
              >
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n}>
                    {n} Passenger{n > 1 ? 's' : ''}
                  </option>
                ))}
              </select>

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
 member2-trains

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
 HEAD

              <FormInput
                id="book-seat"
                label="Berth / Seat Preference"
                value={form.seatPreference}
                onChange={(val) => handleChange('seatPreference', val)}
                options={[
                  { value: 'No Preference', label: 'No Preference' },
                  { value: 'Lower Berth', label: 'Lower Berth' },
                  { value: 'Upper Berth', label: 'Upper Berth' },
                  { value: 'Window', label: 'Window' },
                ]}
              />
main

 member2-trains
            </div>
          </div>

 HEAD
          {/* Food & Meal Options */}
          <div className="booking-card card">
HEAD
            <h3>🍽️ Food & Catering Options</h3>
            <p style={{ color: 'var(--text-light)', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
              Pre-book freshly prepared IRCTC catering meals. Choose breakfast, lunch, both, or neither. Meal charges are calculated per passenger.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
              {/* Breakfast Option */}
              <label
                htmlFor="meal-breakfast"
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  padding: '14px',
                  border: form.meals.breakfast ? '2px solid var(--secondary)' : '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  background: form.meals.breakfast ? 'rgba(29, 112, 162, 0.06)' : 'var(--surface)',
                  cursor: 'pointer',
                  transition: 'var(--transition)',
                }}
              >
                <input
                  id="meal-breakfast"
                  type="checkbox"
                  checked={form.meals.breakfast}
                  onChange={() => handleMealToggle('breakfast')}
                  style={{ width: '18px', height: '18px', marginTop: '2px', cursor: 'pointer' }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ color: 'var(--primary)', fontSize: '0.95rem' }}>🍳 Breakfast</strong>
                    <span style={{ fontWeight: 700, color: 'var(--secondary)' }}>₹{MEAL_PRICES.breakfast} / person</span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-light)', marginTop: '4px', margin: 0 }}>
                    Morning breakfast served with tea or coffee (veg cutlet / idli vada / poha)
                  </p>
                </div>
              </label>

              {/* Lunch Option */}
              <label
                htmlFor="meal-lunch"
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  padding: '14px',
                  border: form.meals.lunch ? '2px solid var(--secondary)' : '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  background: form.meals.lunch ? 'rgba(29, 112, 162, 0.06)' : 'var(--surface)',
                  cursor: 'pointer',
                  transition: 'var(--transition)',
                }}
              >
                <input
                  id="meal-lunch"
                  type="checkbox"
                  checked={form.meals.lunch}
                  onChange={() => handleMealToggle('lunch')}
                  style={{ width: '18px', height: '18px', marginTop: '2px', cursor: 'pointer' }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ color: 'var(--primary)', fontSize: '0.95rem' }}>🍱 Lunch / Dinner</strong>
                    <span style={{ fontWeight: 700, color: 'var(--secondary)' }}>₹{MEAL_PRICES.lunch} / person</span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-light)', marginTop: '4px', margin: 0 }}>
                    Standard North/South Indian Thali (dal, paneer/curry, rice, 3 rotis, curd, sweet)
                  </p>
                </div>
              </label>
            </div>

            <div style={{ marginTop: '14px', fontSize: '0.86rem', color: 'var(--text-muted)' }}>
              {form.meals.breakfast && form.meals.lunch ? (
                <span style={{ color: 'var(--success)', fontWeight: 600 }}>
                  ✓ Both Breakfast & Lunch selected (₹{MEAL_PRICES.breakfast + MEAL_PRICES.lunch} × {form.passengers} passenger{form.passengers > 1 ? 's' : ''} = ₹{totalMealFare})
                </span>
              ) : form.meals.breakfast ? (
                <span style={{ color: 'var(--primary)', fontWeight: 600 }}>
                  ✓ Breakfast selected (₹{MEAL_PRICES.breakfast} × {form.passengers} passenger{form.passengers > 1 ? 's' : ''} = ₹{totalMealFare})
                </span>
              ) : form.meals.lunch ? (
                <span style={{ color: 'var(--primary)', fontWeight: 600 }}>
                  ✓ Lunch selected (₹{MEAL_PRICES.lunch} × {form.passengers} passenger{form.passengers > 1 ? 's' : ''} = ₹{totalMealFare})
                </span>
              ) : (
                <span>ℹ️ No meals selected (opted out — ₹0 meal charge)</span>
              )}
            </div>
          </div>

          {/* Fare Summary & Navigation to Payment */}
          <div className="booking-card card">
            <h3>💰 Fare Summary & Taxes</h3>
            <div className="booking-summary">
              <div className="summary-item">
                <label>Journey Type</label>
                <p>{form.journeyType === 'roundTrip' ? '🔄 Round Trip (2 legs)' : '➡️ One-Way'}</p>
              </div>
              <div className="summary-item">
                <label>Base Ticket Fare</label>
                <p>
                  ₹{train.price} × {form.passengers} passenger{form.passengers > 1 ? 's' : ''}
                  {journeyMultiplier === 2 ? ' × 2 (Round Trip)' : ''} = ₹{baseFare}
                </p>
              </div>
              <div className="summary-item">
                <label>Travel Class</label>
                <p>{form.travelClass || 'Not selected'}</p>
              </div>
              <div className="summary-item">
                <label>Selected Meals</label>
                <p>{getMealsLabel(form.meals)}</p>
              </div>
              <div className="summary-item">
                <label>Meal Charges</label>
                <p>
                  {totalMealFare > 0
                    ? `₹${mealCostPerPassenger} × ${form.passengers} passenger${form.passengers > 1 ? 's' : ''}${journeyMultiplier === 2 ? ' × 2 legs' : ''} = ₹${totalMealFare}`
                    : '₹0 (None)'}
                </p>
              </div>
              <div className="summary-item">
                <label>Subtotal (Fare + Meals)</label>
                <p>₹{subtotal}</p>
              </div>
              <div className="summary-item">
                <label>GST (5% on taxable charges)</label>
                <p style={{ color: 'var(--secondary)', fontWeight: 600 }}>+ ₹{gstAmount}</p>
              </div>
            </div>


            <h3>💰 Fare Summary & Payment</h3>

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
member2-trains
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

 main
            <div className="booking-total">
 HEAD
              <span className="total-label">Final Payable Total (Fare + Meals + GST)</span>
              <span className="total-amount">₹{totalFare}</span>
            </div>

HEAD

            {/* Payment Investigation Note: Requirements studied before real payment integration */}
 main

              <span className="total-label">Total Booking Fare ({tripType === 'roundTrip' ? 'Round Trip' : 'One Way'})</span>
              <span className="total-amount">₹{totalFare}</span>
            </div>

            {/* Simulated Payment Notice */}
member2-trains
            <div
              style={{
                marginTop: '1.25rem',
                padding: '12px 14px',
 HEAD
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(29, 112, 162, 0.06)',
                border: '1px solid rgba(29, 112, 162, 0.2)',

                borderRadius: '8px',
                background: 'rgba(59, 130, 246, 0.08)',
                border: '1px solid rgba(59, 130, 246, 0.25)',
 main
                fontSize: '0.84rem',
                color: 'var(--text-light)',
              }}
            >
HEAD
              <div style={{ fontWeight: 600, color: 'var(--primary)', marginBottom: '3px' }}>
                🔒 Step 1 of 2: Passenger Details Complete
              </div>
              Clicking below validates all required fields with strict format checks and takes you to the secure payment checkout page.

              <div style={{ fontWeight: 600, color: 'var(--primary)', marginBottom: '4px' }}>
                💳 Payment Mode: Simulated Instant Confirmation
              </div>
 HEAD
              No real payments are deducted. Payment gateway requirements (webhook verification, tokenization & PCI-DSS compliance) have been investigated for future gateway integration.
main

              Demo platform: no real charges are deducted. All passenger berth preferences and round-trip journeys are confirmed and saved to your account.
 member2-trains
            </div>

            <button
              type="submit"
              className="btn btn-accent"
 HEAD
HEAD
              style={{ width: '100%', marginTop: '1rem', padding: '14px', fontSize: '1.05rem', fontWeight: 700 }}
            >
              💳 Proceed to Payment (₹{totalFare}) ➔

              style={{ width: '100%', marginTop: '1rem', padding: '14px', fontSize: '1rem' }}
            >
              ✅ Confirm & Book Ticket (₹{totalFare})
main

              style={{ width: '100%', marginTop: '1.25rem', padding: '14px', fontSize: '1.05rem', fontWeight: 700 }}
            >
              ✅ Confirm & Book {tripType === 'roundTrip' ? 'Round-Trip' : ''} Ticket (₹{totalFare})
 member2-trains
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default Booking;
