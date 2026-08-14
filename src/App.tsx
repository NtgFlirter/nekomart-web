import React, { useState, useEffect, useMemo } from 'react';
import { 
  Product, 
  CartItem, 
  CountryOrigin, 
  CurrencyCode, 
  FilterState, 
  Order 
} from './types';
import { INITIAL_PRODUCTS } from './data/mockProducts';
import { ALL_IMPORTED_PRODUCTS, normalizeStoreOrigin } from './data/productData';
import { Header } from './components/Header';
import { MegaNav } from './components/MegaNav';
import { HeroSlider } from './components/HeroSlider';
import { CountryStoreGrid } from './components/CountryStoreGrid';
import { FlashDeals } from './components/FlashDeals';
import { ProductFilterSidebar } from './components/ProductFilterSidebar';
import { ProductGrid } from './components/ProductGrid';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { JsonImporterModal } from './components/JsonImporterModal';
import { WishlistModal } from './components/WishlistModal';
import { PincodeModal } from './components/PincodeModal';
import { CustomsInfoModal } from './components/CustomsInfoModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Footer } from './components/Footer';
import { SmartAppBanner } from './components/SmartAppBanner';
import { Sparkles, Check, ArrowRight, ShoppingCart, ShieldCheck, SlidersHorizontal, ArrowUpDown, X, Smartphone, ExternalLink } from 'lucide-react';
import { formatPrice } from './utils/currency';

