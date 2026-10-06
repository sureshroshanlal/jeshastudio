export type ClothSize = '16' | '18' | '20' | '22' | '24' | '26' | '28' | '30' | '32' | '34' | '36' | '38' | '40';
export const ALL_SIZES: ClothSize[] = ['16', '18', '20', '22', '24', '26', '28', '30', '32', '34', '36', '38', '40'];

export type Gender = 'Girls' | 'Boys' | 'Unisex';

export type StyleCategory = 'Western' | 'Indian' | 'Indo-western';

export type Occasion = 'Festive' | 'Birthday' | 'Party' | 'Wedding' | 'Everyday' | 'Celebration' | 'Seasonal';

export interface SizeVariant {
  size: string; // '16', '18', '20', '22', '24', '26', '28', '30', '32', '34', '36', '38', '40'
  sku: string;
  stock: number;
  price: number;
  mrp: number;
  chestCm?: number;
  waistCm?: number;
  lengthCm?: number;
}

export interface ModelFitInfo {
  modelName: string;
  heightCm: number; // e.g. 128
  wearingSize: string; // e.g. "26"
  fitNote?: string; // e.g. " Arya has a regular build, wearing our Size 26 for a relaxed, twirl-friendly drape."
}

export interface ProductDetails {
  fabric: string; // e.g. "100% Pure Organic Cotton with Mulberry Silk Border"
  lining: string; // e.g. "100% Butter-soft mulmul cotton lining, zero itch"
  stretch: 'Non-stretch' | 'Gentle Stretch' | 'Comfort Stretch';
  softnessScore: number; // 1 to 5 (e.g., 5/5 Ultra Soft for Sensitive Skin)
  pockets: string; // e.g. "2 hidden side seam pockets"
  closure: string; // e.g. "Concealed back YKK zip with soft fabric guard"
  setIncludes: string; // e.g. "1 Kurta, 1 Dhoti Pant, 1 Pocket Square"
  careInstructions: string[];
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  gender: Gender;
  styleCategory: StyleCategory;
  occasions: Occasion[];
  price: number;
  mrp: number;
  featured: boolean;
  isNewArrival: boolean;
  isFestiveEdit: boolean;
  images: string[];
  tryOnCutout?: string;
  variants: SizeVariant[];
  modelFit: ModelFitInfo;
  details: ProductDetails;
  createdAt: string;
}

export type OrderStatus = 'Inquiry' | 'Confirmed' | 'Packed' | 'Dispatched' | 'Delivered' | 'Cancelled';
export type PaymentStatus = 'Paid' | 'Advance Paid' | 'Pending UPI' | 'Cash on Delivery';
export type PaymentMethod = 'UPI' | 'Bank Transfer' | 'Cash' | 'Card';

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  size: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface CustomerDetails {
  name: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  childHeightCm?: number;
  childChestInches?: number;
  specialNotes?: string;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. "JS-2026-104"
  source: 'WhatsApp' | 'Walk-in' | 'Phone' | 'Direct Website';
  customer: CustomerDetails;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  grandTotal: number;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  awbNumber?: string;
  courierPartner?: string;
  createdAt: string;
  updatedAt: string;
  invoiceUrl?: string;
}

export interface SizeRecommendationInput {
  childHeightCm: number;
  childChestInches?: number;
  build: 'Slim' | 'Regular' | 'Chubby/Broad';
  fitPreference: 'Snug Fit' | 'True to Size' | 'Room to Grow';
}

export interface AdminUser {
  id: string;
  email: string;
  username: string;
  name: string;
  role: 'Studio Admin' | 'Store Manager' | 'Inventory Curator';
  avatar?: string;
  lastLogin?: string;
}

