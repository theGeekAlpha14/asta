import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserProfile {
  name: string;
  age: string;
  dob: string;
  email: string;
  phone: string;
  password?: string;
  contacts: { name: string; phone: string }[];
}

interface AuthState {
  user: UserProfile | null;
  isGuest: boolean;
  registrationStep: number;
}

const initialState: AuthState = {
  user: {
    name: '',
    age: '',
    dob: '',
    email: '',
    phone: '',
    contacts: [],
  },
  isGuest: false,
  registrationStep: 1,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    updateProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
      state.user = { ...state.user!, ...action.payload };
    },
    setGuest: (state, action: PayloadAction<boolean>) => {
      state.isGuest = action.payload;
    },
    setRegistrationStep: (state, action: PayloadAction<number>) => {
      state.registrationStep = action.payload;
    },
    addContact: (state, action: PayloadAction<{ name: string; phone: string }>) => {
      state.user?.contacts.push(action.payload);
    },
    clearAuth: (state) => {
      state.user = initialState.user;
      state.isGuest = false;
    }
  },
});

export const { updateProfile, setGuest, setRegistrationStep, addContact, clearAuth } = authSlice.actions;
export default authSlice.reducer;
