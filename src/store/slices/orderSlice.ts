import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Order, OrderItem, OrderStatus } from '../../types';

interface OrderState {
  currentOrder: Order | null;
  orderHistory: Order[];
  cart: {
    vendorId: string | null;
    items: OrderItem[];
    totalAmount: number;
  };
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  currentOrder: null,
  orderHistory: [],
  cart: {
    vendorId: null,
    items: [],
    totalAmount: 0,
  },
  loading: false,
  error: null,
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setCurrentOrder: (state, action: PayloadAction<Order | null>) => {
      state.currentOrder = action.payload;
      state.error = null;
    },
    addToCart: (state, action: PayloadAction<{ vendorId: string; item: OrderItem }>) => {
      const { vendorId, item } = action.payload;
      
      // If cart is empty or from same vendor
      if (!state.cart.vendorId || state.cart.vendorId === vendorId) {
        state.cart.vendorId = vendorId;
        const existingItem = state.cart.items.find(i => i.menuItemId === item.menuItemId);
        
        if (existingItem) {
          existingItem.quantity += item.quantity;
        } else {
          state.cart.items.push(item);
        }
        
        state.cart.totalAmount = state.cart.items.reduce(
          (total, item) => total + (item.price * item.quantity),
          0
        );
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      const menuItemId = action.payload;
      state.cart.items = state.cart.items.filter(item => item.menuItemId !== menuItemId);
      
      if (state.cart.items.length === 0) {
        state.cart.vendorId = null;
      }
      
      state.cart.totalAmount = state.cart.items.reduce(
        (total, item) => total + (item.price * item.quantity),
        0
      );
    },
    updateItemQuantity: (
      state,
      action: PayloadAction<{ menuItemId: string; quantity: number }>
    ) => {
      const { menuItemId, quantity } = action.payload;
      const item = state.cart.items.find(i => i.menuItemId === menuItemId);
      
      if (item) {
        item.quantity = quantity;
        if (quantity === 0) {
          state.cart.items = state.cart.items.filter(i => i.menuItemId !== menuItemId);
        }
        
        state.cart.totalAmount = state.cart.items.reduce(
          (total, item) => total + (item.price * item.quantity),
          0
        );
      }
    },
    clearCart: (state) => {
      state.cart = {
        vendorId: null,
        items: [],
        totalAmount: 0,
      };
    },
    updateOrderStatus: (
      state,
      action: PayloadAction<{ orderId: string; status: OrderStatus }>
    ) => {
      const { orderId, status } = action.payload;
      if (state.currentOrder?.id === orderId) {
        state.currentOrder.status = status;
      }
      const historyOrder = state.orderHistory.find(o => o.id === orderId);
      if (historyOrder) {
        historyOrder.status = status;
      }
    },
    addToOrderHistory: (state, action: PayloadAction<Order>) => {
      state.orderHistory.unshift(action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  setCurrentOrder,
  addToCart,
  removeFromCart,
  updateItemQuantity,
  clearCart,
  updateOrderStatus,
  addToOrderHistory,
  setLoading,
  setError,
} = orderSlice.actions;

export default orderSlice.reducer;