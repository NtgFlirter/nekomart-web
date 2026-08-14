import { Product, CountryOrigin, ProductSpecification } from '../types';
import rawProductSummaries from '../../assets/product_summaries.json';

// Normalize Country Store Origin from StoreCode or StoreName
export function normalizeStoreOrigin(storeCode?: string, storeName?: string): CountryOrigin {
  const code = (storeCode || '').toUpperCase().trim();
  const name = (storeName || '').toUpperCase().trim();
  
  if (code === 'US' || name.includes('UNITED STATES') || name.includes('USA') || code === 'KW' || name.includes('KUWAIT')) return 'USA';
  if (code === 'JP' || name.includes('JAPAN')) return 'Japan';
  if (code === 'UK' || code === 'GB' || code === 'EU' || code === 'EUROPE' || code === 'DE' || name.includes('UNITED KINGDOM') || name.includes('BRITAIN') || name.includes('EUROPE') || name.includes('GERMANY')) return 'UK';
  if (code === 'CH' || code === 'CN' || code === 'KR' || code === 'KOREA' || code === 'CHINA' || name.includes('CHINA') || name.includes('SHENZHEN') || name.includes('KOREA') || name.includes('SEOUL')) return 'China';
  if (code === 'HK' || name.includes('HONG KONG')) return 'Hong Kong';
  return 'USA';
}

const FLAG_BY_ORIGIN: Record<CountryOrigin, string> = {
  USA: '🇺🇸',
  Japan: '🇯🇵',
  UK: '🇬🇧',
  China: '🇨🇳',
  'Hong Kong': '🇭🇰'
};

// Transform raw summary item into a full Product object
export function transformSummaryToProduct(item: any, index: number): Product {
  const id = String(item.id ?? `prod-${index + 1}`);
  const title = item.title ? String(item.title).replace(/\\n/g, ' ').trim() : `Global Import Product #${id}`;
  const brand = item.brand || 'Global Brand';
  
  let categoryName = 'Electronics & Gadgets';
  if (item.category && typeof item.category === 'object' && item.category.name) {
    categoryName = item.category.name;
  } else if (typeof item.category === 'string') {
    categoryName = item.category;
  }

  const price = typeof item.price === 'number' && !isNaN(item.price) && item.price > 0 
    ? Math.round(item.price) 
    : 2499;
  const originalPrice = Math.round(price * 1.25);
  const discountPercent = 20;
  const origin = normalizeStoreOrigin(item.storeCode, item.storeName);
  const storeFlag = item.storeFlag || FLAG_BY_ORIGIN[origin] || '🌐';
  
  const rating = typeof item.rating === 'number' && item.rating > 0 
    ? Number(item.rating.toFixed(1)) 
    : 4.4 + ((Number(item.id) || index) % 6) * 0.1;
    
  const reviewCount = 35 + ((Number(item.id) || index) * 19) % 480;

  const image = item.thumbnail || (Array.isArray(item.images) && item.images[0]) || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80';
  const additionalImages = Array.isArray(item.images) && item.images.length > 0 ? item.images : [image];

  return {
    id,
    title,
    brand,
    category: categoryName,
    price,
    originalPrice,
    discountPercent,
    origin,
    rating: Number(rating.toFixed(1)),
    reviewCount,
    image,
    additionalImages,
    description: item.description && item.description !== 'Product Description'
      ? item.description
      : `Authentic ${brand} international product imported directly from ${item.storeName || origin}. Complete customs clearance, tracking, and doorstep delivery across India included.`,
    features: [
      `100% Authentic ${brand} original item with international verification`,
      `Complete Indian customs clearance (CBIC) and end-to-end tracked transit`,
      `Safe export packaging from ${item.storeName || origin} logistics hub`,
      `Backed by Nekomart global cross-border buyer protection`
    ],
    specifications: [
      { label: 'Brand', value: brand },
      { label: 'Origin Store', value: item.storeName ? `${item.storeName} (${storeFlag})` : `${origin} Store` },
      { label: 'Category', value: categoryName },
      { label: 'Store Code', value: item.storeCode || origin },
      { label: 'Stock Status', value: item.isInStock !== false ? 'In Stock (Direct Import Warehouse)' : 'Special Import Order' },
      { label: 'SKU / Code', value: `NKM-${item.storeCode || 'US'}-${item.id || index}` }
    ],
    inStock: item.isInStock !== false,
    stockCount: 16,
    sku: `NKM-${item.storeCode || 'US'}-${item.id || index}`,
    weightKg: 0.75,
    shippingDaysMin: 4,
    shippingDaysMax: 8,
    isBestSeller: Number(item.id) % 4 === 0,
    isDealOfTheDay: Number(item.id) % 7 === 0,
    isExpressEligible: true,
    customsDutyPercent: 18,
    storeCode: item.storeCode,
    storeName: item.storeName,
    storeFlag,
    model: item.model,
    reviews: [
      {
        id: `rev-${id}-1`,
        author: 'Rahul Verma',
        rating: 5,
        date: '2026-08-04',
        title: 'Delivered in mint condition directly from overseas!',
        comment: 'Very pleased with the import speed. Seamless customs clearance with no extra duty charges asked at delivery.',
        verifiedPurchase: true,
        location: 'Bengaluru, Karnataka'
      },
      {
        id: `rev-${id}-2`,
        author: 'Ananya Roy',
        rating: 4,
        date: '2026-07-29',
        title: 'Original and genuine product',
        comment: 'Packaging was sturdy and authentic. Tracking updates were detailed from export airport to my city.',
        verifiedPurchase: true,
        location: 'Mumbai, Maharashtra'
      }
    ]
  };
}

