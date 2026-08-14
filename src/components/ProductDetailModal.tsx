import React, { useState, useEffect } from 'react';
import { 
  X, 
  Star, 
  ShieldCheck, 
  Truck, 
  Plane, 
  MapPin, 
  Heart, 
  ShoppingCart, 
  Check, 
  Info, 
  ArrowRight,
  PackageCheck,
  RotateCcw,
  Zap,
  Globe,
  HelpCircle,
  ThumbsUp,
  ThumbsDown,
  UserCheck,
  UserX,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Smartphone
} from 'lucide-react';
import { Product, CurrencyCode, ProductVariantItem } from '../types';
import { formatPrice } from '../utils/currency';
import { calculateLandingCost, getEstimatedDeliveryDateString } from '../utils/customsCalculator';
import { fetchFullProductDetail } from '../data/productData';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  currency: CurrencyCode;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (product: Product, quantity: number, shippingMethod: 'standard' | 'express') => void;
  onBuyNow: (product: Product, quantity: number, shippingMethod: 'standard' | 'express') => void;
  currentPincode: string;
  currentCity: string;
  onOpenPincodeModal: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product: initialProduct,
  onClose,
  currency,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onBuyNow,
  currentPincode,
  currentCity,
  onOpenPincodeModal
}) => {
  if (!initialProduct) return null;

  const [detailedProduct, setDetailedProduct] = useState<Product>(initialProduct);
  const [selectedImage, setSelectedImage] = useState<string>(initialProduct.image);
  const [selectedVariantOption, setSelectedVariantOption] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('express');
  const [activeTab, setActiveTab] = useState<'details' | 'specs' | 'guide' | 'faqs' | 'customs' | 'reviews'>('details');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  useEffect(() => {
    setIsMobileDevice(/Android|iPhone|iPad|iPod/i.test(navigator.userAgent));
  }, []);

  // Fetch complete product details dynamically from assets/product_details/{id}.json
  useEffect(() => {
    let isMounted = true;
    setDetailedProduct(initialProduct);
    setSelectedImage(initialProduct.image);

    const loadExtraDetails = async () => {
      setLoadingDetail(true);
      const extra = await fetchFullProductDetail(initialProduct.id);
      if (isMounted && extra) {
        setDetailedProduct((prev) => {
          const merged: Product = {
            ...prev,
            ...extra,
            // keep existing valid fields if extra is missing
            price: extra.price ?? prev.price,
            title: extra.title ?? prev.title,
            image: extra.image ?? prev.image,
            additionalImages: extra.additionalImages && extra.additionalImages.length > 0 
              ? extra.additionalImages 
              : prev.additionalImages,
            specifications: extra.specifications && extra.specifications.length > 0
              ? extra.specifications
              : prev.specifications
          };
          return merged;
        });

        if (extra.image) {
          setSelectedImage(extra.image);
        }

        if (extra.variants && extra.variants.options && extra.variants.options.length > 0) {
          const defaultOpt = extra.variants.selected || extra.variants.options[0];
          setSelectedVariantOption(defaultOpt);
          
          // Check if variant has specific image or price
          if (extra.variants.items) {
            const matched = extra.variants.items.find((item) => item.option === defaultOpt);
            if (matched && matched.images && matched.images.length > 0) {
              setSelectedImage(matched.images[0]);
            }
          }
        }
      }
      if (isMounted) setLoadingDetail(false);
    };

    loadExtraDetails();

    return () => {
      isMounted = false;
    };
  }, [initialProduct]);

  // Compute active variant details
  const activeVariantItem: ProductVariantItem | undefined = detailedProduct.variants?.items?.find(
    (item) => item.option === selectedVariantOption
  );

  const activePrice = activeVariantItem?.price ?? detailedProduct.price;
  const activeSpecifications = activeVariantItem?.specifications && activeVariantItem.specifications.length > 0
    ? activeVariantItem.specifications
    : detailedProduct.specifications;

  const currentImages = activeVariantItem?.images && activeVariantItem.images.length > 0
    ? activeVariantItem.images
    : [detailedProduct.image, ...(detailedProduct.additionalImages || [])].filter((img, i, arr) => arr.indexOf(img) === i);

  const productForCheckout: Product = {
    ...detailedProduct,
    price: activePrice,
    specifications: activeSpecifications
  };

  const landingCost = calculateLandingCost(productForCheckout, shippingMethod);
  const deliveryEstimate = getEstimatedDeliveryDateString(
    landingCost.deliveryDaysMin,
    landingCost.deliveryDaysMax
  );

  const handleVariantSelect = (optionName: string) => {
    setSelectedVariantOption(optionName);
    if (detailedProduct.variants?.items) {
      const match = detailedProduct.variants.items.find((it) => it.option === optionName);
      if (match && match.images && match.images.length > 0) {
        setSelectedImage(match.images[0]);
      }
    }
  };

  const handleAdd = () => {
    onAddToCart(productForCheckout, quantity, shippingMethod);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2000);
  };

  const handleBuy = () => {
    onBuyNow(productForCheckout, quantity, shippingMethod);
  };

  const flagMap: Record<string, string> = {
    USA: '🇺🇸',
    Japan: '🇯🇵',
    UK: '🇬🇧',
    China: '🇨🇳',
    'Hong Kong': '🇭🇰'
  };

  const storeFlag = detailedProduct.storeFlag || flagMap[detailedProduct.origin] || '🌐';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[92vh] overflow-y-auto relative text-slate-800 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar */}
        <div className="sticky top-0 bg-white z-20 px-4 sm:px-6 py-2.5 border-b border-slate-200 flex items-center justify-between gap-2">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-500 overflow-x-auto no-scrollbar py-0.5">
            <span className="text-orange-600 font-extrabold flex items-center space-x-1.5 shrink-0">
              <span className="text-base">{storeFlag}</span>
              <span>{detailedProduct.storeName || `${detailedProduct.origin} Store`} Import</span>
            </span>
            <span>/</span>
            <span className="text-slate-700 shrink-0">{detailedProduct.category}</span>
            <span>/</span>
            <span className="text-slate-400 shrink-0">SKU: {detailedProduct.sku}</span>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            {/* Open in App Button */}
            {isMobileDevice && (
              <a
                id="modal-open-in-app-btn"
                href={`nekomart://product/${detailedProduct.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = `nekomart://product/${detailedProduct.id}`;
                  setTimeout(() => {
                    window.location.href = `intent://product/${detailedProduct.id}#Intent;scheme=nekomart;end`;
                  }, 400);
                }}
                className="bg-orange-600 hover:bg-orange-700 active:scale-95 text-white text-[11px] font-extrabold px-2.5 py-1 rounded-lg flex items-center space-x-1 shadow-xs transition-all cursor-pointer"
                title="Open directly in Nekomart Android App"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>App</span>
              </a>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer shrink-0"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Gallery (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Main high-res image */}
            <div className="relative bg-slate-50 rounded-2xl border border-slate-200 p-6 h-80 flex items-center justify-center overflow-hidden group">
              <img
                src={selectedImage || detailedProduct.image}
                alt={detailedProduct.title}
                className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />

              {/* Badges */}
              <div className="absolute top-3 left-3 bg-slate-900 text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center space-x-1.5 shadow-md">
                <span>{storeFlag}</span>
                <span>Direct Import ({detailedProduct.origin})</span>
              </div>

              {detailedProduct.discountPercent && detailedProduct.discountPercent > 0 && (
                <div className="absolute bottom-3 left-3 bg-red-600 text-white text-xs font-black px-2 py-0.5 rounded shadow-sm">
                  SAVE {detailedProduct.discountPercent}%
                </div>
              )}

              {detailedProduct.model && (
                <div className="absolute bottom-3 right-3 bg-slate-800 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                  Edition: {detailedProduct.model}
                </div>
              )}
            </div>

            {/* Thumbnails Gallery */}
            {currentImages.length > 1 && (
              <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar">
                {currentImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-16 h-16 rounded-xl border p-1 bg-white overflow-hidden shrink-0 transition-all cursor-pointer ${
                      selectedImage === img
                        ? 'border-orange-500 ring-2 ring-orange-200'
                        : 'border-slate-200 hover:border-slate-400 opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumbnail" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            )}

            {/* Highlights List if available */}
            {detailedProduct.highlights && detailedProduct.highlights.length > 0 && (
              <div className="bg-amber-50/60 rounded-xl p-3.5 border border-amber-200/70 text-xs space-y-1.5">
                <div className="font-bold text-amber-900 flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Product Highlights:</span>
                </div>
                <ul className="space-y-1 text-slate-700">
                  {detailedProduct.highlights.map((h, i) => (
                    <li key={i} className="flex items-start space-x-2 text-[11px]">
                      <Check className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Trust Assurance Grid */}
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs space-y-2 text-slate-600">
              <div className="flex items-center space-x-2 font-bold text-slate-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Nekomart 100% Genuine Import Guarantee</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Shipped directly from verified overseas distributors in {detailedProduct.origin}. Passed customs inspection and covered with all-risk transit protection.
              </p>
            </div>
          </div>

          {/* Right Column: Information, Pricing, Variants & Action (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Title & Brand */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-extrabold text-orange-600 uppercase tracking-widest">
                  {detailedProduct.brand}
                </span>
                <div className="flex items-center space-x-1 text-xs">
                  <div className="flex text-amber-400">
                    <Star className="w-4 h-4 fill-amber-400" />
                  </div>
                  <span className="font-bold text-slate-800">{detailedProduct.rating}</span>
                  <span className="text-slate-400">({detailedProduct.reviewCount} customer reviews)</span>
                </div>
              </div>

              <h1 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
                {detailedProduct.title}
              </h1>
            </div>

            {/* Interactive Variants Selector (from JSON data) */}
            {detailedProduct.variants && detailedProduct.variants.options && detailedProduct.variants.options.length > 0 && (
              <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">
                    Select {detailedProduct.variants.type || 'Option'}:
                  </span>
                  <span className="font-bold text-orange-600 text-[11px]">
                    {selectedVariantOption || detailedProduct.variants.selected}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {detailedProduct.variants.options.map((option) => {
                    const isSelected = selectedVariantOption === option || (!selectedVariantOption && detailedProduct.variants?.selected === option);
                    const matchedItem = detailedProduct.variants?.items?.find((it) => it.option === option);
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => handleVariantSelect(option)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                          isSelected
                            ? 'bg-orange-600 text-white shadow-sm ring-2 ring-orange-200'
                            : 'bg-white text-slate-700 border border-slate-300 hover:border-orange-400'
                        }`}
                      >
                        <span>{option}</span>
                        {matchedItem?.price && (
                          <span className={`text-[10px] ${isSelected ? 'text-orange-100' : 'text-slate-400'}`}>
                            ({formatPrice(matchedItem.price, currency)})
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Price Box with transparent Customs Breakdown (Ubuy Style) */}
            <div className="bg-gradient-to-br from-amber-50/70 via-orange-50/40 to-white rounded-2xl border border-orange-200 p-4 space-y-3">
              <div className="flex items-baseline space-x-3">
                <span className="text-2xl sm:text-3xl font-black text-slate-950">
                  {formatPrice(activePrice, currency)}
                </span>
                {detailedProduct.originalPrice && detailedProduct.originalPrice > activePrice && (
                  <span className="text-sm text-slate-400 line-through">
                    {formatPrice(detailedProduct.originalPrice, currency)}
                  </span>
                )}
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  All Indian Customs & Taxes Included
                </span>
              </div>

              {/* Landed Cost Breakdown Card */}
              <div className="bg-white rounded-xl border border-orange-100 p-3 text-xs space-y-1.5 shadow-xs">
                <div className="font-bold text-slate-700 flex items-center justify-between border-b border-slate-100 pb-1">
                  <span>Transparent Landing Cost to India:</span>
                  <span className="text-[11px] text-slate-400">Doorstep Delivery</span>
                </div>
                
                <div className="flex justify-between text-slate-600 text-[11px]">
                  <span>Item Base Price ({detailedProduct.origin}):</span>
                  <span className="font-semibold">{formatPrice(landingCost.basePrice, currency)}</span>
                </div>

                <div className="flex justify-between text-slate-600 text-[11px]">
                  <span className="flex items-center space-x-1">
                    <Plane className="w-3 h-3 text-sky-600" />
                    <span>Int'l Air Cargo ({landingCost.carrierName}):</span>
                  </span>
                  <span className="font-semibold">{formatPrice(landingCost.internationalShipping, currency)}</span>
                </div>

                <div className="flex justify-between text-slate-600 text-[11px]">
                  <span className="flex items-center space-x-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>Indian Customs Duty & Handling:</span>
                  </span>
                  <span className="font-semibold text-emerald-700">{formatPrice(landingCost.customsDuty + landingCost.importHandlingFee, currency)}</span>
                </div>

                <div className="flex justify-between font-black text-xs text-slate-900 border-t border-slate-100 pt-1">
                  <span>Total Calculated Landing Cost:</span>
                  <span className="text-orange-600 text-sm">{formatPrice(landingCost.totalLandedCost, currency)}</span>
                </div>
              </div>
            </div>

            {/* Delivery Estimation & Pincode Checker */}
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-800">
                    Deliver to {currentCity} ({currentPincode})
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Estimated Delivery: <span className="font-bold text-slate-800">{deliveryEstimate}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={onOpenPincodeModal}
                className="text-xs font-bold text-orange-600 hover:text-orange-700 underline cursor-pointer"
              >
                Change PIN
              </button>
            </div>

            {/* Shipping Speed Selector */}
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                Choose Air Cargo Speed:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setShippingMethod('express')}
                  className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                    shippingMethod === 'express'
                      ? 'border-orange-500 bg-orange-50/50 ring-2 ring-orange-200'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold text-slate-900">
                    <span className="flex items-center space-x-1">
                      <Zap className="w-3.5 h-3.5 text-cyan-600" />
                      <span>DHL / FedEx Express</span>
                    </span>
                    <span className="text-orange-600">3-6 Days</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Priority customs queue</div>
                </button>

                <button
                  type="button"
                  onClick={() => setShippingMethod('standard')}
                  className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                    shippingMethod === 'standard'
                      ? 'border-orange-500 bg-orange-50/50 ring-2 ring-orange-200'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold text-slate-900">
                    <span>Standard Air Cargo</span>
                    <span className="text-slate-600">7-10 Days</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Aramex global transit</div>
                </button>
              </div>
            </div>

            {/* Quantity & Action Buttons */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center space-x-3">
                {/* Quantity */}
                <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-10 text-center text-xs font-black text-slate-800">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                  >
                    +
                  </button>
                </div>

                {/* Wishlist Button */}
                <button
                  onClick={() => onToggleWishlist(detailedProduct)}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center space-x-1.5 text-xs font-bold ${
                    isWishlisted
                      ? 'border-rose-300 bg-rose-50 text-rose-600'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-600' : ''}`} />
                  <span>{isWishlisted ? 'Wishlisted' : 'Save'}</span>
                </button>

                {detailedProduct.productUrl && (
                  <a
                    href={detailedProduct.productUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-orange-600 hover:bg-slate-50 text-xs font-bold flex items-center space-x-1 transition-colors"
                    title="View Original Store Listing"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Store Source</span>
                  </a>
                )}
              </div>

              {/* Main Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  id="modal-add-to-cart-btn"
                  onClick={handleAdd}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-black py-3 px-4 rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-2 shadow-md hover:shadow-lg text-sm"
                >
                  {addedSuccess ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Added to Cart!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4 text-amber-400" />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>

                <button
                  id="modal-buy-now-btn"
                  onClick={handleBuy}
                  className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-black py-3 px-4 rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-2 shadow-md hover:shadow-lg text-sm"
                >
                  <Zap className="w-4 h-4" />
                  <span>Buy Now (Import Direct)</span>
                </button>
              </div>

              {/* Mobile Quick App Launch Link */}
              {isMobileDevice && (
                <div className="pt-1">
                  <a
                    id="modal-open-app-direct-link"
                    href={`nekomart://product/${detailedProduct.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      window.location.href = `nekomart://product/${detailedProduct.id}`;
                      setTimeout(() => {
                        window.location.href = `intent://product/${detailedProduct.id}#Intent;scheme=nekomart;end`;
                      }, 400);
                    }}
                    className="w-full bg-slate-900/5 hover:bg-slate-900/10 border border-slate-300 text-slate-800 font-bold py-2 px-3 rounded-xl flex items-center justify-center space-x-2 text-xs transition-colors cursor-pointer"
                  >
                    <Smartphone className="w-4 h-4 text-orange-600" />
                    <span>Open & Checkout in Nekomart Mobile App</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Bottom Section: Tabs (About, Specs, Buying Guide, FAQs, Customs, Reviews) */}
        <div className="p-4 sm:p-6 border-t border-slate-200 bg-slate-50/50">
          <div className="flex border-b border-slate-200 space-x-4 mb-4 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('details')}
              className={`pb-2 text-xs font-black uppercase tracking-wider cursor-pointer whitespace-nowrap transition-all ${
                activeTab === 'details'
                  ? 'text-orange-600 border-b-2 border-orange-600'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Description & Features
            </button>

            <button
              onClick={() => setActiveTab('specs')}
              className={`pb-2 text-xs font-black uppercase tracking-wider cursor-pointer whitespace-nowrap transition-all ${
                activeTab === 'specs'
                  ? 'text-orange-600 border-b-2 border-orange-600'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Specifications ({activeSpecifications.length})
            </button>

            {(detailedProduct.who_should_buy || detailedProduct.pros) && (
              <button
                onClick={() => setActiveTab('guide')}
                className={`pb-2 text-xs font-black uppercase tracking-wider cursor-pointer whitespace-nowrap transition-all ${
                  activeTab === 'guide'
                    ? 'text-orange-600 border-b-2 border-orange-600'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Buyer Guide & Pros/Cons
              </button>
            )}

            {detailedProduct.faqs && detailedProduct.faqs.length > 0 && (
              <button
                onClick={() => setActiveTab('faqs')}
                className={`pb-2 text-xs font-black uppercase tracking-wider cursor-pointer whitespace-nowrap transition-all ${
                  activeTab === 'faqs'
                    ? 'text-orange-600 border-b-2 border-orange-600'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Product FAQs ({detailedProduct.faqs.length})
              </button>
            )}

            <button
              onClick={() => setActiveTab('customs')}
              className={`pb-2 text-xs font-black uppercase tracking-wider cursor-pointer whitespace-nowrap transition-all ${
                activeTab === 'customs'
                  ? 'text-orange-600 border-b-2 border-orange-600'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Customs & Import Info
            </button>

            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-2 text-xs font-black uppercase tracking-wider cursor-pointer whitespace-nowrap transition-all ${
                activeTab === 'reviews'
                  ? 'text-orange-600 border-b-2 border-orange-600'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Customer Reviews ({detailedProduct.reviews?.length || 2})
            </button>
          </div>

          {/* Tab Content Panels */}
          <div className="text-xs text-slate-700 leading-relaxed">
            
            {/* 1. Description & Features Tab */}
            {activeTab === 'details' && (
              <div className="space-y-4">
                <p className="text-slate-800 leading-relaxed">{detailedProduct.description}</p>
                
                {detailedProduct.important_information && detailedProduct.important_information.length > 0 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 space-y-1 text-amber-900">
                    <div className="font-bold flex items-center space-x-1.5">
                      <Info className="w-4 h-4 text-amber-600" />
                      <span>Important Information:</span>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-[11px] text-amber-800">
                      {detailedProduct.important_information.map((info, idx) => (
                        <li key={idx}>{info}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <h4 className="font-bold text-slate-900 mb-2">Key Features:</h4>
                  <ul className="space-y-1.5">
                    {detailedProduct.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* 2. Specifications Tab */}
            {activeTab === 'specs' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {activeSpecifications.map((spec, idx) => (
                  <div key={idx} className="flex justify-between p-2.5 bg-white rounded-lg border border-slate-200">
                    <span className="font-semibold text-slate-500">{spec.label}</span>
                    <span className="font-bold text-slate-800 text-right ml-2">{spec.value}</span>
                  </div>
                ))}
              </div>
            )}

            {/* 3. Buyer Guide & Pros/Cons Tab (from JSON) */}
            {activeTab === 'guide' && (
              <div className="space-y-4">
                {/* Who Should Buy vs Who Should Not Buy */}
                {(detailedProduct.who_should_buy || detailedProduct.who_should_not_buy) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {detailedProduct.who_should_buy && (
                      <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3.5 space-y-2">
                        <div className="font-bold text-emerald-900 flex items-center space-x-1.5">
                          <UserCheck className="w-4 h-4 text-emerald-700" />
                          <span>Who Should Buy:</span>
                        </div>
                        <ul className="space-y-1 text-[11px] text-emerald-950">
                          {detailedProduct.who_should_buy.map((item, i) => (
                            <li key={i} className="flex items-start space-x-1.5">
                              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {detailedProduct.who_should_not_buy && (
                      <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-3.5 space-y-2">
                        <div className="font-bold text-rose-900 flex items-center space-x-1.5">
                          <UserX className="w-4 h-4 text-rose-700" />
                          <span>Who Should Not Buy:</span>
                        </div>
                        <ul className="space-y-1 text-[11px] text-rose-950">
                          {detailedProduct.who_should_not_buy.map((item, i) => (
                            <li key={i} className="flex items-start space-x-1.5">
                              <X className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Pros & Cons */}
                {(detailedProduct.pros || detailedProduct.cons) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {detailedProduct.pros && (
                      <div className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-2">
                        <div className="font-bold text-slate-900 flex items-center space-x-1.5">
                          <ThumbsUp className="w-4 h-4 text-emerald-600" />
                          <span>Pros & Advantages:</span>
                        </div>
                        <ul className="space-y-1 text-[11px] text-slate-700">
                          {detailedProduct.pros.map((p, i) => (
                            <li key={i} className="flex items-start space-x-1.5">
                              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                              <span>{p}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {detailedProduct.cons && (
                      <div className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-2">
                        <div className="font-bold text-slate-900 flex items-center space-x-1.5">
                          <ThumbsDown className="w-4 h-4 text-amber-600" />
                          <span>Points to Consider:</span>
                        </div>
                        <ul className="space-y-1 text-[11px] text-slate-700">
                          {detailedProduct.cons.map((c, i) => (
                            <li key={i} className="flex items-start space-x-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                              <span>{c}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* 4. Product FAQs Tab (from JSON) */}
            {activeTab === 'faqs' && detailedProduct.faqs && (
              <div className="space-y-2">
                {detailedProduct.faqs.map((faq, index) => {
                  const isOpen = openFaqIndex === index;
                  return (
                    <div key={index} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                      <button
                        onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                        className="w-full p-3.5 text-left flex items-center justify-between font-bold text-slate-800 hover:text-orange-600 transition-colors cursor-pointer"
                      >
                        <span className="flex items-center space-x-2">
                          <HelpCircle className="w-4 h-4 text-orange-600 shrink-0" />
                          <span>{faq.question}</span>
                        </span>
                        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                      </button>
                      {isOpen && (
                        <div className="px-3.5 pb-3.5 pt-1 text-slate-600 border-t border-slate-100 text-[11px] leading-relaxed">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* 5. Customs & Import Info Tab */}
            {activeTab === 'customs' && (
              <div className="space-y-3 bg-white p-4 rounded-xl border border-slate-200">
                <div className="flex items-start space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-slate-900">Are import duties included in the final price?</h5>
                    <p className="text-slate-600 text-[11px] mt-0.5">
                      Yes! When you order through Nekomart, all Indian Customs Basic Duty (BCD), IGST, and courier handling fees are calculated upfront. You will never be asked to pay extra at your doorstep.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <PackageCheck className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-slate-900">Is KYC mandatory for Indian delivery?</h5>
                    <p className="text-slate-600 text-[11px] mt-0.5">
                      As per Indian Customs (CBIC) regulations for cross-border courier imports, a government-issued ID (PAN card, Aadhaar or Passport) is required during checkout for rapid airway clearance.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 6. Customer Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="space-y-3">
                {(detailedProduct.reviews || [
                  {
                    id: 'rev-sample-1',
                    author: 'Vikram Sethi',
                    rating: 5,
                    date: '2026-08-04',
                    title: '100% Genuine Import - Fast DHL Transit',
                    comment: 'Delivered in pristine condition with original factory seals. No duty hassle at all.',
                    verifiedPurchase: true,
                    location: 'Bengaluru, Karnataka'
                  }
                ]).map((rev) => (
                  <div key={rev.id} className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-900">{rev.author}</span>
                        {rev.verifiedPurchase && (
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                            Verified Buyer
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400">{rev.date} • {rev.location}</span>
                    </div>
                    <div className="flex text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`}
                        />
                      ))}
                    </div>
                    <h5 className="font-bold text-slate-800 text-xs">{rev.title}</h5>
                    <p className="text-slate-600 text-[11px]">{rev.comment}</p>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};
