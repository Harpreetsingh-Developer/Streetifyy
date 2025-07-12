import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Vendor, MenuItem } from '../../types';

interface VendorState {
  vendors: Vendor[];
  selectedVendor: Vendor | null;
  nearbyVendors: Vendor[];
  loading: boolean;
  error: string | null;
  filters: {
    cuisine: string[];
    priceRange: [number, number];
    rating: number;
    distance: number;
    isOpen: boolean;
  };
}

const initialState: VendorState = {
  vendors: [],
  selectedVendor: null,
  nearbyVendors: [],
  loading: false,
  error: null,
  filters: {
    cuisine: [],
    priceRange: [0, 1000],
    rating: 0,
    distance: 5, // 5km radius by default
    isOpen: false,
  },
};

const vendorSlice = createSlice({
  name: 'vendor',
  initialState,
  reducers: {
    setVendors: (state, action: PayloadAction<Vendor[]>) => {
      state.vendors = action.payload;
      state.error = null;
    },
    setSelectedVendor: (state, action: PayloadAction<Vendor | null>) => {
      state.selectedVendor = action.payload;
    },
    setNearbyVendors: (state, action: PayloadAction<Vendor[]>) => {
      state.nearbyVendors = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    updateFilters: (state, action: PayloadAction<Partial<VendorState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    updateVendorMenu: (state, action: PayloadAction<{ vendorId: string; menu: MenuItem[] }>) => {
      const vendor = state.vendors.find(v => v.id === action.payload.vendorId);
      if (vendor) {
        vendor.menu = action.payload.menu;
      }
      if (state.selectedVendor?.id === action.payload.vendorId) {
        state.selectedVendor.menu = action.payload.menu;
      }
    },
    updateVendorRating: (
      state,
      action: PayloadAction<{ vendorId: string; rating: number; totalRatings: number }>
    ) => {
      const { vendorId, rating, totalRatings } = action.payload;
      const vendor = state.vendors.find(v => v.id === vendorId);
      if (vendor) {
        vendor.rating = rating;
        vendor.totalRatings = totalRatings;
      }
      if (state.selectedVendor?.id === vendorId) {
        state.selectedVendor.rating = rating;
        state.selectedVendor.totalRatings = totalRatings;
      }
    },
    toggleItemAvailability: (
      state,
      action: PayloadAction<{ vendorId: string; itemId: string; isAvailable: boolean }>
    ) => {
      const { vendorId, itemId, isAvailable } = action.payload;
      const vendor = state.vendors.find(v => v.id === vendorId);
      if (vendor) {
        const item = vendor.menu.find(i => i.id === itemId);
        if (item) {
          item.isAvailable = isAvailable;
        }
      }
      if (state.selectedVendor?.id === vendorId) {
        const item = state.selectedVendor.menu.find(i => i.id === itemId);
        if (item) {
          item.isAvailable = isAvailable;
        }
      }
    },
    clearVendors: (state) => {
      state.vendors = [];
      state.selectedVendor = null;
      state.nearbyVendors = [];
      state.error = null;
    },
  },
});

export const {
  setVendors,
  setSelectedVendor,
  setNearbyVendors,
  setLoading,
  setError,
  updateFilters,
  updateVendorMenu,
  updateVendorRating,
  toggleItemAvailability,
  clearVendors,
} = vendorSlice.actions;

export default vendorSlice.reducer;