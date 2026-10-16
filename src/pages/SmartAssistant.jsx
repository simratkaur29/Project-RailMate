import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useJourney } from '../context/JourneyContext';
import FormInput from '../components/FormInput';
import destinations from '../data/destinations';
import '../styles/community.css';
import '../styles/mytrips.css';

/**
 * Original assistant advice data — PRESERVED from existing SmartAssistant.jsx
 */
const assistantData = {
  bestTime: {
    title: "Best Time to Travel",
    tips: [
      "Travel during weekdays (Tuesday to Thursday) for less crowded trains and better availability.",
      "Avoid peak holiday seasons like Diwali, Holi, and summer vacations unless booked well in advance.",
      "Early morning departures (5-7 AM) often have better on-time performance.",
      "Winter months (October to February) are ideal for long-distance travel across most of India.",
      "Book Tatkal tickets at 10 AM (AC classes) or 11 AM (Sleeper) for last-minute travel.",
      "Night trains are great for saving hotel costs on long-distance routes.",
    ],
  },
  whatToCarry: {
    title: "What to Carry on a Train Journey",
    tips: [
      "Valid ID proof (Aadhar, Passport, Voter ID, or Driving License) — mandatory for all passengers.",
      "Printed or digital copy of your e-ticket or PNR number.",
      "Water bottles and light snacks — station food can be unreliable at smaller stops.",
      "Phone charger, power bank, and earphones for entertainment during long journeys.",
      "A small padlock and chain to secure luggage to the berth, especially during night travel.",
      "Personal medicines, hand sanitizer, and wet wipes for hygiene.",
      "A light blanket or shawl — AC coaches can get very cold, especially at night.",
      "A small flashlight or use your phone torch for late-night needs.",
    ],
  },
  stationArrival: {
    title: "Station Arrival Tips",
    tips: [
      "Arrive at the station at least 30 minutes before departure for outstation trains.",
      "Check the platform number on display boards — platforms can change at the last minute.",
      "Locate your coach position using the coach indicator boards on the platform.",
      "Keep your luggage close and use the cloak room if you need to store bags temporarily.",
      "Use the railway app or announcements to track train arrival status in real-time.",
      "Avoid unauthorized porters — use only IRCTC-approved coolies with red uniforms.",
    ],
  },

  safety: {
    title: "Railway Safety Tips",
    tips: [
      "Never board or exit a moving train — wait for it to stop completely .",
      "Do not lean out of windows or stand near open doors during the journey.",
      "Keep emergency numbers handy — Railway Helpline: 139, RPF: 182.",
      "Report any suspicious activity or unattended luggage to the TTE or RPF immediately.",
      "Do not accept food or drinks from strangers — drugging incidents are reported occasionally.",
      "Ensure coach doors are locked from inside during night travel in non-AC coaches.",
      "Know the location of the emergency chain and fire extinguisher in your coach.",
    ],
  },
  packing: {
    title: "Packing Checklist",
    tips: [
      "✅ Valid ID proof and ticket/PNR",
      "✅ Water bottles (minimum 2 liters for long journeys)",
      "✅ Snacks, dry fruits, and biscuits",
      "✅ Phone charger and power bank (fully charged)",
      "✅ Headphones and offline entertainment (movies, music, books)",
      "✅ Bedsheet or thin blanket (for Sleeper class)",
      "✅ Small padlock with chain for luggage",
      "✅ Toiletry kit with hand sanitizer, tissue, and towel",
      "✅ Personal medicines and first-aid basics",
      "✅ Cash and UPI-enabled phone for small purchases",
    ],
  },
  general: {
    title: "General Travel Recommendations",
    tips: [
      "Book tickets 120 days in advance for the best availability on popular routes.",
      "Use the IRCTC website or app for official bookings — avoid unauthorized agents.",
      "Check your PNR status 4 hours before departure for waitlisted tickets.",
      "Carry food from home or buy from the pantry car — it's more hygienic than platform food.",
      "Set an alarm before your arrival station — ask the TTE to alert you if needed.",
      "Explore the station while waiting — many stations have affordable lounges and food courts.",
      "Rate your journey experience on the IRCTC app to help improve services for others.",
    ],
  },
};

const generalCategories = [
  { key: 'bestTime', icon: '🕐', label: 'Best Time to Travel' },
  { key: 'whatToCarry', icon: '🎒', label: 'What to Carry' },
  { key: 'stationArrival', icon: '🚉', label: 'Station Arrival Tips' },
  { key: 'safety', icon: '🛡️', label: 'Safety Tips' },
  { key: 'packing', icon: '📋', label: 'Packing Checklist' },
  { key: 'general', icon: '💡', label: 'General Tips' },
];

