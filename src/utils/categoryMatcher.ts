export function isCategoryMatch(
  productCat?: string,
  selectedCat?: string,
  productSubCat?: string
): boolean {
  if (!selectedCat || selectedCat === 'all') return true;

  const pCat = (productCat || '').toLowerCase().trim();
  const pSub = (productSubCat || '').toLowerCase().trim();
  const sCat = selectedCat.toLowerCase().trim();

  if (!pCat && !pSub) return false;

  // Exact ID or string matches
  if (sCat === pCat || sCat === pSub) return true;

  // Direct substring matches
  if (pCat.includes(sCat) || sCat.includes(pCat) || (pSub && (pSub.includes(sCat) || sCat.includes(pSub)))) {
    return true;
  }

  // Comprehensive alias mapping
  const categoryAliases: Record<string, string[]> = {
    toys: ['toy', 'anime', 'game', 'collectibles', 'figures', 'statues', 'gundam', 'lego', 'board game', 'toys & games', 'toys, anime & games'],
    electronics: ['electronic', 'gadget', 'audio', 'phone', 'laptop', 'camera', 'drone', 'wearable', 'smart', 'gaming', 'headphone', 'tech', 'electronics & gadgets', 'smart electronics'],
    beauty: ['beauty', 'skincare', 'cosmetic', 'makeup', 'fragrance', 'hair', 'j-beauty', 'k-beauty', 'health & beauty', 'beauty & personal care'],
    health: ['health', 'supplement', 'vitamin', 'protein', 'collagen', 'immunity', 'organic', 'health & supplements', 'health & beauty'],
    fashion: ['fashion', 'watch', 'jewel', 'apparel', 'eyewear', 'bag', 'footwear', 'sneaker', 'clothing', 'fashion wear', 'fashion & watches'],
    home: ['home', 'kitchen', 'coffee', 'cookware', 'cleaner', 'purifier', 'knife', 'vacuum', 'home & kitchen', 'home & living'],
    tools: ['tool', 'auto', 'car', 'garage', 'scanner', 'automotive', 'tools & automotive'],
    grocery: ['grocery', 'food', 'snack', 'tea', 'matcha', 'gourmet']
  };

  for (const [key, aliases] of Object.entries(categoryAliases)) {
    const isSelectedInGroup = sCat === key || aliases.some(a => sCat === a || sCat.includes(a) || a.includes(sCat));
    if (isSelectedInGroup) {
      const isProductInGroup = aliases.some(a => pCat.includes(a) || pSub.includes(a));
      if (isProductInGroup) return true;
    }
  }

  return false;
}