// Pre-transformed products catalog from product_summaries.json
export const ALL_IMPORTED_PRODUCTS: Product[] = (rawProductSummaries as any[]).map((item, idx) => 
  transformSummaryToProduct(item, idx)
);

// Dynamic Product Details Loader using Vite's glob import
const productDetailModules: Record<string, () => Promise<{ default?: any } | any>> = 
  ((import.meta as any).glob ? (import.meta as any).glob('/assets/product_details/*.json') : {});

export async function fetchFullProductDetail(productId: string | number): Promise<Partial<Product> | null> {
  const numericId = String(productId).replace(/^prod-/, '').trim();
  const filePath = `/assets/product_details/${numericId}.json`;
  
  if (productDetailModules[filePath]) {
    try {
      const module = await productDetailModules[filePath]();
      const raw = module.default || module;
      return transformRawDetail(raw);
    } catch (err) {
      console.error(`Error loading detail JSON for product #${productId}:`, err);
    }
  }
  return null;
}

function transformRawDetail(raw: any): Partial<Product> {
  const origin = normalizeStoreOrigin(raw.storeCode, raw.storeName);
  const storeFlag = raw.storeFlag || FLAG_BY_ORIGIN[origin] || '🌐';
  
  const categoryName = raw.category && typeof raw.category === 'object' && raw.category.name
    ? raw.category.name
    : (typeof raw.category === 'string' ? raw.category : undefined);

  // Specifications
  const specs: ProductSpecification[] = [];
  if (Array.isArray(raw.specifications)) {
    raw.specifications.forEach((s: any) => {
      if (s && typeof s === 'object') {
        const label = s.label || s.key || 'Specification';
        const value = s.value !== undefined ? String(s.value) : '';
        if (value) specs.push({ label, value });
      }
    });
  }

  // Format description
  let description = raw.description;
  if (!description || description === 'Product Description') {
    description = `Direct authentic international import of ${raw.title} by ${raw.brand || 'authorized manufacturer'} from ${raw.storeName || origin}. Packaged and shipped in original manufacturer boxing with complete Indian customs clearance.`;
  }

  return {
    id: String(raw.id),
    title: raw.title ? String(raw.title).replace(/\\n/g, ' ').trim() : undefined,
    brand: raw.brand,
    category: categoryName,
    price: typeof raw.price === 'number' && !isNaN(raw.price) ? Math.round(raw.price) : undefined,
    origin,
    storeCode: raw.storeCode,
    storeName: raw.storeName,
    storeFlag,
    rating: typeof raw.rating === 'number' && raw.rating > 0 ? Number(raw.rating.toFixed(1)) : undefined,
    image: Array.isArray(raw.images) && raw.images.length > 0 ? raw.images[0] : undefined,
    additionalImages: Array.isArray(raw.images) ? raw.images : undefined,
    description,
    specifications: specs.length > 0 ? specs : undefined,
    who_should_buy: Array.isArray(raw.who_should_buy) && raw.who_should_buy.length > 0 ? raw.who_should_buy : undefined,
    who_should_not_buy: Array.isArray(raw.who_should_not_buy) && raw.who_should_not_buy.length > 0 ? raw.who_should_not_buy : undefined,
    pros: Array.isArray(raw.pros) && raw.pros.length > 0 ? raw.pros : undefined,
    cons: Array.isArray(raw.cons) && raw.cons.length > 0 ? raw.cons : undefined,
    important_information: Array.isArray(raw.important_information) && raw.important_information.length > 0 ? raw.important_information : undefined,
    faqs: Array.isArray(raw.faqs) && raw.faqs.length > 0 ? raw.faqs : undefined,
    variants: raw.variants && typeof raw.variants === 'object' && Array.isArray(raw.variants.options) ? raw.variants : undefined,
    highlights: Array.isArray(raw.highlights) && raw.highlights.length > 0 ? raw.highlights : undefined,
    productUrl: raw.productUrl,
    model: raw.model,
    inStock: raw.isInStock !== false
  };
}
