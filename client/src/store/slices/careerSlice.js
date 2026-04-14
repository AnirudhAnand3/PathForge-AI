import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchCareerProfile = createAsyncThunk('career/fetchProfile', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/career/profile');
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const submitOnboarding = createAsyncThunk('career/submitOnboarding', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/career/onboarding', payload);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const selectCareer = createAsyncThunk('career/selectCareer', async (career, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/career/select-career', { career });
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

const careerSlice = createSlice({
  name: 'career',
  initialState: {
    profile:  null,
    analysis: null,
    loading:  false,
    error:    null,
  },
  reducers: {
    clearError: (state) => { state.error = null; },
    updateProgress: (state, action) => {
      if (state.profile) state.profile.overallProgress = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCareerProfile.pending,  (state) => { state.loading = true; })
      .addCase(fetchCareerProfile.fulfilled,(state, action) => { state.loading = false; state.profile = action.payload; })
      .addCase(fetchCareerProfile.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(submitOnboarding.pending,    (state) => { state.loading = true; })
      .addCase(submitOnboarding.fulfilled,  (state, action) => { state.loading = false; state.profile = action.payload.profile; state.analysis = action.payload.analysis; })
      .addCase(submitOnboarding.rejected,   (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(selectCareer.fulfilled,      (state, action) => { if (state.profile) { state.profile.selectedCareer = action.payload.career; state.profile.roadmap = action.payload.roadmap; } });
  },
});

export const { clearError, updateProgress } = careerSlice.actions;
export default careerSlice.reducer;