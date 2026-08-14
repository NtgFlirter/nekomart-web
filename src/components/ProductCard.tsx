import React from 'react';
import { Star, Zap } from 'lucide-react';
import { Product, CurrencyCode } from '../types';
import { formatPrice } from '../utils/currency';

interface ProductCardProps {
  product: Product;
  currency: CurrencyCode;
  onSelectProduct: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currency,
  onSelectProduct
}) => {
  return (
    <div
      id={`product-card-${product.id}`}
      onClick={() => onSelectProduct(product)}
      className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden flex flex-col justify-between group relative"
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
        <div className="absolute top-2.5 left-2.5 bg-white/90 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded flex items-center space-x-1 shadow-sm border border-slate-200 z-10">
          <span>{product.origin}</span>
        </div>

        {/* Discount Tag */}
        {product.discountPercent && product.discountPercent > 0 && (
          <div className="absolute bottom-2.5 left-2.5 bg-slate-900 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">
            {product.discountPercent}% OFF
          </div>
        )}

        {/* Express Air Cargo Tag */}
        {product.isExpressEligible && (
          <div className="absolute bottom-2.5 right-2.5 bg-slate-100 text-slate-700 border border-slate-200 text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center space-x-0.5 shadow-sm">
            <Zap className="w-2.5 h-2.5" />
            <span>Express</span>
          </div>
        )}
      </div>

      {/* Body Details */}
      <div className="p-3.5 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Category */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold mb-1">
            <span className="text-slate-600 font-bold uppercase tracking-wider">{product.brand}</span>
            <span className="truncate max-w-[120px]">{product.category}</span>
          </div>

          {/* Title */}
          <h3 className="text-xs font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-slate-600 transition-colors">
            {product.title}
          </h3>

          {/* Rating */}
          <div className="flex items-center space-x-1 mt-2">
            <div className="flex items-center text-slate-700 font-bold text-[11px]">
              <Star className="w-3 h-3 fill-slate-300 text-slate-300 mr-1" />
              <span>{product.rating.toFixed(1)}</span>
            </div>
            <span className="text-[11px] text-slate-400">({product.reviewCount.toLocaleString()})</span>
          </div>
        </div>

        {/* Pricing */}
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
          <div>
            <div className="text-base font-bold text-slate-900 leading-tight">
              {formatPrice(product.price, currency)}
            </div>
            {product.originalPrice && product.originalPrice > product.price && (
              <div className="text-[11px] text-slate-400 line-through">
                {formatPrice(product.originalPrice, currency)}
              </div>
            )}
          </div>
          <div className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">
            View
          </div>
        </div>
      </div>
    </div>
  );
};