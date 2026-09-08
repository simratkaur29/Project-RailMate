import { useState } from 'react';
import '../styles/community.css';

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
      "Never board or exit a moving train — wait for it to stop completely.",
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

const categories = [
  { key: 'bestTime', icon: '🕐', label: 'Best Time to Travel' },
  { key: 'whatToCarry', icon: '🎒', label: 'What to Carry' },
  { key: 'stationArrival', icon: '🚉', label: 'Station Arrival Tips' },
  { key: 'safety', icon: '🛡️', label: 'Safety Tips' },
  { key: 'packing', icon: '📋', label: 'Packing Checklist' },
  { key: 'general', icon: '💡', label: 'General Tips' },
];

function SmartAssistant() {
  const [selected, setSelected] = useState('bestTime');

  const currentData = assistantData[selected];

  return (
    <main className="assistant-page">
      <div className="page-header">
        <h1>🤖 Smart Travel Assistant</h1>
        <p>Get helpful suggestions for your railway journey</p>
      </div>

      <div className="container assistant-container">
        <p className="section-subtitle">Select a category to get travel advice:</p>

        <div className="assistant-categories">
          {categories.map((cat) => (
            <button
              key={cat.key}
              className={`category-btn ${selected === cat.key ? 'active' : ''}`}
              onClick={() => setSelected(cat.key)}
            >
              <span className="cat-icon">{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>

        <div className="assistant-response">
          <h3>{currentData.title}</h3>
          <ul>
            {currentData.tips.map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}

export default SmartAssistant;
