import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="footer-logo">
              🚆 RAIL<span className="accent">MATE</span>
            </div>
            <p>Your smart railway travel companion. Search trains, explore stations, and plan your journey with ease.</p>
          </div>

          <div>
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/trains">Search Trains</Link></li>
              <li><Link to="/stations">Station Guide</Link></li>
              <li><Link to="/assistant">Smart Assistant</Link></li>
              <li><Link to="/my-bookings">My Bookings</Link></li>
            </ul>
          </div>

          <div>
            <h4>Community</h4>
            <ul>
              <li><Link to="/community">Discussions</Link></li>
              <li><Link to="/community">Travel Reviews</Link></li>
              <li><Link to="/tips">Railway Tips</Link></li>
              <li><Link to="/community">Announcements</Link></li>
            </ul>
          </div>

          <div>
            <h4>Contact</h4>
            <ul>
              <li><span>📧 support@railmate.in</span></li>
              <li><span>📞 139 (Railway Helpline)</span></li>
              <li><span>📞 182 (RPF Helpline)</span></li>
              <li><span>📍 Mumbai, India</span></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} RAILMATE — Smart Railway Booking & Travel Assistant. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
