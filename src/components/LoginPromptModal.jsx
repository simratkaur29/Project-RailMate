import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/loginprompt.css';

/**
 * LoginPromptModal — Welcoming popup shown once per session to visitors.
 *
 * - Appears after a 1.5 s delay on first visit.
 * - Hidden if the user is already logged in.
 * - Dismissal is remembered for the browser session via sessionStorage.
 * - Closes on backdrop click, Escape key, or explicit buttons.
 * - Prevents background scrolling while open.
 */
function LoginPromptModal({ user }) {
  const [visible, setVisible] = useState(false);
  const [animatingOut, setAnimatingOut] = useState(false);
  const navigate = useNavigate();
  const timerRef = useRef(null);
  const modalRef = useRef(null);

  // Determine whether the popup should appear
  useEffect(() => {
    // Already logged in — never show
    if (user) return;

    // Already dismissed this session
    if (sessionStorage.getItem('railmate_login_prompt_dismissed') === 'true') return;

    // Show immediately
    setVisible(true);
  }, [user]);

  // Prevent background scrolling while modal is open
  useEffect(() => {
    if (visible && !animatingOut) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [visible, animatingOut]);

  // Close handler with fade-out animation
  const handleClose = useCallback(() => {
    setAnimatingOut(true);
    sessionStorage.setItem('railmate_login_prompt_dismissed', 'true');
    setTimeout(() => {
      setVisible(false);
      setAnimatingOut(false);
    }, 250);
  }, []);

  // Escape key handler
  useEffect(() => {
    if (!visible) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [visible, handleClose]);

  // Focus trap — focus the modal when it opens
  useEffect(() => {
    if (visible && !animatingOut && modalRef.current) {
      modalRef.current.focus();
    }
  }, [visible, animatingOut]);

  const handleLogin = () => {
    handleClose();
    navigate('/login');
  };

  const handleSignUp = () => {
    handleClose();
    navigate('/register');
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!visible) return null;

  return (
    <div
      className={`lpm-overlay ${animatingOut ? 'lpm-fade-out' : 'lpm-fade-in'}`}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="lpm-heading"
      aria-describedby="lpm-description"
    >
      <div
        className={`lpm-modal ${animatingOut ? 'lpm-scale-out' : 'lpm-scale-in'}`}
        ref={modalRef}
        tabIndex={-1}
      >
        {/* Close Button */}
        <button
          className="lpm-close-btn"
          onClick={handleClose}
          aria-label="Close login prompt"
        >
          ✕
        </button>

        {/* Decorative Top Accent */}
        <div className="lpm-accent-bar"></div>

        {/* Content */}
        <div className="lpm-content">
          <div className="lpm-icon">🚆</div>
          <h2 id="lpm-heading" className="lpm-heading">
            Welcome to <span className="lpm-brand">RAIL<span className="lpm-brand-accent">MATE</span></span>!
          </h2>
          <p className="lpm-subtitle">Your next journey starts here.</p>
          <p id="lpm-description" className="lpm-description">
            Sign in to manage your bookings, save your favourite destinations,
            and enjoy a smarter travel experience.
          </p>

          {/* Action Buttons */}
          <div className="lpm-actions">
            <button className="btn btn-primary lpm-btn-login" onClick={handleLogin}>
              Log In
            </button>
            <button className="btn btn-accent lpm-btn-signup" onClick={handleSignUp}>
              Sign Up
            </button>
          </div>

          <button className="lpm-btn-later" onClick={handleClose}>
            Maybe Later
          </button>
        </div>

        {/* Decorative Bottom Element */}
        <div className="lpm-decoration">
          <div className="lpm-track">
            <div className="lpm-track-line"></div>
            <div className="lpm-track-dot"></div>
            <div className="lpm-track-dot"></div>
            <div className="lpm-track-dot"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPromptModal;
