import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { JourneyProvider } from './context/JourneyContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoginPromptModal from './components/LoginPromptModal';
import Home from './pages/Home';
import Trains from './pages/Trains';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Booking from './pages/Booking';
import Payment from './pages/Payment';
import MyBookings from './pages/MyBookings';
import StationGuide from './pages/StationGuide';
import SmartAssistant from './pages/SmartAssistant';
import Community from './pages/Community';
import RailwayTips from './pages/RailwayTips';
import DestinationGuide from './pages/DestinationGuide';
import MyTrips from './pages/MyTrips';
import './styles/global.css';
import './styles/profile.css';

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('railmate_user');
    const loggedIn = localStorage.getItem('railmate_logged_in');
    if (saved && loggedIn === 'true') {
      return JSON.parse(saved);
    }
    return null;
  });

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('railmate_user', JSON.stringify(userData));
    localStorage.setItem('railmate_logged_in', 'true');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.setItem('railmate_logged_in', 'false');
  };

  return (
    <Router>
      <JourneyProvider>
        <div className="app">
          <Navbar user={user} onLogout={handleLogout} />
          <LoginPromptModal />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/trains" element={<Trains />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Register onLogin={handleLogin} />} />
            <Route path="/profile" element={<Profile user={user} onLogin={handleLogin} onLogout={handleLogout} />} />
            <Route path="/booking" element={<Booking user={user} />} />
            <Route path="/payment" element={<Payment user={user} />} />
            <Route path="/my-bookings" element={<MyBookings user={user} />} />
            <Route path="/stations" element={<StationGuide />} />
            <Route path="/assistant" element={<SmartAssistant />} />
            <Route path="/community" element={<Community user={user} />} />
            <Route path="/tips" element={<RailwayTips />} />
            <Route path="/destination/:destinationName" element={<DestinationGuide />} />
            <Route path="/my-trips" element={<MyTrips user={user} />} />
          </Routes>
          <Footer />
        </div>
      </JourneyProvider>
    </Router>
  );
}

export default App;
