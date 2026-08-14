import React from 'react';
import { Filter, RotateCcw, Check, Star, Zap, Flame, Globe, X } from 'lucide-react';
import { CountryOrigin, FilterState, CurrencyCode } from '../types';
import { COUNTRY_STORES, CATEGORIES } from '../data/categories';
import { formatPrice } from '../utils/currency';

interface ProductFilterSidebarProps {
  filter: FilterState;
  onFilterChange: (newFilter: Partial<FilterState>) => void;
  onResetFilters: () => void;
  availableBrands: string[];
  availableCategories?: string[];
  totalMatching: number;
  currency: CurrencyCode;
  isMobile?: boolean;
  onCloseMobile?: () => void;
}

export const ProductFilterSidebar: React.FC<ProductFilterSidebarProps> = ({
  filter,
  onFilterChange,
  onResetFilters,
  availableBrands,
  availableCategories,
  totalMatching,
  currency,
  isMobile,
  onCloseMobile
}) => {
  const displayCategories = availableCategories && availableCategories.length > 0
    ? availableCategories
    : CATEGORIES.filter(c => c.id !== 'all').map(c => c.name);
  return (
    <aside className={`bg-white rounded-xl border border-slate-200 p-4 space-y-6 shadow-xs ${isMobile ? 'border-0 shadow-none' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-orange-600" />
          <h3 className="font-extrabold text-sm text-slate-900">Filters</h3>
          <span className="text-[11px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-full font-bold">
            {totalMatching} products
          </span>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={onResetFilters}
            className="text-xs text-orange-600 hover:text-orange-700 font-bold flex items-center space-x-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
          {isMobile && onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Origin Country Stores */}
      <div>
        <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider mb-2.5 flex items-center space-x-1">
          <Globe className="w-3.5 h-3.5 text-slate-500" />
          <span>Origin Country Store</span>
        </h4>
        <div className="space-y-1">
          <button
            onClick={() => onFilterChange({ selectedOrigin: 'ALL' })}
            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between cursor-pointer ${
              filter.selectedOrigin === 'ALL'
                ? 'bg-orange-50 text-orange-600 font-bold'
                : 'hover:bg-slate-50 text-slate-700'
            }`}
          >
            <span>All Global Stores</span>
            {filter.selectedOrigin === 'ALL' && <Check className="w-3.5 h-3.5" />}
          </button>

          {COUNTRY_STORES.map((store) => (
            <button
              key={store.id}
              onClick={() => onFilterChange({ selectedOrigin: store.id })}
              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between cursor-pointer ${
                filter.selectedOrigin === store.id
                  ? 'bg-orange-50 text-orange-600 font-bold'
                  : 'hover:bg-slate-50 text-slate-700'
              }`}
            >
              <span className="flex items-center space-x-2">
                <span>{store.flag}</span>
                <span>{store.name}</span>
              </span>
              {filter.selectedOrigin === store.id && <Check className="w-3.5 h-3.5" />}
            </button>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div>
        <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider mb-2.5">
          Categories
        </h4>
        <div className="space-y-1 max-h-48 overflow-y-auto no-scrollbar">
          <button
            onClick={() => onFilterChange({ selectedCategory: 'all' })}
            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between cursor-pointer ${
              filter.selectedCategory === 'all'
                ? 'bg-orange-50 text-orange-600 font-bold'
                : 'hover:bg-slate-50 text-slate-700'
            }`}
          >
            <span>All Categories</span>
            {filter.selectedCategory === 'all' && <Check className="w-3.5 h-3.5" />}
          </button>

          {displayCategories.map((catName) => (
            <button
              key={catName}
              onClick={() => onFilterChange({ selectedCategory: filter.selectedCategory === catName ? 'all' : catName })}
              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between cursor-pointer ${
                filter.selectedCategory === catName
                  ? 'bg-orange-50 text-orange-600 font-bold'
                  : 'hover:bg-slate-50 text-slate-700'
              }`}
            >
              <span className="truncate">{catName}</span>
              {filter.selectedCategory === catName && <Check className="w-3.5 h-3.5 shrink-0" />}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Slider */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider">
            Price Range (Max)
          </h4>
          <span className="text-xs font-black text-orange-600">
            {formatPrice(filter.maxPrice, currency)}
          </span>
        </div>
        <input
          type="range"
          min={1000}
          max={100000}
          step={1000}
          value={filter.maxPrice}
          onChange={(e) => onFilterChange({ maxPrice: Number(e.target.value) })}
          className="w-full accent-orange-600 cursor-pointer"
        />
        <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
          <span>{formatPrice(1000, currency)}</span>
          <span>{formatPrice(100000, currency)}+</span>
        </div>
      </div>

      {/* Special Highlights & Shipping */}
      <div>
        <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider mb-2.5">
          Delivery & Offers
        </h4>
        <div className="space-y-2 text-xs">
          <label className="flex items-center space-x-2 text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={filter.onlyExpress}
              onChange={(e) => onFilterChange({ onlyExpress: e.target.checked })}
              className="rounded text-orange-600 focus:ring-orange-500 w-4 h-4 accent-orange-600"
            />
            <span className="flex items-center space-x-1">
              <Zap className="w-3.5 h-3.5 text-cyan-600" />
              <span>Import Express (3-5 Days)</span>
            </span>
          </label>

          <label className="flex items-center space-x-2 text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={filter.onlyDeals}
              onChange={(e) => onFilterChange({ onlyDeals: e.target.checked })}
              className="rounded text-orange-600 focus:ring-orange-500 w-4 h-4 accent-orange-600"
            />
            <span className="flex items-center space-x-1">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>Deals of the Day</span>
            </span>
          </label>
        </div>
      </div>

      {/* Top Brands */}
      {availableBrands.length > 0 && (
        <div>
          <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider mb-2.5">
            Top Brands
          </h4>
          <div className="space-y-1 max-h-40 overflow-y-auto no-scrollbar">
            <button
              onClick={() => onFilterChange({ selectedBrand: '' })}
              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between cursor-pointer ${
                !filter.selectedBrand
                  ? 'bg-orange-50 text-orange-600 font-bold'
                  : 'hover:bg-slate-50 text-slate-700'
              }`}
            >
              <span>All Brands</span>
              {!filter.selectedBrand && <Check className="w-3.5 h-3.5" />}
            </button>

            {availableBrands.slice(0, 15).map((brand) => (
              <button
                key={brand}
                onClick={() => onFilterChange({ selectedBrand: brand })}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between cursor-pointer ${
                  filter.selectedBrand === brand
                    ? 'bg-orange-50 text-orange-600 font-bold'
                    : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <span className="truncate">{brand}</span>
                {filter.selectedBrand === brand && <Check className="w-3.5 h-3.5" />}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Customer Rating */}
      <div>
        <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider mb-2.5">
          Minimum Rating
        </h4>
        <div className="space-y-1">
          {[4, 3].map((stars) => (
            <button
              key={stars}
              onClick={() => onFilterChange({ minRating: filter.minRating === stars ? 0 : stars })}
              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between cursor-pointer ${
                filter.minRating === stars
                  ? 'bg-orange-50 text-orange-600 font-bold'
                  : 'hover:bg-slate-50 text-slate-700'
              }`}
            >
              <div className="flex items-center space-x-1">
                <div className="flex text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < stars ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-slate-600">& Up</span>
              </div>
              {filter.minRating === stars && <Check className="w-3.5 h-3.5" />}
            </button>
          ))}
        </div>
      </div>

      {isMobile && onCloseMobile && (
        <div className="sticky bottom-0 pt-3 pb-1 bg-white border-t border-slate-200">
          <button
            onClick={onCloseMobile}
            className="w-full bg-orange-600 hover:bg-orange-700 active:scale-98 text-white text-xs font-bold py-3 rounded-xl shadow-lg flex items-center justify-center space-x-2 transition-all cursor-pointer"
          >
            <span>Apply Filters ({totalMatching} Products)</span>
          </button>
        </div>
      )}

    </aside>
  );
};
