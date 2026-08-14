import React from 'react';
import { Home, Compass, Truck, Heart, ShoppingBag, SlidersHorizontal } from 'lucide-react';
import { CurrencyCode } from '../types';
import { formatPrice } from '../utils/currency';

interface MobileBottomNavProps {
  cartCount: number;
  cartSubtotal: number;
  wishlistCount: number;
  currency: CurrencyCode;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenTracking: () => void;
  onOpenMobileFilters: () => void;
  activeFilterCount: number;
  onScrollToTop: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  cartCount,
  cartSubtotal,
  wishlistCount,
  currency,
  onOpenCart,
  onOpenWishlist,
  onOpenTracking,
  onOpenMobileFilters,
  activeFilterCount,
  onScrollToTop
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 shadow-2xl safe-area-bottom">
      <div className="grid grid-cols-5 gap-1 items-center max-w-md mx-auto">
        
        {/* Home / Explore */}
        <button
          onClick={onScrollToTop}
          className="flex flex-col items-center justify-center py-1 text-slate-600 hover:text-orange-600 active:scale-95 transition-all cursor-pointer"
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-0.5">Explore</span>
        </button>

        {/* Filter Drawer */}
        <button
          onClick={onOpenMobileFilters}
          className="relative flex flex-col items-center justify-center py-1 text-slate-600 hover:text-orange-600 active:scale-95 transition-all cursor-pointer"
        >
          <div className="relative">
            <SlidersHorizontal className="w-5 h-5" />
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-[9px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold mt-0.5">Filter</span>
        </button>

        {/* Track Order */}
        <button
          onClick={onOpenTracking}
          className="flex flex-col items-center justify-center py-1 text-slate-600 hover:text-orange-600 active:scale-95 transition-all cursor-pointer"
        >
          <Truck className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-0.5">Track</span>
        </button>

        {/* Wishlist */}
        <button
          onClick={onOpenWishlist}
          className="relative flex flex-col items-center justify-center py-1 text-slate-600 hover:text-orange-600 active:scale-95 transition-all cursor-pointer"
        >
          <div className="relative">
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center animate-pulse">
                {wishlistCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold mt-0.5">Wishlist</span>
        </button>

        {/* Cart */}
        <button
          onClick={onOpenCart}
          className="relative flex flex-col items-center justify-center py-1 text-orange-600 active:scale-95 transition-all cursor-pointer"
        >
          <div className="relative">
            <div className="bg-orange-600 text-white p-1 rounded-full shadow-sm">
              <ShoppingBag className="w-4 h-4" />
            </div>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-slate-950 text-amber-400 text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-white">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-extrabold text-orange-600 mt-0.5">
            {cartCount > 0 ? formatPrice(cartSubtotal, currency) : 'Cart'}
          </span>
        </button>

      </div>
    </div>
  );
};
