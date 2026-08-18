import React, { useState } from 'react';
import { FilterParams, PropertyType } from '@/types';
import { PROPERTY_TYPES, BHK_OPTIONS } from '@/components/property/FilterBar';
import { ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';

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

  // Accordion states
  const [openBudget, setOpenBudget] = useState(true);
  const [openType, setOpenType] = useState(true);
  const [openBhk, setOpenBhk] = useState(true);

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
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden sticky top-20">
      
      {/* Verified properties toggle (Moved to Top) */}
      <div className="p-4 border-b border-slate-200">
        <label className="flex items-center justify-between cursor-pointer group">
          <div className="flex flex-col">
            <span className="text-sm font-bold text-slate-800">Verified properties</span>
            <span className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
              <ShieldCheck className="w-3 h-3 text-emerald-600" /> by verification team
            </span>
          </div>
          <div className={`w-9 h-5 rounded-full p-0.5 transition-colors ${filters.isVerified ? 'bg-blue-600' : 'bg-slate-200'}`}>
            <div className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform ${filters.isVerified ? 'translate-x-4' : 'translate-x-0'}`} />
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

      <div className="p-4 space-y-2 max-h-[calc(100vh-140px)] overflow-y-auto custom-scrollbar">
        
        {/* Budget Accordion */}
        <div className="border-b border-slate-100 pb-4">
          <button 
            onClick={() => setOpenBudget(!openBudget)}
            className="w-full flex items-center justify-between py-2 cursor-pointer outline-none"
          >
            <span className="text-sm font-bold text-slate-800">Budget</span>
            {openBudget ? <ChevronUp className="w-4 h-4 text-slate-600" /> : <ChevronDown className="w-4 h-4 text-slate-600" />}
          </button>
          
          {openBudget && (
            <div className="flex items-center gap-3 mt-3">
              <div className="relative flex-1">
                <select
                  value={filters.minPrice || ''}
                  onChange={(e) => onFilterChange({ minPrice: e.target.value ? Number(e.target.value) : undefined, page: 1 })}
                  className="w-full pl-3 pr-8 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-full outline-none appearance-none cursor-pointer"
                >
                  <option value="">No min</option>
                  {currentListingType === 'rent' ? (
                    <>
                      <option value="5000">₹5 K</option>
                      <option value="10000">₹10 K</option>
                      <option value="25000">₹25 K</option>
                      <option value="50000">₹50 K</option>
                      <option value="100000">₹1 L</option>
                    </>
                  ) : (
                    <>
                      <option value="1000000">₹10 L</option>
                      <option value="2500000">₹25 L</option>
                      <option value="5000000">₹50 L</option>
                      <option value="10000000">₹1 Cr</option>
                    </>
                  )}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
              </div>
              <div className="relative flex-1">
                <select
                  value={filters.maxPrice || ''}
                  onChange={(e) => onFilterChange({ maxPrice: e.target.value ? Number(e.target.value) : undefined, page: 1 })}
                  className="w-full pl-3 pr-8 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-full outline-none appearance-none cursor-pointer"
                >
                  <option value="">No max</option>
                  {currentListingType === 'rent' ? (
                    <>
                      <option value="10000">₹10 K</option>
                      <option value="25000">₹25 K</option>
                      <option value="50000">₹50 K</option>
                      <option value="100000">₹1 L</option>
                      <option value="200000">₹2 L+</option>
                    </>
                  ) : (
                    <>
                      <option value="5000000">₹50 L</option>
                      <option value="10000000">₹1 Cr</option>
                      <option value="25000000">₹2.5 Cr</option>
                      <option value="50000000">₹5 Cr</option>
                      <option value="100000000">₹10 Cr+</option>
                    </>
                  )}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
              </div>
            </div>
          )}
        </div>

        {/* Type of Property Accordion */}
        <div className="border-b border-slate-100 py-2">
          <button 
            onClick={() => setOpenType(!openType)}
            className="w-full flex items-center justify-between py-2 cursor-pointer outline-none"
          >
            <span className="text-sm font-bold text-slate-800">Type of property</span>
            {openType ? <ChevronUp className="w-4 h-4 text-slate-600" /> : <ChevronDown className="w-4 h-4 text-slate-600" />}
          </button>

          {openType && (
            <div className="flex flex-col gap-2.5 mt-3 px-1">
              {PROPERTY_TYPES.map((pt) => {
                const isSelected = filters.propertyTypes?.includes(pt);
                return (
                  <button
                    key={pt}
                    onClick={() => handlePropertyTypeToggle(pt)}
                    className={`flex items-center gap-2 self-start px-3 py-1.5 rounded-full text-xs transition-colors border cursor-pointer ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50 text-blue-600 font-bold'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-400 font-semibold'
                    }`}
                  >
                    <span className="text-slate-400 text-[10px] font-bold">{isSelected ? '-' : '+'}</span> {pt}
                  </button>
                );
              })}
              <button className="self-start text-xs font-bold text-blue-600 mt-1 hover:underline cursor-pointer">+ 1 more</button>
            </div>
          )}
        </div>

        {/* No. of Bedrooms Accordion */}
        <div className="py-2">
          <button 
            onClick={() => setOpenBhk(!openBhk)}
            className="w-full flex items-center justify-between py-2 cursor-pointer outline-none"
          >
            <span className="text-sm font-bold text-slate-800">No. of Bedrooms</span>
            {openBhk ? <ChevronUp className="w-4 h-4 text-slate-600" /> : <ChevronDown className="w-4 h-4 text-slate-600" />}
          </button>

          {openBhk && (
            <div className="flex flex-wrap gap-2.5 mt-3 px-1">
              {BHK_OPTIONS.map((bhk) => {
                const isSelected = filters.bedrooms?.includes(bhk);
                return (
                  <button
                    key={bhk}
                    onClick={() => handleBhkToggle(bhk)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] transition-colors border cursor-pointer ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50 text-blue-600 font-bold'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-400 font-semibold'
                    }`}
                  >
                    <span className="text-slate-400 text-[9px] font-bold">{isSelected ? '-' : '+'}</span> {bhk} BHK
                  </button>
                );
              })}
              <button className="w-full text-left text-xs font-bold text-blue-600 mt-1 hover:underline cursor-pointer">+ 5 more</button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
