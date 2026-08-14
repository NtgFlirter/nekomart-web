import { Product, CountryOrigin } from '../types';

export interface ImportResult {
  success: boolean;
  count: number;
  products: Product[];
  categories: string[];
  brands: string[];
  errors: string[];
}

const DEFAULT_ORIGINS: CountryOrigin[] = ['USA', 'Japan', 'UK', 'China', 'Hong Kong'];

const FALLBACK_IMAGES: Record<string, string> = {
  electronics: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
  beauty: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80',
  health: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80',
  fashion: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80',
  home: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=800&auto=format&fit=crop&q=80',
  toys: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=800&auto=format&fit=crop&q=80',
  tools: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&auto=format&fit=crop&q=80',
  default: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80'
};

function normalizeOrigin(originVal: unknown): CountryOrigin {
  if (typeof originVal !== 'string') {
    return DEFAULT_ORIGINS[Math.floor(Math.random() * DEFAULT_ORIGINS.length)];
  }
  const clean = originVal.toUpperCase().trim();
  if (clean.includes('US') || clean.includes('UNITED STATES') || clean.includes('AMERICA')) return 'USA';
  if (clean.includes('JP') || clean.includes('JAPAN') || clean.includes('TOKYO')) return 'Japan';
  if (clean.includes('UK') || clean.includes('BRITAIN') || clean.includes('ENGLAND') || clean.includes('LONDON')) return 'UK';
  if (clean.includes('CH') || clean.includes('CN') || clean.includes('KR') || clean.includes('CHINA') || clean.includes('SHENZHEN') || clean.includes('KOREA')) return 'China';
  if (clean.includes('HK') || clean.includes('HONG KONG')) return 'Hong Kong';
  return 'USA';
}

function extractPrice(val: unknown): number {
  if (typeof val === 'number' && !isNaN(val) && val > 0) {
    return Math.round(val);
  }
  if (typeof val === 'string') {
    // Strip currency symbols and commas
    const num = parseFloat(val.replace(/[^0-9.]/g, ''));
    if (!isNaN(num) && num > 0) {
      return Math.round(num);
    }
  }
  return 1999;
}

