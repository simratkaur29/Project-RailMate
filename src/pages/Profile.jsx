import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/profile.css';

function Profile({ user, onLogin, onLogout }) {
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', email: '', phone: '' });
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: '', newPass: '', confirm: '' });
  const [passwordMsg, setPasswordMsg] = useState('');

  // Passenger management
  const [passengers, setPassengers] = useState(() => {
    const saved = localStorage.getItem('railmate_passengers');
    return saved ? JSON.parse(saved) : [];
  });
  const [showPassengerForm, setShowPassengerForm] = useState(false);
  const [editingPassenger, setEditingPassenger] = useState(null);
  const [passengerForm, setPassengerForm] = useState({
    name: '', age: '', gender: 'Male', seatPreference: 'No Preference', idType: 'Aadhar Card',
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    setEditForm({ name: user.name, email: user.email, phone: user.phone });
  }, [user, navigate]);

  useEffect(() => {
    localStorage.setItem('railmate_passengers', JSON.stringify(passengers));
  }, [passengers]);

  if (!user) return null;

  const handleEditSave = () => {
    const updatedUser = { ...user, ...editForm };
    localStorage.setItem('railmate_user', JSON.stringify(updatedUser));
    onLogin(updatedUser);
    setEditing(false);
  };

  const handlePasswordChange = () => {
    if (passwordForm.current !== user.password) {
      setPasswordMsg('Current password is incorrect');
      return;
    }
    if (passwordForm.newPass.length < 6) {
      setPasswordMsg('New password must be at least 6 characters');
      return;
    }
    if (passwordForm.newPass !== passwordForm.confirm) {
      setPasswordMsg('Passwords do not match');
      return;
    }
    const updatedUser = { ...user, password: passwordForm.newPass };
    localStorage.setItem('railmate_user', JSON.stringify(updatedUser));
    onLogin(updatedUser);
    setPasswordForm({ current: '', newPass: '', confirm: '' });
    setPasswordMsg('Password changed successfully!');
    setTimeout(() => { setPasswordMsg(''); setChangingPassword(false); }, 2000);
  };

  const handleAddPassenger = () => {
    if (!passengerForm.name.trim() || !passengerForm.age) return;

    if (editingPassenger !== null) {
      const updated = [...passengers];
      updated[editingPassenger] = { ...passengerForm, id: passengers[editingPassenger].id };
      setPassengers(updated);
      setEditingPassenger(null);
    } else {
      setPassengers([...passengers, { ...passengerForm, id: Date.now() }]);
    }
    setPassengerForm({ name: '', age: '', gender: 'Male', seatPreference: 'No Preference', idType: 'Aadhar Card' });
    setShowPassengerForm(false);
  };

  const handleEditPassenger = (index) => {
    setPassengerForm(passengers[index]);
    setEditingPassenger(index);
    setShowPassengerForm(true);
  };

  const handleDeletePassenger = (index) => {
    setPassengers(passengers.filter((_, i) => i !== index));
  };

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <main className="profile-page">
      <div className="page-header">
        <h1>👤 My Profile</h1>
        <p>Manage your account and passenger details</p>
      </div>

      <div className="container profile-container">
        {/* Profile Info Card */}
        <div className="profile-card card">
          <div className="profile-header">
            <div className="profile-avatar">{user.name.charAt(0).toUpperCase()}</div>
            <div className="profile-info">
              <h2>{user.name}</h2>
              <p>{user.email}</p>
            </div>
          </div>

          {editing ? (
            <div>
              <div className="form-group">
                <label htmlFor="edit-name">Full Name</label>
                <input id="edit-name" type="text" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
              </div>
              <div className="form-group">
                <label htmlFor="edit-email">Email</label>
                <input id="edit-email" type="email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} />
              </div>
              <div className="form-group">
                <label htmlFor="edit-phone">Phone</label>
                <input id="edit-phone" type="tel" value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} />
              </div>
              <div className="profile-actions">
                <button className="btn btn-primary" onClick={handleEditSave}>Save Changes</button>
                <button className="btn btn-outline" onClick={() => setEditing(false)}>Cancel</button>
              </div>
            </div>
          ) : (
            <>
              <div className="profile-details">
                <div className="profile-detail">
                  <label>Full Name</label>
                  <p>{user.name}</p>
                </div>
                <div className="profile-detail">
                  <label>Email</label>
                  <p>{user.email}</p>
                </div>
                <div className="profile-detail">
                  <label>Phone</label>
                  <p>{user.phone}</p>
                </div>
              </div>
              <div className="profile-actions" style={{ marginTop: '1.5rem' }}>
                <button className="btn btn-primary" onClick={() => setEditing(true)}>✏️ Edit Profile</button>
                <button className="btn btn-outline" onClick={() => setChangingPassword(!changingPassword)}>🔒 Change Password</button>
                <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
              </div>
            </>
          )}
        </div>

        {/* Change Password */}
        {changingPassword && (
          <div className="profile-card card">
            <h3 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>Change Password</h3>
            {passwordMsg && (
              <p style={{ color: passwordMsg.includes('success') ? 'var(--success)' : 'var(--error)', marginBottom: '1rem', fontWeight: 500 }}>
                {passwordMsg}
              </p>
            )}
            <div className="form-group">
              <label htmlFor="current-pass">Current Password</label>
              <input id="current-pass" type="password" value={passwordForm.current} onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })} />
            </div>
            <div className="form-group">
              <label htmlFor="new-pass">New Password</label>
              <input id="new-pass" type="password" value={passwordForm.newPass} onChange={(e) => setPasswordForm({ ...passwordForm, newPass: e.target.value })} />
            </div>
            <div className="form-group">
              <label htmlFor="confirm-pass">Confirm New Password</label>
              <input id="confirm-pass" type="password" value={passwordForm.confirm} onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })} />
            </div>
            <button className="btn btn-primary" onClick={handlePasswordChange}>Update Password</button>
          </div>
        )}

        {/* Passenger Management */}
        <div className="profile-card card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ color: 'var(--primary)' }}>👥 Passengers</h3>
            <button className="btn btn-accent btn-sm" onClick={() => { setShowPassengerForm(!showPassengerForm); setEditingPassenger(null); setPassengerForm({ name: '', age: '', gender: 'Male', seatPreference: 'No Preference', idType: 'Aadhar Card' }); }}>
              + Add Passenger
            </button>
          </div>

          {showPassengerForm && (
            <div style={{ background: 'var(--background)', padding: '1.25rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem' }}>
              <div className="form-group">
                <label htmlFor="pass-name">Passenger Name</label>
                <input id="pass-name" type="text" placeholder="Full name" value={passengerForm.name} onChange={(e) => setPassengerForm({ ...passengerForm, name: e.target.value })} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label htmlFor="pass-age">Age</label>
                  <input id="pass-age" type="number" placeholder="Age" value={passengerForm.age} onChange={(e) => setPassengerForm({ ...passengerForm, age: e.target.value })} />
                </div>
                <div className="form-group">
                  <label htmlFor="pass-gender">Gender</label>
                  <select id="pass-gender" value={passengerForm.gender} onChange={(e) => setPassengerForm({ ...passengerForm, gender: e.target.value })}>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="pass-seat">Seat Preference</label>
                  <select id="pass-seat" value={passengerForm.seatPreference} onChange={(e) => setPassengerForm({ ...passengerForm, seatPreference: e.target.value })}>
                    <option>No Preference</option>
                    <option>Lower Berth</option>
                    <option>Middle Berth</option>
                    <option>Upper Berth</option>
                    <option>Side Lower</option>
                    <option>Side Upper</option>
                    <option>Window</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="pass-id">ID Type</label>
                  <select id="pass-id" value={passengerForm.idType} onChange={(e) => setPassengerForm({ ...passengerForm, idType: e.target.value })}>
                    <option>Aadhar Card</option>
                    <option>PAN Card</option>
                    <option>Passport</option>
                    <option>Driving License</option>
                    <option>Voter ID</option>
                  </select>
                </div>
              </div>
              <div className="profile-actions">
                <button className="btn btn-primary btn-sm" onClick={handleAddPassenger}>
                  {editingPassenger !== null ? 'Update' : 'Add'} Passenger
                </button>
                <button className="btn btn-outline btn-sm" onClick={() => { setShowPassengerForm(false); setEditingPassenger(null); }}>Cancel</button>
              </div>
            </div>
          )}

          <div className="passenger-list">
            {passengers.length === 0 ? (
              <div className="empty-state">
                <div className="icon">👤</div>
                <p>No passengers added yet. Add passenger details for quick booking.</p>
              </div>
            ) : (
              passengers.map((p, index) => (
                <div key={p.id} className="passenger-card card">
                  <div className="passenger-info">
                    <h4>{p.name}</h4>
                    <p>Age: {p.age} | {p.gender} | {p.seatPreference} | {p.idType}</p>
                  </div>
                  <div className="passenger-actions">
                    <button className="btn btn-outline btn-sm" onClick={() => handleEditPassenger(index)}>✏️ Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDeletePassenger(index)}>🗑️ Delete</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default Profile;
