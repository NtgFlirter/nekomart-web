export type CountryOrigin = 'USA' | 'Japan' | 'UK' | 'China' | 'Hong Kong';

export interface CountryStore {
  id: CountryOrigin;
  name: string;
  flag: string;
  code: string;
  tagline: string;
  badgeColor: string;
  bannerImage: string;
  popularCategories: string[];
}

export interface ProductSpecification {
  label: string;
  value: string;
}

export interface ProductReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  location: string;
}

export interface ProductVariantItem {
  option: string;
  price?: number;
  images?: string[];
  specifications?: ProductSpecification[];
}

export interface ProductVariants {
  type: string;
  options: string[];
  selected?: string;
  items?: ProductVariantItem[];
}

export interface ProductFAQ {
  question: string;
  answer: string;
}

export interface Product {
  id: string;
  title: string;
  brand: string;
  category: string;
  subCategory?: string;
  price: number; // in INR base
  originalPrice?: number;
  discountPercent?: number;
  origin: CountryOrigin;
  rating: number;
  reviewCount: number;
  image: string;
  additionalImages?: string[];
  description: string;
  features: string[];
  specifications: ProductSpecification[];
  inStock: boolean;
  stockCount?: number;
  sku: string;
  weightKg: number;
  shippingDaysMin: number;
  shippingDaysMax: number;
  isBestSeller?: boolean;
  isDealOfTheDay?: boolean;
  isExpressEligible?: boolean;
  customsDutyPercent?: number; // default ~18-28%
  reviews?: ProductReview[];
  storeCode?: string;
  storeName?: string;
  storeFlag?: string;
  model?: string;
  highlights?: string[];
  who_should_buy?: string[];
  who_should_not_buy?: string[];
  pros?: string[];
  cons?: string[];
  important_information?: string[];
  faqs?: ProductFAQ[];
  variants?: ProductVariants;
  productUrl?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedShipping: 'standard' | 'express';
  selectedVariant?: string;
}

export interface CurrencyCodeConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  rateToInr: number;
}

export type CurrencyCode = 'INR' | 'USD' | 'JPY' | 'GBP' | 'EUR' | 'AED';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  rateToInr: number; // 1 unit of currency = X INR (or INR * (1/rate))
}

export interface FilterState {
  searchQuery: string;
  selectedOrigin: CountryOrigin | 'ALL';
  selectedCategory: string;
  selectedBrand: string;
  minPrice: number;
  maxPrice: number;
  minRating: number;
  onlyExpress: boolean;
  onlyInStock: boolean;
  onlyDeals: boolean;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  pincode: string;
  flatNumber: string;
  areaStreet: string;
  landmark?: string;
  city: string;
  state: string;
  addressType: 'home' | 'work';
}

export interface KycVerification {
  idType: 'pan' | 'aadhaar' | 'passport';
  idNumber: string;
  verified: boolean;
}

export interface Order {
  id: string;
  items: CartItem[];
  shippingAddress: ShippingAddress;
  kyc: KycVerification;
  subtotal: number;
  shippingFee: number;
  customsDuty: number;
  tax: number;
  total: number;
  currency: CurrencyCode;
  paymentMethod: 'upi' | 'card' | 'netbanking' | 'cod';
  orderDate: string;
  status: 'confirmed' | 'dispatched_overseas' | 'customs_cleared' | 'in_local_transit' | 'out_for_delivery' | 'delivered';
  trackingNumber: string;
  carrier: 'DHL Express' | 'FedEx Cross-Border' | 'Aramex Global';
  estimatedDeliveryDate: string;
}

export interface ShipmentItem {
  title: string;
  thumbnail: string;
  quantity: number;
  storeCode?: string;
  storeName?: string;
}

export interface ShipmentEvent {
  location: string;
  status: string;
  time: string;
}

export interface OrderShipment {
  shipmentId: string;
  originStore: string;
  originCode: string;
  destinationCountry: string;
  currentStatus: string;
  eta: string;
  items: ShipmentItem[];
  events: ShipmentEvent[];
}

export interface TrackOrderRecord {
  orderNumber: string;
  shipments: OrderShipment[];
}
