import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  FileJson, 
  Check, 
  AlertCircle, 
  Download, 
  RotateCcw, 
  Sparkles, 
  Database,
  Layers,
  ArrowRight
} from 'lucide-react';
import { Product, CountryOrigin } from '../types';
import { parseProductJson, ImportResult } from '../utils/jsonImporter';
import { INITIAL_PRODUCTS } from '../data/mockProducts';

interface JsonImporterModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProducts: Product[];
  onApplyProducts: (newProducts: Product[], mode: 'replace' | 'append') => void;
  onResetToDefault: () => void;
}

export const JsonImporterModal: React.FC<JsonImporterModalProps> = ({
  isOpen,
  onClose,
  currentProducts,
  onApplyProducts,
  onResetToDefault
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'upload' | 'paste' | 'generate860'>('upload');
  const [jsonText, setJsonText] = useState('');
  const [parseResult, setParseResult] = useState<ImportResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [appliedSuccess, setAppliedSuccess] = useState<string | null>(null);

  // File upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);
        const result = parseProductJson(parsed);
        setParseResult(result);
      } catch (err: any) {
        setParseResult({
          success: false,
          count: 0,
          products: [],
          categories: [],
          brands: [],
          errors: [`Invalid JSON format: ${err?.message || 'Failed to parse JSON file'}`]
        });
      } finally {
        setIsProcessing(false);
      }
    };
    reader.readAsText(file);
  };

  // Text paste parse handler
  const handleParseText = () => {
    if (!jsonText.trim()) return;
    setIsProcessing(true);
    try {
      const parsed = JSON.parse(jsonText);
      const result = parseProductJson(parsed);
      setParseResult(result);
    } catch (err: any) {
      setParseResult({
        success: false,
        count: 0,
        products: [],
        categories: [],
        brands: [],
        errors: [`Invalid JSON text: ${err?.message || 'Syntax error in JSON'}`]
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Generator for 860 simulated high-volume imported products
  const handleGenerate860 = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const origins: CountryOrigin[] = ['USA', 'Japan', 'UK', 'China', 'Hong Kong'];
      const categories = [
        'Electronics & Gadgets', 'Beauty & Personal Care', 'Health & Supplements',
        'Fashion & Watches', 'Grocery', 'Toys, Anime & Games', 'Tools & Automotive'
      ];
      const brands = [
        'Apple', 'Sony', 'Anker', 'Bose', 'CeraVe', 'COSRX', 'NOW Foods',
        'Optimum Nutrition', 'Seiko', 'Casio', 'Dyson', 'Bandai Spirits',
        'Nintendo', 'Ninja', 'Bosch', 'Wüsthof', 'Beauty of Joseon', 'Fortnum & Mason'
      ];

      const generated: Product[] = [];
      const titles = [
        'Pro Series Wireless Active Noise Canceling ANC Headset',
        'Advanced Ceramide Barrier Hydration Glow Serum 50ml',
        '100% Pure Hydrolyzed Whey Protein Powder 5 lbs',
        'Automatic Chronograph 200M Water Resistant Steel Watch',
        'Ultra Precision Multi-Task Cordless Brushless Kit',
        'Ceremonial Organic Kyoto Harvest Stone Ground Green Tea',
        'Exclusive Collector Grade Scale Figure Japan Edition',
        'Intelligent Dual Zone Air Fryer with Smart Digital Sensor',
        'Multi-Port 140W GaN Fast Wall Charger with US Foldable Plug',
        'Glass Skin Soothing Rice Probiotic Facial Essence'
      ];

      for (let i = 1; i <= 860; i++) {
        const origin = origins[i % origins.length];
        const category = categories[i % categories.length];
        const brand = brands[i % brands.length];
        const baseTitle = titles[i % titles.length];
        const price = Math.round((850 + (i * 137) % 65000));
        const discount = (i % 5 === 0) ? (15 + (i % 25)) : undefined;
        const originalPrice = discount ? Math.round(price * (1 + discount / 100)) : undefined;

        // Choose appropriate image
        const baseImg = INITIAL_PRODUCTS[i % INITIAL_PRODUCTS.length]?.image || INITIAL_PRODUCTS[0].image;

        generated.push({
          id: `neko-gen-${i}`,
          title: `${brand} ${baseTitle} (Batch #${i} - ${origin} Store Direct)`,
          brand,
          category,
          price,
          originalPrice,
          discountPercent: discount,
          origin,
          rating: Number((4.3 + (i % 7) * 0.1).toFixed(1)),
          reviewCount: 45 + (i * 19) % 3500,
          image: baseImg,
          description: `Direct imported edition of ${brand} ${baseTitle}. Guaranteed 100% genuine merchandise from ${origin} store with Indian customs clearance and doorstep delivery.`,
          features: [
            `Direct ${origin} cross-border shipment`,
            `100% Factory sealed genuine authentic stock`,
            `All Indian customs duties, IGST and fees included`,
            `Transit insurance and tracking included`
          ],
          specifications: [
            { label: 'Import Store', value: `${origin} Global Warehouse` },
            { label: 'Brand', value: brand },
            { label: 'Category', value: category },
            { label: 'Catalog Index', value: `#${i} of 860` }
          ],
          inStock: true,
          stockCount: 5 + (i % 30),
          sku: `NKM-${origin.substring(0, 2).toUpperCase()}-${1000 + i}`,
          weightKg: Number((0.4 + (i % 5) * 0.5).toFixed(1)),
          shippingDaysMin: 4,
          shippingDaysMax: 7,
          isBestSeller: i % 8 === 0,
          isDealOfTheDay: i % 12 === 0,
          isExpressEligible: true,
          customsDutyPercent: 18
        });
      }

      const result = parseProductJson(generated);
      setParseResult(result);
      setIsProcessing(false);
    }, 200);
  };

  // Apply parsed products
  const handleApply = (mode: 'replace' | 'append') => {
    if (!parseResult || parseResult.products.length === 0) return;
    onApplyProducts(parseResult.products, mode);
    setAppliedSuccess(
      `Successfully loaded ${parseResult.products.length} products into Nekomart catalog (${mode === 'replace' ? 'replaced' : 'appended'})!`
    );
    setTimeout(() => {
      setAppliedSuccess(null);
      onClose();
    }, 1500);
  };

  // Export current catalog as JSON
  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(currentProducts, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `nekomart_products_catalog_${currentProducts.length}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in">
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative text-slate-800 animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white z-20 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-sm">
              <FileJson className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 leading-tight">
                JSON Product Catalog Importer
              </h2>
              <p className="text-xs text-slate-500">
                Load your 860 product JSON into Nekomart or manage existing items (Current: {currentProducts.length} items)
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

        {/* Tab Selection */}
        <div className="p-6 space-y-5">
          <div className="flex border-b border-slate-200 space-x-2">
            <button
              onClick={() => setActiveTab('upload')}
              className={`pb-2.5 px-3 text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'upload'
                  ? 'border-b-2 border-orange-600 text-orange-600 font-black'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload .json File</span>
            </button>

            <button
              onClick={() => setActiveTab('paste')}
              className={`pb-2.5 px-3 text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'paste'
                  ? 'border-b-2 border-orange-600 text-orange-600 font-black'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <FileJson className="w-3.5 h-3.5" />
              <span>Paste Raw JSON Text</span>
            </button>

            <button
              onClick={() => setActiveTab('generate860')}
              className={`pb-2.5 px-3 text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'generate860'
                  ? 'border-b-2 border-orange-600 text-orange-600 font-black'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Generate 860 Products Preset</span>
            </button>
          </div>

          {/* Tab 1: Upload File */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              <label className="border-2 border-dashed border-slate-300 hover:border-orange-500 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50 hover:bg-orange-50/20">
                <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mb-3">
                  <Upload className="w-6 h-6" />
                </div>
                <p className="text-sm font-bold text-slate-800">
                  Click to browse or drag & drop your <code className="bg-slate-200 px-1 py-0.5 rounded text-orange-700">products.json</code> file
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Supports array of products <code className="text-slate-600">[...]</code> or objects with <code className="text-slate-600">&#123; products: [...] &#125;</code> (e.g. 860 items)
                </p>
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          )}

          {/* Tab 2: Paste Raw JSON */}
          {activeTab === 'paste' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-600">
                Paste your raw product JSON array or object below:
              </p>
              <textarea
                value={jsonText}
                onChange={(e) => setJsonText(e.target.value)}
                placeholder='[
  {
    "title": "Sony WH-1000XM5 Wireless Headphones",
    "brand": "Sony",
    "category": "Electronics & Gadgets",
    "price": 26990,
    "origin": "USA",
    "rating": 4.8
  }
]'
                rows={8}
                className="w-full p-3 font-mono text-xs bg-slate-900 text-emerald-400 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button
                onClick={handleParseText}
                disabled={!jsonText.trim() || isProcessing}
                className="bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-bold text-xs px-4 py-2 rounded-lg cursor-pointer transition-colors"
              >
                {isProcessing ? 'Parsing JSON...' : 'Parse & Validate JSON'}
              </button>
            </div>
          )}

          {/* Tab 3: Auto-generate 860 Products */}
          {activeTab === 'generate860' && (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-6 space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    Instant 860-Product Cross-Border Catalog Simulator
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Test the complete 860-item cross-border catalog structure immediately. This populates 860 unique realistic imported goods across USA, Japan, UK, Korea, and Germany with customs ratings, landed costs, and brands.
                  </p>
                </div>
              </div>

              <button
                onClick={handleGenerate860}
                disabled={isProcessing}
                className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-md cursor-pointer transition-all flex items-center space-x-2"
              >
                <Database className="w-4 h-4 text-amber-400" />
                <span>{isProcessing ? 'Generating 860 items...' : 'Generate 860 Products Dataset'}</span>
              </button>
            </div>
          )}

          {/* Parse Result Summary */}
          {parseResult && (
            <div className={`p-4 rounded-xl border ${
              parseResult.success 
                ? 'bg-emerald-50/80 border-emerald-300 text-slate-800' 
                : 'bg-red-50 border-red-200 text-red-800'
            }`}>
              {parseResult.success ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-emerald-800 font-bold text-sm">
                    <Check className="w-5 h-5 text-emerald-600" />
                    <span>Successfully Parsed {parseResult.count} Products!</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div className="bg-white p-2.5 rounded-lg border border-emerald-200">
                      <div className="text-slate-400 text-[10px] uppercase font-bold">Total Items</div>
                      <div className="text-base font-black text-slate-900">{parseResult.count}</div>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-emerald-200">
                      <div className="text-slate-400 text-[10px] uppercase font-bold">Categories</div>
                      <div className="text-base font-black text-slate-900">{parseResult.categories.length}</div>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-emerald-200">
                      <div className="text-slate-400 text-[10px] uppercase font-bold">Brands</div>
                      <div className="text-base font-black text-slate-900">{parseResult.brands.length}</div>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-emerald-200">
                      <div className="text-slate-400 text-[10px] uppercase font-bold">First Item</div>
                      <div className="text-xs font-bold text-slate-900 truncate">
                        {parseResult.products[0]?.title}
                      </div>
                    </div>
                  </div>

                  {/* Apply Actions */}
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      onClick={() => handleApply('replace')}
                      className="bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-md cursor-pointer transition-all flex items-center space-x-1.5"
                    >
                      <ArrowRight className="w-4 h-4" />
                      <span>Replace Store Catalog ({parseResult.count} items)</span>
                    </button>

                    <button
                      onClick={() => handleApply('append')}
                      className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl cursor-pointer transition-all"
                    >
                      <span>Append to Current ({currentProducts.length + parseResult.count} total)</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 font-bold text-sm">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <span>Failed to parse JSON file</span>
                  </div>
                  <ul className="text-xs list-disc list-inside space-y-1">
                    {parseResult.errors.map((err, idx) => (
                      <li key={idx}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {appliedSuccess && (
            <div className="p-3 bg-emerald-600 text-white font-bold text-xs rounded-xl flex items-center space-x-2 animate-bounce">
              <Check className="w-4 h-4" />
              <span>{appliedSuccess}</span>
            </div>
          )}

          {/* Footer utilities: Export & Reset */}
          <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-3">
              <button
                onClick={handleExportJson}
                className="text-slate-700 hover:text-slate-900 font-bold flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg cursor-pointer transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Current Catalog ({currentProducts.length} Items)</span>
              </button>

              <button
                onClick={() => {
                  onResetToDefault();
                  onClose();
                }}
                className="text-red-600 hover:text-red-700 font-bold flex items-center space-x-1 hover:underline cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Default Nekomart Catalog</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold px-4 py-1.5 rounded-lg cursor-pointer"
            >
              Close
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
