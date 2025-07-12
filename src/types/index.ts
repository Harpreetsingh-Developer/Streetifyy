// Common Types

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  profilePic?: string;
  preferences?: UserPreferences;
  addresses: Address[];
  following: string[];
  followers: string[];
}

export interface UserPreferences {
  dietaryRestrictions: string[];
  cuisinePreferences: string[];
  spiceLevelPreference?: number;
}

export interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
  address: string;
  latitude: number;
  longitude: number;
  landmark?: string;
}

export interface Vendor {
  id: string;
  name: string;
  description: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  cuisine: string[];
  rating: number;
  totalRatings: number;
  photos: string[];
  menu: MenuItem[];
  operatingHours: OperatingHours;
  isOpen: boolean;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  photo?: string;
  customizationOptions?: CustomizationOption[];
  isAvailable: boolean;
  category: string;
}

export interface CustomizationOption {
  name: string;
  options: {
    name: string;
    price: number;
  }[];
}

export interface OperatingHours {
  [key: string]: {
    open: string;
    close: string;
  };
}

export interface Order {
  id: string;
  userId: string;
  vendorId: string;
  items: OrderItem[];
  status: OrderStatus;
  totalAmount: number;
  deliveryAddress: Address;
  paymentMethod: string;
  paymentStatus: 'pending' | 'completed' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  menuItemId: string;
  quantity: number;
  customizations?: {
    [key: string]: string;
  };
  price: number;
}

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready_for_pickup'
  | 'picked_up'
  | 'delivered'
  | 'cancelled';

export interface SocialContent {
  id: string;
  creatorId: string;
  type: 'post' | 'story' | 'reel';
  media: {
    type: 'image' | 'video';
    url: string;
  }[];
  caption?: string;
  location?: {
    latitude: number;
    longitude: number;
    name: string;
  };
  tags?: string[];
  mentions?: string[];
  likes: number;
  comments: Comment[];
  createdAt: Date;
  expiresAt?: Date; // for stories
  associatedVendor?: string;
  associatedItems?: string[];
}

export interface Comment {
  id: string;
  userId: string;
  content: string;
  likes: number;
  createdAt: Date;
  replies?: Comment[];
}