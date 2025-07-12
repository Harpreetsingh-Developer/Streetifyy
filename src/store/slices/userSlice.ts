import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, Address } from '../../types';

interface UserState {
  currentUser: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  savedAddresses: Address[];
}

const initialState: UserState = {
  currentUser: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  savedAddresses: [],
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.currentUser = action.payload;
      state.isAuthenticated = !!action.payload;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    addAddress: (state, action: PayloadAction<Address>) => {
      state.savedAddresses.push(action.payload);
    },
    removeAddress: (state, action: PayloadAction<string>) => {
      state.savedAddresses = state.savedAddresses.filter(
        (address) => address.id !== action.payload
      );
    },
    updatePreferences: (state, action: PayloadAction<User['preferences']>) => {
      if (state.currentUser) {
        state.currentUser.preferences = action.payload;
      }
    },
    toggleFollowVendor: (state, action: PayloadAction<string>) => {
      if (state.currentUser) {
        const vendorId = action.payload;
        const following = state.currentUser.following;
        const index = following.indexOf(vendorId);
        
        if (index === -1) {
          following.push(vendorId);
        } else {
          following.splice(index, 1);
        }
      }
    },
    clearUser: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
      state.error = null;
      state.savedAddresses = [];
    },
  },
});

export const {
  setUser,
  setLoading,
  setError,
  addAddress,
  removeAddress,
  updatePreferences,
  toggleFollowVendor,
  clearUser,
} = userSlice.actions;

export default userSlice.reducer;