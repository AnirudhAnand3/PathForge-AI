import { createSlice } from '@reduxjs/toolkit';

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    sessions:        [],
    activeSessionId: null,
    messages:        [],
  },
  reducers: {
    setSessions: (state, action) => { state.sessions = action.payload; },
    setActiveSession: (state, action) => {
      state.activeSessionId = action.payload.id;
      state.messages = action.payload.messages || [];
    },
    addMessage: (state, action) => { state.messages.push(action.payload); },
    updateLastMessage: (state, action) => {
      if (state.messages.length > 0) {
        state.messages[state.messages.length - 1].content = action.payload;
      }
    },
    clearMessages: (state) => { state.messages = []; state.activeSessionId = null; },
  },
});

export const { setSessions, setActiveSession, addMessage, updateLastMessage, clearMessages } = chatSlice.actions;
export default chatSlice.reducer;