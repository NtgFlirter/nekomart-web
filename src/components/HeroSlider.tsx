import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plane, ShieldCheck, Clock, CreditCard, Sparkles, ArrowRight } from 'lucide-react';
import { PROMO_BANNERS } from '../data/categories';
import { CountryOrigin } from '../types';

interface HeroSliderProps {
  onSelectStore: (store: CountryOrigin) => void;
  onOpenJsonImporter: () => void;
}

export const HeroSlider: React.FC<HeroSliderProps> = ({ onSelectStore, onOpenJsonImporter }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % PROMO_BANNERS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const banner = PROMO_BANNERS[currentSlide];

  return (
    <div className="bg-slate-900 overflow-hidden">
      {/* Banner Carousel */}
      <div className="relative max-w-7xl mx-auto px-4 py-4 md:py-6">
        <div className={`relative rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-r ${banner.bgGradient} transition-all duration-700 min-h-[300px] md:min-h-[360px] flex items-center`}>
          
          {/* Background pattern & overlay */}
          <div className="absolute inset-0 bg-black/25 mix-blend-multiply pointer-events-none" />
          <div 
            className="absolute right-0 top-0 bottom-0 w-1/2 opacity-30 md:opacity-60 bg-cover bg-center pointer-events-none transition-all duration-700"
            style={{ backgroundImage: `url(${banner.image})` }}
          />

          {/* Banner Content */}
          <div className="relative z-10 p-6 md:p-12 max-w-2xl text-white space-y-4">
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{banner.tag}</span>
            </div>

            <h1 className="text-2xl md:text-4xl lg:text-5xl font-black tracking-tight leading-tight drop-shadow-sm">
              {banner.title}
            </h1>

            <p className="text-sm md:text-base text-white/90 font-medium max-w-xl">
              {banner.subtitle}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                id="hero-banner-cta-btn"
                onClick={() => onSelectStore(banner.origin)}
                className="bg-white text-slate-900 hover:bg-amber-400 font-extrabold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center space-x-2 text-sm"
              >
                <span>{banner.cta}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Slider navigation arrows */}
          <button
            onClick={() => setCurrentSlide((prev) => (prev - 1 + PROMO_BANNERS.length) % PROMO_BANNERS.length)}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-sm transition-all z-20 cursor-pointer"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % PROMO_BANNERS.length)}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-sm transition-all z-20 cursor-pointer"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Slide Indicator Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center space-x-2 z-20">
            {PROMO_BANNERS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  currentSlide === idx ? 'w-8 bg-white' : 'w-2 bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

        </div>

        {/* 4 Trust Value Props (Ubuy Signature Strip) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
          <div className="bg-slate-800/80 border border-slate-700/60 p-3 rounded-xl flex items-center space-x-3 text-white">
            <div className="w-10 h-10 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
              <Plane className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-100">Worldwide Express</p>
              <p className="text-[11px] text-slate-400">Direct to India via DHL / FedEx</p>
            </div>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/60 p-3 rounded-xl flex items-center space-x-3 text-white">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-100">Customs Cleared</p>
              <p className="text-[11px] text-slate-400">No surprise duties at doorstep</p>
            </div>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/60 p-3 rounded-xl flex items-center space-x-3 text-white">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-100">100% Genuine Items</p>
              <p className="text-[11px] text-slate-400">Direct from factory overseas</p>
            </div>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/60 p-3 rounded-xl flex items-center space-x-3 text-white">
            <div className="w-10 h-10 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-100">Indian Payments</p>
              <p className="text-[11px] text-slate-400">UPI, RuPay, EMI & NetBanking</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