export default function App() {
  // 1. Products Catalog State (with localStorage persistence for custom JSON uploads, defaulting to imported JSON products)
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('nekomart_products_catalog_v3') || localStorage.getItem('nekomart_products_catalog');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Normalize any stale origins from previous storage versions
          return parsed.map((p: any, idx: number) => {
            let origin = p.origin;
            if (origin === 'Korea' || origin === 'KR' || origin === 'China') {
              origin = 'China';
            } else if (origin === 'Germany' || origin === 'DE') {
              origin = 'UK';
            } else if (!origin) {
              origin = normalizeStoreOrigin(p.storeCode, p.storeName);
            }
            return {
              ...p,
              origin,
              storeFlag: origin === 'China' ? '🇨🇳' : (p.storeFlag || '🌐')
            };
          });
        }
      }
    } catch (e) {
      // fallback
    }
    return ALL_IMPORTED_PRODUCTS.length > 0 ? ALL_IMPORTED_PRODUCTS : INITIAL_PRODUCTS;
  });

  // Save to localStorage when products catalog updates
  useEffect(() => {
    try {
      localStorage.setItem('nekomart_products_catalog_v3', JSON.stringify(products));
      localStorage.setItem('nekomart_products_catalog', JSON.stringify(products));
    } catch (e) {
      // quota or fallback
    }
  }, [products]);

  // 2. Location & PIN Code state
  const [currentPincode, setCurrentPincode] = useState<string>(() => {
    return localStorage.getItem('nekomart_pincode') || '110001';
  });
  const [currentCity, setCurrentCity] = useState<string>(() => {
    return localStorage.getItem('nekomart_city') || 'New Delhi';
  });

  // 3. Currency State
  const [currency, setCurrency] = useState<CurrencyCode>('INR');

  // 4. Cart State
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('nekomart_cart');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem('nekomart_cart', JSON.stringify(cartItems));
    } catch (e) {}
  }, [cartItems]);

  // 5. Wishlist State
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('nekomart_wishlist');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return ['prod-us-001', 'prod-jp-002'];
  });

  useEffect(() => {
    try {
      localStorage.setItem('nekomart_wishlist', JSON.stringify(wishlistIds));
    } catch (e) {}
  }, [wishlistIds]);

  // 6. Orders History State
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('nekomart_orders');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem('nekomart_orders', JSON.stringify(orders));
    } catch (e) {}
  }, [orders]);

  // 7. Coupons & Discounts
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState<number>(0);

  // 8. Filters State
  const [filter, setFilter] = useState<FilterState>({
    searchQuery: '',
    selectedOrigin: 'ALL',
    selectedCategory: 'all',
    selectedBrand: '',
    minPrice: 0,
    maxPrice: 100000,
    minRating: 0,
    onlyExpress: false,
    onlyInStock: true,
    onlyDeals: false,
    sortBy: 'featured'
  });

  // 9. Modals State
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isJsonImporterOpen, setIsJsonImporterOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isPincodeOpen, setIsPincodeOpen] = useState(false);
  const [isCustomsInfoOpen, setIsCustomsInfoOpen] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Active filter count for mobile badge
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filter.selectedOrigin !== 'ALL') count++;
    if (filter.selectedCategory !== 'all') count++;
    if (filter.selectedBrand) count++;
    if (filter.minPrice > 0 || filter.maxPrice < 100000) count++;
    if (filter.minRating > 0) count++;
    if (filter.onlyExpress) count++;
    if (filter.onlyDeals) count++;
    return count;
  }, [filter]);

  // Toast notification for Add-to-cart
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Deep Linking URL synchronization (Web <-> Mobile App Link Handler)
  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const productId = urlParams.get('product') || urlParams.get('prod') || urlParams.get('id');
      const storeCode = urlParams.get('store');
      const categoryParam = urlParams.get('category');
      const trackParam = urlParams.get('track') || urlParams.get('order');

      if (productId) {
        const found = products.find((p) => String(p.id) === String(productId));
        if (found) {
          setSelectedProduct(found);
        }

        // Check if on mobile device to automatically attempt opening Nekomart App via Android Intent
        const isMobile = /Android/i.test(navigator.userAgent);
        const hasTriggered = sessionStorage.getItem('nekomart_intent_triggered_' + productId);
        if (isMobile && !hasTriggered) {
          sessionStorage.setItem('nekomart_intent_triggered_' + productId, 'true');
          const appPackage = "com.aistudio.ecommerce.qxyz";
          const intentUri = `intent://product/${productId}#Intent;scheme=nekomart;package=${appPackage};S.browser_fallback_url=${encodeURIComponent(window.location.href)};end`;
          // Attempt intent trigger
          window.location.href = intentUri;
        }
      }

      if (storeCode) {
        const norm = normalizeStoreOrigin(storeCode, storeCode);
        setFilter((prev) => ({ ...prev, selectedOrigin: norm }));
      }

      if (categoryParam) {
        setFilter((prev) => ({ ...prev, selectedCategory: categoryParam }));
      }

      if (trackParam) {
        setIsTrackingOpen(true);
      }
    } catch (e) {
      console.warn('Deep link parsing error:', e);
    }
  }, [products]);

  // Sync selected product with URL parameter for easy sharing and App Deep Linking
  const handleOpenProduct = (product: Product) => {
    setSelectedProduct(product);
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('product', String(product.id));
      window.history.replaceState({}, '', url.toString());
    } catch (e) {}
  };

  const handleCloseProduct = () => {
    setSelectedProduct(null);
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete('product');
      url.searchParams.delete('prod');
      url.searchParams.delete('id');
      window.history.replaceState({}, '', url.toString());
    } catch (e) {}
  };

  // Filter & Search Engine
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // 1. Origin store filter
      if (filter.selectedOrigin !== 'ALL' && product.origin !== filter.selectedOrigin) {
        return false;
      }

      // 2. Category filter
      if (filter.selectedCategory !== 'all') {
        const catMatch = product.category.toLowerCase().includes(filter.selectedCategory.toLowerCase());
        const subMatch = product.subCategory?.toLowerCase().includes(filter.selectedCategory.toLowerCase());
        if (!catMatch && !subMatch) return false;
      }

      // 3. Search query
      if (filter.searchQuery.trim()) {
        const query = filter.searchQuery.toLowerCase();
        const titleMatch = product.title.toLowerCase().includes(query);
        const brandMatch = product.brand.toLowerCase().includes(query);
        const catMatch = product.category.toLowerCase().includes(query);
        const originMatch = product.origin.toLowerCase().includes(query);
        const skuMatch = product.sku?.toLowerCase().includes(query);
        if (!titleMatch && !brandMatch && !catMatch && !originMatch && !skuMatch) {
          return false;
        }
      }

      // 4. Brand
      if (filter.selectedBrand && product.brand !== filter.selectedBrand) {
        return false;
      }

      // 5. Price
      if (product.price > filter.maxPrice) {
        return false;
      }

      // 6. Rating
      if (filter.minRating > 0 && product.rating < filter.minRating) {
        return false;
      }

      // 7. Express eligible
      if (filter.onlyExpress && !product.isExpressEligible) {
        return false;
      }

      // 8. Deals only
      if (filter.onlyDeals && !product.isDealOfTheDay && (!product.discountPercent || product.discountPercent < 15)) {
        return false;
      }

      // 9. Stock
      if (filter.onlyInStock && !product.inStock) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (filter.sortBy === 'price-asc') return a.price - b.price;
      if (filter.sortBy === 'price-desc') return b.price - a.price;
      if (filter.sortBy === 'rating') return b.rating - a.rating;
      if (filter.sortBy === 'newest') return b.id.localeCompare(a.id);
      return 0; // featured default
    });
  }, [products, filter]);

  // Unique brands in active catalog
  const availableBrands = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.brand) set.add(p.brand);
    });
    return Array.from(set).sort();
  }, [products]);

  // Unique categories in active catalog
  const availableCategories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set).sort();
  }, [products]);

  // Cart Handlers
  const handleAddToCart = (
    product: Product,
    quantity: number = 1,
    shippingMethod: 'standard' | 'express' = 'express',
    e?: React.MouseEvent
  ) => {
    if (e) e.stopPropagation();

    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity, selectedShipping: shippingMethod }];
    });

    showToast(`Added "${product.title.slice(0, 30)}..." to your Import Cart`);
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveCartItem(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveCartItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Wishlist Handlers
  const handleToggleWishlist = (product: Product, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setWishlistIds((prev) => {
      if (prev.includes(product.id)) {
        showToast('Removed from saved wishlist');
        return prev.filter((id) => id !== product.id);
      } else {
        showToast(`Saved "${product.title.slice(0, 25)}..." to Wishlist`);
        return [...prev, product.id];
      }
    });
  };

  // Wishlist products array
  const wishlistProducts = useMemo(() => {
    return products.filter((p) => wishlistIds.includes(p.id));
  }, [products, wishlistIds]);

  // Coupon Handlers
  const handleApplyCoupon = (code: string): boolean => {
    const clean = code.toUpperCase().trim();
    if (clean === 'NEKO10' || clean === 'UBUY10') {
      const subtotal = cartItems.reduce((acc, i) => acc + i.product.price * i.quantity, 0);
      const discount = Math.round(subtotal * 0.1);
      setDiscountAmount(discount);
      setAppliedCoupon(clean);
      return true;
    } else if (clean === 'WELCOME500' || clean === 'IMPORT500') {
      setDiscountAmount(500);
      setAppliedCoupon(clean);
      return true;
    }
    return false;
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
  };

  // Buy Now Handler
  const handleBuyNow = (
    product: Product,
    quantity: number = 1,
    shippingMethod: 'standard' | 'express' = 'express'
  ) => {
    handleAddToCart(product, quantity, shippingMethod);
    setSelectedProduct(null);
    setIsCheckoutOpen(true);
  };

  // Order Placement
  const handleOrderCompleted = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setCartItems([]);
    handleRemoveCoupon();
  };

  // Custom JSON Products Importer Actions
  const handleApplyCustomJsonProducts = (newProducts: Product[], mode: 'replace' | 'append') => {
    if (mode === 'replace') {
      setProducts(newProducts);
    } else {
      setProducts((prev) => [...prev, ...newProducts]);
    }
    // Reset filters to show full new catalog
    setFilter((prev) => ({
      ...prev,
      selectedOrigin: 'ALL',
      selectedCategory: 'all',
      searchQuery: '',
      selectedBrand: ''
    }));
  };

  const handleResetToDefaultCatalog = () => {
    setProducts(INITIAL_PRODUCTS);
    localStorage.removeItem('nekomart_products_catalog');
    showToast('Reset catalog to default Nekomart authentic collection');
  };

  // Location update
  const handleSaveLocation = (pin: string, city: string) => {
    setCurrentPincode(pin);
    setCurrentCity(city);
    localStorage.setItem('nekomart_pincode', pin);
    localStorage.setItem('nekomart_city', city);
    showToast(`Updated delivery address to ${city} (${pin})`);
  };

  const cartSubtotal = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      
      {/* 0. Mobile Smart App Banner (Direct Deep Link & Intent Launcher) */}
      <SmartAppBanner 
        productId={selectedProduct?.id || (typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('product') || new URLSearchParams(window.location.search).get('id') : null)}
        storeCode={filter.selectedOrigin !== 'ALL' ? filter.selectedOrigin : null}
      />

      {/* 1. Header (Top utility + Main brand search) */}
      <Header
        currentStore={filter.selectedOrigin}
        onSelectStore={(store) => {
          setFilter((prev) => ({ ...prev, selectedOrigin: store }));
        }}
        currency={currency}
        onSelectCurrency={setCurrency}
        searchQuery={filter.searchQuery}
        onSearchChange={(q) => setFilter((prev) => ({ ...prev, searchQuery: q }))}
        selectedCategory={filter.selectedCategory}
        onSelectCategory={(cat) => setFilter((prev) => ({ ...prev, selectedCategory: cat }))}
        cartCount={cartItems.reduce((acc, i) => acc + i.quantity, 0)}
        cartSubtotal={cartSubtotal}
        onOpenCart={() => setIsCartOpen(true)}
        wishlistCount={wishlistIds.length}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenJsonImporter={() => setIsJsonImporterOpen(true)}
        onOpenTracking={() => setIsTrackingOpen(true)}
        onOpenCustomsInfo={() => setIsCustomsInfoOpen(true)}
        onOpenPincodeModal={() => setIsPincodeOpen(true)}
        currentPincode={currentPincode}
        currentCity={currentCity}
        totalProductsCount={products.length}
      />

      {/* 2. Secondary Mega Navigation Bar */}
      <MegaNav
        currentStore={filter.selectedOrigin}
        onSelectStore={(store) => {
          setFilter((prev) => ({ ...prev, selectedOrigin: store }));
        }}
        selectedCategory={filter.selectedCategory}
        onSelectCategory={(cat) => setFilter((prev) => ({ ...prev, selectedCategory: cat }))}
        onOpenDeals={() => setFilter((prev) => ({ ...prev, onlyDeals: true }))}
        onOpenExpress={() => setFilter((prev) => ({ ...prev, onlyExpress: true }))}
        onOpenJsonImporter={() => setIsJsonImporterOpen(true)}
        onOpenCustomsInfo={() => setIsCustomsInfoOpen(true)}
      />

      {/* 3. Hero Promo Banner Slider (Shown on Homepage / All Stores) */}
      {filter.searchQuery === '' && filter.selectedCategory === 'all' && (
        <HeroSlider
          onSelectStore={(store) => setFilter((prev) => ({ ...prev, selectedOrigin: store }))}
          onOpenJsonImporter={() => setIsJsonImporterOpen(true)}
        />
      )}

      {/* Main App Container */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 w-full flex-1 py-4 sm:py-6 pb-24 md:pb-8">
        
        {/* Country Stores Hub Showcase */}
        {filter.searchQuery === '' && filter.selectedCategory === 'all' && (
          <CountryStoreGrid
            selectedStore={filter.selectedOrigin}
            onSelectStore={(store) => setFilter((prev) => ({ ...prev, selectedOrigin: store }))}
          />
        )}

        {/* Flash Deals with Live Countdown (Ubuy signature section) */}
        {filter.searchQuery === '' && filter.selectedCategory === 'all' && (
          <FlashDeals
            products={products}
            currency={currency}
            onSelectProduct={setSelectedProduct}
            onAddToCart={handleAddToCart}
          />
        )}

        {/* Catalog Browser Section: Sidebar Filters + Product Grid */}
        <div className="mt-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center space-x-2">
                <span>
                  {filter.selectedOrigin === 'ALL'
                    ? 'Worldwide Global Imports Store'
                    : `${filter.selectedOrigin} Store Catalog`}
                </span>
                <span className="text-xs bg-orange-100 text-orange-800 font-bold px-2 py-0.5 rounded-full">
                  {filteredProducts.length} Items
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Authentic international products imported directly to India with all customs clearance included
              </p>
            </div>

            {/* Mobile Filter Toggle Button */}
            <div className="lg:hidden flex items-center gap-2">
              <button
                id="mobile-filter-open-btn"
                onClick={() => setIsMobileFilterOpen(true)}
                className="flex-1 sm:flex-initial bg-white border border-slate-300 hover:border-orange-500 text-slate-800 font-bold text-xs py-2 px-3.5 rounded-xl shadow-xs flex items-center justify-center space-x-2 cursor-pointer transition-all active:scale-95"
              >
                <SlidersHorizontal className="w-4 h-4 text-orange-600" />
                <span>Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="bg-orange-600 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
            {/* Desktop Sidebar Filters (1 col on desktop, hidden on mobile) */}
            <div className="hidden lg:block lg:col-span-1 sticky top-36 z-10">
              <ProductFilterSidebar
                filter={filter}
                onFilterChange={(newF) => setFilter((prev) => ({ ...prev, ...newF }))}
                onResetFilters={() =>
                  setFilter({
                    searchQuery: '',
                    selectedOrigin: 'ALL',
                    selectedCategory: 'all',
                    selectedBrand: '',
                    minPrice: 0,
                    maxPrice: 100000,
                    minRating: 0,
                    onlyExpress: false,
                    onlyInStock: true,
                    onlyDeals: false,
                    sortBy: 'featured'
                  })
                }
                availableBrands={availableBrands}
                availableCategories={availableCategories}
                totalMatching={filteredProducts.length}
                currency={currency}
              />
            </div>

            {/* Product Grid (Full width on mobile, 3 cols on desktop) */}
            <div className="lg:col-span-3">
              <ProductGrid
                products={filteredProducts}
                filter={filter}
                onFilterChange={(newF) => setFilter((prev) => ({ ...prev, ...newF }))}
                onResetFilters={() =>
                  setFilter({
                    searchQuery: '',
                    selectedOrigin: 'ALL',
                    selectedCategory: 'all',
                    selectedBrand: '',
                    minPrice: 0,
                    maxPrice: 100000,
                    minRating: 0,
                    onlyExpress: false,
                    onlyInStock: true,
                    onlyDeals: false,
                    sortBy: 'featured'
                  })
                }
                currency={currency}
                wishlistIds={wishlistIds}
                onToggleWishlist={handleToggleWishlist}
                onSelectProduct={handleOpenProduct}
                onAddToCart={handleAddToCart}
                onOpenJsonImporter={() => setIsJsonImporterOpen(true)}
              />
            </div>
          </div>
        </div>

      </main>

      {/* Mobile Slide-over Filters Drawer */}
      {isMobileFilterOpen && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex justify-end lg:hidden animate-in fade-in"
          onClick={() => setIsMobileFilterOpen(false)}
        >
          <div 
            className="bg-white w-full max-w-sm h-full overflow-y-auto p-4 shadow-2xl animate-in slide-in-from-right duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <ProductFilterSidebar
              filter={filter}
              onFilterChange={(newF) => setFilter((prev) => ({ ...prev, ...newF }))}
              onResetFilters={() =>
                setFilter({
                  searchQuery: '',
                  selectedOrigin: 'ALL',
                  selectedCategory: 'all',
                  selectedBrand: '',
                  minPrice: 0,
                  maxPrice: 100000,
                  minRating: 0,
                  onlyExpress: false,
                  onlyInStock: true,
                  onlyDeals: false,
                  sortBy: 'featured'
                })
              }
              availableBrands={availableBrands}
              availableCategories={availableCategories}
              totalMatching={filteredProducts.length}
              currency={currency}
              isMobile={true}
              onCloseMobile={() => setIsMobileFilterOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        cartCount={cartItems.reduce((acc, i) => acc + i.quantity, 0)}
        cartSubtotal={cartSubtotal}
        wishlistCount={wishlistIds.length}
        currency={currency}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenTracking={() => setIsTrackingOpen(true)}
        onOpenMobileFilters={() => setIsMobileFilterOpen(true)}
        activeFilterCount={activeFiltersCount}
        onScrollToTop={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      />

      {/* Footer */}
      <Footer
        onSelectStore={(store) => setFilter((prev) => ({ ...prev, selectedOrigin: store }))}
        onSelectCategory={(cat) => setFilter((prev) => ({ ...prev, selectedCategory: cat }))}
        onOpenCustomsInfo={() => setIsCustomsInfoOpen(true)}
        onOpenTracking={() => setIsTrackingOpen(true)}
        onOpenJsonImporter={() => setIsJsonImporterOpen(true)}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center space-x-3 border border-slate-700 animate-in slide-in-from-bottom duration-200">
          <div className="w-7 h-7 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-black">
            <Check className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold">{toastMessage}</span>
          <button
            onClick={() => setIsCartOpen(true)}
            className="bg-orange-600 hover:bg-orange-700 text-white text-[11px] font-black px-2.5 py-1 rounded-lg ml-2 cursor-pointer transition-colors"
          >
            View Cart
          </button>
        </div>
      )}

      {/* Modals & Drawers */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={handleCloseProduct}
        currency={currency}
        isWishlisted={selectedProduct ? wishlistIds.includes(selectedProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        currentPincode={currentPincode}
        currentCity={currentCity}
        onOpenPincodeModal={() => setIsPincodeOpen(true)}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        currency={currency}
        discountAmount={discountAmount}
        appliedCoupon={appliedCoupon}
        onApplyCoupon={handleApplyCoupon}
        onRemoveCoupon={handleRemoveCoupon}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        currency={currency}
        discountAmount={discountAmount}
        onOrderCompleted={handleOrderCompleted}
        initialPincode={currentPincode}
        initialCity={currentCity}
      />

      <OrderTrackingModal
        isOpen={isTrackingOpen}
        onClose={() => setIsTrackingOpen(false)}
        orders={orders}
      />

      <JsonImporterModal
        isOpen={isJsonImporterOpen}
        onClose={() => setIsJsonImporterOpen(false)}
        currentProducts={products}
        onApplyProducts={handleApplyCustomJsonProducts}
        onResetToDefault={handleResetToDefaultCatalog}
      />

      <WishlistModal
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistProducts={wishlistProducts}
        onRemoveFromWishlist={(id) => setWishlistIds((prev) => prev.filter((item) => item !== id))}
        onAddToCart={handleAddToCart}
        onSelectProduct={setSelectedProduct}
        currency={currency}
      />

      <PincodeModal
        isOpen={isPincodeOpen}
        onClose={() => setIsPincodeOpen(false)}
        currentPincode={currentPincode}
        currentCity={currentCity}
        onSaveLocation={handleSaveLocation}
      />

      <CustomsInfoModal
        isOpen={isCustomsInfoOpen}
        onClose={() => setIsCustomsInfoOpen(false)}
      />

    </div>
  );
}
