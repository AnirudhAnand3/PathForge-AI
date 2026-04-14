import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    sidebarOpen:  true,
    theme:        'dark',
    notifications: [],
    loadingStates: {},
  },
  reducers: {
    toggleSidebar: (state) => { state.sidebarOpen = !state.sidebarOpen; },
    addNotification: (state, action) => {
      state.notifications.unshift({ id: Date.now(), ...action.payload });
      if (state.notifications.length > 10) state.notifications.pop();
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    setLoading: (state, action) => {
      state.loadingStates[action.payload.key] = action.payload.value;
    },
  },
});

export const { toggleSidebar, addNotification, removeNotification, setLoading } = uiSlice.actions;
export default uiSlice.reducer;