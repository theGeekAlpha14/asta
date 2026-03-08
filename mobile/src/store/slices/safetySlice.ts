import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SafetyState {
  currentScore: number | null;
  isLoading: boolean;
  error: string | null;
  userLocation: {
    latitude: number;
    longitude: number;
  } | null;
}

const initialState: SafetyState = {
  currentScore: null,
  isLoading: false,
  error: null,
  userLocation: null,
};

const safetySlice = createSlice({
  name: 'safety',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setSafetyScore: (state, action: PayloadAction<number>) => {
      state.currentScore = action.payload;
      state.isLoading = false;
    },
    setUserLocation: (state, action: PayloadAction<{ latitude: number; longitude: number }>) => {
      state.userLocation = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const { setLoading, setSafetyScore, setUserLocation, setError } = safetySlice.actions;
export default safetySlice.reducer;
