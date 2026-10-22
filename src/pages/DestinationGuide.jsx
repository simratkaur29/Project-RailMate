
import { useParams, Link } from 'react-router-dom';
import stationsData from '../data/stations';
import '../styles/community.css';

const destinationInfo = {
  'new delhi': {
    description: 'The capital city of India, known for its rich history, vibrant culture, and iconic landmarks.',
    highlights: ['India Gate', 'Red Fort', 'Qutub Minar', 'Lotus Temple', 'Chandni Chowk', 'Connaught Place'],
    bestTime: 'October to March (Winter season)',
    food: ['Chole Bhature', 'Paranthas', 'Chaat', 'Butter Chicken', 'Biryani'],
    transport: 'Delhi Metro is the best way to get around. Auto-rickshaws and cabs are also widely available.',
  },
  mumbai: {
    description: 'The financial capital of India, famous for Bollywood, street food, and the stunning Marine Drive.',
    highlights: ['Gateway of India', 'Marine Drive', 'Elephanta Caves', 'Juhu Beach', 'Siddhivinayak Temple'],
    bestTime: 'November to February (Cool and dry)',
    food: ['Vada Pav', 'Pav Bhaji', 'Bhel Puri', 'Misal Pav', 'Bombay Sandwich'],
    transport: 'Mumbai local trains and BEST buses are the lifeline. Use metro for newer routes.',
  },
  kolkata: {
    description: 'The cultural capital of India, known for its colonial architecture, art, and literature.',
    highlights: ['Victoria Memorial', 'Howrah Bridge', 'Park Street', 'Dakshineswar Temple', 'Indian Museum'],
    bestTime: 'October to February (Pleasant weather)',
    food: ['Rosogolla', 'Kathi Roll', 'Macher Jhol', 'Puchka', 'Mishti Doi'],
    transport: 'Kolkata Metro, trams, and yellow taxis are popular. Ferries across the Hooghly are scenic.',
  },
  chennai: {
    description: 'A major cultural hub in South India, known for its temples, beaches, and classical arts.',
    highlights: ['Marina Beach', 'Kapaleeshwarar Temple', 'Fort St. George', 'Mahabalipuram', 'Guindy National Park'],
    bestTime: 'November to February (Cooler months)',
    food: ['Dosa', 'Idli', 'Filter Coffee', 'Chettinad Chicken', 'Kothu Parotta'],
    transport: 'Chennai Metro and MTC buses cover the city well. Auto-rickshaws are common.',
  },
  bangalore: {
    description: 'The IT capital of India, known for its pleasant weather, parks, and vibrant nightlife.',
    highlights: ['Lalbagh Gardens', 'Cubbon Park', 'Bangalore Palace', 'ISKCON Temple', 'MG Road'],
    bestTime: 'Year-round (Pleasant climate)',
    food: ['Masala Dosa', 'Bisi Bele Bath', 'Filter Coffee', 'Ragi Mudde', 'Mangalorean Fish Curry'],
    transport: 'Namma Metro is expanding. BMTC buses and ride-hailing apps are widely used.',
  },
  chandigarh: {
    description: 'India\'s first planned city, known for its urban design, gardens, and clean streets.',
    highlights: ['Rock Garden', 'Sukhna Lake', 'Rose Garden', 'Capitol Complex', 'Elante Mall'],
    bestTime: 'September to November and February to April',
    food: ['Amritsari Kulcha', 'Chole Bhature', 'Lassi', 'Butter Chicken', 'Paneer Tikka'],
    transport: 'CTU buses and auto-rickshaws. The city is also very bike-friendly.',
  },
  pune: {
    description: 'A vibrant city known for its educational institutions, historical forts, and thriving food scene.',
    highlights: ['Shaniwar Wada', 'Aga Khan Palace', 'Sinhagad Fort', 'Dagdusheth Ganpati', 'Koregaon Park'],
    bestTime: 'October to February (Cool and pleasant)',
    food: ['Misal Pav', 'Poha', 'Vada Pav', 'Bhakarwadi', 'Mastani'],
    transport: 'PMPML buses and auto-rickshaws. Pune Metro is expanding.',
  },
  varanasi: {
    description: 'One of the oldest cities in the world, known for its ghats, temples, and spiritual significance.',
    highlights: ['Dashashwamedh Ghat', 'Kashi Vishwanath Temple', 'Sarnath', 'Ganga Aarti', 'Ramnagar Fort'],
    bestTime: 'October to March (Comfortable weather)',
    food: ['Kachori Sabzi', 'Banarasi Paan', 'Lassi', 'Chaat', 'Malaiyo'],
    transport: 'Auto-rickshaws and e-rickshaws are the main mode. Boat rides on the Ganga are a must.',
  },
  patna: {
    description: 'The capital of Bihar, one of India\'s oldest continuously inhabited cities with rich historical heritage.',
    highlights: ['Golghar', 'Patna Museum', 'Mahavir Mandir', 'Gandhi Maidan', 'Nalanda (nearby)'],
    bestTime: 'October to March (Mild weather)',
    food: ['Litti Chokha', 'Sattu Paratha', 'Thekua', 'Makhana Kheer', 'Dalpuri'],
    transport: 'Auto-rickshaws and city buses. Ride-hailing apps are available.',
  },
};

