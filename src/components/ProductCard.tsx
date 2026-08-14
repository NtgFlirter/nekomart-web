import React from 'react';
import { Heart, Star, Zap, ShieldCheck, Plane, ShoppingCart } from 'lucide-react';
import { Product, CurrencyCode } from '../types';
import { formatPrice } from '../utils/currency';

interface ProductCardProps {
  product: Product;
  currency: CurrencyCode;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product, e: React.MouseEvent) => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, e: React.MouseEvent) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currency,
  isWishlisted,
  onToggleWishlist,
  onSelectProduct,
  onAddToCart
}) => {
  const flagMap: Record<string, string> = {
    USA: '🇺🇸',
    Japan: '🇯🇵',
    UK: '🇬🇧',
    China: '🇨🇳',
    'Hong Kong': '🇭🇰'
  };

  return (
    <div
      id={`product-card-${product.id}`}
      onClick={() => onSelectProduct(product)}
      className="bg-white rounded-xl border border-slate-200 hover:border-orange-400 hover:shadow-xl transition-all duration-200 cursor-pointer overflow-hidden flex flex-col justify-between group relative"
    >
      {/* Top Image Section */}
      <div className="relative bg-slate-50 p-4 h-52 flex items-center justify-center overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-300"
          referrerPolicy="no-referrer"
          loading="lazy"
        />

        {/* Origin Store Badge */}
        <div className="absolute top-2.5 left-2.5 bg-slate-900/85 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1 shadow-xs z-10">
          <span>{flagMap[product.origin] || '🌐'}</span>
          <span>{product.origin} Store</span>
        </div>

        {/* Wishlist Icon Button */}
        <button
          onClick={(e) => onToggleWishlist(product, e)}
          className={`absolute top-2.5 right-2.5 p-1.5 rounded-full backdrop-blur-xs transition-all z-10 cursor-pointer ${
            isWishlisted 
              ? 'bg-rose-50 text-rose-500 shadow-sm' 
              : 'bg-white/80 text-slate-400 hover:text-rose-500 hover:bg-white shadow-xs'
          }`}
          title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Discount Tag */}
        {product.discountPercent && product.discountPercent > 0 && (
          <div className="absolute bottom-2.5 left-2.5 bg-red-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded shadow-xs">
            {product.discountPercent}% OFF
          </div>
        )}

        {/* Express Air Cargo Tag */}
        {product.isExpressEligible && (
          <div className="absolute bottom-2.5 right-2.5 bg-cyan-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center space-x-0.5 shadow-xs">
            <Zap className="w-2.5 h-2.5" />
            <span>Air Express</span>
          </div>
        )}
      </div>

      {/* Body Details */}
      <div className="p-3.5 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Category */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold mb-1">
            <span className="text-orange-600 font-bold uppercase tracking-wider">{product.brand}</span>
            <span className="truncate max-w-[120px]">{product.category}</span>
          </div>

          {/* Title */}
          <h3 className="text-xs font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-orange-600 transition-colors">
            {product.title}
          </h3>

          {/* Rating */}
          <div className="flex items-center space-x-1.5 mt-2">
            <div className="flex items-center bg-amber-50 px-1.5 py-0.5 rounded text-amber-700 font-bold text-[11px]">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400 mr-0.5" />
              <span>{product.rating.toFixed(1)}</span>
            </div>
            <span className="text-[11px] text-slate-400">({product.reviewCount.toLocaleString()})</span>
          </div>

          {/* Customs info note */}
          <div className="mt-2 flex items-center space-x-1 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
            <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
            <span className="truncate">Includes Customs Clearance</span>
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
          <div>
            <div className="text-base font-black text-slate-900 leading-tight">
              {formatPrice(product.price, currency)}
            </div>
            {product.originalPrice && product.originalPrice > product.price && (
              <div className="text-[11px] text-slate-400 line-through">
                {formatPrice(product.originalPrice, currency)}
              </div>
            )}
          </div>

          <button
            id={`add-to-cart-${product.id}`}
            onClick={(e) => onAddToCart(product, e)}
            className="bg-slate-900 hover:bg-orange-600 text-white p-2 rounded-lg transition-colors cursor-pointer flex items-center space-x-1 text-xs font-bold shadow-xs hover:shadow"
            title="Add to Cart"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>

      </div>
    </div>
  );
};
