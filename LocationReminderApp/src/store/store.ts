import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/auth.slice';
import reminderReducer from './slices/reminder.slice';
import locationReducer from './slices/location.slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    reminder: reminderReducer,
    location: locationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;