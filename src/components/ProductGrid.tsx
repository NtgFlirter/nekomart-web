import React, { useState } from 'react';
import { 
  ArrowUpDown, 
  Grid3X3, 
  List, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  RotateCcw, 
  FileJson,
  X
} from 'lucide-react';
import { Product, FilterState, CurrencyCode } from '../types';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  filter: FilterState;
  onFilterChange: (newFilter: Partial<FilterState>) => void;
  onResetFilters: () => void;
  currency: CurrencyCode;
  wishlistIds: string[];
  onToggleWishlist: (product: Product, e: React.MouseEvent) => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, e: React.MouseEvent) => void;
  onOpenJsonImporter: () => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  filter,
  onFilterChange,
  onResetFilters,
  currency,
  wishlistIds,
  onToggleWishlist,
  onSelectProduct,
  onAddToCart,
  onOpenJsonImporter
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const totalPages = Math.ceil(products.length / itemsPerPage) || 1;
  const paginatedProducts = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  return (
    <div className="flex-1">
      {/* Top Bar: Results Count, Active Tags & Sort */}
      <div className="bg-white rounded-xl border border-slate-200 p-3.5 mb-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-slate-800">
            Showing <span className="text-orange-600 font-extrabold">{products.length}</span> international products
          </span>
          {filter.selectedOrigin !== 'ALL' && (
            <span className="inline-flex items-center space-x-1 bg-orange-100 text-orange-800 text-[11px] font-bold px-2 py-0.5 rounded-full">
              <span>{filter.selectedOrigin} Store</span>
              <button onClick={() => onFilterChange({ selectedOrigin: 'ALL' })} className="hover:text-orange-950">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filter.selectedCategory !== 'all' && (
            <span className="inline-flex items-center space-x-1 bg-slate-100 text-slate-800 text-[11px] font-bold px-2 py-0.5 rounded-full">
              <span>{filter.selectedCategory}</span>
              <button onClick={() => onFilterChange({ selectedCategory: 'all' })} className="hover:text-slate-950">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filter.searchQuery && (
            <span className="inline-flex items-center space-x-1 bg-amber-100 text-amber-800 text-[11px] font-bold px-2 py-0.5 rounded-full">
              <span>"{filter.searchQuery}"</span>
              <button onClick={() => onFilterChange({ searchQuery: '' })} className="hover:text-amber-950">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>

        {/* Sort dropdown */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 text-xs text-slate-600 font-medium">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span>Sort By:</span>
            <select
              value={filter.sortBy}
              onChange={(e) => onFilterChange({ sortBy: e.target.value as any })}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-orange-500 cursor-pointer"
            >
              <option value="featured">Featured Global Imports</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Customer Rating</option>
              <option value="newest">Newest Arrivals</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {paginatedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {paginatedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              currency={currency}
              isWishlisted={wishlistIds.includes(product.id)}
              onToggleWishlist={onToggleWishlist}
              onSelectProduct={onSelectProduct}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
          <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mx-auto text-2xl font-black">
            🔍
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            No imported products found
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            We couldn't find anything matching your active filters or search terms. Try clearing your filters or importing your custom product JSON file.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={onResetFilters}
              className="bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors cursor-pointer flex items-center space-x-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
            <button
              onClick={onOpenJsonImporter}
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors cursor-pointer flex items-center space-x-1.5"
            >
              <FileJson className="w-3.5 h-3.5" />
              <span>Upload 860 Products JSON</span>
            </button>
          </div>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-between bg-white rounded-xl border border-slate-200 p-3 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">
            Page <span className="font-bold text-slate-800">{currentPage}</span> of{' '}
            <span className="font-bold text-slate-800">{totalPages}</span>
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              aria-label="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
              let pageNum = i + 1;
              if (totalPages > 5 && currentPage > 3) {
                pageNum = currentPage - 3 + i + 1;
                if (pageNum > totalPages) pageNum = totalPages - (4 - i);
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    currentPage === pageNum
                      ? 'bg-orange-600 text-white shadow-sm'
                      : 'text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              aria-label="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
