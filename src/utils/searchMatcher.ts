import { Product } from '../types';

// Stopwords to ignore if search query has multiple terms
const STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from',
  'has', 'he', 'in', 'is', 'it', 'its', 'of', 'on', 'or', 'that',
  'the', 'to', 'was', 'were', 'will', 'with', '&', 'the', 'best',
  'top', 'buy', 'online', 'store', 'shop'
]);

// Common synonyms & alias maps for cross-border global shopping
const SYNONYMS: Record<string, string[]> = {
  'usa': ['us', 'america', 'american', 'states'],
  'us': ['usa', 'america', 'american'],
  'japan': ['japanese', 'jp', 'tokyo', 'nipon', 'nippon'],
  'japanese': ['japan', 'jp'],
  'uk': ['britain', 'british', 'england', 'london', 'gb'],
  'china': ['chinese', 'cn'],
  'chinese': ['china', 'cn'],
  'hk': ['hongkong', 'hong kong'],
  'hongkong': ['hk', 'hong kong'],

  'phone': ['iphone', 'mobile', 'smartphone', 'cellular', 'cellphone'],
  'headphone': ['headphones', 'earphone', 'earphones', 'earbuds', 'airpods', 'headset', 'audio'],
  'headphones': ['headphone', 'earphone', 'earphones', 'earbuds', 'airpods', 'headset', 'audio'],
  'watch': ['watches', 'smartwatch', 'timepiece', 'chronograph'],
  'watches': ['watch', 'smartwatch', 'timepiece'],
  'toy': ['toys', 'figure', 'figures', 'statue', 'statues', 'gundam', 'anime', 'manga', 'collectibles', 'lego'],
  'toys': ['toy', 'figure', 'figures', 'statue', 'statues', 'gundam', 'anime', 'manga', 'collectibles', 'lego'],
  'figure': ['figures', 'toy', 'toys', 'statue', 'statues', 'gundam', 'anime'],
  'anime': ['manga', 'gundam', 'toy', 'toys', 'figure', 'figures', 'japan'],
  'snack': ['snacks', 'chocolate', 'chocolates', 'candy', 'matcha', 'tea', 'biscuit', 'grocery', 'food'],
  'grocery': ['groceries', 'snack', 'snacks', 'food', 'tea', 'matcha', 'coffee'],
  'skincare': ['beauty', 'cosmetics', 'serum', 'cream', 'lotion', 'face', 'makeup'],
  'beauty': ['skincare', 'cosmetics', 'makeup', 'serum', 'perfume', 'fragrance'],
  'shoe': ['shoes', 'sneaker', 'sneakers', 'footwear', 'boots'],
  'shoes': ['shoe', 'sneaker', 'sneakers', 'footwear', 'boots'],
};

function getStemVariants(token: string): string[] {
  const variants = new Set<string>([token]);

  // Strip trailing 's' or 'es'
  if (token.endsWith('s') && token.length > 3) {
    variants.add(token.slice(0, -1));
  }
  if (token.endsWith('es') && token.length > 4) {
    variants.add(token.slice(0, -2));
  }
  if (token.endsWith('ies') && token.length > 4) {
    variants.add(token.slice(0, -3) + 'y');
  }
  if (token.endsWith('ing') && token.length > 5) {
    variants.add(token.slice(0, -3));
  }

  // Check synonym map
  for (const varToken of Array.from(variants)) {
    if (SYNONYMS[varToken]) {
      SYNONYMS[varToken].forEach(syn => variants.add(syn));
    }
  }

  return Array.from(variants);
}

export function isSearchMatch(product: Product, searchQuery: string): boolean {
  if (!searchQuery || !searchQuery.trim()) return true;

  const rawTokens = searchQuery.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (rawTokens.length === 0) return true;

  // Filter stop words if multiple tokens exist
  const tokens = rawTokens.length > 1
    ? rawTokens.filter(t => !STOP_WORDS.has(t))
    : rawTokens;

  const effectiveTokens = tokens.length > 0 ? tokens : rawTokens;

  // Build searchable text corpus for the product
  const searchableCorpus = [
    product.title,
    product.brand,
    product.category,
    product.subCategory || '',
    product.description || '',
    product.origin,
    product.sku || '',
    product.storeName || '',
    product.model || '',
    ...(product.features || []),
    ...(product.highlights || []),
    ...(product.specifications || []).map(s => `${s.label} ${s.value}`)
  ].join(' ').toLowerCase();

  // Every token (or at least one of its stem/synonym variants) must match in the corpus
  return effectiveTokens.every(token => {
    const variants = getStemVariants(token);
    return variants.some(variant => searchableCorpus.includes(variant));
  });
}
