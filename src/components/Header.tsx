import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  ShoppingCart, 
  Heart, 
  User, 
  ChevronDown, 
  Globe, 
  FileJson, 
  Truck, 
  ShieldCheck, 
  Headphones, 
  Sparkles,
  X,
  Mic,
  Camera,
  Layers
} from 'lucide-react';
import { CountryOrigin, CurrencyCode } from '../types';
import { COUNTRY_STORES, CATEGORIES, CURRENCIES } from '../data/categories';
import { formatPrice } from '../utils/currency';

interface HeaderProps {
  currentStore: CountryOrigin | 'ALL';
  onSelectStore: (store: CountryOrigin | 'ALL') => void;
  currency: CurrencyCode;
  onSelectCurrency: (currency: CurrencyCode) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  cartCount: number;
  cartSubtotal: number;
  onOpenCart: () => void;
  wishlistCount: number;
  onOpenWishlist: () => void;
  onOpenJsonImporter: () => void;
  onOpenTracking: () => void;
  onOpenCustomsInfo: () => void;
  onOpenPincodeModal: () => void;
  currentPincode: string;
  currentCity: string;
  totalProductsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentStore,
  onSelectStore,
  currency,
  onSelectCurrency,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  cartCount,
  cartSubtotal,
  onOpenCart,
  wishlistCount,
  onOpenWishlist,
  onOpenJsonImporter,
  onOpenTracking,
  onOpenCustomsInfo,
  onOpenPincodeModal,
  currentPincode,
  currentCity,
  totalProductsCount
}) => {
  const [storeDropdownOpen, setStoreDropdownOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchQuery);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange(localSearch);
  };

  const activeStoreObj = COUNTRY_STORES.find(s => s.id === currentStore);

  return (
    <header className="sticky top-0 z-40 bg-white shadow-md">
      {/* Top utility announcement & country bar */}
      <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Left: Location & Delivery notice */}
          <div className="flex items-center space-x-4">
            <button
              id="header-pincode-btn"
              onClick={onOpenPincodeModal}
              className="flex items-center space-x-1.5 text-slate-200 hover:text-amber-400 transition-colors group cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-400 group-hover:animate-bounce" />
              <span>Deliver to:</span>
              <span className="font-semibold text-white underline decoration-dotted">
                🇮🇳 India ({currentCity} - {currentPincode})
              </span>
            </button>

            <span className="hidden sm:inline text-slate-600">|</span>

            <div className="hidden md:flex items-center space-x-1.5 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% Genuine Direct Imports • Customs Handled</span>
            </div>
          </div>

          {/* Right: Quick actions, Currency, Language */}
          <div className="flex items-center space-x-3 text-xs">
            {/* Track Order */}
            <button
              id="header-track-order-btn"
              onClick={onOpenTracking}
              className="flex items-center space-x-1 hover:text-amber-400 transition-colors cursor-pointer"
            >
              <Truck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Track Order</span>
            </button>

            {/* Customs Info */}
            <button
              id="header-customs-info-btn"
              onClick={onOpenCustomsInfo}
              className="hidden lg:flex items-center space-x-1 hover:text-amber-400 transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Customs Policy</span>
            </button>

            {/* Currency Selector */}
            <div className="relative">
              <button
                id="header-currency-toggle"
                onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
                className="flex items-center space-x-1 px-1.5 py-0.5 rounded hover:bg-slate-800 text-white font-medium cursor-pointer"
              >
                <span>{CURRENCIES[currency].symbol}</span>
                <span>{currency}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {currencyDropdownOpen && (
                <div 
                  className="absolute right-0 mt-1.5 w-40 bg-white text-slate-800 rounded-md shadow-xl border border-slate-200 py-1 z-50 animate-in fade-in zoom-in-95 duration-100"
                  onMouseLeave={() => setCurrencyDropdownOpen(false)}
                >
                  <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                    Select Currency
                  </div>
                  {Object.values(CURRENCIES).map(curr => (
                    <button
                      key={curr.code}
                      onClick={() => {
                        onSelectCurrency(curr.code);
                        setCurrencyDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-amber-50 cursor-pointer ${
                        currency === curr.code ? 'font-bold text-orange-600 bg-orange-50/50' : 'text-slate-700'
                      }`}
                    >
                      <span>{curr.name}</span>
                      <span className="font-mono text-slate-500 font-bold">{curr.symbol} {curr.code}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 24/7 Help */}
            <a 
              href="#support" 
              onClick={(e) => { e.preventDefault(); onOpenCustomsInfo(); }} 
              className="hidden sm:flex items-center space-x-1 hover:text-amber-400"
            >
              <Headphones className="w-3.5 h-3.5" />
              <span>24/7 Help</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Ubuy/Nekomart Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-3 lg:gap-6">
          
          {/* Logo & Global Store Indicator */}
          <div className="flex items-center space-x-3 shrink-0">
            <button 
              id="brand-logo-btn"
              onClick={() => {
                onSelectStore('ALL');
                onSelectCategory('all');
                onSearchChange('');
                setLocalSearch('');
              }}
              className="text-left group cursor-pointer"
            >
              <div className="flex items-center space-x-1.5">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-orange-600 via-amber-500 to-orange-500 flex items-center justify-center text-white font-black text-xl shadow-md group-hover:scale-105 transition-transform">
                  🐱
                </div>
                <div>
                  <div className="flex items-baseline">
                    <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 group-hover:text-orange-600 transition-colors">
                      neko<span className="text-orange-600">mart</span>
                    </span>
                    <span className="ml-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-amber-600 bg-amber-100 px-1 py-0.2 rounded">
                      .co.in
                    </span>
                  </div>
                  <div className="text-[9px] sm:text-[10px] font-medium text-slate-500 flex items-center space-x-1">
                    <Globe className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-orange-500" />
                    <span>Global Cross-Border Hub</span>
                  </div>
                </div>
              </div>
            </button>

            {/* Country Store Switcher Pill */}
            <div className="relative hidden xl:block">
              <button
                id="country-store-switcher-pill"
                onClick={() => setStoreDropdownOpen(!storeDropdownOpen)}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-full border border-slate-300 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-800 transition-all cursor-pointer shadow-xs"
              >
                {activeStoreObj ? (
                  <>
                    <span className="text-base">{activeStoreObj.flag}</span>
                    <span>{activeStoreObj.name}</span>
                  </>
                ) : (
                  <>
                    <Globe className="w-3.5 h-3.5 text-orange-600" />
                    <span>All Country Stores</span>
                  </>
                )}
                <ChevronDown className="w-3 h-3 text-slate-500" />
              </button>

              {storeDropdownOpen && (
                <div 
                  className="absolute left-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95"
                  onMouseLeave={() => setStoreDropdownOpen(false)}
                >
                  <div className="px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Select Origin Country Store
                  </div>
                  <button
                    onClick={() => {
                      onSelectStore('ALL');
                      setStoreDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-lg text-xs font-medium cursor-pointer ${
                      currentStore === 'ALL' ? 'bg-orange-50 text-orange-600 font-bold' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Globe className="w-4 h-4 text-orange-600" />
                      <span>All Global Stores</span>
                    </div>
                    <span className="text-[10px] text-slate-400">Worldwide</span>
                  </button>

                  {COUNTRY_STORES.map(store => (
                    <button
                      key={store.id}
                      onClick={() => {
                        onSelectStore(store.id);
                        setStoreDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-lg text-xs font-medium cursor-pointer ${
                        currentStore === store.id ? 'bg-orange-50 text-orange-600 font-bold' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-base">{store.flag}</span>
                        <span>{store.name}</span>
                      </div>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                        {store.code}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Search Bar with Category Dropdown */}
          <form 
            onSubmit={handleSearchSubmit} 
            className="order-last md:order-none w-full md:w-auto md:flex-1 max-w-2xl flex items-center mt-2 md:mt-0"
          >
            <div className="relative flex w-full rounded-lg border-2 border-orange-500 shadow-sm focus-within:ring-2 focus-within:ring-orange-300">
              {/* Category selector inside search */}
              <div className="relative hidden md:block">
                <button
                  type="button"
                  id="search-category-dropdown-btn"
                  onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                  className="h-full px-3 bg-slate-100 border-r border-slate-200 text-xs font-semibold text-slate-700 flex items-center space-x-1 hover:bg-slate-200 rounded-l-md whitespace-nowrap cursor-pointer"
                >
                  <span className="max-w-[110px] truncate">
                    {selectedCategory === 'all' 
                      ? 'All Stores' 
                      : (CATEGORIES.find(c => c.id === selectedCategory)?.name || selectedCategory)}
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-500" />
                </button>

                {categoryDropdownOpen && (
                  <div 
                    className="absolute left-0 top-full mt-1 w-56 bg-white rounded-lg shadow-xl border border-slate-200 py-1 z-50 text-xs"
                    onMouseLeave={() => setCategoryDropdownOpen(false)}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        onSelectCategory('all');
                        setCategoryDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 hover:bg-amber-50 cursor-pointer ${
                        selectedCategory === 'all' ? 'font-bold text-orange-600 bg-orange-50' : 'text-slate-700'
                      }`}
                    >
                      All Categories
                    </button>
                    {CATEGORIES.filter(c => c.id !== 'all').map(cat => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          onSelectCategory(cat.id);
                          setCategoryDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 hover:bg-amber-50 cursor-pointer ${
                          selectedCategory === cat.id ? 'font-bold text-orange-600 bg-orange-50' : 'text-slate-700'
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Main Search Input */}
              <div className="relative flex-1 flex items-center">
                <input
                  id="main-search-input"
                  type="text"
                  placeholder="Search over millions of imported products from USA, Japan, UK..."
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  className="w-full pl-3 pr-8 py-2 text-sm text-slate-800 placeholder-slate-400 bg-white focus:outline-none"
                />
                {localSearch && (
                  <button
                    type="button"
                    onClick={() => {
                      setLocalSearch('');
                      onSearchChange('');
                    }}
                    className="absolute right-2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Search Action Button */}
              <button
                id="search-submit-btn"
                type="submit"
                className="bg-orange-600 hover:bg-orange-700 text-white px-5 flex items-center justify-center font-bold transition-colors cursor-pointer rounded-r-md"
              >
                <Search className="w-4 h-4" />
                <span className="hidden sm:inline ml-1.5 text-xs uppercase tracking-wide">Search</span>
              </button>
            </div>
          </form>

          {/* User Action Items: Account, Wishlist, Cart */}
          <div className="flex items-center space-x-1 sm:space-x-3 shrink-0">
            {/* Account dropdown */}
            <div className="relative hidden sm:block">
              <button
                id="header-account-btn"
                onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                className="flex items-center space-x-1.5 text-left p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 border border-slate-200">
                  <User className="w-4 h-4" />
                </div>
                <div className="text-left hidden lg:block">
                  <div className="text-[10px] text-slate-500 font-medium leading-none">Hello, Sign in</div>
                  <div className="text-xs font-bold text-slate-800 leading-tight flex items-center">
                    <span>Account</span>
                    <ChevronDown className="w-3 h-3 ml-0.5 text-slate-400" />
                  </div>
                </div>
              </button>

              {accountDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-slate-200 p-2 z-50 animate-in fade-in"
                  onMouseLeave={() => setAccountDropdownOpen(false)}
                >
                  <div className="p-3 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg mb-2">
                    <p className="text-xs font-bold text-slate-800">Welcome to Nekomart</p>
                    <p className="text-[11px] text-slate-600">Cross-Border Imports to India</p>
                  </div>
                  <div className="space-y-1 text-xs">
                    <button 
                      onClick={() => { onOpenTracking(); setAccountDropdownOpen(false); }}
                      className="w-full text-left px-3 py-2 hover:bg-slate-100 rounded-md font-medium text-slate-700 flex items-center space-x-2"
                    >
                      <Truck className="w-3.5 h-3.5 text-orange-600" />
                      <span>My Global Orders</span>
                    </button>
                    <button 
                      onClick={() => { onOpenWishlist(); setAccountDropdownOpen(false); }}
                      className="w-full text-left px-3 py-2 hover:bg-slate-100 rounded-md font-medium text-slate-700 flex items-center space-x-2"
                    >
                      <Heart className="w-3.5 h-3.5 text-rose-500" />
                      <span>Wishlist & Saved Items</span>
                    </button>
                    <button 
                      onClick={() => { onOpenCustomsInfo(); setAccountDropdownOpen(false); }}
                      className="w-full text-left px-3 py-2 hover:bg-slate-100 rounded-md font-medium text-slate-700 flex items-center space-x-2"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Customs KYC Documents</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Wishlist Button */}
            <button
              id="header-wishlist-btn"
              onClick={onOpenWishlist}
              className="relative p-2 text-slate-700 hover:text-orange-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="View Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              id="header-cart-btn"
              onClick={onOpenCart}
              className="flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-3 sm:px-4 py-2 rounded-lg font-bold shadow-md transition-all cursor-pointer group"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-slate-900 text-amber-400 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-white">
                    {cartCount}
                  </span>
                )}
              </div>
              <div className="hidden sm:block text-left text-xs">
                <div className="text-[10px] opacity-85 leading-none">Cart</div>
                <div className="font-black leading-tight">
                  {formatPrice(cartSubtotal, currency)}
                </div>
              </div>
            </button>

          </div>
        </div>
      </div>
    </header>
  );
};
