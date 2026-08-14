import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  ShieldCheck, 
  Plane, 
  ArrowRight, 
  Tag, 
  Plus, 
  Minus,
  Sparkles,
  Zap
} from 'lucide-react';
import { CartItem, CurrencyCode } from '../types';
import { formatPrice } from '../utils/currency';
import { calculateLandingCost } from '../utils/customsCalculator';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onProceedToCheckout: () => void;
  currency: CurrencyCode;
  discountAmount: number;
  appliedCoupon: string | null;
  onApplyCoupon: (code: string) => boolean;
  onRemoveCoupon: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout,
  currency,
  discountAmount,
  appliedCoupon,
  onApplyCoupon,
  onRemoveCoupon
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);

  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  
  // Total customs & shipping calculated across items
  const totalShipping = items.reduce((acc, item) => {
    const cost = calculateLandingCost(item.product, item.selectedShipping);
    return acc + cost.internationalShipping * item.quantity;
  }, 0);

  const totalCustoms = items.reduce((acc, item) => {
    const cost = calculateLandingCost(item.product, item.selectedShipping);
    return acc + (cost.customsDuty + cost.importHandlingFee) * item.quantity;
  }, 0);

  const finalTotal = Math.max(0, subtotal + totalShipping + totalCustoms - discountAmount);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    const success = onApplyCoupon(couponCode.trim());
    if (!success) {
      setCouponError('Invalid coupon code. Try NEKO10 or WELCOME500');
    } else {
      setCouponError(null);
      setCouponCode('');
    }
  };

  const flagMap: Record<string, string> = {
    USA: '🇺🇸',
    Japan: '🇯🇵',
    UK: '🇬🇧',
    China: '🇨🇳',
    'Hong Kong': '🇭🇰'
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300 relative text-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-5 h-5 text-orange-600" />
            <h2 className="font-extrabold text-base text-slate-900">
              Your Import Cart ({items.reduce((acc, i) => acc + i.quantity, 0)})
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free express import progress banner */}
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-xs text-amber-900 flex items-center justify-between">
          <div className="flex items-center space-x-1.5 font-semibold">
            <Zap className="w-3.5 h-3.5 text-orange-600" />
            <span>Air Express & Customs Insurance Included</span>
          </div>
          <span className="text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded font-bold">
            100% Guaranteed
          </span>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length > 0 ? (
            items.map((item) => (
              <div
                key={item.product.id}
                className="bg-white rounded-xl border border-slate-200 p-3 flex gap-3 relative group shadow-2xs hover:border-orange-300 transition-colors"
              >
                <div className="w-20 h-20 bg-slate-50 rounded-lg p-1 shrink-0 flex items-center justify-center border border-slate-100 overflow-hidden">
                  <img
                    src={item.product.image}
                    alt={item.product.title}
                    className="h-full w-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold text-orange-600 uppercase flex items-center space-x-1">
                        <span>{flagMap[item.product.origin] || '🌐'}</span>
                        <span>{item.product.origin} Store</span>
                      </span>
                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="text-slate-400 hover:text-red-500 transition-colors p-1 cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <h4 className="text-xs font-bold text-slate-800 line-clamp-2 mt-0.5 leading-snug">
                      {item.product.title}
                    </h4>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100">
                    <div className="text-xs font-black text-slate-900">
                      {formatPrice(item.product.price * item.quantity, currency)}
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                        className="p-1 hover:bg-slate-200 text-slate-600 rounded-l cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-bold text-slate-800">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                        className="p-1 hover:bg-slate-200 text-slate-600 rounded-r cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 space-y-3">
              <div className="w-16 h-16 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center mx-auto text-2xl">
                🐱
              </div>
              <h3 className="font-bold text-slate-800 text-sm">Your import cart is empty</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Explore thousands of items from USA, Japan, UK and Korean stores with doorstep Indian customs clearance.
              </p>
              <button
                onClick={onClose}
                className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs px-4 py-2 rounded-lg cursor-pointer transition-colors"
              >
                Start Global Shopping
              </button>
            </div>
          )}
        </div>

        {/* Footer Summary & Checkout (if items exist) */}
        {items.length > 0 && (
          <div className="border-t border-slate-200 p-4 bg-slate-50 space-y-3">
            {/* Coupon input */}
            <div>
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg text-xs">
                  <div className="flex items-center space-x-1.5 text-emerald-800 font-bold">
                    <Tag className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Coupon "{appliedCoupon}" applied!</span>
                  </div>
                  <button
                    onClick={onRemoveCoupon}
                    className="text-red-500 font-bold hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApply} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter Coupon (e.g. NEKO10)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg uppercase placeholder:normal-case focus:outline-none focus:ring-1 focus:ring-orange-500 font-mono"
                  />
                  <button
                    type="submit"
                    className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg cursor-pointer transition-colors"
                  >
                    Apply
                  </button>
                </form>
              )}
              {couponError && <p className="text-[10px] text-red-600 mt-1">{couponError}</p>}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-1 text-xs text-slate-600 border-t border-slate-200 pt-2">
              <div className="flex justify-between">
                <span>Items Subtotal:</span>
                <span className="font-semibold text-slate-800">{formatPrice(subtotal, currency)}</span>
              </div>
              <div className="flex justify-between">
                <span>International Air Cargo:</span>
                <span className="font-semibold text-slate-800">{formatPrice(totalShipping, currency)}</span>
              </div>
              <div className="flex justify-between">
                <span>Customs Duty & IGST (Pre-cleared):</span>
                <span className="font-semibold text-emerald-700">{formatPrice(totalCustoms, currency)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Discount Applied:</span>
                  <span>-{formatPrice(discountAmount, currency)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-black text-slate-900 border-t border-slate-200 pt-1.5">
                <span>Total Landing Price:</span>
                <span className="text-orange-600 text-base">{formatPrice(finalTotal, currency)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              id="cart-proceed-checkout-btn"
              onClick={onProceedToCheckout}
              className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-black py-3 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center justify-center space-x-2 text-sm"
            >
              <span>Proceed to Global Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
