import { createSlice } from '@reduxjs/toolkit';

/**
 * userSlice — Redux Toolkit slice for authentication state.
 * Manages the current user object and persists login status to localStorage.
 */

// Load initial state from localStorage (if user was previously logged in)
const loadUserFromStorage = () => {
  const saved = localStorage.getItem('railmate_user');
  const loggedIn = localStorage.getItem('railmate_logged_in');
  if (saved && loggedIn === 'true') {
    return JSON.parse(saved);
  }
  return null;
};

const userSlice = createSlice({
  name: 'user',
  initialState: {
    currentUser: loadUserFromStorage(),
  },
  reducers: {
    login(state, action) {
      state.currentUser = action.payload;
      localStorage.setItem('railmate_user', JSON.stringify(action.payload));
      localStorage.setItem('railmate_logged_in', 'true');
    },
    logout(state) {
      state.currentUser = null;
      localStorage.setItem('railmate_logged_in', 'false');
    },
    updateUser(state, action) {
      state.currentUser = { ...state.currentUser, ...action.payload };
      localStorage.setItem('railmate_user', JSON.stringify(state.currentUser));
    },
  },
});

export const { login, logout, updateUser } = userSlice.actions;
export const selectUser = (state) => state.user.currentUser;
export default userSlice.reducer;
