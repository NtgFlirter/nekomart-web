import React from 'react';
import { ArrowRight, Plane, Sparkles } from 'lucide-react';
import { COUNTRY_STORES } from '../data/categories';
import { CountryOrigin } from '../types';

interface CountryStoreGridProps {
  selectedStore: CountryOrigin | 'ALL';
  onSelectStore: (store: CountryOrigin | 'ALL') => void;
}

export const CountryStoreGrid: React.FC<CountryStoreGridProps> = ({
  selectedStore,
  onSelectStore
}) => {
  return (
    <section className="my-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xl">✈️</span>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Explore Global Country Stores
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Shop directly from international brand warehouses with door-to-door Indian customs clearance
          </p>
        </div>

        {selectedStore !== 'ALL' && (
          <button
            onClick={() => onSelectStore('ALL')}
            className="text-xs font-bold text-orange-600 hover:text-orange-700 underline cursor-pointer"
          >
            Show All Stores
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {COUNTRY_STORES.map((store) => {
          const isSelected = selectedStore === store.id;
          return (
            <div
              key={store.id}
              onClick={() => onSelectStore(store.id)}
              className={`group relative rounded-xl border p-3.5 transition-all duration-200 cursor-pointer overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? 'border-orange-500 bg-orange-50/60 shadow-md ring-2 ring-orange-400'
                  : 'border-slate-200 bg-white hover:border-orange-400 hover:shadow-lg'
              }`}
            >
              {/* Header flag & badge */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-3xl filter drop-shadow-sm group-hover:scale-110 transition-transform">
                    {store.flag}
                  </span>
                  <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${store.badgeColor}`}>
                    {store.code} Store
                  </span>
                </div>

                <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-orange-600 transition-colors">
                  {store.name}
                </h3>

                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {store.tagline}
                </p>
              </div>

              {/* Popular tags preview */}
              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-orange-600 group-hover:text-orange-700">
                <span>Shop Direct</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
