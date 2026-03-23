export interface Product {
  id: string;
  title: string;
  description: string;
  image: string;
  images?: string[];
  video?: string;
  price: number; // Selling price
  comparativePrice?: number; // Original/compare price for discount calculation
  category: string[]; // Multiple categories
  stock: number;
  sku: string;
  soldCount: number;
  viewCount: number;
  trending: boolean;
  featured: boolean;
  originalUrl?: string;
  createdAt: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  productCount?: number;
  image?: string;
  createdAt?: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed';
  paymentMethod: 'cod' | 'upi' | 'razorpay';
  shippingAddress: Address;
  createdAt: number;
  meeshoOrderId?: string;
}

export interface Address {
  fullName: string;
  phone: string;
  email?: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  type: 'home' | 'work';
}

export interface UserProfile {
  uid: string;
  id?: string; // For compatibility
  email: string;
  displayName: string;
  phone?: string;
  phoneNumber?: string; // For compatibility
  role: 'admin' | 'user';
  addresses: Address[];
  createdAt: number;
  totalSpent: number;
  orderCount: number;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount: number;
  expiryDate: number;
  usageLimit: number;
  usageCount: number;
  active: boolean;
}

export interface InventoryLog {
  id: string;
  productId: string;
  change: number;
  type: 'sale' | 'restock' | 'adjustment';
  timestamp: number;
}
