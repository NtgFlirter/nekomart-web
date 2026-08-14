import React, { useState } from 'react';
import { 
  Menu, 
  Flame, 
  Zap, 
  Award, 
  ShieldCheck, 
  ChevronRight, 
  Globe, 
  FileJson,
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';
import { CountryOrigin } from '../types';
import { CATEGORIES, COUNTRY_STORES } from '../data/categories';

interface MegaNavProps {
  currentStore: CountryOrigin | 'ALL';
  onSelectStore: (store: CountryOrigin | 'ALL') => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  onOpenDeals: () => void;
  onOpenExpress: () => void;
  onOpenJsonImporter: () => void;
  onOpenCustomsInfo: () => void;
}

export const MegaNav: React.FC<MegaNavProps> = ({
  currentStore,
  onSelectStore,
  selectedCategory,
  onSelectCategory,
  onOpenDeals,
  onOpenExpress,
  onOpenJsonImporter,
  onOpenCustomsInfo
}) => {
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string>('electronics');

  const activeHoverCategoryObj = CATEGORIES.find(c => c.id === hoveredCategory) || CATEGORIES[1];

  return (
    <nav className="bg-slate-800 text-white shadow-md relative z-30">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between text-xs font-semibold overflow-x-auto no-scrollbar py-1">
          
          {/* Mega Menu Toggle */}
          <div className="relative shrink-0">
            <button
              id="mega-menu-all-categories-btn"
              onClick={() => setMegaMenuOpen(!megaMenuOpen)}
              className={`flex items-center space-x-2 py-2 px-3 rounded-md transition-colors cursor-pointer ${
                megaMenuOpen ? 'bg-orange-600 text-white' : 'bg-slate-700 hover:bg-slate-600 text-white'
              }`}
            >
              <Menu className="w-4 h-4" />
              <span className="uppercase tracking-wider font-bold">All Categories</span>
            </button>

            {/* Mega Dropdown Panel */}
            {megaMenuOpen && (
              <div 
                className="absolute left-0 top-full mt-1 w-[700px] bg-white text-slate-800 rounded-xl shadow-2xl border border-slate-200 z-50 flex overflow-hidden animate-in fade-in zoom-in-95 duration-100"
                onMouseLeave={() => setMegaMenuOpen(false)}
              >
                {/* Left Category Column */}
                <div className="w-1/2 bg-slate-50 p-2 border-r border-slate-200 space-y-0.5">
                  <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Product Categories
                  </div>
                  {CATEGORIES.filter(c => c.id !== 'all').map(cat => (
                    <button
                      key={cat.id}
                      onMouseEnter={() => setHoveredCategory(cat.id)}
                      onClick={() => {
                        onSelectCategory(cat.id);
                        setMegaMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between transition-colors cursor-pointer ${
                        hoveredCategory === cat.id ? 'bg-orange-50 text-orange-600 font-bold' : 'hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <span className="truncate">{cat.name}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                  ))}
                  
                  <div className="pt-2 border-t border-slate-200 mt-2">
                    <button
                      onClick={() => {
                        onSelectCategory('all');
                        setMegaMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 text-orange-600 font-bold hover:underline flex items-center justify-between"
                    >
                      <span>View All Categories</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Right Subcategories / Country Store Banner */}
                <div className="w-1/2 p-4 bg-white flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2 mb-3">
                      {activeHoverCategoryObj?.name}
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      {activeHoverCategoryObj?.subcategories.map((sub, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            onSelectCategory(activeHoverCategoryObj.id);
                            setMegaMenuOpen(false);
                          }}
                          className="text-left text-xs text-slate-600 hover:text-orange-600 hover:translate-x-1 transition-all py-1 cursor-pointer flex items-center space-x-1.5"
                        >
                          <span className="w-1 h-1 rounded-full bg-orange-400"></span>
                          <span>{sub}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg text-xs">
                    <p className="font-bold">Direct Air Cargo to India</p>
                    <p className="text-[11px] opacity-90">Customs, duties & insurance included at checkout.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Country Stores Quick Pills */}
          <div className="flex items-center space-x-1 md:space-x-2 shrink-0">
            <button
              id="store-nav-all"
              onClick={() => onSelectStore('ALL')}
              className={`px-2.5 py-1.5 rounded-md flex items-center space-x-1 transition-all cursor-pointer ${
                currentStore === 'ALL'
                  ? 'bg-orange-500 text-white font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>All Stores</span>
            </button>

            {COUNTRY_STORES.map(store => (
              <button
                key={store.id}
                id={`store-nav-${store.id.toLowerCase()}`}
                onClick={() => onSelectStore(store.id)}
                className={`px-2.5 py-1.5 rounded-md flex items-center space-x-1 transition-all cursor-pointer ${
                  currentStore === store.id
                    ? 'bg-orange-500 text-white font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                <span className="text-sm leading-none">{store.flag}</span>
                <span className="whitespace-nowrap">{store.name}</span>
              </button>
            ))}
          </div>

          {/* Featured highlights on the right */}
          <div className="flex items-center space-x-2 shrink-0">
            {/* Deals */}
            <button
              id="nav-deals-btn"
              onClick={onOpenDeals}
              className="flex items-center space-x-1 px-2 py-1 text-amber-300 hover:text-amber-200 hover:bg-slate-700 rounded transition-colors cursor-pointer"
            >
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span className="whitespace-nowrap">Deals of the Day</span>
            </button>

            {/* Express */}
            <button
              id="nav-express-btn"
              onClick={onOpenExpress}
              className="hidden lg:flex items-center space-x-1 px-2 py-1 text-cyan-300 hover:text-cyan-200 hover:bg-slate-700 rounded transition-colors cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span className="whitespace-nowrap">Import Express (3-5 Days)</span>
            </button>

            {/* Customs Guarantee */}
            <button
              id="nav-customs-duty-btn"
              onClick={onOpenCustomsInfo}
              className="hidden xl:flex items-center space-x-1 px-2 py-1 text-emerald-300 hover:text-emerald-200 hover:bg-slate-700 rounded transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="whitespace-nowrap">Duty Calculator</span>
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
};
