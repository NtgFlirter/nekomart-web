import React from 'react';
import { 
  Globe, 
  ShieldCheck, 
  Truck, 
  Headphones, 
  CreditCard, 
  RotateCcw, 
  Mail, 
  Lock,
  ArrowRight,
  FileJson
} from 'lucide-react';
import { COUNTRY_STORES, CATEGORIES } from '../data/categories';
import { CountryOrigin } from '../types';

interface FooterProps {
  onSelectStore: (store: CountryOrigin) => void;
  onSelectCategory: (cat: string) => void;
  onOpenCustomsInfo: () => void;
  onOpenTracking: () => void;
  onOpenJsonImporter: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectStore,
  onSelectCategory,
  onOpenCustomsInfo,
  onOpenTracking,
  onOpenJsonImporter
}) => {
  return (
    <footer className="bg-slate-950 text-slate-400 text-xs mt-16 border-t border-slate-800">
      
      {/* Top Value Assurance Banner */}
      <div className="bg-slate-900 border-b border-slate-800 py-8 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-white">
          <div className="flex items-start space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-orange-600/20 text-orange-400 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-100">Worldwide Doorstep Express</h4>
              <p className="text-xs text-slate-400 mt-0.5">Fast air delivery to all Indian PIN codes via DHL & FedEx.</p>
            </div>
          </div>

          <div className="flex items-start space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-100">Pre-Cleared Customs</h4>
              <p className="text-xs text-slate-400 mt-0.5">All import duties and taxes calculated upfront at checkout.</p>
            </div>
          </div>

          <div className="flex items-start space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-100">100% Genuine Authenticity</h4>
              <p className="text-xs text-slate-400 mt-0.5">Sourced directly from verified overseas manufacturers.</p>
            </div>
          </div>

          <div className="flex items-start space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-100">24/7 Dedicated Support</h4>
              <p className="text-xs text-slate-400 mt-0.5">Live order tracking and dedicated import specialists.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand & About */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center text-white font-black text-lg">
                🐱
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                neko<span className="text-orange-500">mart</span>.co.in
              </span>
            </div>

            <p className="text-slate-400 leading-relaxed text-xs max-w-sm">
              Nekomart is India's leading cross-border shopping destination, delivering authentic luxury goods, electronics, beauty, and supplements directly from USA, Japan, UK, China, and Hong Kong to your doorstep with zero customs hassle.
            </p>

            {/* Newsletter */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-slate-200">Subscribe for Global Import Deals & Coupons</span>
              <div className="flex max-w-sm">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-slate-900 border border-slate-800 px-3 py-2 text-xs rounded-l-lg text-white focus:outline-none focus:border-orange-500 flex-1"
                />
                <button className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-4 py-2 rounded-r-lg text-xs cursor-pointer transition-colors">
                  Join
                </button>
              </div>
            </div>
          </div>

          {/* Country Stores */}
          <div className="space-y-3">
            <h5 className="font-bold text-sm text-slate-100 uppercase tracking-wider">
              Country Stores
            </h5>
            <ul className="space-y-2 text-xs">
              {COUNTRY_STORES.map((s) => (
                <li key={s.id}>
                  <button
                    onClick={() => {
                      onSelectStore(s.id);
                      window.scrollTo({ top: 400, behavior: 'smooth' });
                    }}
                    className="hover:text-orange-400 transition-colors flex items-center space-x-1.5 cursor-pointer text-left"
                  >
                    <span>{s.flag}</span>
                    <span>{s.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Top Categories */}
          <div className="space-y-3">
            <h5 className="font-bold text-sm text-slate-100 uppercase tracking-wider">
              Popular Categories
            </h5>
            <ul className="space-y-2 text-xs">
              {CATEGORIES.filter(c => c.id !== 'all').slice(0, 6).map((c) => (
                <li key={c.id}>
                  <button
                    onClick={() => {
                      onSelectCategory(c.name);
                      window.scrollTo({ top: 400, behavior: 'smooth' });
                    }}
                    className="hover:text-orange-400 transition-colors cursor-pointer text-left truncate max-w-full"
                  >
                    {c.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service & Legal */}
          <div className="space-y-3">
            <h5 className="font-bold text-sm text-slate-100 uppercase tracking-wider">
              Customer Support
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#shipping" className="hover:text-orange-400 transition-colors">
                  Track Global Shipment
                </a>
              </li>
              <li>
                <a href="#kyc" className="hover:text-orange-400 transition-colors">
                  Indian Customs & KYC Policy
                </a>
              </li>
              <li>
                <a href="#returns" className="hover:text-orange-400 transition-colors">
                  International Return Policy
                </a>
              </li>
              <li>
                <a href="#terms" className="hover:text-orange-400 transition-colors">
                  Terms of Cross-Border Sale
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Payment Methods & Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3 text-xs">
            <span className="font-bold text-slate-300">Accepted Indian Payments:</span>
            <div className="flex items-center space-x-2 text-[11px] font-bold text-slate-300">
              <span className="bg-slate-900 px-2 py-1 rounded border border-slate-800">⚡ UPI (GPay/PhonePe)</span>
              <span className="bg-slate-900 px-2 py-1 rounded border border-slate-800">RuPay</span>
              <span className="bg-slate-900 px-2 py-1 rounded border border-slate-800">Visa / MasterCard</span>
              <span className="bg-slate-900 px-2 py-1 rounded border border-slate-800">NetBanking</span>
            </div>
          </div>

          <div className="text-slate-500 text-xs">
            © 2026 Nekomart India (nekomart.co.in). Inspired by Ubuy Global. All rights reserved.
          </div>
        </div>

      </div>
    </footer>
  );
};