function DestinationGuide() {
  const { city } = useParams();
  const cityLower = city?.toLowerCase() || '';
  const info = destinationInfo[cityLower];

  const station = stationsData.find(
    (s) => s.city.toLowerCase() === cityLower
  );

  if (!info) {
    return (
      <main className="destination-page">
        <div className="page-header">
          <h1>📍 Destination Guide</h1>
          <p>Explore your travel destination</p>
        </div>
        <div className="container">
          <div className="empty-state">
            <div className="icon">🗺️</div>
            <h3>Destination not found</h3>
            <p>We don't have a guide for "{city}" yet. Try another destination.</p>
            <Link to="/stations" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              Browse Stations
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="destination-page">
      <div className="page-header">
        <h1>📍 {city.charAt(0).toUpperCase() + city.slice(1)} Travel Guide</h1>
        <p>{info.description}</p>
      </div>

      <div className="container">
        <div className="community-list">
          {/* Highlights */}
          <div className="announcement-card card">
            <span className="icon">🏛️</span>
            <div>
              <h4>Top Highlights</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                {info.highlights.map((h) => (
                  <span key={h} className="facility-tag">{h}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Best Time */}
          <div className="announcement-card card" style={{ borderLeftColor: 'var(--secondary)' }}>
            <span className="icon">🕐</span>
            <div>
              <h4>Best Time to Visit</h4>
              <p>{info.bestTime}</p>
            </div>
          </div>

          {/* Local Food */}
          <div className="announcement-card card" style={{ borderLeftColor: 'var(--accent)' }}>
            <span className="icon">🍽️</span>
            <div>
              <h4>Must-Try Food</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                {info.food.map((f) => (
                  <span key={f} className="facility-tag">{f}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Transport */}
          <div className="announcement-card card" style={{ borderLeftColor: 'var(--success)' }}>
            <span className="icon">🚌</span>
            <div>
              <h4>Local Transport</h4>
              <p>{info.transport}</p>
            </div>
          </div>

          {/* Station Info */}
          {station && (
            <div className="announcement-card card" style={{ borderLeftColor: 'var(--primary)' }}>
              <span className="icon">🚉</span>
              <div>
                <h4>{station.name} ({station.code})</h4>
                <p>🚉 {station.platforms} Platforms</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                  {station.facilities.map((f) => (
                    <span key={f} className="facility-tag">{f}</span>
                  ))}
                </div>
                <p style={{ marginTop: '8px', color: 'var(--text-light)' }}>💡 {station.tips}</p>
              </div>
            </div>
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Link to="/stations" className="btn btn-outline">← Back to Station Guide</Link>
        </div>
      </div>
    </main>
  );
}

export default DestinationGuide;
