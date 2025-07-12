import { configureStore } from '@reduxjs/toolkit';
import userReducer from './user/reducer';
import vendorReducer from './slices/vendorSlice';
import orderReducer from './slices/orderSlice';
import socialReducer from './slices/socialSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    vendor: vendorReducer,
    order: orderReducer,
    social: socialReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for serialization check
        ignoredActions: ['user/setUser', 'vendor/setVendors'],
        // Ignore these field paths in state for serialization check
        ignoredPaths: ['user.currentUser', 'vendor.selectedVendor'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;