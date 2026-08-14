import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  X, 
  MapPin, 
  ShieldCheck, 
  Plane, 
  CreditCard, 
  CheckCircle2, 
  Lock, 
  ArrowRight, 
  ArrowLeft,
  QrCode,
  Building2,
  Truck,
  FileCheck2,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { CartItem, CurrencyCode, ShippingAddress, KycVerification, Order } from '../types';
import { INDIAN_STATES } from '../data/categories';
import { formatPrice } from '../utils/currency';
import { calculateLandingCost, getEstimatedDeliveryDateString } from '../utils/customsCalculator';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  currency: CurrencyCode;
  discountAmount: number;
  onOrderCompleted: (order: Order) => void;
  initialPincode: string;
  initialCity: string;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  currency,
  discountAmount,
  onOrderCompleted,
  initialPincode,
  initialCity
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Step 1: Address
  const [address, setAddress] = useState<ShippingAddress>({
    fullName: 'Rahul Verma',
    email: 'rahul.verma@example.com',
    phone: '+91 98765 43210',
    pincode: initialPincode || '110001',
    flatNumber: 'Flat 402, Lotus Towers',
    areaStreet: 'MG Road, Connaught Place',
    landmark: 'Near Metro Gate 3',
    city: initialCity || 'New Delhi',
    state: 'Delhi NCR',
    addressType: 'home'
  });

  // Step 2: Customs KYC (Indian Regulation Requirement)
  const [kyc, setKyc] = useState<KycVerification>({
    idType: 'pan',
    idNumber: 'ABCDE1234F',
    verified: true
  });

  // Step 3: Shipping
  const [shippingSpeed, setShippingSpeed] = useState<'express' | 'standard'>('express');

  // Step 4: Payment
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking' | 'cod'>('upi');
  const [upiId, setUpiId] = useState('rahul@okhdfcbank');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8821');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('923');

  // Step 5: Created Order
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Totals calculations
  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const totalShipping = items.reduce((acc, item) => {
    const cost = calculateLandingCost(item.product, shippingSpeed);
    return acc + cost.internationalShipping * item.quantity;
  }, 0);
  const totalCustoms = items.reduce((acc, item) => {
    const cost = calculateLandingCost(item.product, shippingSpeed);
    return acc + (cost.customsDuty + cost.importHandlingFee) * item.quantity;
  }, 0);
  const grandTotal = Math.max(0, subtotal + totalShipping + totalCustoms - discountAmount);

  // Address validation
  const isAddressValid = address.fullName && address.email && address.phone && address.pincode && address.city && address.state && address.flatNumber;
  const isKycValid = kyc.idNumber.length >= 6;

  const handlePlaceOrder = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const orderId = `NKM-IN-${Math.floor(100000 + Math.random() * 900000)}`;
      const trackingNumber = `DHL-EXP-${Math.floor(10000000 + Math.random() * 90000000)}`;
      const newOrder: Order = {
        id: orderId,
        items,
        shippingAddress: address,
        kyc,
        subtotal,
        shippingFee: totalShipping,
        customsDuty: totalCustoms,
        tax: 0,
        total: grandTotal,
        currency,
        paymentMethod,
        orderDate: new Date().toISOString().split('T')[0],
        status: 'confirmed',
        trackingNumber,
        carrier: shippingSpeed === 'express' ? 'DHL Express' : 'Aramex Global',
        estimatedDeliveryDate: getEstimatedDeliveryDateString(shippingSpeed === 'express' ? 3 : 7, shippingSpeed === 'express' ? 6 : 10)
      };

      setCompletedOrder(newOrder);
      onOrderCompleted(newOrder);
      setIsProcessing(false);
      setStep(5);

      // Trigger celebration confetti!
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // Safe fallback
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in">
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto relative text-slate-800 animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="sticky top-0 bg-white z-20 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-600 text-white flex items-center justify-center font-black">
              🐱
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 leading-tight">
                Nekomart Global Checkout
              </h2>
              <p className="text-[11px] text-slate-500 flex items-center space-x-1">
                <Lock className="w-3 h-3 text-emerald-600" />
                <span>256-Bit Encrypted Indian Customs Import Gateway</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps Progress Indicator (if not completed) */}
        {step < 5 && (
          <div className="bg-slate-50 px-6 py-3 border-b border-slate-200">
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className={`flex flex-col items-center space-y-1 ${step >= 1 ? 'text-orange-600 font-bold' : 'text-slate-400'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 1 ? 'bg-orange-600 text-white' : 'bg-slate-200'}`}>
                  1
                </div>
                <span className="hidden sm:inline">Address</span>
              </div>

              <div className={`flex flex-col items-center space-y-1 ${step >= 2 ? 'text-orange-600 font-bold' : 'text-slate-400'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 2 ? 'bg-orange-600 text-white' : 'bg-slate-200'}`}>
                  2
                </div>
                <span className="hidden sm:inline">Customs KYC</span>
              </div>

              <div className={`flex flex-col items-center space-y-1 ${step >= 3 ? 'text-orange-600 font-bold' : 'text-slate-400'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 3 ? 'bg-orange-600 text-white' : 'bg-slate-200'}`}>
                  3
                </div>
                <span className="hidden sm:inline">Air Cargo</span>
              </div>

              <div className={`flex flex-col items-center space-y-1 ${step >= 4 ? 'text-orange-600 font-bold' : 'text-slate-400'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 4 ? 'bg-orange-600 text-white' : 'bg-slate-200'}`}>
                  4
                </div>
                <span className="hidden sm:inline">Payment</span>
              </div>
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Left Content Form (8 cols) */}
          <div className="lg:col-span-8 space-y-5">
            
            {/* Step 1: Shipping Address in India */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 border-b border-slate-100 pb-2">
                  <MapPin className="w-5 h-5 text-orange-600" />
                  <h3 className="font-extrabold text-sm text-slate-900">
                    Step 1: Indian Delivery Address
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Full Recipient Name *</label>
                    <input
                      type="text"
                      value={address.fullName}
                      onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                      placeholder="e.g. Rahul Verma"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Mobile Number (for SMS & Courier) *</label>
                    <input
                      type="tel"
                      value={address.phone}
                      onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                      placeholder="+91 98765 43210"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Email Address (Airway tracking) *</label>
                    <input
                      type="email"
                      value={address.email}
                      onChange={(e) => setAddress({ ...address, email: e.target.value })}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                      placeholder="rahul@example.com"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Indian PIN Code *</label>
                    <input
                      type="text"
                      maxLength={6}
                      value={address.pincode}
                      onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold focus:outline-none focus:ring-1 focus:ring-orange-500"
                      placeholder="110001"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-bold text-slate-700 block mb-1">Flat, House No., Building, Company *</label>
                    <input
                      type="text"
                      value={address.flatNumber}
                      onChange={(e) => setAddress({ ...address, flatNumber: e.target.value })}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                      placeholder="Flat 402, Lotus Towers"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Area, Street, Sector *</label>
                    <input
                      type="text"
                      value={address.areaStreet}
                      onChange={(e) => setAddress({ ...address, areaStreet: e.target.value })}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                      placeholder="MG Road, Connaught Place"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">City / District *</label>
                    <input
                      type="text"
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                      placeholder="New Delhi"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">State / Union Territory *</label>
                    <select
                      value={address.state}
                      onChange={(e) => setAddress({ ...address, state: e.target.value })}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 cursor-pointer"
                    >
                      {INDIAN_STATES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Landmark (Optional)</label>
                    <input
                      type="text"
                      value={address.landmark || ''}
                      onChange={(e) => setAddress({ ...address, landmark: e.target.value })}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                      placeholder="Near Metro Station"
                    />
                  </div>
                </div>

                <div className="pt-3 flex justify-end">
                  <button
                    onClick={() => setStep(2)}
                    disabled={!isAddressValid}
                    className="bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-extrabold text-xs px-6 py-2.5 rounded-xl shadow-md cursor-pointer transition-all flex items-center space-x-1.5"
                  >
                    <span>Proceed to Customs KYC</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Customs KYC Compliance */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 border-b border-slate-100 pb-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-extrabold text-sm text-slate-900">
                    Step 2: Indian Customs (CBIC) Import KYC Verification
                  </h3>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 space-y-1">
                  <div className="font-bold flex items-center space-x-1">
                    <FileCheck2 className="w-4 h-4 text-orange-600" />
                    <span>Regulatory Requirement for International Courier Imports</span>
                  </div>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    Per Govt of India Notification (Customs Act 1962), a valid Government photo ID is required to process duty clearance at Delhi IGI / Mumbai customs airports without manual holds.
                  </p>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Select Identity Document Type *</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'pan', label: 'PAN Card (Fastest)' },
                        { id: 'aadhaar', label: 'Aadhaar Card' },
                        { id: 'passport', label: 'Indian Passport' }
                      ].map((doc) => (
                        <button
                          key={doc.id}
                          type="button"
                          onClick={() => setKyc({ ...kyc, idType: doc.id as any })}
                          className={`p-2.5 rounded-xl border text-center font-bold transition-all cursor-pointer ${
                            kyc.idType === doc.id
                              ? 'border-orange-500 bg-orange-50 text-orange-700 ring-1 ring-orange-300'
                              : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {doc.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      {kyc.idType === 'pan' ? 'PAN Number (10 Alphanumeric Characters) *' : kyc.idType === 'aadhaar' ? 'Aadhaar Number (12 Digits) *' : 'Passport Number *'}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={kyc.idNumber}
                        onChange={(e) => setKyc({ ...kyc, idNumber: e.target.value.toUpperCase() })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-sm uppercase focus:outline-none focus:ring-1 focus:ring-orange-500"
                        placeholder="ABCDE1234F"
                      />
                      <span className="absolute right-3 top-2.5 text-xs text-emerald-600 font-bold flex items-center space-x-1">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Pre-Verified</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-between">
                  <button
                    onClick={() => setStep(1)}
                    className="text-xs text-slate-600 hover:text-slate-900 font-bold flex items-center space-x-1 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Address</span>
                  </button>

                  <button
                    onClick={() => setStep(3)}
                    disabled={!isKycValid}
                    className="bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-extrabold text-xs px-6 py-2.5 rounded-xl shadow-md cursor-pointer transition-all flex items-center space-x-1.5"
                  >
                    <span>Proceed to Air Cargo</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Air Cargo Speed */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 border-b border-slate-100 pb-2">
                  <Plane className="w-5 h-5 text-sky-600" />
                  <h3 className="font-extrabold text-sm text-slate-900">
                    Step 3: Select International Air Cargo Speed
                  </h3>
                </div>

                <div className="space-y-3">
                  <div
                    onClick={() => setShippingSpeed('express')}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      shippingSpeed === 'express'
                        ? 'border-orange-500 bg-orange-50/60 ring-2 ring-orange-300'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold text-slate-900 text-xs">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-lg bg-orange-500 text-white flex items-center justify-center font-bold">
                          ✈️
                        </div>
                        <div>
                          <div className="text-sm font-black text-orange-600">
                            DHL Express & FedEx Priority Air (Recommended)
                          </div>
                          <div className="text-slate-500 font-normal text-[11px]">
                            Estimated 3-6 business days to {address.city} with expedited customs lane
                          </div>
                        </div>
                      </div>
                      <span className="text-sm font-black text-slate-900">
                        {formatPrice(totalShipping, currency)}
                      </span>
                    </div>
                  </div>

                  <div
                    onClick={() => setShippingSpeed('standard')}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      shippingSpeed === 'standard'
                        ? 'border-orange-500 bg-orange-50/60 ring-2 ring-orange-300'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold text-slate-900 text-xs">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center font-bold">
                          📦
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-800">
                            Standard International Air (Aramex Global)
                          </div>
                          <div className="text-slate-500 font-normal text-[11px]">
                            Estimated 7-10 business days to {address.city}
                          </div>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-slate-700">
                        {formatPrice(Math.round(totalShipping * 0.75), currency)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-between">
                  <button
                    onClick={() => setStep(2)}
                    className="text-xs text-slate-600 hover:text-slate-900 font-bold flex items-center space-x-1 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to KYC</span>
                  </button>

                  <button
                    onClick={() => setStep(4)}
                    className="bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs px-6 py-2.5 rounded-xl shadow-md cursor-pointer transition-all flex items-center space-x-1.5"
                  >
                    <span>Proceed to Indian Payment</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Payment */}
            {step === 4 && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 border-b border-slate-100 pb-2">
                  <CreditCard className="w-5 h-5 text-orange-600" />
                  <h3 className="font-extrabold text-sm text-slate-900">
                    Step 4: Select Payment Method
                  </h3>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-3 rounded-xl border text-center font-bold transition-all cursor-pointer ${
                      paymentMethod === 'upi'
                        ? 'border-orange-500 bg-orange-50 text-orange-700 ring-2 ring-orange-300'
                        : 'border-slate-200 bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="text-base mb-1">⚡ UPI</div>
                    <span className="text-[11px]">GPay / PhonePe / Paytm</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-xl border text-center font-bold transition-all cursor-pointer ${
                      paymentMethod === 'card'
                        ? 'border-orange-500 bg-orange-50 text-orange-700 ring-2 ring-orange-300'
                        : 'border-slate-200 bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="text-base mb-1">💳 Cards</div>
                    <span className="text-[11px]">RuPay / Visa / Master</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('netbanking')}
                    className={`p-3 rounded-xl border text-center font-bold transition-all cursor-pointer ${
                      paymentMethod === 'netbanking'
                        ? 'border-orange-500 bg-orange-50 text-orange-700 ring-2 ring-orange-300'
                        : 'border-slate-200 bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="text-base mb-1">🏦 NetBanking</div>
                    <span className="text-[11px]">HDFC / SBI / ICICI</span>
                  </button>
                </div>

                {/* Method details */}
                {paymentMethod === 'upi' && (
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 text-xs">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Enter UPI VPA / ID</label>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-orange-500"
                        placeholder="yourname@okhdfcbank"
                      />
                    </div>
                    <div className="flex items-center space-x-2 text-[11px] text-slate-500">
                      <QrCode className="w-4 h-4 text-slate-700" />
                      <span>Instant UPI intent approval via your mobile banking app.</span>
                    </div>
                  </div>
                )}

                {paymentMethod === 'card' && (
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 text-xs">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Card Number</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-orange-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Expiry (MM/YY)</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full p-2.5 bg-white border border-slate-200 rounded-lg font-mono"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">CVV</label>
                        <input
                          type="password"
                          maxLength={4}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          className="w-full p-2.5 bg-white border border-slate-200 rounded-lg font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'netbanking' && (
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                    <label className="font-bold text-slate-700 block">Select Your Indian Bank</label>
                    <select className="w-full p-2.5 bg-white border border-slate-200 rounded-lg font-medium cursor-pointer">
                      <option>HDFC Bank</option>
                      <option>State Bank of India (SBI)</option>
                      <option>ICICI Bank</option>
                      <option>Axis Bank</option>
                      <option>Kotak Mahindra Bank</option>
                    </select>
                  </div>
                )}

                <div className="pt-3 flex items-center justify-between">
                  <button
                    onClick={() => setStep(3)}
                    className="text-xs text-slate-600 hover:text-slate-900 font-bold flex items-center space-x-1 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>

                  <button
                    id="place-order-confirm-btn"
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                    className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-black text-sm px-8 py-3 rounded-xl shadow-lg cursor-pointer transition-all flex items-center space-x-2"
                  >
                    <Lock className="w-4 h-4" />
                    <span>{isProcessing ? 'Processing Import...' : `Pay ${formatPrice(grandTotal, currency)}`}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Step 5: Order Confirmed & Airway Bill Details */}
            {step === 5 && completedOrder && (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-3xl font-black shadow-inner">
                  🎉
                </div>

                <h3 className="text-xl font-black text-slate-900">
                  Global Import Order Placed Successfully!
                </h3>

                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Your order has been transmitted to our overseas hub. Airway bill generated and Indian customs clearance initiated.
                </p>

                {/* Order summary box */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 max-w-lg mx-auto text-left text-xs space-y-2">
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="font-bold text-slate-500">Order Number:</span>
                    <span className="font-mono font-black text-slate-900">{completedOrder.id}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="font-bold text-slate-500">Carrier Airway Bill:</span>
                    <span className="font-mono font-bold text-orange-600">{completedOrder.trackingNumber}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="font-bold text-slate-500">Estimated Delivery:</span>
                    <span className="font-bold text-slate-900">{completedOrder.estimatedDeliveryDate}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="font-bold text-slate-500">Delivery Address:</span>
                    <span className="font-bold text-slate-900 text-right">{completedOrder.shippingAddress.flatNumber}, {completedOrder.shippingAddress.city} ({completedOrder.shippingAddress.pincode})</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="font-black text-slate-900">Amount Paid (Customs Included):</span>
                    <span className="font-black text-orange-600 text-sm">{formatPrice(completedOrder.total, currency)}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={onClose}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow cursor-pointer transition-all"
                  >
                    Continue Shopping on Nekomart
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Right Column: Order Summary (4 cols) */}
          {step < 5 && (
            <div className="lg:col-span-4 bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-3 h-fit text-xs">
              <h4 className="font-extrabold text-slate-900 border-b border-slate-200 pb-2 flex items-center justify-between">
                <span>Order Summary</span>
                <span className="text-slate-500 text-[11px] font-bold">{items.length} items</span>
              </h4>

              {/* Items preview */}
              <div className="space-y-2 max-h-48 overflow-y-auto no-scrollbar">
                {items.map((item) => (
                  <div key={item.product.id} className="flex items-center space-x-2 bg-white p-2 rounded-lg border border-slate-200">
                    <img src={item.product.image} alt={item.product.title} className="w-10 h-10 object-contain shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-bold text-slate-800 truncate">{item.product.title}</p>
                      <p className="text-[10px] text-slate-500">Qty: {item.quantity} • {item.product.origin} Store</p>
                    </div>
                    <span className="font-bold text-slate-900 shrink-0">
                      {formatPrice(item.product.price * item.quantity, currency)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Costs Breakdown */}
              <div className="border-t border-slate-200 pt-2 space-y-1.5 text-slate-600 text-[11px]">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-slate-800">{formatPrice(subtotal, currency)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Int'l Air Shipping:</span>
                  <span className="font-semibold text-slate-800">{formatPrice(totalShipping, currency)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Customs Duty & IGST:</span>
                  <span className="font-semibold text-emerald-700">{formatPrice(totalCustoms, currency)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Discount:</span>
                    <span>-{formatPrice(discountAmount, currency)}</span>
                  </div>
                )}
                <div className="flex justify-between text-xs font-black text-slate-900 border-t border-slate-200 pt-2">
                  <span>Total Landed Cost:</span>
                  <span className="text-orange-600 text-sm">{formatPrice(grandTotal, currency)}</span>
                </div>
              </div>

              {/* Safe guarantee */}
              <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl text-[10px] text-emerald-800 flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zero additional customs fee demanded on arrival. Fully pre-cleared.</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
