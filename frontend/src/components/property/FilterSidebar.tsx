import React from 'react';
import { FilterParams, PropertyType } from '@/types';
import { PROPERTY_TYPES, BHK_OPTIONS } from '@/components/property/FilterBar';

interface FilterSidebarProps {
  filters: FilterParams;
  onFilterChange: (newFilters: Partial<FilterParams>) => void;
  onReset: () => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onFilterChange,
  onReset,
}) => {
  const currentListingType = filters.listingType || 'all';

  const handleBhkToggle = (bhk: number) => {
    const currentBhk = filters.bedrooms || [];
    const nextBhk = currentBhk.includes(bhk)
      ? currentBhk.filter((b) => b !== bhk)
      : [...currentBhk, bhk];
    onFilterChange({ bedrooms: nextBhk, page: 1 });
  };

  const handlePropertyTypeToggle = (pt: PropertyType) => {
    const currentTypes = filters.propertyTypes || [];
    const nextTypes = currentTypes.includes(pt)
      ? currentTypes.filter((t) => t !== pt)
      : [...currentTypes, pt];
    onFilterChange({ propertyTypes: nextTypes, page: 1 });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden sticky top-24">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 flex items-center justify-between">
        <h3 className="font-bold text-slate-800 text-sm">Filters</h3>
        <button
          onClick={onReset}
          className="text-xs font-semibold text-rose-600 hover:text-rose-700 transition-colors"
        >
          Reset All
        </button>
      </div>

      <div className="p-4 space-y-6 max-h-[calc(100vh-140px)] overflow-y-auto custom-scrollbar">
        
        {/* Listing Type */}
        <div>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Looking To</h4>
          <div className="flex gap-2">
            {['buy', 'rent'].map((type) => (
              <button
                key={type}
                onClick={() => onFilterChange({ listingType: type as any, page: 1 })}
                className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all ${
                  currentListingType === type
                    ? 'bg-rose-50 border-rose-200 text-rose-700'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-rose-200 hover:bg-slate-50'
                }`}
              >
                {type === 'buy' ? 'Buy' : 'Rent'}
              </button>
            ))}
          </div>
        </div>

        {/* Budget */}
        <div className="border-t border-slate-100 pt-5">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Budget</h4>
          <div className="flex items-center gap-2">
            <select
              value={filters.minPrice || ''}
              onChange={(e) => onFilterChange({ minPrice: e.target.value ? Number(e.target.value) : undefined, page: 1 })}
              className="flex-1 px-2 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none"
            >
              <option value="">Min</option>
              <option value="5000">₹5K</option>
              <option value="10000">₹10K</option>
              <option value="20000">₹20K</option>
              <option value="5000000">₹50L</option>
              <option value="10000000">₹1Cr</option>
            </select>
            <span className="text-slate-400 text-xs">to</span>
            <select
              value={filters.maxPrice || ''}
              onChange={(e) => onFilterChange({ maxPrice: e.target.value ? Number(e.target.value) : undefined, page: 1 })}
              className="flex-1 px-2 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none"
            >
              <option value="">Max</option>
              <option value="20000">₹20K</option>
              <option value="50000">₹50K</option>
              <option value="100000">₹1L</option>
              <option value="10000000">₹1Cr</option>
              <option value="50000000">₹5Cr</option>
              <option value="100000000">₹10Cr+</option>
            </select>
          </div>
        </div>

        {/* Type of Property */}
        <div className="border-t border-slate-100 pt-5">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Type of Property</h4>
          <div className="space-y-2">
            {PROPERTY_TYPES.map((pt) => {
              const isSelected = filters.propertyTypes?.includes(pt);
              return (
                <label key={pt} className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-rose-600 border-rose-600 text-white' : 'border-slate-300 bg-white group-hover:border-rose-400'}`}>
                    {isSelected && <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                  </div>
                  <input type="checkbox" className="hidden" checked={isSelected || false} onChange={() => handlePropertyTypeToggle(pt)} />
                  <span className="text-sm text-slate-700 font-medium">{pt}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* No. of Bedrooms */}
        <div className="border-t border-slate-100 pt-5">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">No. of Bedrooms</h4>
          <div className="flex flex-wrap gap-2">
            {BHK_OPTIONS.map((bhk) => {
              const isSelected = filters.bedrooms?.includes(bhk);
              return (
                <button
                  key={bhk}
                  onClick={() => handleBhkToggle(bhk)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${
                    isSelected
                      ? 'bg-rose-600 border-rose-600 text-white'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-rose-300'
                  }`}
                >
                  {bhk} BHK
                </button>
              );
            })}
          </div>
        </div>

        {/* Verified */}
        <div className="border-t border-slate-100 pt-5">
          <label className="flex items-center justify-between cursor-pointer group">
            <span className="text-sm text-slate-700 font-medium">Verified Properties</span>
            <div className={`w-10 h-5 rounded-full p-0.5 transition-colors ${filters.isVerified ? 'bg-emerald-500' : 'bg-slate-200'}`}>
              <div className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform ${filters.isVerified ? 'translate-x-5' : 'translate-x-0'}`} />
            </div>
            {/* hidden input for accessibility */}
            <input 
              type="checkbox" 
              className="hidden" 
              checked={filters.isVerified || false} 
              onChange={(e) => onFilterChange({ isVerified: e.target.checked ? true : undefined, page: 1 })} 
            />
          </label>
        </div>

        <div className="pt-2">
          <label className="flex items-center justify-between cursor-pointer group">
            <span className="text-sm text-slate-700 font-medium">Zero Brokerage</span>
            <div className={`w-10 h-5 rounded-full p-0.5 transition-colors ${filters.isZeroBrokerage ? 'bg-rose-500' : 'bg-slate-200'}`}>
              <div className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform ${filters.isZeroBrokerage ? 'translate-x-5' : 'translate-x-0'}`} />
            </div>
            <input 
              type="checkbox" 
              className="hidden" 
              checked={filters.isZeroBrokerage || false} 
              onChange={(e) => onFilterChange({ isZeroBrokerage: e.target.checked ? true : undefined, page: 1 })} 
            />
          </label>
        </div>

      </div>
    </div>
  );
};