const purposeOptions = [
  { value: 'Tourism', label: 'Tourism' },
  { value: 'College or Studies', label: 'College or Studies' },
  { value: 'Business', label: 'Business' },
  { value: 'Visiting Family', label: 'Visiting Family' },
];

const interestList = [
  'History and Heritage',
  'Nature',
  'Shopping',
  'Food',
  'Family-Friendly',
];

/**
 * SmartAssistant — Enhanced Travel Assistant with destination-aware recommendations.
 * Preserves the original general travel advice categories and adds a personalized
 * travel plan generator based on destination, purpose, and interests.
 */
function SmartAssistant() {
  const navigate = useNavigate();
  const { journey, updateJourney, setFullChecklist } = useJourney();

  // ---- Mode: general tips vs destination-aware plan ----
  const [mode, setMode] = useState('general');
  const [selectedCategory, setSelectedCategory] = useState('bestTime');

  // ---- Destination form state (local) ----
  const [formData, setFormData] = useState({
    destination: journey.destination || '',
    travelDate: journey.travelDate || '',
    purpose: journey.travelPurpose || '',
    interests: journey.interests?.length > 0 ? [...journey.interests] : [],
  });
  const [formErrors, setFormErrors] = useState({});
  const [travelPlan, setTravelPlan] = useState(null);
  const [planGenerated, setPlanGenerated] = useState(false);

  // Pre-fill form when journey context changes
  useEffect(() => {
    if (journey.destination && !formData.destination) {
      setFormData((prev) => ({ ...prev, destination: journey.destination }));
    }
    if (journey.travelDate && !formData.travelDate) {
      setFormData((prev) => ({ ...prev, travelDate: journey.travelDate }));
    }
    if (journey.travelPurpose && !formData.purpose) {
      setFormData((prev) => ({ ...prev, purpose: journey.travelPurpose }));
    }
    if (journey.interests?.length > 0 && formData.interests.length === 0) {
      setFormData((prev) => ({ ...prev, interests: [...journey.interests] }));
    }
  }, [journey]);

  // ---- Validation ----
  const validateForm = () => {
    const errors = {};
    if (!formData.destination.trim()) {
      errors.destination = 'Destination is required.';
    }
    if (!formData.travelDate) {
      errors.travelDate = 'Travel date is required.';
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (new Date(formData.travelDate) < today) {
        errors.travelDate = 'Travel date cannot be in the past.';
      }
    }
    if (!formData.purpose) {
      errors.purpose = 'Please select a travel purpose.';
    }
    return errors;
  };

  // ---- Toggle interests ----
  const toggleInterest = (interest) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  // ---- Generate travel plan ----
  const handleGeneratePlan = (e) => {
    e.preventDefault();
    const errors = validateForm();
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) return;

    // Update global journey context
    updateJourney({
      destination: formData.destination,
      travelDate: formData.travelDate,
      travelPurpose: formData.purpose,
      interests: formData.interests,
    });

    // Find destination data
    const dest = destinations.find(
      (d) => d.name.toLowerCase() === formData.destination.trim().toLowerCase()
    );

    // Build the plan
    const plan = generateTravelPlan(dest, formData);
    setTravelPlan(plan);
    setPlanGenerated(true);

    // Set checklist in context
    const checklistItems = plan.packing.map((text, index) => ({
      id: `chk-${index}`,
      text,
      checked: false,
    }));
    setFullChecklist(checklistItems);
  };

  // ---- Plan Generator Logic ----
  const generateTravelPlan = (dest, form) => {
    const plan = {
      destination: form.destination,
      packing: [],
      destinationTips: [],
      arrivalChecklist: [],
      transportation: [],
      places: [],
      food: [],
    };

    // A. Packing Checklist
    plan.packing = [
      'Valid ID proof (Aadhar, Passport, or Driving License)',
      'Printed or digital train ticket / PNR',
      'Water bottle and light snacks for the journey',
      'Phone charger and power bank',
      'Personal medicines and first-aid basics',
      'Cash and UPI-enabled phone',
    ];

    if (form.purpose === 'Tourism') {
      plan.packing.push('Comfortable walking shoes');
      plan.packing.push('Camera or phone with storage space for photos');
      plan.packing.push('Sunscreen and sunglasses');
    } else if (form.purpose === 'Business') {
      plan.packing.push('Formal clothing and accessories');
      plan.packing.push('Laptop and charger');
      plan.packing.push('Business cards and documents');
    } else if (form.purpose === 'College or Studies') {
      plan.packing.push('College documents and admission papers');
      plan.packing.push('Laptop/tablet and charger');
      plan.packing.push('Stationery and notebooks');
    } else if (form.purpose === 'Visiting Family') {
      plan.packing.push('Gifts or sweets for family');
      plan.packing.push('Comfortable home clothes');
    }

    if (form.interests.includes('Nature')) {
      plan.packing.push('Hat or cap for outdoor visits');
    }
    if (form.interests.includes('Shopping')) {
      plan.packing.push('Extra bag for shopping purchases');
    }

    // B. Destination Tips
    if (dest) {
      plan.destinationTips = dest.travelTips;
    } else {
      plan.destinationTips = [
        `Research ${form.destination} attractions and opening hours before your visit.`,
        'Keep your accommodation address saved on your phone.',
        'Check weather conditions and pack accordingly.',
        'Learn about local transportation options in advance.',
        'Keep emergency contacts saved on your phone.',
        'Carry weather-appropriate clothing.',
      ];
    }

    // C. Arrival Checklist
    plan.arrivalChecklist = [
      'Confirm your accommodation address and directions from the station.',
      'Save the local emergency helpline numbers.',
      'Plan your onward transportation from the railway station.',
      'Keep a printed copy of your accommodation booking.',
      'Withdraw cash if needed — not all places accept digital payments.',
    ];

    if (form.purpose === 'Tourism') {
      plan.arrivalChecklist.push('Download offline maps for the destination area.');
    } else if (form.purpose === 'Business') {
      plan.arrivalChecklist.push('Confirm your meeting venue and travel time from the station.');
    }

    // D. Transportation
    if (dest) {
      plan.transportation = dest.transportation;
    } else {
      plan.transportation = [
        { mode: 'Auto-Rickshaws / Taxis', description: 'Usually available at the railway station exit. Negotiate fare or use app-based services.' },
        { mode: 'Ride-Sharing Apps', description: 'Convenient for travel within the city. Check availability in advance.' },
      ];
    }

    // E. Places to Visit
    if (dest) {
      let places = dest.attractions;
      if (form.interests.length > 0) {
        const filtered = places.filter((p) =>
          form.interests.some(
            (interest) =>
              p.category.toLowerCase().includes(interest.toLowerCase()) ||
              interest.toLowerCase().includes(p.category.toLowerCase())
          )
        );
        places = filtered.length > 0 ? filtered : places;
      }
      plan.places = places.slice(0, 6);
    }

    // F. Food
    if (dest) {
      plan.food = dest.food;
    }

    return plan;
  };

  const currentCategoryData = assistantData[selectedCategory];

  return (
    <main className="assistant-page">
      <div className="page-header">
        <h1>🤖 Smart Travel Assistant</h1>
        <p>Get helpful suggestions for your railway journey</p>
      </div>

      <div className="container assistant-container" style={{ maxWidth: 900 }}>
        {/* Journey Banner — shown if journey exists */}
        {journey.selectedTrain && (
          <div className="journey-banner">
            <span className="jb-icon">🚆</span>
            <div className="jb-info">
              <strong>{journey.selectedTrain.name}</strong>
              <br />
              <span>
                {journey.source} → {journey.destination}
                {journey.travelDate && ` • ${journey.travelDate}`}
              </span>
            </div>
            <button
              className="btn btn-outline btn-sm"
              onClick={() => navigate(`/destination/${encodeURIComponent(journey.destination)}`)}
            >
              Explore Destination
            </button>
          </div>
        )}

        {/* Mode Selector */}
        <div className="tab-nav" style={{ marginBottom: '2rem' }}>
          <button
            className={`tab-btn ${mode === 'general' ? 'active' : ''}`}
            onClick={() => setMode('general')}
          >
            💡 General Travel Advice
          </button>
          <button
            className={`tab-btn ${mode === 'destination' ? 'active' : ''}`}
            onClick={() => setMode('destination')}
          >
            🗺️ Destination Travel Plan
          </button>
        </div>

        {/* ========== GENERAL MODE (PRESERVED) ========== */}
        {mode === 'general' && (
          <>
            <p className="section-subtitle">Select a category to get travel advice:</p>

            <div className="assistant-categories">
              {generalCategories.map((cat) => (
                <button
                  key={cat.key}
                  className={`category-btn ${selectedCategory === cat.key ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat.key)}
                >
                  <span className="cat-icon">{cat.icon}</span>
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="assistant-response">
              <h3>{currentCategoryData.title}</h3>
              <ul>
                {currentCategoryData.tips.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </div>
          </>
        )}

        {/* ========== DESTINATION MODE ========== */}
        {mode === 'destination' && (
          <>
            {/* Destination Travel Plan Form */}
            <div className="assistant-form-section">
              <h3>🗺️ Plan Your Destination Trip</h3>
              <p className="form-subtitle">
                Enter your travel details to get personalized recommendations.
                {journey.destination && ' Some fields are pre-filled from your selected journey.'}
              </p>

              <form onSubmit={handleGeneratePlan}>
                <div className="form-row">
                  <FormInput
                    label="Destination"
                    id="assist-dest"
                    value={formData.destination}
                    onChange={(val) => {
                      setFormData({ ...formData, destination: val });
                      if (formErrors.destination) setFormErrors({ ...formErrors, destination: '' });
                    }}
                    placeholder="e.g. Jaipur, New Delhi"
                    error={formErrors.destination}
                    required
                  />
                  <FormInput
                    label="Travel Date"
                    id="assist-date"
                    type="date"
                    value={formData.travelDate}
                    onChange={(val) => {
                      setFormData({ ...formData, travelDate: val });
                      if (formErrors.travelDate) setFormErrors({ ...formErrors, travelDate: '' });
                    }}
                    error={formErrors.travelDate}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                <FormInput
                  label="Purpose of Travel"
                  id="assist-purpose"
                  value={formData.purpose}
                  onChange={(val) => {
                    setFormData({ ...formData, purpose: val });
                    if (formErrors.purpose) setFormErrors({ ...formErrors, purpose: '' });
                  }}
                  placeholder="Select purpose"
                  error={formErrors.purpose}
                  options={purposeOptions}
                  required
                />

                <div className="form-group">
                  <label>Interests <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: '0.82rem' }}>(optional)</span></label>
                  <div className="interests-grid">
                    {interestList.map((interest) => (
                      <button
                        key={interest}
                        type="button"
                        className={`interest-chip ${formData.interests.includes(interest) ? 'selected' : ''}`}
                        onClick={() => toggleInterest(interest)}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                </div>

                <button type="submit" className="btn btn-accent" style={{ marginTop: '0.5rem' }}>
                  ✨ Generate Travel Plan
                </button>
              </form>
            </div>

            {/* Generated Travel Plan */}
            {planGenerated && travelPlan && (
              <div className="travel-plan">
                <h2 className="section-title" style={{ fontSize: '1.4rem' }}>
                  Your Travel Plan for {travelPlan.destination}
                </h2>

                {/* A. Packing Checklist */}
                <div className="plan-section">
                  <div className="plan-section-header">
                    <span className="ps-icon">🎒</span>
                    <h4>Packing Checklist</h4>
                  </div>
                  <div className="plan-section-body">
                    <ul>
                      {travelPlan.packing.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* B. Destination Tips */}
                <div className="plan-section">
                  <div className="plan-section-header">
                    <span className="ps-icon">💡</span>
                    <h4>Travel Tips for {travelPlan.destination}</h4>
                  </div>
                  <div className="plan-section-body">
                    <ul>
                      {travelPlan.destinationTips.map((tip, i) => (
                        <li key={i}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* C. Arrival Checklist */}
                <div className="plan-section">
                  <div className="plan-section-header">
                    <span className="ps-icon">🛬</span>
                    <h4>Arrival Preparation</h4>
                  </div>
                  <div className="plan-section-body">
                    <ul>
                      {travelPlan.arrivalChecklist.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* D. Local Transportation */}
                <div className="plan-section">
                  <div className="plan-section-header">
                    <span className="ps-icon">🚌</span>
                    <h4>Local Transportation</h4>
                  </div>
                  <div className="plan-section-body">
                    <ul>
                      {travelPlan.transportation.map((t, i) => (
                        <li key={i}>
                          <strong>{t.mode}:</strong> {t.description}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* E. Places to Visit */}
                {travelPlan.places.length > 0 && (
                  <div className="plan-section">
                    <div className="plan-section-header">
                      <span className="ps-icon">📍</span>
                      <h4>Suggested Places to Visit</h4>
                    </div>
                    <div className="plan-section-body">
                      <ul>
                        {travelPlan.places.map((place, i) => (
                          <li key={i}>
                            <strong>{place.name}</strong> — {place.description}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* F. Local Food */}
                {travelPlan.food.length > 0 && (
                  <div className="plan-section">
                    <div className="plan-section-header">
                      <span className="ps-icon">🍽️</span>
                      <h4>Recommended Local Food</h4>
                    </div>
                    <div className="plan-section-body">
                      <ul>
                        {travelPlan.food.map((f, i) => (
                          <li key={i}>
                            <strong>{f.name}</strong> — {f.description}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* G & H. Action Buttons */}
                <div className="plan-actions">
                  {destinations.find(
                    (d) => d.name.toLowerCase() === travelPlan.destination.toLowerCase()
                  ) && (
                      <button
                        className="btn btn-primary"
                        onClick={() =>
                          navigate(`/destination/${encodeURIComponent(travelPlan.destination)}`)
                        }
                      >
                        🗺️ Open Destination Guide
                      </button>
                    )}
                  <button
                    className="btn btn-outline"
                    onClick={() => navigate('/stations')}
                  >
                    🚉 View Station Guide
                  </button>
                  <button
                    className="btn btn-outline"
                    onClick={() => navigate('/my-trips')}
                  >
                    📋 View My Trip
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}

export default SmartAssistant;
