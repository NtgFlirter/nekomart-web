import { CountryStore, CurrencyCode, CurrencyConfig } from '../types';

export const COUNTRY_STORES: CountryStore[] = [
  {
    id: 'USA',
    name: 'USA Store',
    flag: '🇺🇸',
    code: 'US',
    tagline: 'Tech gadgets, premium vitamins & US fashion',
    badgeColor: 'bg-blue-600 text-white',
    bannerImage: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?w=1200&auto=format&fit=crop&q=80',
    popularCategories: ['Electronics', 'Health & Supplements', 'Beauty & Personal Care', 'Watches & Jewelry']
  },
  {
    id: 'Japan',
    name: 'Japan Store',
    flag: '🇯🇵',
    code: 'JP',
    tagline: 'J-Beauty skincare, Anime collectibles, Matcha & Gaming',
    badgeColor: 'bg-rose-600 text-white',
    bannerImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200&auto=format&fit=crop&q=80',
    popularCategories: ['Anime & Collectibles', 'Beauty & Personal Care', 'Gaming & Consoles', 'Stationery & Home']
  },
  {
    id: 'UK',
    name: 'UK Store',
    flag: '🇬🇧',
    code: 'GB',
    tagline: 'British luxury, organic cosmetics & heritage tea',
    badgeColor: 'bg-indigo-700 text-white',
    bannerImage: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200&auto=format&fit=crop&q=80',
    popularCategories: ['Fashion & Apparel', 'Luxury Watches', 'Gourmet Food', 'Home & Living']
  },
  {
    id: 'China',
    name: 'China Store',
    flag: '🇨🇳',
    code: 'CH',
    tagline: 'Direct consumer electronics, smart home tech & lifestyle gear',
    badgeColor: 'bg-red-600 text-white',
    bannerImage: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=1200&auto=format&fit=crop&q=80',
    popularCategories: ['Smart Electronics', 'Home & Living', 'Audio Gear', 'Accessories']
  },
  {
    id: 'Hong Kong',
    name: 'Hong Kong Store',
    flag: '🇭🇰',
    code: 'HK',
    tagline: 'Global electronics, drone tech & camera optics',
    badgeColor: 'bg-rose-500 text-white',
    bannerImage: 'https://images.unsplash.com/photo-1506970845246-18f21d533b20?w=1200&auto=format&fit=crop&q=80',
    popularCategories: ['Electronics', 'Photography', 'Audio Gear', 'Smart Watches']
  }
];

export const CATEGORIES = [
  {
    id: 'all',
    name: 'All Categories',
    icon: 'Grid',
    subcategories: []
  },
  {
    id: 'electronics',
    name: 'Electronics & Gadgets',
    icon: 'Laptop',
    subcategories: ['Audio & Headphones', 'Smartphones & Tablets', 'Laptops & Computers', 'Cameras & Drones', 'Wearables & Smartwatches', 'Smart Home & IoT', 'Gaming Gear']
  },
  {
    id: 'beauty',
    name: 'Beauty & Personal Care',
    icon: 'Sparkles',
    subcategories: ['Korean Skincare (K-Beauty)', 'Japanese Skincare (J-Beauty)', 'Luxury Fragrances', 'Hair Care & Styling', 'Makeup & Cosmetics', 'Anti-Aging Serums']
  },
  {
    id: 'health',
    name: 'Health & Supplements',
    icon: 'HeartPulse',
    subcategories: ['Vitamins & Minerals', 'Sports Nutrition & Protein', 'Collagen & Hair Care', 'Immunity Boosters', 'Herbal Extracts', 'Organic Superfoods']
  },
  {
    id: 'fashion',
    name: 'Fashion & Watches',
    icon: 'Watch',
    subcategories: ['Luxury Imported Watches', 'Designer Eyewear', 'Bags & Backpacks', 'Footwear & Sneakers', 'Men\'s Grooming', 'Women\'s Apparel']
  },
  {
    id: 'grocery',
    name: 'Grocery',
    icon: 'ShoppingBag',
    subcategories: ['Imported Snacks & Chocolates', 'Japanese Matcha & Teas', 'Gourmet Coffee Beans', 'Organic Spices & Sauces', 'Global Confectionery']
  },
  {
    id: 'toys',
    name: 'Toys, Anime & Games',
    icon: 'Gamepad2',
    subcategories: ['Anime Figures & Statues', 'Gundam Model Kits', 'Imported Board Games', 'Gaming Consoles & Handhelds', 'Collector Cards & Trading', 'Lego Exclusive Sets']
  },
  {
    id: 'tools',
    name: 'Tools & Automotive',
    icon: 'Wrench',
    subcategories: ['German Power Tools', 'Car Detailing & Ceramic Coat', 'Precision Toolkits', 'Diagnostic Scanners', 'Garage Equipment']
  }
];

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee', rateToInr: 1 },
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', rateToInr: 86.5 },
  JPY: { code: 'JPY', symbol: '¥', name: 'Japanese Yen', rateToInr: 0.58 },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound', rateToInr: 109.8 },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', rateToInr: 94.2 },
  AED: { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', rateToInr: 23.55 }
};

export const PROMO_BANNERS = [
  {
    id: 1,
    title: 'Direct Import from USA & Japan',
    subtitle: '100% Genuine Global Products Delivered to India with Customs Cleared',
    cta: 'Explore USA Store',
    tag: 'GLOBAL CROSS-BORDER',
    bgGradient: 'from-orange-600 via-amber-600 to-red-700',
    origin: 'USA' as const,
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 2,
    title: 'Authentic J-Beauty & Anime Haven',
    subtitle: 'Direct from Tokyo: Hada Labo, Anessa, Bandai Spirits & Studio Ghibli',
    cta: 'Shop Japan Store',
    tag: 'TOKYO DIRECT',
    bgGradient: 'from-rose-600 via-pink-600 to-purple-800',
    origin: 'Japan' as const,
    image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 3,
    title: 'US Vitamins & Wellness Essentials',
    subtitle: 'Kirkland, NOW Foods, Optimum Nutrition & Thorne with Doorstep Delivery',
    cta: 'Shop Supplements',
    tag: '100% AUTHENTIC',
    bgGradient: 'from-emerald-700 via-teal-600 to-cyan-800',
    origin: 'USA' as const,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 4,
    title: 'Smart Tech & Gadgets Direct from China',
    subtitle: 'High-performance smart electronics, audio gear & lifestyle innovations direct to India',
    cta: 'Shop China Store',
    tag: 'TECH DIRECT',
    bgGradient: 'from-red-600 via-rose-600 to-amber-700',
    origin: 'China' as const,
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&auto=format&fit=crop&q=80'
  }
];

export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi NCR', 'Chandigarh', 'Jammu & Kashmir', 'Ladakh'
];
