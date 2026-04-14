import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import careerReducer from './slices/careerSlice';
import chatReducer from './slices/chatSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    career: careerReducer,
    chat: chatReducer,
    ui: uiReducer,
  },
});