import React, { useState, useEffect } from 'react';
import { Flame, Clock, Zap, ArrowRight, Star } from 'lucide-react';
import { Product, CurrencyCode } from '../types';
import { formatPrice } from '../utils/currency';

interface FlashDealsProps {
  products: Product[];
  currency: CurrencyCode;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, e: React.MouseEvent) => void;
}

export const FlashDeals: React.FC<FlashDealsProps> = ({
  products,
  currency,
  onSelectProduct,
  onAddToCart
}) => {
  const [timeLeft, setTimeLeft] = useState({ hours: 11, minutes: 42, seconds: 18 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const dealProducts = products.filter(p => p.isDealOfTheDay || (p.discountPercent && p.discountPercent > 20)).slice(0, 4);

  if (dealProducts.length === 0) return null;

  return (
    <section className="my-8 bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 rounded-2xl p-4 md:p-6 text-white shadow-xl">
      {/* Header with timer */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-9 h-9 rounded-xl bg-white text-orange-600 flex items-center justify-center font-black shadow-md">
            <Flame className="w-5 h-5 fill-orange-500" />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-black tracking-tight">
              Cross-Border Deals of the Day
            </h2>
            <p className="text-xs text-white/90">
              Limited import stocks available at special landing prices
            </p>
          </div>
        </div>

        {/* Countdown Timer */}
        <div className="flex items-center space-x-1.5 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20">
          <Clock className="w-4 h-4 text-amber-300 animate-pulse" />
          <span className="text-xs font-bold text-amber-200 uppercase tracking-wider mr-1">Ends in:</span>
          <div className="font-mono font-black text-sm space-x-1">
            <span className="bg-black/50 px-1.5 py-0.5 rounded">{String(timeLeft.hours).padStart(2, '0')}</span>:
            <span className="bg-black/50 px-1.5 py-0.5 rounded">{String(timeLeft.minutes).padStart(2, '0')}</span>:
            <span className="bg-black/50 px-1.5 py-0.5 rounded">{String(timeLeft.seconds).padStart(2, '0')}</span>
          </div>
        </div>
      </div>

      {/* Deals Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {dealProducts.map(product => (
          <div
            key={product.id}
            onClick={() => onSelectProduct(product)}
            className="bg-white rounded-xl overflow-hidden text-slate-900 shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer group flex flex-col justify-between"
          >
            <div className="relative p-3 bg-slate-50 flex items-center justify-center h-44 overflow-hidden">
              <img
                src={product.image}
                alt={product.title}
                className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
              
              {/* Discount pill */}
              {product.discountPercent && (
                <div className="absolute top-2 left-2 bg-red-600 text-white text-[11px] font-black px-2 py-0.5 rounded-md shadow-sm">
                  {product.discountPercent}% OFF
                </div>
              )}

              {/* Origin badge */}
              <div className="absolute top-2 right-2 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1">
                <span>{product.origin === 'USA' ? '🇺🇸' : product.origin === 'Japan' ? '🇯🇵' : product.origin === 'China' ? '🇨🇳' : product.origin === 'Hong Kong' ? '🇭🇰' : '🇬🇧'}</span>
                <span>{product.origin} Store</span>
              </div>
            </div>

            <div className="p-3 flex-1 flex flex-col justify-between">
              <div>
                <p className="text-[11px] font-bold text-orange-600 uppercase tracking-wider">
                  {product.brand}
                </p>
                <h3 className="text-xs font-bold text-slate-800 line-clamp-2 mt-0.5 leading-snug group-hover:text-orange-600 transition-colors">
                  {product.title}
                </h3>

                <div className="flex items-center space-x-1 mt-1.5">
                  <div className="flex items-center text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span className="text-xs font-bold ml-1 text-slate-700">{product.rating}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">({product.reviewCount})</span>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-sm font-black text-slate-900">
                    {formatPrice(product.price, currency)}
                  </div>
                  {product.originalPrice && (
                    <div className="text-[10px] text-slate-400 line-through">
                      {formatPrice(product.originalPrice, currency)}
                    </div>
                  )}
                </div>

                <button
                  onClick={(e) => onAddToCart(product, e)}
                  className="bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm hover:shadow transition-all cursor-pointer"
                >
                  Add to Cart
                </button>
              </div>

            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
