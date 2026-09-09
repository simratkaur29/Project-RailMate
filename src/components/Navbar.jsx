import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import '../styles/navbar.css';

function Navbar({ user, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    setMenuOpen(false);
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">🚆</span>
          <span>RAIL<span className="logo-accent">MATE</span></span>
        </Link>

        <button className="mobile-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          {menuOpen ? '✕' : '☰'}
        </button>

        <div className={`navbar-menu ${menuOpen ? 'open' : ''}`}>
          <div className="navbar-links">
            <NavLink to="/" onClick={() => setMenuOpen(false)}>Home</NavLink>
            <NavLink to="/trains" onClick={() => setMenuOpen(false)}>Trains</NavLink>
            <NavLink to="/stations" onClick={() => setMenuOpen(false)}>Station Guide</NavLink>
            <NavLink to="/assistant" onClick={() => setMenuOpen(false)}>Travel Assistant</NavLink>
            <NavLink to="/community" onClick={() => setMenuOpen(false)}>Community</NavLink>
            <NavLink to="/tips" onClick={() => setMenuOpen(false)}>Railway Tips</NavLink>
            {user && (
              <NavLink to="/my-bookings" onClick={() => setMenuOpen(false)}>My Bookings</NavLink>
            )}
          </div>

          <div className="navbar-auth">
            {user ? (
              <>
                <Link to="/profile" className="btn btn-outline" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.4)' }} onClick={() => setMenuOpen(false)}>
                  👤 {user.name.split(' ')[0]}
                </Link>
                <button className="btn btn-accent" onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.4)' }} onClick={() => setMenuOpen(false)}>
                  Login
                </Link>
                <Link to="/register" className="btn btn-accent" onClick={() => setMenuOpen(false)}>
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
