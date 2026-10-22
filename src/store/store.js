import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';

/**
 * Redux store — Central state container for the application.
 * Currently manages user authentication state via the userSlice.
 */
const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

export default store;
