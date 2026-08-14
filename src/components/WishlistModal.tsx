import React from 'react';
import { X, Heart, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import { Product, CurrencyCode } from '../types';
import { formatPrice } from '../utils/currency';

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistProducts: Product[];
  onRemoveFromWishlist: (productId: string) => void;
  onAddToCart: (product: Product, e: React.MouseEvent) => void;
  onSelectProduct: (product: Product) => void;
  currency: CurrencyCode;
}

export const WishlistModal: React.FC<WishlistModalProps> = ({
  isOpen,
  onClose,
  wishlistProducts,
  onRemoveFromWishlist,
  onAddToCart,
  onSelectProduct,
  currency
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in">
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto relative text-slate-800 animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white z-20 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            <h2 className="text-base font-black text-slate-900">
              My Saved Global Imports ({wishlistProducts.length})
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {wishlistProducts.length > 0 ? (
            <div className="space-y-3">
              {wishlistProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="bg-white rounded-xl border border-slate-200 p-3.5 flex items-center gap-3 hover:border-orange-300 transition-colors"
                >
                  <div 
                    onClick={() => { onSelectProduct(prod); onClose(); }}
                    className="w-16 h-16 bg-slate-50 rounded-lg p-1 shrink-0 flex items-center justify-center cursor-pointer border border-slate-100"
                  >
                    <img src={prod.image} alt={prod.title} className="h-full w-full object-contain" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-1 text-[10px] font-bold text-orange-600 uppercase">
                      <span>{prod.origin} Store</span>
                      <span>•</span>
                      <span>{prod.brand}</span>
                    </div>
                    <h4 
                      onClick={() => { onSelectProduct(prod); onClose(); }}
                      className="text-xs font-bold text-slate-800 truncate cursor-pointer hover:text-orange-600"
                    >
                      {prod.title}
                    </h4>
                    <div className="text-sm font-black text-slate-900 mt-1">
                      {formatPrice(prod.price, currency)}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={(e) => onAddToCart(prod, e)}
                      className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs px-3 py-1.5 rounded-lg flex items-center space-x-1 cursor-pointer transition-colors"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Add to Cart</span>
                    </button>

                    <button
                      onClick={() => onRemoveFromWishlist(prod.id)}
                      className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-100 cursor-pointer"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 space-y-3">
              <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto text-2xl">
                ❤️
              </div>
              <h3 className="font-bold text-slate-800 text-sm">No items in your wishlist</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Click the heart icon on any international product to save it for later.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
