import React, { useState, useEffect, useMemo } from 'react';
import { 
  Product, 
  CountryOrigin, 
  CurrencyCode, 
  FilterState 
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
import { JsonImporterModal } from './components/JsonImporterModal';
import { PincodeModal } from './components/PincodeModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Footer } from './components/Footer';
import { SmartAppBanner } from './components/SmartAppBanner';
import { Sparkles, Check, ArrowRight, ShoppingCart, ShieldCheck, SlidersHorizontal, ArrowUpDown, X, Smartphone, ExternalLink } from 'lucide-react';
import { formatPrice } from './utils/currency';
import { isCategoryMatch } from './utils/categoryMatcher';
import { isSearchMatch } from './utils/searchMatcher';

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
  
  
  const [isJsonImporterOpen, setIsJsonImporterOpen] = useState(false);
  
  
  const [isPincodeOpen, setIsPincodeOpen] = useState(false);
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
          const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
          const hasTriggered = sessionStorage.getItem('nekomart_intent_triggered_' + productId);
          
          if (isMobile && !hasTriggered) {
            sessionStorage.setItem('nekomart_intent_triggered_' + productId, 'true');
            // 1. Android user ko App me bhej diya
            window.location.href = `intent://product/${productId}#Intent;scheme=nekomart;end`;
             
            // 2. URL se "?product=" hata diya taaki background me React Modal open na ho!
            try {
              const url = new URL(window.location.href);
              url.searchParams.delete('product');
              url.searchParams.delete('id');
              url.searchParams.delete('prod');
              window.history.replaceState({}, '', url.toString());
            } catch (e) {}
          } else {
            // 3. Desktop users ya existing session ke liye normally Web modal open karega
            setSelectedProduct(found);
          }
        }
      }

      if (storeCode) {
        const norm = normalizeStoreOrigin(storeCode, storeCode);
        setFilter((prev) => ({ ...prev, selectedOrigin: norm }));
      }

      if (categoryParam) {
        setFilter((prev) => ({ ...prev, selectedCategory: categoryParam }));
      }
    } catch (e) {
      console.warn('Deep link parsing error:', e);
    }
  }, [products]);

  // Sync selected product with URL parameter for easy sharing and App Deep Linking
  const handleOpenProduct = (product: Product) => {
    // 1. Update URL query param
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('product', String(product.id));
      window.history.replaceState({}, '', url.toString());
    } catch (e) {}

    // 2. On Mobile Browser: Check if app is installed via smart intent/scheme probe
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (isMobile) {
      const appSchemeUrl = `nekomart://product/${product.id}`;
      const startTime = Date.now();

      // Trigger app opening
      window.location.href = appSchemeUrl;

      // Fallback timer: if user is still on the web page after 500ms (app not installed or blocked), open web modal
      setTimeout(() => {
        // If document is still visible and not sent to background, app didn't open -> open Web Modal
        if (!document.hidden && Date.now() - startTime < 1500) {
          setSelectedProduct(product);
        }
      }, 500);
    } else {
      // On desktop: open web modal immediately
      setSelectedProduct(product);
    }
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
    const hasSearchQuery = Boolean(filter.searchQuery.trim());

    // Primary Pass: strict matching with category & origin filters
    let results = products.filter((product) => {
      // 1. Origin store filter
      if (filter.selectedOrigin !== 'ALL' && product.origin !== filter.selectedOrigin) {
        return false;
      }

      // 2. Category filter
      if (filter.selectedCategory !== 'all') {
        if (!isCategoryMatch(product.category, filter.selectedCategory, product.subCategory)) {
          return false;
        }
      }

      // 3. Search query
      if (hasSearchQuery) {
        if (!isSearchMatch(product, filter.searchQuery)) {
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
    });

    // Fallback Pass: If search query is typed but returns 0 results due to a restrictive category or origin filter,
    // search across all categories and origins so the user never gets 0 results if matching items exist!
    if (results.length === 0 && hasSearchQuery) {
      results = products.filter((product) => {
        if (!isSearchMatch(product, filter.searchQuery)) {
          return false;
        }
        if (filter.selectedBrand && product.brand !== filter.selectedBrand) {
          return false;
        }
        if (product.price > filter.maxPrice) {
          return false;
        }
        if (filter.onlyInStock && !product.inStock) {
          return false;
        }
        return true;
      });
    }

    return results.sort((a, b) => {
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

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans selection:bg-orange-500 selection:text-white overflow-x-hidden">
      
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
        onOpenJsonImporter={() => setIsJsonImporterOpen(true)}
        onOpenCustomsInfo={() => {}}
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
        onOpenCustomsInfo={() => {}}
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
            onSelectProduct={handleOpenProduct}
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
                                                onSelectProduct={handleOpenProduct}
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
        onOpenMobileFilters={() => setIsMobileFilterOpen(true)}
        activeFilterCount={activeFiltersCount}
        onScrollToTop={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      />

      {/* Footer */}
      <Footer
        onSelectStore={(store) => setFilter((prev) => ({ ...prev, selectedOrigin: store }))}
        onSelectCategory={(cat) => setFilter((prev) => ({ ...prev, selectedCategory: cat }))}
        onOpenCustomsInfo={() => {}}
        onOpenJsonImporter={() => setIsJsonImporterOpen(true)}
      />

      {/* Modals & Drawers */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={handleCloseProduct}
        currency={currency}
        currentPincode={currentPincode}
        currentCity={currentCity}
        onOpenPincodeModal={() => setIsPincodeOpen(true)}
      />

      

      

      

      <JsonImporterModal
        isOpen={isJsonImporterOpen}
        onClose={() => setIsJsonImporterOpen(false)}
        currentProducts={products}
        onApplyProducts={handleApplyCustomJsonProducts}
        onResetToDefault={handleResetToDefaultCatalog}
      />

      

      <PincodeModal
        isOpen={isPincodeOpen}
        onClose={() => setIsPincodeOpen(false)}
        currentPincode={currentPincode}
        currentCity={currentCity}
        onSaveLocation={handleSaveLocation}
      />

    </div>
  );
}