export function parseProductJson(jsonData: unknown): ImportResult {
  const errors: string[] = [];
  let rawList: any[] = [];

  if (Array.isArray(jsonData)) {
    rawList = jsonData;
  } else if (typeof jsonData === 'object' && jsonData !== null) {
    // Check if it's wrapped in an object like { products: [...] } or { items: [...] } or { data: [...] }
    const obj = jsonData as Record<string, any>;
    if (Array.isArray(obj.products)) rawList = obj.products;
    else if (Array.isArray(obj.items)) rawList = obj.items;
    else if (Array.isArray(obj.data)) rawList = obj.data;
    else if (Array.isArray(obj.results)) rawList = obj.results;
    else if (Array.isArray(obj.catalog)) rawList = obj.catalog;
    else {
      // Maybe it's a map of id -> product
      rawList = Object.values(obj).filter(v => typeof v === 'object' && v !== null);
    }
  }

  if (rawList.length === 0) {
    return {
      success: false,
      count: 0,
      products: [],
      categories: [],
      brands: [],
      errors: ['No valid product items or array found in the provided JSON.']
    };
  }

  const parsedProducts: Product[] = [];
  const categorySet = new Set<string>();
  const brandSet = new Set<string>();

  rawList.forEach((item, index) => {
    try {
      if (!item || typeof item !== 'object') return;

      const title = item.title || item.name || item.product_name || item.productName || item.item_name || `Imported Product #${index + 1}`;
      const brand = item.brand || item.manufacturer || item.vendor || 'Global Brand';
      const category = item.category || item.category_name || item.department || 'Electronics & Gadgets';
      const subCategory = item.subCategory || item.subcategory || item.sub_category || undefined;

      const price = extractPrice(item.price || item.price_inr || item.cost || item.sale_price || item.amount);
      const originalPrice = item.originalPrice || item.original_price || item.mrp || (price > 0 ? Math.round(price * 1.25) : price);
      const discountPercent = originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

      const origin = normalizeOrigin(item.origin || item.country || item.country_of_origin || item.store || item.source_country);
      
      const rating = typeof item.rating === 'number' ? Math.min(5, Math.max(1, Number(item.rating.toFixed(1)))) : (4.2 + (index % 8) * 0.1);
      const reviewCount = typeof item.reviewCount === 'number' ? item.reviewCount : (typeof item.reviews_count === 'number' ? item.reviews_count : (120 + (index * 17) % 1500));

      let image = item.image || item.image_url || item.imageUrl || item.img || item.thumbnail || item.photo;
      if (!image || typeof image !== 'string' || !image.startsWith('http')) {
        const catKey = category.toLowerCase();
        if (catKey.includes('beauty') || catKey.includes('skin')) image = FALLBACK_IMAGES.beauty;
        else if (catKey.includes('health') || catKey.includes('supplement') || catKey.includes('vitamin')) image = FALLBACK_IMAGES.health;
        else if (catKey.includes('watch') || catKey.includes('fashion') || catKey.includes('apparel')) image = FALLBACK_IMAGES.fashion;
        else if (catKey.includes('toy') || catKey.includes('anime') || catKey.includes('game')) image = FALLBACK_IMAGES.toys;
        else if (catKey.includes('kitchen') || catKey.includes('home')) image = FALLBACK_IMAGES.home;
        else if (catKey.includes('tool') || catKey.includes('car') || catKey.includes('auto')) image = FALLBACK_IMAGES.tools;
        else if (catKey.includes('elect') || catKey.includes('audio') || catKey.includes('gadget')) image = FALLBACK_IMAGES.electronics;
        else image = FALLBACK_IMAGES.default;
      }

      const description = item.description || item.desc || item.about || `Direct cross-border import of ${title}. Guaranteed 100% genuine product with complete customs clearance delivered to your doorstep in India.`;
      
      const features = Array.isArray(item.features) 
        ? item.features 
        : [
            `100% Authentic ${brand} original international import`,
            `Complete Indian customs clearance and door-to-door tracking`,
            `Full voltage & international specification verified`,
            `Protected with Nekomart global transit insurance`
          ];

      const specifications = Array.isArray(item.specifications) 
        ? item.specifications 
        : [
            { label: 'Origin Store', value: `${origin} Store` },
            { label: 'Brand', value: brand },
            { label: 'Category', value: category },
            { label: 'SKU / Model', value: item.sku || `NKM-${origin.substring(0, 2).toUpperCase()}-${1000 + index}` }
          ];

      const product: Product = {
        id: item.id ? String(item.id) : `custom-prod-${index + 1}-${Date.now()}`,
        title,
        brand,
        category,
        subCategory,
        price,
        originalPrice,
        discountPercent,
        origin,
        rating,
        reviewCount,
        image,
        additionalImages: Array.isArray(item.additionalImages) ? item.additionalImages : undefined,
        description,
        features,
        specifications,
        inStock: item.inStock !== false && item.stock !== 0,
        stockCount: typeof item.stockCount === 'number' ? item.stockCount : 15,
        sku: item.sku || `NKM-${origin.substring(0, 2).toUpperCase()}-${1000 + index}`,
        weightKg: typeof item.weightKg === 'number' ? item.weightKg : (0.5 + (index % 4) * 0.4),
        shippingDaysMin: item.shippingDaysMin || 4,
        shippingDaysMax: item.shippingDaysMax || 7,
        isBestSeller: Boolean(item.isBestSeller || index % 5 === 0),
        isDealOfTheDay: Boolean(item.isDealOfTheDay || index % 7 === 0),
        isExpressEligible: Boolean(item.isExpressEligible !== false),
        customsDutyPercent: item.customsDutyPercent || (category.toLowerCase().includes('beauty') ? 12 : 18)
      };

      parsedProducts.push(product);
      categorySet.add(category);
      brandSet.add(brand);
    } catch (err: any) {
      errors.push(`Error parsing item #${index}: ${err?.message || 'Unknown error'}`);
    }
  });

  return {
    success: parsedProducts.length > 0,
    count: parsedProducts.length,
    products: parsedProducts,
    categories: Array.from(categorySet),
    brands: Array.from(brandSet),
    errors
  };
}
