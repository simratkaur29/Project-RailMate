import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { JourneyProvider } from './context/JourneyContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Trains from './pages/Trains';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Booking from './pages/Booking';
import MyBookings from './pages/MyBookings';
import StationGuide from './pages/StationGuide';
import SmartAssistant from './pages/SmartAssistant';
import Community from './pages/Community';
import RailwayTips from './pages/RailwayTips';
import DestinationGuide from './pages/DestinationGuide';
import MyTrips from './pages/MyTrips';
import LoginPromptModal from './components/LoginPromptModal';
import './styles/global.css';
import './styles/profile.css';

function App() {
  return (
    <Router>
      <JourneyProvider>
        <div className="app">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/trains" element={<Trains />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/stations" element={<StationGuide />} />
            <Route path="/assistant" element={<SmartAssistant />} />
            <Route path="/community" element={<Community />} />
            <Route path="/tips" element={<RailwayTips />} />
            <Route path="/destination/:destinationName" element={<DestinationGuide />} />
            <Route path="/my-trips" element={<MyTrips />} />
          </Routes>
          <Footer />
          <LoginPromptModal />
        </div>
      </JourneyProvider>
    </Router>
  );
}

export default App;
